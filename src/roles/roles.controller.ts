import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateRoleDto } from './dto/update-role.dto';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Roles('OWNER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Patch(':id')
  updatee(@Param('id') id: string, @Body() data: UpdateRoleDto) {
    return this.rolesService.update(id, data);
  }

  @Roles('OWNER', 'ADMIN')
  @Post(':id/permissions')
  createPermission(@Param('id') roleId: string) {
    console.log('create permission')
  }
  @Roles('OWNER', 'ADMIN')
  @Patch(':id/permissions/:permissionId')
  updatePermission(
    @Param('id') roleId: string,
    @Param('permissionId') permissionId: string) {
    console.log('update permission ')
  }
  @Roles('OWNER', 'ADMIN')
  @Delete(':id/permissions/:permissionId')
  deletePermission(
    @Param('id') roleId: string,
    @Param('permissionId') permissionId: string
  ) {
    console.log('delete permission')
  }


}
