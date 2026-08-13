import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() data: CreatePermissionDto) {
    return this.permissionsService.create(data);
  }

  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdatePermissionDto) {
    return this.permissionsService.update(id, data);
  }

  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
