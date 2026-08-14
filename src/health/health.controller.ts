import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dbService: DatabaseService,
    private readonly redisService: RedisService
  ) { }

  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([])
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.dbService.isHealthy('database'),
      () => this.redisService.isHealthy('redis')
    ]);
  }
}
