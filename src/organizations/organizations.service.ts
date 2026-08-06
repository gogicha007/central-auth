import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuditAction, MemberStatus, ResourceType, RoleNames } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InvitationsService } from '../invitations/invitations.service';
import { RolesService } from '../roles/roles.service';
import { CreateRoleDto } from '../roles/dto/create-role.dto';
import { SendInvitationRequestDto } from './dto/send-invitation-request.dto';
import { UpdateMembershipRoleDto } from './dto/update-membership-role';
import { AuditService } from '../audit/audit.service';
import { CreateAuditDto } from '../audit/dto/create-audit.dto';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly invitationService: InvitationsService,
    private readonly roleService: RolesService,
    private readonly auditService: AuditService,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    creatorUserId: string,
  ) {
    try {
      const organization = await this.databaseService.$transaction(async (tx) => {
        const organization = await tx.organization.create({
          data: {
            name: createOrganizationDto.name,
            slug: createOrganizationDto.slug,
            taxNo: createOrganizationDto.taxNo,
          },
        });

        const ownerRole = await tx.role.create({
          data: {
            organizationId: organization.id,
            name: RoleNames.OWNER,
            description: 'Organization owner with full control',
            isSystem: true,
          },
        });

        await tx.organizationMember.create({
          data: {
            organizationId: organization.id,
            userId: creatorUserId,
            roleId: ownerRole.id,
            status: MemberStatus.ACTIVE,
          },
        });

        return organization;
      });

      await this.createAuditLog(AuditAction.ORGANIZATION_CREATED, {
        organizationId: organization.id,
        userId: creatorUserId,
        resource: ResourceType.ORGANIZATION,
        resourceId: organization.id,
        metadata: {
          slug: organization.slug,
        },
      });

      return organization;
    } catch {
      throw new ConflictException('Organization name or slug already exists');
    }
  }

  findAll() {
    return this.databaseService.organization.findMany();
  }

  findOne(id: string) {
    return this.databaseService.organization.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const updatedOrganization = await this.databaseService.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });

    await this.createAuditLog(AuditAction.ORGANIZATION_UPDATED, {
      organizationId: updatedOrganization.id,
      resource: ResourceType.ORGANIZATION,
      resourceId: updatedOrganization.id,
    });

    return updatedOrganization;
  }

  async remove(id: string) {
    const deletedOrganization = await this.databaseService.organization.delete({ where: { id } });

    await this.createAuditLog(AuditAction.ORGANIZATION_DELETED, {
      organizationId: deletedOrganization.id,
      resource: ResourceType.ORGANIZATION,
      resourceId: deletedOrganization.id,
    });

    return deletedOrganization;
  }

  async sendInvitation(data: SendInvitationRequestDto) {
    const role = await this.roleService.findByOrgId(
      data.organizationId,
      data.roleName,
    );

    if (!role) {
      throw new NotFoundException(
        `Role '${data.roleName}' does not exist in this organization, please create one and try again.`,
      );
    }
    return await this.invitationService.create({
      organizationId: data.organizationId,
      roleId: role.id,
      email: data.email,
      createdByUserId: data.createdByUserId,
    });
  }

  async acceptInvitation(token: string) {
    return this.invitationService.acceptInvitation(token);
  }

  async createRole(payload: CreateRoleDto) {
    return await this.roleService.create(payload);
  }

  async updateMembershipRole(payload: UpdateMembershipRoleDto) {
    const role = await this.roleService.findByOrgId(
      payload.organizationId,
      payload.roleName,
    );

    if (!role) {
      throw new NotFoundException(
        `Role '${payload.roleName}' does not exist in this organization, please create one and try again.`,
      );
    }
    const updatedMember = await this.databaseService.organizationMember.update({
      where: {
        id: payload.memberId,
        organizationId: payload.organizationId,
      },
      data: {
        roleId: role.id,
      },
    });

    await this.createAuditLog(AuditAction.ROLE_ASSIGNED, {
      organizationId: payload.organizationId,
      resource: ResourceType.ROLE,
      resourceId: role.id,
      metadata: {
        memberId: payload.memberId,
      },
    });

    return updatedMember;
  }

  private async createAuditLog(
    action: AuditAction,
    context: Omit<Partial<CreateAuditDto>, 'action'> = {},
  ) {
    try {
      await this.auditService.create({
        action,
        resource: context.resource ?? ResourceType.ORGANIZATION,
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
}
