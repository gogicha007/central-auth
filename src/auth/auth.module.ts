import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PasswordModule } from '../common/password/password.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtService } from '@nestjs/jwt';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisModule } from '../redis/redis.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { OrganizationGuard } from './guards/organization.guard';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    PasswordModule,
    PassportModule,
    RedisModule,
    SessionsModule,
    UsersModule,
    AuditModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtService,
    JwtAuthGuard,
    OrganizationGuard,
    PermissionsGuard,
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, OrganizationGuard, PermissionsGuard],
})
export class AuthModule {}
