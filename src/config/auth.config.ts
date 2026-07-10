import { registerAs } from '@nestjs/config'

export default registerAs('auth', () => ({
    jwtSecret: process.env.JWT_SECRET,
    jwtTtl: process.env.JWT_TTL || '15m',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTtl: process.env.REFRESH_TTL || '30d'
}))