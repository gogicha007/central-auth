import { RoleNames } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateMembershipRoleRequestDto {
  @IsString({ message: 'role name must be string' })
  roleName!: RoleNames;
}

export class UpdateMembershipRoleDto extends UpdateMembershipRoleRequestDto {
  organizationId!: string;
  organizationMemberId!: string;
}
