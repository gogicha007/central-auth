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
import { RoleDelegationValidator } from '../common/validators/role-delegation.validator';
import { AuthenticatedUserContext } from '../auth/auth.types';

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
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Organization name or slug already exists');
      }
      throw error
    }

  }

  async findAll() {
    return await this.databaseService.organization.findMany();
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
    const { organizationId, fromOwnerId, toOwnerId } = payload
    if (payload.fromOwnerId === payload.toOwnerId) throw new ConflictException('target owner is same as current')

    const targetUser = await this.usersService.findById(toOwnerId)
    if (!targetUser) throw new NotFoundException('target owner not found')
    if (blockedStatuses.includes(targetUser.status)) throw new ForbiddenException('target user is not active')

    await this.databaseService.$transaction(async (tx) => {
      const ownerRole = await tx.role.findUnique({
        where: {
          organizationId_name: {
            organizationId: organizationId,
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
          organizationId: organizationId,
          userId: fromOwnerId,
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
            organizationId: organizationId,
            userId: toOwnerId
          }
        },
        update: {
          roleId: ownerRole.id,
          status: MemberStatus.ACTIVE
        },
        create: {
          organizationId: organizationId,
          userId: toOwnerId,
          roleId: ownerRole.id,
          status: MemberStatus.ACTIVE
        }
      })

      //check if admin role exists for that organization 
      let adminRole = await tx.role.findUnique({
        where: {
          organizationId_name: {
            organizationId: organizationId,
            name: RoleNames.ADMIN,
          },
        },
      })

      if (!adminRole) {
        adminRole = await tx.role.create({
          data: {
            organizationId: organizationId,
            name: RoleNames.ADMIN,
            description: 'Admin for organization'
          }
        })
      }

      await tx.organizationMember.update({
        where: {
          organizationId_userId: {
            organizationId: organizationId,
            userId: fromOwnerId
          }
        },
        data: {
          roleId: adminRole.id
        }
      })
    })

    await this.createAuditLog(AuditAction.ORGANIZATION_TRANSFERRED, {
      organizationId: organizationId,
      userId: fromOwnerId,
      resource: ResourceType.ORGANIZATION,
      resourceId: organizationId,
      metadata: {
        fromOwnerId: fromOwnerId,
        toOwnerId: toOwnerId
      }
    })
    return ok('Ownership transferred successfully')
  }

  async sendInvitation(actorUser: AuthenticatedUserContext, data: SendInvitationRequestDto) {

    const actorRole = await this.databaseService.organizationMember.findFirst({
      where: {
        organizationId: data.organizationId,
        userId: actorUser.id
      },
      include: {
        role: true
      }
    })

    if (!actorRole) throw new NotFoundException(
      `Actor '${actorUser.email}' not found in organization members`,
    )

    const role = await this.roleService.findByOrgId(
      data.organizationId,
      data.roleName,
    );

    if (!role) {
      throw new NotFoundException(
        `Role '${data.roleName}' does not exist in this organization, please create one and try again.`,
      );
    }

    RoleDelegationValidator.assertCanInviteRole(
      actorRole.role.name, data.roleName, actorUser.isPlatformAdmin
    )

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

  async updateMembershipRole(
    actorUser: AuthenticatedUserContext,
    payload: UpdateMembershipRoleDto) {
    const { organizationId, organizationMemberId, roleName } = payload

    const targetRole = await this.roleService.findByOrgId(organizationId, roleName)
    if (!targetRole) {
      throw new NotFoundException(
        `Role '${roleName}' does not exist in this organization, please create one and try again.`,
      );
    }

    const [actorMember, targetMember] = await Promise.all([
      this.databaseService.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId, userId: actorUser.id } },
        include: { role: true }
      }),
      this.databaseService.organizationMember.findFirst({
        where: { id: organizationMemberId, organizationId },
        include: { role: true }
      })
    ])

    if (!actorMember) throw new ForbiddenException('You are not a member of this organization')
    if (!targetMember) throw new NotFoundException('Target organization member nod found')

    RoleDelegationValidator.assertCanManageRole({
      actorRole: actorMember.role.name,
      targetRole: targetMember.role.name,
      requestedRole: targetRole.name,
      isPlatformAdmin: actorUser.isPlatformAdmin
    })

    const updatedMember = await this.databaseService.organizationMember.update({
      where: {
        id: organizationMemberId,
        organizationId: organizationId,
      },
      data: { roleId: targetRole.id },
    });

    await this.createAuditLog(AuditAction.ROLE_ASSIGNED, {
      organizationId: organizationId,
      resource: ResourceType.ROLE,
      resourceId: targetRole.id,
      metadata: { organizationMemberId },
    });

    return updatedMember;
  }

  async deleteMember(actorUser: AuthenticatedUserContext, payload: DeleteOrgMemberDto) {
    const { organizationId, organizationMemberId } = payload

    const actorMember = await this.databaseService.organizationMember.findFirst({
      where: {
        organizationId,
        userId: actorUser.id
      },
      include: {
        role: true
      }
    })
    if (!actorMember) throw new NotFoundException('action: deleteMember, target member not found')

    const targetMember = await this.databaseService.organizationMember.findFirst({
      where: {
        organizationId,
        id: organizationMemberId
      },
      include: {
        role: true
      }
    })
    if (!targetMember) throw new NotFoundException('action: deleteMember, target member not found')

    RoleDelegationValidator.assertCanRemoveMember({
      actorRole: actorMember.role.name,
      targetRole: targetMember.role.name,
      isPlatformAdmin: actorUser.isPlatformAdmin,
    });

    if (targetMember.role.name === RoleNames.OWNER) {
      const targetOwnerCount = await this.databaseService.organizationMember.count({
        where: {
          organizationId,
          roleId: targetMember.roleId,
        }
      })

      if (targetOwnerCount === 1) {
        throw new ForbiddenException('You must leave at least one owner')
      }
    }

    const removedMember = await this.databaseService.organizationMember.delete({
      where: {
        id: organizationMemberId
      }
    })

    await this.createAuditLog(AuditAction.MEMBER_REMOVED, {
      organizationId: organizationId,
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
