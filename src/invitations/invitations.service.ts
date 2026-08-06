import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SendInvitationDto } from './dto/send-invitation.dto';
import * as crypto from 'crypto';
import { MemberStatus, TokenType } from '@prisma/client';
import { ok } from '../common/utils/api-response.util';
import { MailService } from '../mail/mail.service';
import { handlePrismaError } from '../common/filters/error.util';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  async create(payload: SendInvitationDto) {
    const invitationToken = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
      .createHash('sha256')
      .update(invitationToken)
      .digest('hex');

    await this.dbService.$transaction(async (tx) => {
      await tx.userToken.updateMany({
        where: {
          userId: payload.createdByUserId,
          type: TokenType.INVITATION,
        },
        data: {
          usedAt: new Date(),
        },
      });

      await tx.userToken.create({
        data: {
          userId: payload.createdByUserId,
          type: TokenType.INVITATION,
          tokenHash,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          usedAt: null,
        },
      });

      await tx.invitation.create({
        data: {
          organizationId: payload.organizationId,
          roleId: payload.roleId,
          createdByUserId: payload.createdByUserId,
          email: payload.email,
          token: tokenHash,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    });

    await this.mailService.sendInvitationEmail(payload.email, invitationToken);

    return ok('Invitation sent to user');
  }

  async acceptInvitation(token: string) {
    if (!token) {
      throw new BadRequestException('Token not found');
    }

    const now = new Date();

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    try {
      await this.dbService.$transaction(async (tx) => {
        const invitation = await tx.invitation.findFirst({
          where: {
            token: tokenHash,
            acceptedAt: null,
            expiresAt: { gte: now },
          },
          select: {
            organizationId: true,
            roleId: true,
            email: true,
          },
        });

        if (!invitation) {
          throw new BadRequestException('Invalid or expired invitation');
        }

        await tx.userToken.updateMany({
          where: {
            tokenHash,
            type: TokenType.INVITATION,
            usedAt: null,
            expiresAt: { gte: now },
          },
          data: { usedAt: now },
        });

        await tx.invitation.updateMany({
          where: {
            token: tokenHash,
            acceptedAt: null,
            expiresAt: { gte: now },
          },
          data: {
            acceptedAt: now,
          },
        });

        const { organizationId, roleId, email } = invitation;

        const user = await tx.user.findUnique({
          where: { email },
          select: { id: true },
        });

        if (!user) throw new NotFoundException('user not found');

        await tx.organizationMember.create({
          data: {
            organizationId,
            userId: user.id,
            roleId,
            status: MemberStatus.ACTIVE,
          },
        });
      });
      return ok(
        'User invitation accepted, used registered as member of organization',
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
