import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SendInvitationDto } from './dto/send-invitation.dto';
import * as crypto from 'crypto';
import { AuditAction, MemberStatus, ResourceType, TokenType } from '@prisma/client';
import { ok } from '../common/utils/api-response.util';
import { MailService } from '../mail/mail.service';
import { handlePrismaError } from '../common/filters/error.util';
import { AuditService } from '../audit/audit.service';
import { CreateAuditDto } from '../audit/dto/create-audit.dto';

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
  ) {}

  async create(payload: SendInvitationDto) {
    const invitationToken = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
      .createHash('sha256')
      .update(invitationToken)
      .digest('hex');

    const invitation = await this.dbService.$transaction(async (tx) => {
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

      return await tx.invitation.create({
        data: {
          organizationId: payload.organizationId,
          roleId: payload.roleId,
          createdByUserId: payload.createdByUserId,
          email: payload.email,
          token: tokenHash,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        select: {
          id: true,
          organizationId: true,
          roleId: true,
        },
      });
    });

    await this.mailService.sendInvitationEmail(payload.email, invitationToken);

    await this.createAuditLog(AuditAction.MEMBER_INVITED, {
      organizationId: invitation.organizationId,
      userId: payload.createdByUserId,
      resource: ResourceType.INVITATION,
      resourceId: invitation.id,
      metadata: {
        email: payload.email,
        roleId: invitation.roleId,
      },
    });

    return ok('Invitation sent to user');
  }

  async acceptInvitation(token: string) {
    if (!token) {
      throw new BadRequestException('Token not found');
    }

    const now = new Date();

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    try {
      const membership = await this.dbService.$transaction(async (tx) => {
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

        return await tx.organizationMember.create({
          data: {
            organizationId,
            userId: user.id,
            roleId,
            status: MemberStatus.ACTIVE,
          },
          select: {
            id: true,
            organizationId: true,
            userId: true,
            roleId: true,
          },
        });
      });

      await this.createAuditLog(AuditAction.MEMBER_JOINED, {
        organizationId: membership.organizationId,
        userId: membership.userId,
        resource: ResourceType.ORGANIZATION,
        resourceId: membership.organizationId,
        metadata: {
          membershipId: membership.id,
          roleId: membership.roleId,
        },
      });

      return ok(
        'User invitation accepted, used registered as member of organization',
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  private async createAuditLog(
    action: AuditAction,
    context: Omit<Partial<CreateAuditDto>, 'action'> = {},
  ) {
    try {
      await this.auditService.create({
        action,
        resource: context.resource ?? ResourceType.INVITATION,
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
}
