import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import { handlePrismaError } from '../common/filters/error.util';

@Injectable()
export class SessionsService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  private getPositiveIntConfig(key: string): number {
    const raw = this.configService.getOrThrow<string>(key);
    const value = Number.parseInt(raw, 10);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`${key} must be a positive integer`);
    }

    return value;
  }

  async createSession(
    userId: string,
    ip: null | string = null,
    userAgent: null | string = null,
  ) {
    const now = new Date();

    const absoluteTtlDays = this.getPositiveIntConfig('SESSION_ABSOLUTE_TTL_D');
    const idleTtlHours = this.getPositiveIntConfig('SESSION_IDLE_TTL_H');

    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + absoluteTtlDays);

    const idleExpiresAt = new Date(now);
    idleExpiresAt.setHours(idleExpiresAt.getHours() + idleTtlHours);

    try {
      return await this.dbService.$transaction(async (tx) => {
        const activeSession = await tx.session.findFirst({
          where: {
            userId,
            revokedAt: null,
            expiresAt: { gt: now },
            idleExpiresAt: { gt: now },
          },
          select: { id: true },
        });
        if (activeSession) {
          await tx.session.update({
            where: { id: activeSession.id },
            data: {
              revokedAt: now,
              revokedReason: 'replaced',
            },
          });
        }

        return tx.session.create({
          data: {
            userId,
            ip,
            userAgent,
            lastActivity: now,
            expiresAt,
            idleExpiresAt,
          },
        });
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getSession(sessionId: string) {
    try {
      return await this.dbService.session.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
          idleExpiresAt: true,
          revokedAt: true,
          refreshVersion: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async revokeSession(sessionId: string, reason?: string | null) {
    const now = new Date();

    const revokedSession = await this.dbService.session.update({
      where: {
        id: sessionId,
      },
      data: {
        revokedAt: now,
        revokedReason: reason,
      },
    });

    return revokedSession;
  }

  async getActiveSessions() {
    const now = new Date();
    const activeSessions = await this.dbService.session.findMany({
      where: {
        revokedAt: null,
        expiresAt: { gt: now },
        idleExpiresAt: { gt: now },
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        idleExpiresAt: true,
        revokedAt: true,
        refreshVersion: true,
      },
    });
    return activeSessions;
  }

  async cleanupRevokedSessions(retentionDays: number) {
    if (!Number.isFinite(retentionDays) || retentionDays < 1) {
      throw new Error('retentionDays must be a positive integer');
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Math.floor(retentionDays));

    const result = await this.dbService.session.deleteMany({
      where: {
        revokedAt: {
          not: null,
          lt: cutoff,
        },
      },
    });

    return result.count;
  }
}
