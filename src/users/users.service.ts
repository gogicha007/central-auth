import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenType, UserStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { handlePrismaError } from '../common/filters/error.util';
import { ok } from '../common/utils/api-response.util';
import { LoginDto } from '../auth/dto/login.dto';
import { PasswordService } from '../common/password/password.service';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { blockedStatuses } from './constants';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
  ) { }

  async create(payload: CreateUserDto) {
    const existingUser = await this.dbService.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (existingUser)
      throw new ConflictException(
        `User with email: ${payload.email} already exists`,
      );

    try {
      const { email, firstName, lastName, passwordHash } = payload;
      const verificationToken = crypto.randomBytes(32).toString('hex');

      const createdUser: CreateUserResponseDto =
        await this.dbService.$transaction(async (tx) => {
          // create user
          const newUser = await tx.user.create({
            data: {
              email,
              passwordHash,
              firstName,
              lastName,
              status: UserStatus.PENDING,
              emailVerified: false,
            },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              status: true,
              emailVerified: true,
            },
          });
          // send verification email
          const tokenHash = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

          const userToken = {
            userId: newUser.id,
            type: TokenType.EMAIL_VERIFICATION,
            tokenHash,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          };

          await tx.userToken.create({
            data: {
              userId: userToken.userId,
              type: userToken.type,
              tokenHash: userToken.tokenHash,
              expiresAt: userToken.expiresAt,
            },
          });
          return newUser;
        });

      await this.mailService.sendVerificationEmail(email, verificationToken);

      return ok(
        'User created. Please check your email to verify your account',
        createdUser,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async verifyEmailByToken(receivedToken: string) {
    if (!receivedToken) throw new BadRequestException('Token not found');

    const now = new Date();

    const tokenHash = crypto
      .createHash('sha256')
      .update(receivedToken)
      .digest('hex');

    try {
      await this.dbService.$transaction(async (tx) => {
        const userToken = await tx.userToken.findUnique({
          where: {
            tokenHash,
            type: TokenType.EMAIL_VERIFICATION,
          },
          select: {
            userId: true,
            expiresAt: true,
            usedAt: true,
          },
        });

        if (!userToken) throw new BadRequestException('Token not found');

        const updateCount = await tx.userToken.updateMany({
          where: {
            tokenHash,
            usedAt: null,
            expiresAt: { gte: now },
            type: TokenType.EMAIL_VERIFICATION,
          },
          data: {
            usedAt: new Date(),
          },
        });

        if (updateCount.count === 0)
          throw new BadRequestException('Invalid or used token');

        await tx.user.update({
          where: { id: userToken.userId },
          data: {
            status: UserStatus.ACTIVE,
            emailVerified: true,
            emailVerifiedAt: new Date(),
          },
        });
      });
      return ok('Email verified successfully. You can now log in.');
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findById(userId: string) {
    return this.dbService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        status: true,
        isPlatformAdmin: true,
      },
    });
  }

  async verifyUser(payload: LoginDto) {
    const user = await this.dbService.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        email: true,
        status: true,
        passwordHash: true,
        isPlatformAdmin: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (blockedStatuses.includes(user.status)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const checkPassword = await this.passwordService.compare(
      payload.password,
      user.passwordHash,
    );

    if (!checkPassword) {
      await this.dbService.$transaction(async (tx) => {
        const failureCount = await tx.user.update({
          where: { id: user.id },
          data: {
            failedLoginCount: {
              increment: 1,
            },
          },
          select: {
            failedLoginCount: true,
          },
        });
        if (failureCount.failedLoginCount >= 5) {
          await tx.user.update({
            where: { id: user.id },
            data: {
              status: UserStatus.LOCKED,
            },
          });
        }
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.dbService.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lastLoginAt: new Date(),
      },
    });

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      isPlatformAdmin: user.isPlatformAdmin,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.dbService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    if (!user || blockedStatuses.includes(user.status))
      return ok(
        'If an account exists with that email, a password reset link has been sent.',
      );

    const resetToken = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await this.dbService.$transaction(async (tx) => {
      await tx.userToken.updateMany({
        where: {
          userId: user.id,
          type: TokenType.PASSWORD_RESET,
        },
        data: {
          usedAt: new Date(),
        },
      });

      await tx.userToken.create({
        data: {
          userId: user.id,
          type: TokenType.PASSWORD_RESET,
          tokenHash,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          usedAt: null,
        },
      });
    });

    await this.mailService.sendPasswordResetEmail(email, resetToken);

    //TODO: audit log

    return ok(
      'If an account exists with that email, a password reset link has been sent.',
    );
  }

  async verifyPasswordResetToken(token: string) {
    if (!token) throw new BadRequestException('Reset token not found');

    const now = new Date();

    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const userToken = await this.dbService.userToken.findFirst({
      where: {
        tokenHash,
        type: TokenType.PASSWORD_RESET,
        usedAt: null,
        expiresAt: { gte: now },
      },
      select: {
        id: true,
      },
    });

    if (!userToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    return ok('Password reset token is valid');
  }
}
