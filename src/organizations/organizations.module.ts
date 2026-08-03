import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { InvitationsModule } from '../invitations/invitations.module';
import { InvitationsService } from '../invitations/invitations.service';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [AuthModule, DatabaseModule, InvitationsModule, RolesModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, InvitationsService, RolesService],
})
export class OrganizationsModule {}
