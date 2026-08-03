import { ConflictException, Injectable } from '@nestjs/common';
import { MemberStatus, RoleNames } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly databaseService: DatabaseService) {}

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
    return await this.databaseService.organization.delete({ id });
  }
}
