import { SetMetadata } from '@nestjs/common';
import { RoleNames } from '@prisma/client';

export const ROLES_KEY = 'role';

export const Roles = (...role: RoleNames[]) => SetMetadata(ROLES_KEY, role);