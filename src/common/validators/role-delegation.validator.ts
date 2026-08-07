// src/common/utils/role-delegation.validator.ts
import { ForbiddenException, BadRequestException } from '@nestjs/common';

export const ROLE_HIERARCHY: Record<string, number> = {
  VIEWER: 1,
  EMPLOYEE: 2,
  ADMIN: 3,
  MANAGER: 4,
  DIRECTOR: 5,
  OWNER: 6,
};

export interface RoleDelegationContext {
  actorRole: string;
  targetCurrentRole: string;
  requestedRole: string;
}

export class RoleDelegationValidator {
  static assertCanManageRole(context: RoleDelegationContext): void {
    const { actorRole, targetCurrentRole, requestedRole } = context;

    const actorRank = ROLE_HIERARCHY[actorRole];
    const targetCurrentRank = ROLE_HIERARCHY[targetCurrentRole];
    const requestedRank = ROLE_HIERARCHY[requestedRole];

    // 1. Validate presence in hierarchy
    if (!actorRank || !targetCurrentRank || !requestedRank) {
      throw new BadRequestException('Unmapped or invalid role in hierarchy.');
    }

    // 2. Prevent no-op role assignments
    if (targetCurrentRole === requestedRole) {
      throw new BadRequestException(`Member already holds the '${requestedRole}' role.`);
    }

    // 3. OWNER bypasses delegation constraints
    if (actorRole === 'OWNER') {
      return;
    }

    // 4. Non-owners cannot grant OWNER
    if (requestedRole === 'OWNER') {
      throw new ForbiddenException('Only the current OWNER can grant or transfer ownership.');
    }

    // 5. Cannot modify members with equal or higher rank
    if (targetCurrentRank >= actorRank) {
      throw new ForbiddenException(
        `You cannot modify members with equal or higher roles (${targetCurrentRole}).`
      );
    }

    // 6. Cannot assign a role equal to or higher than your own
    if (requestedRank >= actorRank) {
      throw new ForbiddenException(
        `You can only assign roles strictly below your current rank (${actorRole}).`
      );
    }
  }
}