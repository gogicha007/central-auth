import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);

    if (!cached) {
      return null;
    }

    return JSON.parse(cached) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);

    if (!ttlSeconds || ttlSeconds <= 0) {
      await this.redis.set(key, serialized);
      return;
    }

    await this.redis.set(key, serialized, 'EX', ttlSeconds);
  }

  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds: number,
  ): Promise<T> {
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached) as T;

    const freshData = await fn();

    await this.set(key, freshData, ttlSeconds);
    return freshData;
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
