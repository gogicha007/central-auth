import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuditAction, ResourceType, UserStatus } from '@prisma/client';
import { SignUpDto } from './dto/signUp.dto';
import { AuditService } from '../audit/audit.service';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from '../common/password/password.service';
import { RedisService } from '../redis/redis.service';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import { CreateAuditDto } from '../audit/dto/create-audit.dto';
import { AuthenticatedUserContext, JwtPayload } from './auth.types';
import { isSessionActive } from '../common/utils/session-helper';
import {
  cacheSession,
  createTokenPayload,
  getSessionCacheKey,
  getSessionForAuth,
  getJwtOptions,
} from './auth-session-cache.util';
import { ok } from '../common/utils/api-response.util';
import { DatabaseService } from '../database/database.service';
import ms, { type StringValue } from 'ms'


type RefreshFailure =
  | 'missing_token'
  | 'token_expired'
  | 'token_invalid'
  | 'session_inactive'
  | 'version_mismatch'
  | 'user_not_found';

interface RefreshCtx {
  userId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly redisService: RedisService,
    private readonly auditService: AuditService,
    private readonly dbService: DatabaseService,
  ) {}

  async signUp(payload: SignUpDto) {
    const hashedPassword = await this.passwordService.hash(payload.password);
    const credentials = {
      email: payload.email,
      passwordHash: hashedPassword,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
    const user = await this.userService.create(credentials);
    const createdUserId = user?.data?.id as string | undefined;
    if (user) {
      await this.createAuditLog(AuditAction.USER_CREATED, {
        userId: createdUserId,
        resourceId: createdUserId,
        metadata: { email: payload.email },
      });
    }
    return user;
  }

  async validateUser(payload: LoginDto) {
    try {
      return await this.userService.verifyUser(payload);
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        await this.createAuditLog(AuditAction.LOGIN_FAILED, {
          metadata: { email: payload.email },
        });
        return null;
      }
      throw error;
    }
  }

  async login(user: LoginResponseDto, ip?: string, userAgent?: string | null) {
    const organizations = await
      this.dbService.organizationMember.findMany({
        where: { userId: user.id },
        select: {
          organizationId: true,
          organization: { select: { name: true } },
          role: { select: { name: true } }
        }
      })

    const session = await this.sessionsService.createSession(user.id, ip, userAgent)

    await cacheSession(this.redisService, session);

    const accessPayload = createTokenPayload(user, session.id);

    const accessToken = this.jwtService.sign(
      accessPayload,
      getJwtOptions(
        this.configService,
        'JWT_ACCESS_TOKEN_SECRET',
        this.accessTtl,
      ),
    );

    const refreshPayload = { ...accessPayload, version: session.refreshVersion, };

    const refreshToken = this.jwtService.sign(
      refreshPayload,
      getJwtOptions(
        this.configService,
        'JWT_REFRESH_TOKEN_SECRET',
        this.refreshTtl,
      ),
    );

    await this.createAuditLog(AuditAction.LOGIN, {
      userId: user.id,
      resourceId: user.id,
      metadata: { sessionId: session.id },
      ip,
      userAgent: userAgent ?? undefined,
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'bearer',
      expiresIn: this.accessExpiresInSeconds,
    };
  }

  async refresh(refreshToken: string, ip?: string, userAgent?: string) {
    if (!refreshToken) return this.rejectRefresh('missing_token', { ip, userAgent })

    let payload: JwtPayload & { version?: number };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return this.rejectRefresh('token_expired', { ip, userAgent });
      }
      if (error instanceof JsonWebTokenError) {
        return this.rejectRefresh('token_invalid', { ip, userAgent });
      }

      if (error instanceof JsonWebTokenError) {
        return this.rejectRefresh('token_invalid', { ip, userAgent })
      }
      throw error;
    }

    const ctx = { userId: payload.sub, sessionId: payload.sid, ip, userAgent };

    const session = await getSessionForAuth(
      this.redisService,
      this.sessionsService,
      payload.sid,
    );
    if (!session || !isSessionActive(session)) {
      return this.rejectRefresh('session_inactive', ctx);
    }

    if (session.userId !== payload.sub) {
      return this.rejectRefresh('token_invalid', ctx)
    }

    if (session.refreshVersion !== payload.version) {
      return this.rejectRefresh('version_mismatch', ctx);
    }

    const user = await this.userService.findById(payload.sub);
    if (!user) return this.rejectRefresh('user_not_found', ctx);

    const rotated = await this.sessionsService.rotateRefreshVersion(
      session.id,
      payload.version!,
    );
    if (!rotated) {
      return this.rejectRefresh('version_mismatch', ctx);
    }
    await cacheSession(this.redisService, rotated);

    const tokenPayload = createTokenPayload(user, session.id);

    const accessToken = this.jwtService.sign(
      tokenPayload,
      getJwtOptions(
        this.configService,
        'JWT_ACCESS_TOKEN_SECRET',
        this.accessTtl,
      ),
    );

    const newRefreshToken = this.jwtService.sign(
      {...tokenPayload, version: rotated.refreshVersion},
      getJwtOptions(this.configService, 'JWT_REFRESH_TOKEN_SECRET', this.refreshTtl)
    )
    if (!user || user.status !== UserStatus.ACTIVE) { return this.rejectRefresh('user_not_found', ctx) }

    if (typeof payload.version !== 'number') { return this.rejectRefresh('token_invalid', ctx) }

    const rotated = await this.sessionsService.rotateRefreshVersion(
      session.id,
      payload.version
    );
    if (!rotated) { return this.rejectRefresh('version_mismatch', ctx) }

    try {
      await cacheSession(this.redisService, rotated);
    } catch (error) {
      this.logger.warn({ msg: 'Session cache write failed', sessionId: session.id, error })
      await this.redisService.delete(getSessionCacheKey(session.id)).catch(() => undefined);
    }

    const tokenPayload = createTokenPayload(user, session.id);
    const accessToken = this.jwtService.sign(
      tokenPayload,
      getJwtOptions(this.configService, 'JWT_ACCESS_TOKEN_SECRET', this.accessTtl),
    );

    const newRefreshToken = this.jwtService.sign(
      { ...tokenPayload, version: rotated.refreshVersion },
      getJwtOptions(this.configService, 'JWT_REFRESH_TOKEN_SECRET', this.refreshTtl),
    );

    await this.createAuditLog(AuditAction.REFRESH_TOKEN, {
      userId: user.id,
      resourceId: user.id,
      metadata: { sessionId: session.id },
      ip,
      userAgent,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      tokenType: 'bearer',
      expiresIn: this.accessExpiresInSeconds,
      expiresIn: this.accessExpiresInSeconds
    };
  }

  async verifyEmail(token: string) {
    const emailVerified = await this.userService.verifyEmailByToken(token);
    if (emailVerified) {
      await this.createAuditLog(AuditAction.EMAIL_VERIFIED);
    }
    return emailVerified;
  }

  async logout(
    user: AuthenticatedUserContext,
    ip?: string,
    userAgent?: string,
  ) {
    await this.sessionsService.revokeSession(user.sessionId, 'logout');
    await this.redisService.delete(getSessionCacheKey(user.sessionId));
    await this.createAuditLog(AuditAction.LOGOUT, {
      userId: user.id,
      resource: ResourceType.SESSION,
      resourceId: user.sessionId,
      metadata: { reason: 'logout' },
      ip,
      userAgent,
    });
    return ok('user logged out successfully');
  }

  async sessionRevoke(
    userId: string,
    sessionId: string,
    ip?: string,
    userAgent?: string,
  ) {
    const session = await this.sessionsService.getSession(sessionId);

    if (!session || session.userId !== userId) {
      throw new UnauthorizedException('Session not found');
    }

    await this.sessionsService.revokeSession(sessionId, 'revoke');
    await this.redisService.delete(getSessionCacheKey(sessionId));
    await this.createAuditLog(AuditAction.SESSION_REVOKED, {
      userId,
      resource: ResourceType.SESSION,
      resourceId: sessionId,
      metadata: { reason: 'revoke' },
      ip,
      userAgent,
    });
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

  private async createAuditLog(
    action: AuditAction,
    context: Omit<Partial<CreateAuditDto>, 'action'> = {},
  ) {
    try {
      await this.auditService.create({
        action,
        resource: context.resource ?? ResourceType.USER,
        organizationId: context.organizationId,
        userId: context.userId,
        resourceId: context.resourceId,
        metadata: context.metadata,
        ip: context.ip,
        userAgent: context.userAgent,
      });
    } catch (error) {
      this.logger.warn('Audit write failed', { action, error });
    }
  }

  private async rejectRefresh(
    reason: RefreshFailure,
    ctx: RefreshCtx = {},
  ): Promise<never> {
    this.logger.warn({ msg: 'Refresh rejected', reason, ...ctx });

  private get accessTtl(): StringValue {
    return this.configService.getOrThrow<string>('JWT_ACCESS_TTL_M') as StringValue
  }

  private get refreshTtl(): StringValue {
    return this.configService.getOrThrow<string>('JWT_REFRESH_TTL_D') as StringValue;
  }

  private get accessExpiresInSeconds(): number {
    const millis = ms(this.accessTtl);
    if (typeof millis !== 'number' || Number.isNaN(millis)) {
      throw new Error(`Invalid access token TTL: ${this.accessTtl}`);
    }
    return Math.floor(millis / 1000);
  }

  private async rejectRefresh(reason: RefreshFailure, ctx: RefreshCtx = {}): Promise<never> {
    if (reason === 'token_expired' || reason === 'session_inactive') {
      this.logger.log({ msg: 'Refresh rejected', reason, ...ctx });
    } else {
      this.logger.warn({ msg: 'Refresh rejected', reason, ...ctx });
    }

    if (reason === 'version_mismatch' || reason === 'token_invalid') {
      await this.createAuditLog(AuditAction.REFRESH_FAILED, {
        userId: ctx.userId,
        resource: ResourceType.SESSION,
        resourceId: ctx.sessionId,
        metadata: { reason },
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      });
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  private get accessTtl(): StringValue {
    return this.configService.getOrThrow<string>('JWT_TTL_M') as StringValue;
  }

  private get refreshTtl(): StringValue {
    return this.configService.getOrThrow<string>(
      'JWT_REFRESH_TTL_D',
    ) as StringValue;
  }

  private get accessExpiresInSeconds(): number {
    const millis = ms(this.accessTtl);
    if (typeof millis !== 'number' || Number.isNaN(millis)) {
      throw new Error(`Invalid access token TTL: ${this.accessTtl}`);
    }
    return Math.floor(millis / 1000);
  }
}
