import { SetMetadata } from '@nestjs/common';

export const REQUIRED_ROLE_KEY = 'requiredRole';

export const AdminOnly = () => SetMetadata(REQUIRED_ROLE_KEY, 'admin');

export const IsManager = () => SetMetadata(REQUIRED_ROLE_KEY, 'manager');