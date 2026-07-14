import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import authConfig from './config/auth.config';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggingModule } from '../libs/services/logging.module';
import { LoggerMiddleware } from '../libs/middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379
      }
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLER_TTL') || 60000, // in seconds
          limit: config.get<number>('THROTTLER_LIMIT') || 10,
        },
      ],
    }),
    DatabaseModule,
    RedisModule,
    LoggingModule,
    AuthModule,
    UsersModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
