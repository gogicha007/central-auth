import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { UserContext } from './auth.types';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  //TODO: POST logout
  // @UseGuards(LocalAuthGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Req() req: Request) {
    const user = req.user
    console.log('logout controller hit, user',user)
    return this.authService.logout();
  }

  //TODO: POST sessions/:id/revoke
  @Post('sessions/:id/revoke')
  sessinsRevoke() {
    return 'sessions revoke';
  }

  //TODO: GET sessions
  @Get('sessions')
  sessions() {
    return 'sessions';
  }

  //TODO: POST organizations
  @Post('organizations')
  orgainzations() {
    return 'organization';
  }

  //TODO: POST organization/:id/invitation
  @Post('organizations/:id/invitations')
  orgInvitacions() {
    return 'organization invitations';
  }

  //TODO: POST invitaciont/accept
  @Post('invitations/accept')
  invitacionAccept() {
    return 'invitation accept';
  }

  //TODO: PATCH organiztions/:id/members/role
  @Patch('organizations/:id/members/:memberId/role')
  membershipRoles() {
    return 'membership roles';
  }

  @Get()
  health() {
    return 'get outh requested';
  }
}
