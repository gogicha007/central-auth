import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds: number,
  ): Promise<T> {
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached) as T;

    const freshData = await fn();
    await this.redis.set(key, JSON.stringify(freshData), 'EX', ttlSeconds);
    return freshData;
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
