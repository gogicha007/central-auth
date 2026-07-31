import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberStatus, RoleNames } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import { ROLES_KEY } from '../decorators/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly db: DatabaseService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<RoleNames[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles) {
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

        const member = await this.db.organizationMember.findFirst({
            where: {
                userId,
                organizationId,
                status: MemberStatus.ACTIVE,
            },
            select: {
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!member) {
            return false;
        }

        return requiredRoles.includes(member.role.name);
    }
}

function getSingleHeaderValue(value: string | string[] | undefined) {
    if (!value) {
        return undefined;
    }

    return Array.isArray(value) ? value[0] : value;
}