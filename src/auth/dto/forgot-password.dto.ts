import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserValidators } from '../../common/validators/user.validators';

export class ForgotPasswordDto {
  @IsEmail({}, UserValidators.EMAIL_RULES)
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;
}
