import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MemberStatus, RoleNames } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InvitationsService } from '../invitations/invitations.service';
import { RolesService } from '../roles/roles.service';
import { CreateRoleDto } from '../roles/dto/create-role.dto';
import { SendInvitationRequestDto } from './dto/send-invitation-request.dto';


@Injectable()
export class OrganizationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly invitationService: InvitationsService,
    private readonly roleService: RolesService,
  ) { }

  async create(
    createOrganizationDto: CreateOrganizationDto,
    creatorUserId: string,
  ) {
    try {
      return await this.databaseService.$transaction(async (tx) => {
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
    return await this.databaseService.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.organization.delete({ where: { id } });
  }

  async sendInvitation(data: SendInvitationRequestDto) {
    const role = await this.roleService.findByOrgId(
      data.organizationId,
      data.roleName
    );

    if (!role) {
      throw new NotFoundException(
        `Role '${data.roleName}' does not exist in this organization.`
      );
    }
    return await this.invitationService.create({
      organizationId: data.organizationId,
      roleId: role.id,
      email: data.email,
      createdByUserId: data.createdByUserId
    })
  }

  async createRole(payload: CreateRoleDto) {
    return await this.roleService.create(payload);
  }
}
