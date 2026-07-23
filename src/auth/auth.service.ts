import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../common/password/password.service';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '../sessions/sessions.service';
import { JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
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

  private getJwtOptions(secretKey: string, ttl: string): JwtSignOptions {
    return {
      secret: this.configService.getOrThrow(secretKey),
      expiresIn: ttl as JwtSignOptions['expiresIn'],
    };
  }

  private createTokenPayload(user: LoginResponseDto, sessionId: string) {
    return {
      sub: user.id,
      sid: sessionId,
      email: user.email,
    } satisfies JwtPayload;
  }

  async login(user: LoginResponseDto, ip?: string, userAgent?: string | null) {
    const session = await this.sessionsService.createSession(
      user.id,
      ip,
      userAgent,
    );

    const accessPayload = this.createTokenPayload(user, session.id);

    const accessToken = this.jwtService.sign(
      accessPayload,
      this.getJwtOptions(
        'JWT_ACCESS_TOKEN_SECRET',
        `${this.configService.getOrThrow<string>('JWT_TTL_M')}m`,
      ),
    );

    const refreshPayload = {
      ...accessPayload,
      version: session.refreshVersion,
    };

    const refreshToken = this.jwtService.sign(
      refreshPayload,
      this.getJwtOptions(
        'JWT_REFRESH_TOKEN_SECRET',
        `${this.configService.getOrThrow<string>('JWT_REFRESH_TTL_D')}d`,
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

      const session = await this.sessionsService.getSession(payload.sid);
      if (!session || session.revokedAt || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (session.refreshVersion !== payload.version) {
        throw new UnauthorizedException('Refresh token is invalid');
      }

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign(
        this.createTokenPayload(user, session.id),
        this.getJwtOptions(
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

  logout() {
    return `logout hit`;
  }
}
