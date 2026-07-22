import { Injectable } from "@nestjs/common";
import { SignUpDto } from "./dto/signUp.dto";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UsersService } from "../users/users.service";
import { PasswordService } from "../common/password/password.service";
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";
import { SessionsService } from "../sessions/sessions.service";


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly sessionsService: SessionsService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
        private readonly configService: ConfigService
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

    async login(user: LoginResponseDto, ip?: string | undefined, userAgent?: string | null) {
        const session = await this.sessionsService.createSession(user.id, ip, userAgent)
        console.log("login, session", session)

        const expiresAccessToken = new Date()

        expiresAccessToken.setMinutes(
            expiresAccessToken.getMinutes() +
            parseInt(this.configService.getOrThrow<string>("JWT_TTL_M"))
        )
        console.log("login, expiresAccessToken+15m", expiresAccessToken)

        const payload = { username: user.email, sub: user.id }

        console.log("login, payload", payload)

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET"),
            expiresIn: `${this.configService.getOrThrow("JWT_TTL_M")}m`
        })

        console.log('accessToken', accessToken)
        return accessToken
    }

    verifyEmail(token: string) {
        return this.userService.verifyEmailByToken(token)
    }

    logout() {
        return `logout hit`
    }

}