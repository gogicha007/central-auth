import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUserContext } from '../auth/auth.types';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

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

  @Roles('OWNER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Post(':id/invitations')
  orgInvitacions(
    @CurrentUser() user: AuthenticatedUserContext,
    @Param('id') organizationId: string,
    @Body() { roleId, email },
  ) {
    console.log(
      'send id/invitation, user, orgid, roleid',
      user.id,
      ' ',
      organizationId,
      ' ',
      roleId,
    );

    return this.organizationsService.sendInvitation({
      organizationId,
      email,
      roleId,
      createdByUserId: user.id,
    });
  }

  @Post('invitations/accept')
  invitacionAccept() {
    return 'invitation accept';
  }

  @Patch(':id/members/:memberId/role')
  membershipRoles() {
    return 'membership roles';
  }
}
