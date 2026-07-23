import type { JwtSignOptions } from '@nestjs/jwt';
import { computeSessionTtlSeconds } from '../common/utils/session-helper';
import type { JwtPayload } from './auth.types';

export type AuthSession = {
  id: string;
  userId: string;
  expiresAt: Date;
  idleExpiresAt: Date;
  revokedAt: Date | null;
  refreshVersion: number;
};

export type CachedSession = {
  id: string;
  userId: string;
  expiresAt: string | Date;
  idleExpiresAt: string | Date;
  revokedAt: string | Date | null;
  refreshVersion: number;
};

type JwtConfigReader = {
  getOrThrow<T = string>(propertyPath: string): T;
};

type TokenUser = {
  id: string;
  email: string;
};

type RedisCacheStore = {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
};

type SessionReader = {
  getSession(sessionId: string): Promise<AuthSession | null | undefined>;
};

export function getJwtOptions(
  configService: JwtConfigReader,
  secretKey: string,
  ttl: string,
): JwtSignOptions {
  return {
    secret: configService.getOrThrow(secretKey),
    expiresIn: ttl as JwtSignOptions['expiresIn'],
  };
}

export function createTokenPayload(
  user: TokenUser,
  sessionId: string,
): JwtPayload {
  return {
    sub: user.id,
    sid: sessionId,
    email: user.email,
  };
}

export function getSessionCacheKey(sessionId: string) {
  return `auth:session:${sessionId}`;
}

export function normalizeCachedSession(session: CachedSession): AuthSession {
  return {
    ...session,
    expiresAt: new Date(session.expiresAt),
    idleExpiresAt: new Date(session.idleExpiresAt),
    revokedAt: session.revokedAt ? new Date(session.revokedAt) : null,
  };
}

export async function cacheSession(
  redisService: RedisCacheStore,
  session: CachedSession,
): Promise<void> {
  const ttlSeconds = computeSessionTtlSeconds(
    new Date(session.expiresAt),
    new Date(session.idleExpiresAt),
  );

  if (ttlSeconds <= 0) {
    return;
  }

  await redisService.set(getSessionCacheKey(session.id), session, ttlSeconds);
}

export async function getSessionForAuth(
  redisService: RedisCacheStore,
  sessionsService: SessionReader,
  sessionId: string,
): Promise<AuthSession | null | undefined> {
  const cacheKey = getSessionCacheKey(sessionId);
  const cachedSession = await redisService.get<CachedSession>(cacheKey);

  if (cachedSession) {
    return normalizeCachedSession(cachedSession);
  }

  const session = await sessionsService.getSession(sessionId);

  if (session) {
    await cacheSession(redisService, session);
  }

  return session;
}