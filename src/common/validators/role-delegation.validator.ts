import { ForbiddenException, BadRequestException } from '@nestjs/common';

export const ROLE_HIERARCHY: Record<string, number> = {
  VIEWER: 1,
  EMPLOYEE: 2,
  MANAGER: 3,
  DIRECTOR: 4,
  ADMIN: 5,
  OWNER: 6,
};

export interface RoleDelegationContext {
  actorRole: string;
  targetRole: string;
  requestedRole: string;
  isPlatformAdmin?: boolean;
}

export interface RoleActionContext {
  actorRole: string;
  targetRole: string;
  isPlatformAdmin?: boolean
}
export class RoleDelegationValidator {
  static assertCanManageRole(context: RoleDelegationContext): void {
    const { actorRole, targetRole, requestedRole, isPlatformAdmin = false } = context;

    if (isPlatformAdmin) return

    const actorRank = ROLE_HIERARCHY[actorRole];
    const targetRank = ROLE_HIERARCHY[targetRole];
    const requestedRank = ROLE_HIERARCHY[requestedRole];

    if (!actorRank || !targetRank || !requestedRank) {
      throw new BadRequestException('Unmapped or invalid role in hierarchy.');
    }

    if (targetRole === requestedRole) {
      throw new BadRequestException(`Member already holds the '${requestedRole}' role.`);
    }

    if (actorRole === 'OWNER') return;

    if (requestedRole === 'OWNER') {
      throw new ForbiddenException('Only the current OWNER can grant or transfer ownership.');
    }

    if (targetRank >= actorRank) {
      throw new ForbiddenException(
        `You cannot modify members with equal or higher roles (${targetRole}).`
      );
    }

    if (requestedRank >= actorRank) {
      throw new ForbiddenException(
        `You can only assign roles strictly below your current rank (${actorRole}).`
      );
    }
  }

  static assertCanRemoveMember(context: RoleActionContext): void {
    const { actorRole, targetRole, isPlatformAdmin = false } = context;

    if (isPlatformAdmin) return;

    const actorRank = ROLE_HIERARCHY[actorRole];
    const targetRank = ROLE_HIERARCHY[targetRole];

    if (!actorRank || !targetRank) {
      throw new BadRequestException('Unmapped or invalid role in hierarchy.');
    }

    if (actorRole === 'OWNER') return;

    if (targetRank >= actorRank) {
      throw new ForbiddenException(
        `You cannot remove members with equal or higher roles (${targetRole}).`
      );
    }
  }

  static assertCanInviteRole(
    actorRole: string,
    invitedRole: string,
    isPlatformAdmin = false
  ): void {
    if (isPlatformAdmin) return

    const actorRank = ROLE_HIERARCHY[actorRole]
    const invitedRank = ROLE_HIERARCHY[invitedRole]

    if (!actorRank || !invitedRank) {
      throw new BadRequestException('Unmapped or invalid role in hierarchy')
    }

    if (actorRole === 'OWNER') return

    if (invitedRole === 'OWNER') {
      throw new ForbiddenException('Only the current OWNER can invite a new OWNER.');
    }

    if (invitedRank >= actorRank) {
      throw new ForbiddenException(
        `You can only invite roles strictly below your current rank (${actorRole}).`
      );
    }
  }
}