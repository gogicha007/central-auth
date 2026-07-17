import { UserStatus } from "@prisma/client"

export class LoginResponseDto {
    id!: string
    status!: UserStatus
    emailVerified!: boolean
    email!: string
    accessToken?: string
    expiresIn?: number
    tokenType?: string
}