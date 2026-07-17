import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignUpDto } from "./dto/signUp.dto";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UsersService } from "../users/users.service";
import { PasswordService } from "../common/password/password.service";
import { JwtService } from "@nestjs/jwt"


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService
    ) { }
    async signUp(payload: SignUpDto) {
        const hashedPassword = await this.passwordService.hash(payload.password)
        const { password, ...credentials } = { ...payload, passwordHash: hashedPassword }
        return this.userService.create(credentials)
    }

    async validateUser(payload: LoginDto) {
        const user = await this.userService.verifyUser(payload)
        if (user) return user

        return null
    }

    async login(user: LoginResponseDto) {
        const payload = { username: user.email, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    verifyEmail(token: string) {
        return this.userService.verifyEmailByToken(token)
    }

    logout() {
        return `logout hit`
    }

}