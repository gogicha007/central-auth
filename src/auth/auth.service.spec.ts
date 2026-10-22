import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../common/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '../sessions/sessions.service';
import { RedisService } from '../redis/redis.service';
import { AuditService } from '../audit/audit.service';

describe('AuthService.login', () => {
  let authService: AuthService;
  let sessionsService: {
<<<<<<< HEAD
    createSession: jest.Mock<
      (userId: string, ip?: string, userAgent?: string) => Promise<{ id: string }>
    >;
=======
    createSession: jest.Mock<(...args: any[]) => Promise<{ id: string }>>;
>>>>>>> develop
  };
  let jwtService: { sign: jest.Mock };
  let configService: { getOrThrow: jest.Mock<(key: string) => string> };

  beforeEach(async () => {
    sessionsService = { createSession: jest.fn() };
    jwtService = { sign: jest.fn() };
    configService = {
      getOrThrow: jest.fn((key: string) => {
        switch (key) {
          case 'JWT_ACCESS_TOKEN_SECRET':
            return 'access-secret';
          case 'JWT_REFRESH_TOKEN_SECRET':
            return 'refresh-secret';
          case 'JWT_TTL_M':
            return '15m';
          case 'JWT_REFRESH_TTL_D':
            return '30d';
          default:
            return '';
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: {} },
        { provide: PasswordService, useValue: {} },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: SessionsService, useValue: sessionsService },
        { provide: RedisService, useValue: { set: jest.fn() } },
        { provide: AuditService, useValue: {} },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('issues both access and refresh tokens after creating a session', async () => {
    sessionsService.createSession.mockResolvedValue({ id: 'session-1' });
    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await authService.login({
      id: 'user-1',
      email: 'user@example.com',
      status: 'ACTIVE',
    } as any);

    expect(sessionsService.createSession).toHaveBeenCalledWith(
      'user-1',
      undefined,
      undefined,
    );
    expect(jwtService.sign).toHaveBeenCalledTimes(2);
    expect(result).toEqual(
      expect.objectContaining({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }),
    );
  });
});
