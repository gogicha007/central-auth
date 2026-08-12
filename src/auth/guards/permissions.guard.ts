import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberStatus } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import {
  PERMISSIONS_KEY,
} from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dbService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: { id?: string; isPlatformAdmin?: boolean };
      params?: Record<string, string | undefined>;
      headers?: Record<string, string | string[] | undefined>;
    }>();

    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    if (request.user?.isPlatformAdmin) {
      return true;
    }

    const organizationId =
      request.params?.organizationId ??
      request.params?.orgId ??
      request.params?.id ??
      getSingleHeaderValue(request.headers?.['x-organization-id']) ??
      getSingleHeaderValue(request.headers?.['x-org-id']);

    if (!organizationId) {
      return false;
    }

    const member = await this.dbService.organizationMember.findFirst({
      where: {
        userId,
        organizationId,
        status: MemberStatus.ACTIVE,
      },
      select: {
        role: {
          select: {
            rolePermissions: {
              select: {
                permission: {
                  select: {
                    resource: true,
                    action: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!member) {
      return false;
    }

    const effectivePermissions = new Set<string>();
    for (const rolePermission of member.role.rolePermissions) {
      const permission = rolePermission.permission;
      const resource = permission.resource.toUpperCase();
      const action = permission.action.toUpperCase();
      effectivePermissions.add(`${resource}:${action}`);
    }

    return requiredPermissions.every((permission) =>
      effectivePermissions.has(normalizePermission(permission)),
    );
  }
}

function normalizePermission(permission: string): string {
  return permission.trim().toUpperCase().replace(/\s+/g, '');
}

function getSingleHeaderValue(value: string | string[] | undefined) {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value[0] : value;
}