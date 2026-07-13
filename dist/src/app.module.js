"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const redis_module_1 = require("./redis/redis.module");
const auth_config_1 = __importDefault(require("./config/auth.config"));
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const config_2 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const logging_module_1 = require("../libs/services/logging.module");
const logger_middleware_1 = require("../libs/middleware/logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [auth_config_1.default],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_2.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: config.get('THROTTLER_TTL') || 60000,
                        limit: config.get('THROTTLER_LIMIT') || 10,
                    },
                ],
            }),
            database_module_1.DatabaseModule,
            redis_module_1.RedisModule,
            logging_module_1.LoggingModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map