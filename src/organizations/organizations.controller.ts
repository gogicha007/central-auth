import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleNames } from '@prisma/client';
import type { AuthenticatedUserContext } from '../auth/auth.types';
import { UpdateMembershipRoleRequestDto } from './dto/update-membership-role';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() user: AuthenticatedUserContext,
  ) {
    return this.organizationsService.create(createOrganizationDto, user.id);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Public()
  @Get('invitations/accept')
  invitationAccept(@Query('token') token: string) {
    return this.organizationsService.acceptInvitation(token);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Roles('OWNER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Roles('OWNER')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  @Roles('OWNER')
  @UseGuards(RolesGuard)
  @Post(':id/transfer')
  transferOwnership(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUserContext,
    @Body() data: { toOwnerId: string }
  ) {
    const payload = {
      organizationId: id,
      fromOwnerId: user.id,
      toOwnerId: data.toOwnerId
    }
    return this.organizationsService.transferOrganizationOwnership(payload)
  }

  @Roles('OWNER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Post(':id/invitations')
  orgInvitacions(
    @CurrentUser() user: AuthenticatedUserContext,
    @Param('id') organizationId: string,
    @Body() { roleName, email }: { roleName: RoleNames; email: string },
  ) {
    return this.organizationsService.sendInvitation({
      organizationId,
      email,
      roleName,
      createdByUserId: user.id,
    });
  }

  @Roles('OWNER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Post(':organizationId/roles')
  createRole(
    @Param('organizationId') organizationId: string,
    @Body() data: { name: string; description: string },
  ) {
    const key = data.name as keyof typeof RoleNames;
    const roleName = RoleNames[key];
    const payload = { ...data, name: roleName, organizationId };
    return this.organizationsService.createRole(payload);
  }

  @Roles('OWNER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Patch(':id/members/:memberId/role')
  membershipRoles(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() data: UpdateMembershipRoleRequestDto,
  ) {
    return this.organizationsService.updateMembershipRole({
      organizationId: id,
      memberId,
      roleName: data.roleName,
    });
  }

  @Roles('OWNER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string
  ) {
    return this.organizationsService.deleteMember({ organizationId: id, memberId })
  }

}
