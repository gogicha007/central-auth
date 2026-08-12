import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { AuditAction, ResourceType, RoleNames } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { CreateAuditDto } from '../audit/dto/create-audit.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly auditService: AuditService,
  ) { }

  async create(data: CreateRoleDto) {
    const role = await this.dbService.role.create({
      data,
    });

    await this.createAuditLog(AuditAction.ROLE_CREATED, {
      organizationId: role.organizationId,
      resource: ResourceType.ROLE,
      resourceId: role.id,
      metadata: {
        name: role.name,
      },
    });

    return role;
  }

  async update(id: string, data: UpdateRoleDto) {
    const role = await this.dbService.role.update({
      where: { id },
      data,
    });

    await this.createAuditLog(AuditAction.ROLE_UPDATED, {
      organizationId: role.organizationId,
      resource: ResourceType.ROLE,
      resourceId: role.id,
      metadata: {
        name: role.name,
      },
    });

    return role;
  }

  async findByOrgId(organizationId: string, name: RoleNames) {
    return await this.dbService.role.findUnique({
      where: {
        organizationId_name: {
          organizationId,
          name,
        },
      },
    });
  }

  private async createAuditLog(
    action: AuditAction,
    context: Omit<Partial<CreateAuditDto>, 'action'> = {},
  ) {
    try {
      await this.auditService.create({
        action,
        resource: context.resource ?? ResourceType.ROLE,
        organizationId: context.organizationId,
        userId: context.userId,
        resourceId: context.resourceId,
        metadata: context.metadata,
        ip: context.ip,
        userAgent: context.userAgent,
      });
    } catch (error) {
      this.logger.warn('Audit write failed', { action, error });
    }
  }

  async createPermission(roleId: string, data: CreatePermissionDto) {
    console.log('roleid', roleId, ' ', 'data', ' ', data)
  }

  async updatePermission() {

  }

  async deletePermission() {

  }
}
