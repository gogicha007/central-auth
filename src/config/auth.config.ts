import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtTtl: process.env.JWT_ACCESS_TTL_M || '15m',
  refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  refreshTtl: process.env.JWT_REFRESH_TTL_D || '30d',
}));
