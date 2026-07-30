import { SetMetadata } from '@nestjs/common';
import { RoleNames } from '@prisma/client';

export const ROLE_KEY = 'role';

export const Roles = (...role: RoleNames[]) => SetMetadata(ROLE_KEY, role);
