import { MemberStatus } from '@prisma/client';

export class CreateOrganizationMemberDto {
  organizationId!: string;
  userId!: string;
  roleId!: string;
  status!: MemberStatus;
}
