import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './permissions.guard';
import { OrganizationGuard } from './organization.guard';

const context = (params: any, headers = {}) =>
  ({
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ params, headers, user: { id: 'user' } }),
    }),
  }) as any;

describe('Explicit organization authorization', () => {
  it.each(['roles', 'permissions'])(
    '%s does not infer tenant scope from a generic ID or header',
    async (kind) => {
      const db = { organizationMember: { findFirst: jest.fn() } } as any;
      const reflector = {
        getAllAndOverride: () => (kind === 'roles' ? ['ADMIN'] : ['USER:VIEW']),
      } as any;
      const guard =
        kind === 'roles'
          ? new RolesGuard(reflector, db)
          : new PermissionsGuard(reflector, db);
      await expect(
        guard.canActivate(
          context({ id: 'org-a' }, { 'x-organization-id': 'org-a' }),
        ),
      ).resolves.toBe(false);
      expect(db.organizationMember.findFirst).not.toHaveBeenCalled();
    },
  );
  it.each(['roles', 'permissions'])(
    '%s denies missing or inactive membership',
    async (kind) => {
      const db = {
        organizationMember: { findFirst: jest.fn().mockResolvedValue(null) },
      } as any;
      const reflector = {
        getAllAndOverride: () => (kind === 'roles' ? ['ADMIN'] : ['USER:VIEW']),
      } as any;
      const guard =
        kind === 'roles'
          ? new RolesGuard(reflector, db)
          : new PermissionsGuard(reflector, db);
      await expect(
        guard.canActivate(context({ organizationId: 'org-a', id: 'resource' })),
      ).resolves.toBe(false);
      expect(db.organizationMember.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user', organizationId: 'org-a', status: 'ACTIVE' },
        }),
      );
    },
  );
  it('organization existence checks require the explicitly named route parameter', async () => {
    const db = {
      organization: { findFirst: jest.fn().mockResolvedValue({ id: 'org-a' }) },
    } as any;
    const guard = new OrganizationGuard(db);
    await expect(guard.canActivate(context({ id: 'org-a' }))).resolves.toBe(
      false,
    );
    expect(db.organization.findFirst).not.toHaveBeenCalled();
    await expect(
      guard.canActivate(context({ organizationId: 'org-a' })),
    ).resolves.toBe(true);
  });
});
