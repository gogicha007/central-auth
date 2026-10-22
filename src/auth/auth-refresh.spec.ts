import 'reflect-metadata';
import { AuthService } from './auth.service';
import { UserStatus } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

describe('Refresh account and session checks', () => {
  const user = {
    id: 'user',
    email: 'test@example.com',
    status: UserStatus.ACTIVE,
    isPlatformAdmin: false,
  };
  let service: AuthService;
  let session: any;
  let sessions: any;
  let users: any;
  let jwt: any;
  beforeEach(() => {
    session = {
      id: 'session',
      userId: 'user',
      refreshVersion: 0,
      revokedAt: null,
      expiresAt: new Date(Date.now() + 86_400_000),
      idleExpiresAt: new Date(Date.now() + 3_600_000),
    };
    sessions = {
      getSession: jest.fn(async () => session),
      rotateRefreshVersion: jest.fn(async () => ({
        ...session,
        refreshVersion: 1,
      })),
    };
    users = { findById: jest.fn().mockResolvedValue(user) };
    jwt = {
      verify: jest
        .fn()
        .mockReturnValue({ sub: 'user', sid: 'session', version: 0 }),
      sign: jest.fn().mockReturnValue('fixture-token'),
    };
    const config = {
      getOrThrow: (key: string) =>
        key === 'JWT_ACCESS_TTL_M'
          ? '15m'
          : key === 'JWT_REFRESH_TTL_D'
            ? '30d'
            : 'fixture-secret',
    };
    service = new AuthService(
      config as any,
      users,
      sessions,
      jwt,
      {} as any,
      {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn(),
        delete: jest.fn(),
      } as any,
      { create: jest.fn() } as any,
      {} as any,
    );
  });
  it("rejects another user's session before rotation or signing", async () => {
    session.userId = 'someone-else';
    await expect(service.refresh('fixture')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(sessions.rotateRefreshVersion).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });
  it.each([
    UserStatus.PENDING,
    UserStatus.SUSPENDED,
    UserStatus.DEACTIVATED,
    UserStatus.DELETED,
    UserStatus.LOCKED,
  ])('rejects %s accounts', async (status) => {
    users.findById.mockResolvedValue({ ...user, status });
    await expect(service.refresh('fixture')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(sessions.rotateRefreshVersion).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });
  it('rotates and returns new tokens for an active account and matching session', async () => {
    const result = await service.refresh('fixture');
    expect(sessions.rotateRefreshVersion).toHaveBeenCalledWith('session', 0);
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      accessToken: 'fixture-token',
      refreshToken: 'fixture-token',
      expiresIn: 900,
    });
  });
});
