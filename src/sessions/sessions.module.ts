import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';
import { SessionCacheWarmupService } from './redis-session-restore.service';
import { SessionCleanupService } from './session-cleanup.service';

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [
    SessionsService,
    SessionCacheWarmupService,
    SessionCleanupService,
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
