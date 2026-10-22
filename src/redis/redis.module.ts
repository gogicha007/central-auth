import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { HealthIndicatorService } from '@nestjs/terminus';
import { redisConnectionOptions } from '../config/redis.config';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis(redisConnectionOptions(configService));
      },
    },
    RedisService,
    HealthIndicatorService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
