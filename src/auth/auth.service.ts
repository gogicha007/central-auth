import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignUpDto } from "./dto/signUp.dto";
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "../users/users.service";
import { PasswordService } from "../common/password/password.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly passwordService: PasswordService
    ) { }
    async signUp(payload: SignUpDto) {
        const hashedPassword = await this.passwordService.hash(payload.password)
        const { password, ...credentials } = { ...payload, passwordHash: hashedPassword }
        return this.userService.create(credentials)
    }

    async validateUser(payload: LoginDto) {
        const user = await this.userService.validateUser(payload)
        if (user) return user

        return null
    }

    verifyEmail(token: string) {
        return this.userService.verifyEmailByToken(token)
    }

    logout() {
        return `logout hit`
    }

}