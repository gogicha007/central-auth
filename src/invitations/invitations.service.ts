import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class InvitationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(userId: string, orgId: string, roleId: string) {
    return 'invitations service';
  }
}
