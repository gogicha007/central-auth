import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { HealthIndicatorService } from '@nestjs/terminus';

@Module({
  providers: [DatabaseService, HealthIndicatorService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
