import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(data: CreatePermissionDto) {
    try {
      return await this.dbService.permission.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Permission '${data.resource}:${data.action}' already exists.`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.dbService.permission.findMany();
  }

  async findOne(id: string) {
    const permission = await this.dbService.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission '${id}' not found`);
    }

    return permission;
  }

  async update(id: string, data: UpdatePermissionDto) {
    await this.findOne(id);
    return this.dbService.permission.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.dbService.permission.delete({ where: { id } });
  }
}
