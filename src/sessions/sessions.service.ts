import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import { handlePrismaError } from '../common/filters/error.util';

@Injectable()
export class SessionsService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly configService: ConfigService,
  ) { }

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
    userAgent: null | string = null
  ) {
    const lastActivity = new Date();

    const absoluteTtlDays = this.getPositiveIntConfig('SESSION_ABSOLUTE_TTL_D');
    const idleTtlHours = this.getPositiveIntConfig('SESSION_IDLE_TTL_H');

    const expiresAt = new Date(lastActivity);
    expiresAt.setDate(expiresAt.getDate() + absoluteTtlDays);

    const idleExpiresAt = new Date(lastActivity);
    idleExpiresAt.setHours(idleExpiresAt.getHours() + idleTtlHours);

    try {
      const session = await this.dbService.session.create({
        data: {
          userId,
          ip,
          userAgent,
          lastActivity,
          expiresAt,
          idleExpiresAt,
        }
      })

      return session;
    } catch (error) {
      handlePrismaError(error)
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
          revokedAt: true,
          refreshVersion: true,
        },
      });
    } catch (error) {
      handlePrismaError(error)
    }
  }
}
