import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../common/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '../sessions/sessions.service';
import { AuthenticatedUserContext, JwtPayload } from './auth.types';
import { RedisService } from '../redis/redis.service';
import { isSessionActive } from '../common/utils/session-helper';
import {
  cacheSession,
  createTokenPayload,
  getSessionCacheKey,
  getSessionForAuth,
  getJwtOptions,
} from './auth-session-cache.util';
import { ok } from '../common/utils/api-response.util';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly redisService: RedisService,
  ) {}

  async signUp(payload: SignUpDto) {
    const hashedPassword = await this.passwordService.hash(payload.password);
    const credentials = {
      email: payload.email,
      passwordHash: hashedPassword,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
    return this.userService.create(credentials);
  }

  async validateUser(payload: LoginDto) {
    const user = await this.userService.verifyUser(payload);
    if (user) return user;

    return null;
  }

  async login(user: LoginResponseDto, ip?: string, userAgent?: string | null) {
    const session = await this.sessionsService.createSession(
      user.id,
      ip,
      userAgent,
    );

    await cacheSession(this.redisService, session);

    const accessPayload = createTokenPayload(user, session.id);

    const accessToken = this.jwtService.sign(
      accessPayload,
      getJwtOptions(
        this.configService,
        'JWT_ACCESS_TOKEN_SECRET',
        `${this.configService.getOrThrow<string>('JWT_TTL_M')}`,
      ),
    );

    const refreshPayload = {
      ...accessPayload,
      version: session.refreshVersion,
    };

    const refreshToken = this.jwtService.sign(
      refreshPayload,
      getJwtOptions(
        this.configService,
        'JWT_REFRESH_TOKEN_SECRET',
        `${this.configService.getOrThrow<string>('JWT_REFRESH_TTL_D')}`,
      ),
    );

    return {
      accessToken,
      refreshToken,
      tokenType: 'bearer',
      expiresIn:
        Number.parseInt(
          this.configService.getOrThrow<string>('JWT_TTL_M'),
          10,
        ) * 60,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload & { version?: number }>(
        refreshToken,
        {
          secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
        },
      );

      const session = await getSessionForAuth(
        this.redisService,
        this.sessionsService,
        payload.sid,
      );
      if (!session || !isSessionActive(session)) {
        throw new UnauthorizedException('Invalid session');
      }

      if (session.refreshVersion !== payload.version) {
        throw new UnauthorizedException('Refresh token is invalid');
      }

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign(
        createTokenPayload(user, session.id),
        getJwtOptions(
          this.configService,
          'JWT_ACCESS_TOKEN_SECRET',
          `${this.configService.getOrThrow<string>('JWT_TTL_M')}m`,
        ),
      );

      return {
        accessToken,
        tokenType: 'bearer',
        expiresIn:
          Number.parseInt(
            this.configService.getOrThrow<string>('JWT_TTL_M'),
            10,
          ) * 60,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  verifyEmail(token: string) {
    return this.userService.verifyEmailByToken(token);
  }

  async logout(user: AuthenticatedUserContext) {
    await this.sessionsService.revokeSession(user.sessionId, 'logout');
    await this.redisService.delete(getSessionCacheKey(user.sessionId));
    return ok('user logged out successfully');
  }

  async sessionRevoke(userId: string, sessionId: string) {
    const session = await this.sessionsService.getSession(sessionId);

    if (!session || session.userId !== userId) {
      throw new UnauthorizedException('Session not found');
    }

    await this.sessionsService.revokeSession(sessionId, 'revoke');
    await this.redisService.delete(getSessionCacheKey(sessionId));
    return ok('session revoked successfully');
  }

  getSessions() {
    return this.sessionsService.getAllActiveSessions();
  }

  getUserActiveSessions(userId: string) {
    return this.sessionsService.getUserActiveSessions(userId);
  }

  async forgotPassword(email: string) {
    return await this.userService.forgotPassword(email);
  }

  async validateToken(token: string) {
    return await this.userService.verifyPasswordResetToken(token);
  }

  async resetPassword(data: ResetPasswordDto) {
    return await this.userService.resetPassword(data);
  }

  async changePassword(data: ChangePasswordDto) {
    return await this.userService.changePassword(data);
  }
}
