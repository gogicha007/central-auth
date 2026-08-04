import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserValidators } from '../../common/validators/user.validators';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Reset token is required' })
  token!: string;

  @IsString()
  @MinLength(8, UserValidators.PASSWORD_RULES)
  @IsNotEmpty({ message: 'New password is required' })
  newPassword!: string;
}