import { IsEmail } from 'class-validator';
import { UserValidators } from '../../common/validators/user.validators';

export class SendInvitationDto {
  organizationId!: string;

  @IsEmail({}, UserValidators.EMAIL_RULES)
  email!: string;

  roleId!: string;

  createdByUserId!: string;
}
