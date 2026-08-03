import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  UseGuards,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUserContext, UserContext } from './auth.types';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Throttle } from '@nestjs/throttler';
import { ForgotPasswordThrottlerGuard } from './guards/forgot-password-throttler.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @CurrentUser() user: UserContext) {
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;

    const ip = forwardedIp ?? req.ip ?? undefined;

    const userAgent =
      typeof req.headers['user-agent'] === 'string'
        ? req.headers['user-agent']
        : undefined;
    return this.authService.login(user, ip, userAgent);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Req() req: Request) {
    const user = req.user as AuthenticatedUserContext;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.logout(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sessions/:id/revoke')
  sessionRevoke(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthenticatedUserContext;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.sessionRevoke(user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('sessions')
  getUserSessions(@Req() req: Request) {
    const user = req.user as AuthenticatedUserContext;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.getUserActiveSessions(user.id);
  }

  @UseGuards(ForgotPasswordThrottlerGuard)
  @Post('password/forgot')
  @Throttle({
    ipStrict: { limit: 5, ttl: 900000 },
    emailStrict: { limit: 3, ttl: 900000 },
  })
  passwordForgot(@Body() data: ForgotPasswordDto) {
    this.authService.forgotPassword(data.email);
  }

  @Post('password/reset')
  passwordReset() {}

  @Post('password/change')
  passwordChange() {}

  @Get()
  health() {
    return 'get outh requested';
  }
}
