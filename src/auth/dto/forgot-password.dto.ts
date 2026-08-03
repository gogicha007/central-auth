import { IsEmail } from 'class-validator';
import { UserValidators } from '../../common/validators/user.validators';

export class ForgotPasswordDto {
  @IsEmail({}, UserValidators.EMAIL_RULES)
  email!: string;
}
