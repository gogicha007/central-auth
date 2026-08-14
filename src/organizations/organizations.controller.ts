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
  ForbiddenException,
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
import { OrganizationGuard } from '../auth/guards/organization.guard';

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
  findAll(@CurrentUser() user: AuthenticatedUserContext) {
    if (!user.isPlatformAdmin) throw new ForbiddenException()
    return this.organizationsService.findAll();
  }

  @Public()
  @Get('invitations/accept')
  invitationAccept(@Query('token') token: string) {
    return this.organizationsService.acceptInvitation(token);
  }

  @Roles('OWNER', 'ADMIN', 'MANAGER', 'DIRECTOR', 'EMPLOYEE', 'VIEWER')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Roles('OWNER', 'ADMIN')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Roles('OWNER')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  @Roles('OWNER')
  @UseGuards(OrganizationGuard, RolesGuard)
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

  @Roles('OWNER', 'ADMIN', 'DIRECTOR')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Post(':id/invitations')
  orgInvitacions(
    @CurrentUser() user: AuthenticatedUserContext,
    @Param('id') organizationId: string,
    @Body() { roleName, email }: { roleName: RoleNames; email: string },
  ) {

    return this.organizationsService.sendInvitation(user, {
      organizationId,
      email,
      roleName,
      createdByUserId: user.id,
    });
  }

  @Roles('OWNER', 'ADMIN')
  @UseGuards(OrganizationGuard, RolesGuard)
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
  @UseGuards(OrganizationGuard, RolesGuard)
  @Patch(':id/members/:memberId/role')
  membershipRoles(
    @Param('id') id: string,
    @Param('memberId') organizationMemberId: string,
    @CurrentUser() user: AuthenticatedUserContext,
    @Body() data: UpdateMembershipRoleRequestDto,
  ) {
    return this.organizationsService.updateMembershipRole(user, {
      organizationId: id,
      organizationMemberId,
      roleName: data.roleName,
    });
  }

  @Roles('OWNER', 'ADMIN')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: AuthenticatedUserContext
  ) {
    return this.organizationsService.deleteMember(
      user,
      { organizationId: id, organizationMemberId: memberId })
  }

}
