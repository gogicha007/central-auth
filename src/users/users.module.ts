import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MailModule } from '../mail/mail.module';
import { DatabaseModule } from '../database/database.module';
import { PasswordModule } from '../common/password/password.module';
import { SessionsModule } from '../sessions/sessions.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [MailModule, DatabaseModule, PasswordModule, SessionsModule, RedisModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
