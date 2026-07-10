import { SetMetadata } from '@nestjs/common';

export const REQUIRED_ROLE_KEY = 'requiredRole';

export const isSuperAdmin = () => SetMetadata(REQUIRED_ROLE_KEY, 'SuperAdmin');

export const IsManager = () => SetMetadata(REQUIRED_ROLE_KEY, 'manager');