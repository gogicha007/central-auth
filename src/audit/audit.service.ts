import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuditService {
  constructor(private readonly dbService: DatabaseService) {}
  async create(createAuditDto: CreateAuditDto) {
    return await this.dbService.auditLog.create({
      data: createAuditDto,
    });
  }

  async findAll() {
    return await this.dbService.auditLog.findMany();
  }

  async findOne(id: string) {
    return await this.dbService.auditLog.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return await this.dbService.auditLog.delete({
      where: { id },
    });
  }
}
