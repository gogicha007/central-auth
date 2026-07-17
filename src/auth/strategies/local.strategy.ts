import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { LoginResponseDto } from '../dto/login-response.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' })
    }

    async validate(username: string, password: string): Promise<LoginResponseDto> {
        console.log('local strategy')
        const user = await this.authService.validateUser({ email: username, password })
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        return user;
    }
}