import { IsEmail } from 'class-validator';
import { UserValidators } from '../../common/validators/user.validators';
import { RoleNames } from '@prisma/client';

export class SendInvitationDto {
  organizationId!: string;

  @IsEmail({}, UserValidators.EMAIL_RULES)
  email!: string;

  roleId!: string;

  createdByUserId!: string;
}
