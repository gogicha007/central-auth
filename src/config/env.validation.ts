export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  for (const key of ['JWT_ACCESS_TOKEN_SECRET', 'JWT_REFRESH_TOKEN_SECRET']) {
    const value = config[key];

    if (typeof value !== 'string' || value.trim().length < 32) {
      throw new Error(`${key} must contain at least 32 characters`);
    }
  }

  if (config.JWT_ACCESS_TOKEN_SECRET === config.JWT_REFRESH_TOKEN_SECRET) {
    throw new Error('Access and refresh secrets must be different');
  }

  for (const key of ['JWT_ACCESS_TTL_M', 'JWT_REFRESH_TTL_D']) {
    const value = config[key];

    if (typeof value !== 'string' || !/^[1-9]\d*(s|m|h|d)$/.test(value)) {
      throw new Error(`${key} must be a positive duration, such as 15m or 30d`);
    }
  }

  for (const key of ['SESSION_ABSOLUTE_TTL_D', 'SESSION_IDLE_TTL_H']) {
    const value = config[key];

    if (
      !/^[1-9]\d*$/.test(String(value ?? '')) ||
      !Number.isSafeInteger(Number(value))
    ) {
      throw new Error(`${key} must be a positive integer`);
    }
  }

  if (typeof config.REDIS_HOST !== 'string' || !config.REDIS_HOST.trim()) {
    throw new Error('REDIS_HOST must be a non-empty hostname');
  }

  const redisPort = Number(config.REDIS_PORT);
  if (
    !/^\d+$/.test(String(config.REDIS_PORT ?? '')) ||
    !Number.isInteger(redisPort) ||
    redisPort < 1 ||
    redisPort > 65535
  ) {
    throw new Error('REDIS_PORT must be an integer between 1 and 65535');
  }

  return {
    ...config,
    REDIS_HOST: config.REDIS_HOST.trim(),
    REDIS_PORT: redisPort,
  };
}
