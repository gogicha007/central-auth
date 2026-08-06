import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { InvitationsModule } from '../invitations/invitations.module';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuthModule, DatabaseModule, InvitationsModule, RolesModule, AuditModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, RolesService],
})
export class OrganizationsModule {}
