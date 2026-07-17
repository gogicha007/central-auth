import { Controller, Post, Body, Get, Patch, Query, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signUp.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto)
    }

    //TODO: POST login
    @UseGuards(LocalAuthGuard)
    @Post('login')
    // login(@Body() loginDto: LoginDto) {
    //     return this.authService.validateUser(loginDto)
    // }
    async login(@Request() req) {
        console.log('auth controller/login')
        return req.user
    }

    @Get('verify-email')
    verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token)
    }

    //TODO: POST refresh token
    @Post('refresh')
    refresh() {
        return 'refresh'
    }

    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        return req.logout()
    }
    //TODO: POST sessions/:id/revoke
    @Post('sessions/:id/revoke')
    sessinsRevoke() {
        return 'sessions revoke'
    }

    //TODO: GET sessions
    @Get('sessiong')
    sessions() {
        return 'sessions'
    }

    //TODO: POST organizations
    @Post('organizations')
    orgainzations() {
        return 'organization'
    }

    //TODO: POST organization/:id/invitation
    @Post('organizations/:id/invitations')
    orgInvitacions() {
        return 'organization invitations'
    }

    //TODO: POST invitaciont/accept
    @Post('invitations/accept')
    invitacionAccept() {
        return 'invitation accept'
    }

    //TODO: PATCH organiztions/:id/members/role
    @Patch('organizations/:id/members/:memberId/role')
    membershipRoles() {
        return 'membership roles'
    }

    @Get()
    health() {
        return 'get outh requested'
    }

}