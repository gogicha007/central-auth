import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleNames } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(data: CreateRoleDto) {
    return await this.dbService.role.create({
      data,
    });
  }
  
  async update(id: string, data: UpdateRoleDto) {
    return await this.dbService.role.update({
      where: { id },
      data,
    });
  }

  async findByOrgId(organizationId: string, name: RoleNames){
    console.log('roles service, findby org id', organizationId, ' ', name)
    return await this.dbService.role.findUnique({
      where: {
        organizationId_name: {
          organizationId,
          name
        }
      }
    })
  }
}
