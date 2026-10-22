import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { AuditAction, ResourceType, RoleNames } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { CreateAuditDto } from '../audit/dto/create-audit.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly auditService: AuditService,
  ) {}

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

  async update(organizationId: string, id: string, data: UpdateRoleDto) {
    await this.findInOrganization(organizationId, id);
    const role = await this.dbService.role.update({
      where: { id, organizationId },
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

  private async findInOrganization(organizationId: string, id: string) {
    const role = await this.dbService.role.findUnique({
      where: { id, organizationId },
    });
    if (!role)
      throw new NotFoundException('Role not found in this organization');
    return role;
  }

  async assignPermission(
    organizationId: string,
    roleId: string,
    permissionId: string,
  ) {
    const [role, permission] = await Promise.all([
      this.findInOrganization(organizationId, roleId),
      this.dbService.permission.findUnique({ where: { id: permissionId } }),
    ]);

    if (!role) throw new NotFoundException(`Role '${roleId}' not found`);
    if (!permission)
      throw new NotFoundException(`Permission '${permissionId}' not found`);

    const rolePermission = await this.dbService.rolePermission.upsert({
      where: { roleId_permissionId: { roleId, permissionId } },
      update: {},
      create: { roleId, permissionId },
    });

    await this.createAuditLog(AuditAction.PERMISSION_GRANTED, {
      organizationId: role.organizationId,
      resource: ResourceType.PERMISSION,
      resourceId: permissionId,
      metadata: { roleId },
    });

    return rolePermission;
  }

  async removePermission(
    organizationId: string,
    roleId: string,
    permissionId: string,
  ) {
    const role = await this.findInOrganization(organizationId, roleId);

    await this.dbService.rolePermission.delete({
      where: { roleId_permissionId: { roleId, permissionId } },
    });

    await this.createAuditLog(AuditAction.PERMISSION_REVOKED, {
      organizationId: role.organizationId,
      resource: ResourceType.PERMISSION,
      resourceId: permissionId,
      metadata: { roleId },
    });
  }
}
