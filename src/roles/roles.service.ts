import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RolesService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(data: CreateRoleDto) {
    return await this.databaseService.role.create({
      data
    })
  }
}
