import Redis from 'ioredis';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    getOrSet<T>(key: string, fn: () => Promise<T>, ttlSeconds: number): Promise<T>;
    delete(key: string): Promise<void>;
}
