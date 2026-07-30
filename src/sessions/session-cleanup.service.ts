import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionsService } from './sessions.service';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanupRevokedSessions() {
    const retentionDays = Number.parseInt(
      this.configService.get<string>('SESSION_REVOKED_RETENTION_D') ?? '30',
      10,
    );

    const deletedCount = await this.sessionsService.cleanupRevokedSessions(
      retentionDays,
    );

    if (deletedCount > 0) {
      this.logger.log(`Cleaned up ${deletedCount} revoked sessions`);
    }
  }
}