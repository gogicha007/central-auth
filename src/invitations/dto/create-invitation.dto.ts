export class CreateInvitationDto {
  organizationId!: string;
  email!: string;
  roleId!: string;
  token!: string;
  expiresAt!: Date;
  acceptedAt?: Date;
  createdByUserId!: string;
}
