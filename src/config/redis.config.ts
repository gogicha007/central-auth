import { ConfigService } from '@nestjs/config';

// Keep queue and session clients pointed at the same Redis deployment.
export function redisConnectionOptions(config: ConfigService) {
  return {
    host: config.getOrThrow<string>('REDIS_HOST'),
    port: Number(config.getOrThrow<number | string>('REDIS_PORT')),
  };
}
