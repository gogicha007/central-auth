import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles('OWNER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() data: CreateRoleDto) {
    return this.rolesService.create(data);
  }
}
