import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PasswordModule } from '../common/password/password.module';

@Module({
	imports: [PasswordModule, UsersModule],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule { }
