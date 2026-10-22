import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { organizationIdFromRequest } from '../organization-context';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      params?: Record<string, string | string[]>;
    }>();

    const organizationId = organizationIdFromRequest(request);

    if (!organizationId) {
      return false;
    }

    const organization = await this.dbService.organization.findFirst({
      where: { id: organizationId as string },
    });

    if (!organization) throw new NotFoundException('Organization not found');

    return true;
  }
}
