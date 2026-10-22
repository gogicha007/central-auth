import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'ADMIN')
@Controller('organizations/:organizationId/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles('OWNER', 'ADMIN')
  @Patch(':roleId')
  updatee(
    @Param('organizationId') organizationId: string,
    @Param('roleId') id: string,
    @Body() data: UpdateRoleDto,
  ) {
    return this.rolesService.update(organizationId, id, data);
  }

  @Roles('OWNER', 'ADMIN')
  @Post(':roleId/permissions')
  assignPermission(
    @Param('organizationId') organizationId: string,
    @Param('roleId') roleId: string,
    @Body() payload: AssignPermissionDto,
  ) {
    return this.rolesService.assignPermission(
      organizationId,
      roleId,
      payload.permissionId,
    );
  }

  @Roles('OWNER', 'ADMIN')
  @Delete(':roleId/permissions/:permissionId')
  removePermission(
    @Param('organizationId') organizationId: string,
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesService.removePermission(
      organizationId,
      roleId,
      permissionId,
    );
  }
}
