"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => ({
    jwtSecret: process.env.JWT_SECRET,
    jwtTtl: process.env.JWT_TTL || '15m',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTtl: process.env.REFRESH_TTL || '30d'
}));
//# sourceMappingURL=auth.config.js.map