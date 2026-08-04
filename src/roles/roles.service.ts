import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';

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
}
