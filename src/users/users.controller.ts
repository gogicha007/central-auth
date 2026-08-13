import { Controller, Get, Patch, Delete, Post, Body, Param, UseGuards, ForbiddenException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUserContext } from "../auth/auth.types";


@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUserContext) {
        if (!user.isPlatformAdmin) throw new ForbiddenException()
        return this.usersService.findAll()
    }

    @Get('me')
    findMe(@CurrentUser() user: AuthenticatedUserContext) {
        return this.usersService.findById(user.id);
    }

    @Patch('me')
    updateMe(
        @CurrentUser() user: AuthenticatedUserContext,
        @Body() data: UpdateUserDto,
    ) {
        return this.usersService.update(user.id, data);
    }

    @Patch(':id')
    update(
        @CurrentUser() user: AuthenticatedUserContext,
        @Param('id') id: string,
        @Body() data: UpdateUserDto
    ) {
        if (!user.isPlatformAdmin) throw new ForbiddenException()
        return this.usersService.update(id, data);
    }

    @Post('me/deactivate')
    deactivateMe(@CurrentUser() user: AuthenticatedUserContext) {
        return this.usersService.deactivate(user.id);
    }

    @Post(':id/reactivate')
    reactivate(
        @CurrentUser() user: AuthenticatedUserContext,
        @Param('id') id: string
    ) {
        if (!user.isPlatformAdmin) throw new ForbiddenException()
        return this.usersService.reactivate(id);
    }

    @Delete(':id')
    remove(
        @CurrentUser() user: AuthenticatedUserContext,
        @Param('id') id: string
    ) {
        if (!user.isPlatformAdmin) throw new ForbiddenException()
        return this.usersService.remove(id);
    }
}