import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    const dbService = {
      userToken: {
        findFirst: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const mailService = {
      sendVerificationEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    };

    const passwordService = {
      compare: jest.fn(),
      hash: jest.fn(),
    };

    const sessionService = {
      getUserActiveSessions: jest.fn(),
      revokeSessionsByUserId: jest.fn(),
    };

    const redisService = {
      delete: jest.fn(),
    };

    service = new UsersService(
      dbService as any,
      mailService as any,
      passwordService as any,
      sessionService as any,
      redisService as any,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate an active password reset token', async () => {
    (service as any).dbService.userToken.findFirst.mockResolvedValue({
      id: 'token-1',
    });

    const result = await service.verifyPasswordResetToken('plain-token');

    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Password reset token is valid',
      }),
    );
  });

  it('should reject an invalid or expired password reset token', async () => {
    (service as any).dbService.userToken.findFirst.mockResolvedValue(null);

    await expect(
      service.verifyPasswordResetToken('plain-token'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject a password change when the new password matches the current password', async () => {
    (service as any).dbService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      passwordHash: 'hashed-current',
    });
    (service as any).passwordService.compare.mockResolvedValue(true);

    await expect(
      service.changePassword({
        userId: 'user-1',
        currentPassword: 'old-password',
        newPassword: 'same-password',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should revoke active sessions after a successful password change', async () => {
    (service as any).dbService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      passwordHash: 'hashed-current',
    });
    (service as any).dbService.user.update.mockResolvedValue({});
    (service as any).passwordService.compare
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    (service as any).passwordService.hash.mockResolvedValue('hashed-new');
    (service as any).sessionService.getUserActiveSessions.mockResolvedValue([
      { id: 'session-1' },
    ]);

    const result = await service.changePassword({
      userId: 'user-1',
      currentPassword: 'old-password',
      newPassword: 'new-password',
    });

    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Password successfully changed',
      }),
    );
    expect(
      (service as any).sessionService.revokeSessionsByUserId,
    ).toHaveBeenCalledWith('user-1', 'password change');
    expect((service as any).redisService.delete).toHaveBeenCalled();
  });
});
