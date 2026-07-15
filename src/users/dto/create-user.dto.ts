import { IsEmail, IsString } from "class-validator";
import { UserValidators } from "../../common/validators/user.validators";

export class CreateUserDto {
    @IsEmail({}, UserValidators.EMAIL_RULES)
    email!: string

    @IsString(UserValidators.NAME_RULES)
    firstName!: string

    @IsString(UserValidators.NAME_RULES)
    lastName!: string

    @IsString(UserValidators.NAME_RULES)
    passwordHash!: string
}