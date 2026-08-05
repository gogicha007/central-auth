import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SendInvitationDto } from './dto/send-invitation.dto';
import * as crypto from 'crypto'
import { TokenType } from '@prisma/client';
import { ok } from '../common/utils/api-response.util';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly mailService: MailService
  ) { }

  async create(payload: SendInvitationDto) {
    const invitationToken = crypto.randomBytes(32).toString('hex')

    const tokenHash = crypto
      .createHash('sha256')
      .update(invitationToken)
      .digest('hex')

    await this.dbService.$transaction(async (tx) => {
      await tx.userToken.updateMany({
        where: {
          userId: payload.createdByUserId,
          type: TokenType.INVITATION
        },
        data: {
          usedAt: new Date()
        }
      })

      await tx.userToken.create({
        data: {
          userId: payload.createdByUserId,
          type: TokenType.INVITATION,
          tokenHash,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          usedAt: null
        }
      })

      await tx.invitation.create({
        data: {
          organizationId: payload.organizationId,
          roleId: payload.roleId as string,
          createdByUserId: payload.createdByUserId,
          email: payload.email,
          token: tokenHash,
          expiresAt: new Date()
        }
      })
    })

    return ok('Invitation sent to user');
  }
}
