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

    service = new UsersService(
      dbService as any,
      mailService as any,
      passwordService as any,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate an active password reset token', async () => {
    (service as any).dbService.userToken.findFirst.mockResolvedValue({ id: 'token-1' });

    const result = await service.verifyPasswordResetToken('plain-token');

    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Token is valid',
      }),
    );
  });

  it('should reject an invalid or expired password reset token', async () => {
    (service as any).dbService.userToken.findFirst.mockResolvedValue(null);

    await expect(service.verifyPasswordResetToken('plain-token')).rejects.toThrow(
      BadRequestException,
    );
  });
});
