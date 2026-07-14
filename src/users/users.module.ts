import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MailModule } from '../mail/mail.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [MailModule, DatabaseModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
