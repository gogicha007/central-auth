import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuditAction, MemberStatus, ResourceType, RoleNames } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { DatabaseService } from '../database/database.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { CreateAuditDto } from '../audit/dto/create-audit.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateRoleDto } from '../roles/dto/create-role.dto';
import { DeleteOrgMemberDto } from './dto/delete-org-member.dto';
import { InvitationsService } from '../invitations/invitations.service';
import { SendInvitationRequestDto } from './dto/send-invitation-request.dto';
import { TransferOrganizationOwnershipDto } from './dto/transfer-org-ownership.dto';
import { UpdateMembershipRoleDto } from './dto/update-membership-role';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { blockedStatuses } from '../users/constants';
import { ok } from '../common/utils/api-response.util';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly invitationService: InvitationsService,
    private readonly roleService: RolesService,
    private readonly auditService: AuditService,
    private readonly usersService: UsersService
  ) { }

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

  async transferOrganizationOwnership(payload: TransferOrganizationOwnershipDto) {
    if (payload.fromOwnerId === payload.toOwnerId) throw new ConflictException('target owner is same as current')

    const targetUser = await this.usersService.findById(payload.toOwnerId)
    if (!targetUser) throw new NotFoundException('target owner not found')
    if (blockedStatuses.includes(targetUser.status)) throw new ForbiddenException('target user is not active')

    await this.databaseService.$transaction(async (tx) => {
      const ownerRole = await tx.role.findUnique({
        where: {
          organizationId_name: {
            organizationId: payload.organizationId,
            name: RoleNames.OWNER,
          },
        },
        select: { id: true },
      })

      if (!ownerRole) {
        throw new NotFoundException('current owner role not found in that org')
      }

      const currentOwnerMember = await tx.organizationMember.findFirst({
        where: {
          organizationId: payload.organizationId,
          userId: payload.fromOwnerId,
          roleId: ownerRole.id,
          status: MemberStatus.ACTIVE,
        },
        select: { id: true },
      })

      if (!currentOwnerMember) {
        throw new ForbiddenException('current user is not an active owner of this organization')
      }

      //upsert new owner
      await tx.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId: payload.organizationId,
            userId: payload.toOwnerId
          }
        },
        update: {
          roleId: ownerRole.id,
          status: MemberStatus.ACTIVE
        },
        create: {
          organizationId: payload.organizationId,
          userId: payload.toOwnerId,
          roleId: ownerRole.id,
          status: MemberStatus.ACTIVE
        }
      })

      //check if admin role exists for that organization 
      let adminRole = await tx.role.findUnique({
        where: {
          organizationId_name: {
            organizationId: payload.organizationId,
            name: RoleNames.ADMIN,
          },
        },
      })

      if (!adminRole) {
        adminRole = await tx.role.create({
          data: {
            organizationId: payload.organizationId,
            name: RoleNames.ADMIN,
            description: 'Admin for organization'
          }
        })
      }

      await tx.organizationMember.update({
        where: {
          organizationId_userId: {
            organizationId: payload.organizationId,
            userId: payload.fromOwnerId
          }
        },
        data: {
          roleId: adminRole.id
        }
      })
    })

    await this.createAuditLog(AuditAction.ORGANIZATION_TRANSFERRED, {
      organizationId: payload.organizationId,
      userId: payload.fromOwnerId,
      resource: ResourceType.ORGANIZATION,
      resourceId: payload.organizationId,
      metadata: {
        fromOwnerId: payload.fromOwnerId,
        toOwnerId: payload.toOwnerId
      }
    })
     return ok('Ownership transferred successfully')
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

  async deleteMember(payload: DeleteOrgMemberDto) {
    const removedMember = await this.databaseService.organizationMember.delete({
      where: {
        organizationId: payload.organizationId,
        id: payload.memberId
      }
    })

    await this.createAuditLog(AuditAction.MEMBER_REMOVED, {
      organizationId: removedMember.id,
      resource: ResourceType.ORGANIZATION,
      resourceId: removedMember.id,
    });

    return removedMember
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
