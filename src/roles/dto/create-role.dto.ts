import { RoleNames } from '@prisma/client';

export class CreateRoleDto {
  organizationId!: string;
  name!: RoleNames;
  description!: string;
  isSystem?: boolean;
}
