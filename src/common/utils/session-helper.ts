type SessionForAuth = {
  expiresAt: Date;
  idleExpiresAt: Date;
  revokedAt: Date | null;
  refreshVersion: number;
};

export function computeSessionTtlSeconds(
  expiresAt: Date,
  idleExpiresAt: Date,
  now: Date = new Date(),
): number {
  const effectiveExpiryMs = Math.min(
    expiresAt.getTime(),
    idleExpiresAt.getTime(),
  );
  return Math.max(0, Math.floor((effectiveExpiryMs - now.getTime()) / 1000));
}

export function isSessionActive(
  session: Pick<SessionForAuth, 'expiresAt' | 'idleExpiresAt' | 'revokedAt'>,
  now: Date = new Date(),
): boolean {
  if (session.revokedAt) return false;
  if (session.expiresAt.getTime() <= now.getTime()) return false;
  if (session.idleExpiresAt.getTime() <= now.getTime()) return false;
  return true;
}