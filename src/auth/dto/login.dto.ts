import { IsEmail, IsString, MinLength } from 'class-validator'
import { UserValidators } from '../../common/validators/user.validators'
import { UserStatus } from '@prisma/client'

export class LoginDto {
    @IsEmail({}, UserValidators.EMAIL_RULES)
    email!: string

    @IsString(UserValidators.NAME_RULES)
    @MinLength(8, UserValidators.PASSWORD_RULES)
    password!: string
}

