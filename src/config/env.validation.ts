export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  for (const key of [
    'JWT_ACCESS_TOKEN_SECRET',
    'JWT_REFRESH_TOKEN_SECRET',
  ]) {
    const value = config[key];

    if (typeof value !== 'string' || value.trim().length < 32) {
      throw new Error(`${key} must contain at least 32 characters`);
    }
  }

  if (
    config.JWT_ACCESS_TOKEN_SECRET ===
    config.JWT_REFRESH_TOKEN_SECRET
  ) {
    throw new Error('Access and refresh secrets must be different');
  }

  for (const key of ['JWT_ACCESS_TTL_M', 'JWT_REFRESH_TTL_D']) {
    const value = config[key];

    if (
      typeof value !== 'string' ||
      !/^[1-9]\d*(s|m|h|d)$/.test(value)
    ) {
      throw new Error(
        `${key} must be a positive duration, such as 15m or 30d`,
      );
    }
  }

  for (const key of [
    'SESSION_ABSOLUTE_TTL_D',
    'SESSION_IDLE_TTL_H',
  ]) {
    const value = config[key];

    if (
      !/^[1-9]\d*$/.test(String(value ?? '')) ||
      !Number.isSafeInteger(Number(value))
    ) {
      throw new Error(`${key} must be a positive integer`);
    }
  }

  return config;
}