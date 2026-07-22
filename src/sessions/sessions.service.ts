import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';

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

  createSession(userId: string) {
    console.log('create session, userId', userId);

    const now = new Date();

    const absoluteTtlDays = this.getPositiveIntConfig('SESSION_ABSOLUTE_TTL_D');
    const idleTtlHours = this.getPositiveIntConfig('SESSION_IDLE_TTL_H');

    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + absoluteTtlDays);

    const idleExpiresAt = new Date(now);
    idleExpiresAt.setHours(idleExpiresAt.getHours() + idleTtlHours);

    return 'session';
  }
}
