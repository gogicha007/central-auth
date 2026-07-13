import { IsEmail, IsString, MinLength } from 'class-validator'
import { UserValidators } from '../../../libs/validators/user.validators'

export class LoginDto {
    @IsEmail({}, UserValidators.EMAIL_RULES)
    email!: string

    @IsString(UserValidators.NAME_RULES)
    @MinLength(8, UserValidators.PASSWORD_RULES)
    password!: string
}

export class LoginResponseDto {
    accessToken!: string
    expiresIn!: number
    tokenType!: string
}