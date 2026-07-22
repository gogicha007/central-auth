import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../common/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '../sessions/sessions.service';

describe('AuthService.login', () => {
  let authService: AuthService;
  let sessionsService: { createSession: jest.Mock };
  let jwtService: { sign: jest.Mock };
  let configService: { getOrThrow: jest.Mock };

  beforeEach(async () => {
    sessionsService = { createSession: jest.fn() };
    jwtService = { sign: jest.fn().mockReturnValue('token') };
    configService = {
      getOrThrow: jest.fn((key: string) => {
        switch (key) {
          case 'JWT_ACCESS_TOKEN_SECRET':
            return 'secret';
          case 'JWT_TTL_M':
            return '15';
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
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('waits for session creation before issuing a token', async () => {
    let resolveSession: ((value: unknown) => void) | undefined;
    const sessionPromise = new Promise((resolve) => {
      resolveSession = resolve;
    });

    sessionsService.createSession.mockReturnValue(sessionPromise);

    const loginPromise = authService.login({
      id: 'user-1',
      email: 'user@example.com',
    } as any);

    expect(jwtService.sign).not.toHaveBeenCalled();

    resolveSession?.({ id: 'session-1' });
    await loginPromise;

    expect(sessionsService.createSession).toHaveBeenCalledWith('user-1');
    expect(jwtService.sign).toHaveBeenCalledTimes(1);
  });
});
