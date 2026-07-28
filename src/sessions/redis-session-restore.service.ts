import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { RedisService } from "../redis/redis.service";
import { cacheSession } from "../auth/auth-session-cache.util";

@Injectable()
export class SessionCacheWarmupService implements OnApplicationBootstrap {
    constructor(
        private readonly sessionsService: SessionsService,
        private readonly redisService: RedisService,
    ) {}

    async onApplicationBootstrap() {
        const activeSessions = await this.sessionsService.getActiveSessions()

        await Promise.all(
            activeSessions.map((session) => cacheSession(this.redisService, session))
        )
    }
}