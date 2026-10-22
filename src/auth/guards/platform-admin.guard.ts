import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/** Permissions are a global catalog, without an organization owner. */
@Injectable()
export class PlatformAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: { id?: string; isPlatformAdmin?: boolean } }>();
    if (!user?.id) throw new UnauthorizedException('Authentication required');
    return user.isPlatformAdmin === true;
  }
}
