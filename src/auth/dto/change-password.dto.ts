import { IsNotEmpty, MinLength, IsString } from "class-validator";
import { UserValidators } from "../../common/validators/user.validators";

export class ChangePasswordDto {
    userId?: string
    
    @IsNotEmpty()
    currentPassword!: string

    @IsString()
    @MinLength(8, UserValidators.PASSWORD_RULES)
    @IsNotEmpty({ message: 'New password is required' })
    newPassword!: string;
}