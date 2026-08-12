import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { RoleNames } from '@prisma/client';

describe('PermissionsGuard', () => {
  const makeContext = (request: any) => ({
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  }) as any;

  it('allows platform admins without checking org permissions', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['USER:VIEW']),
    } as any;

    const dbService = {
      organizationMember: {
        findFirst: jest.fn(),
      },
    } as any;

    const guard = new PermissionsGuard(reflector, dbService);
    const context = makeContext({
      user: { id: 'u-1', isPlatformAdmin: true },
      params: { id: 'org-1' },
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(dbService.organizationMember.findFirst).not.toHaveBeenCalled();
  });

  it('checks effective permissions for the active org membership', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['USER:VIEW']),
    } as any;

    const dbService = {
      organizationMember: {
        findFirst: jest.fn().mockResolvedValue({
          role: {
            rolePermissions: [
              { permission: { resource: 'USER', action: 'VIEW' } },
            ],
          },
        }),
      },
    } as any;

    const guard = new PermissionsGuard(reflector, dbService);
    const context = makeContext({
      user: { id: 'u-1', isPlatformAdmin: false },
      params: { id: 'org-1' },
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('denies access when the permission is not assigned to the role', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['USER:DELETE']),
    } as any;

    const dbService = {
      organizationMember: {
        findFirst: jest.fn().mockResolvedValue({
          role: {
            rolePermissions: [
              { permission: { resource: 'USER', action: 'VIEW' } },
            ],
          },
        }),
      },
    } as any;

    const guard = new PermissionsGuard(reflector, dbService);
    const context = makeContext({
      user: { id: 'u-1', isPlatformAdmin: false },
      params: { id: 'org-1' },
    });

    await expect(guard.canActivate(context)).resolves.toBe(false);
  });
});
