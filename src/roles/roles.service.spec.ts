import { RolesService } from './roles.service';
import { NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  const role = { id: 'role-b', organizationId: 'org-b', name: 'VIEWER' };
  let db: any;
  let service: RolesService;
  beforeEach(() => {
    db = {
      role: {
        findUnique: jest.fn(async ({ where }) =>
          where.id === role.id && where.organizationId === role.organizationId
            ? role
            : null,
        ),
        update: jest.fn().mockResolvedValue(role),
      },
      permission: {
        findUnique: jest.fn().mockResolvedValue({ id: 'permission' }),
      },
      rolePermission: {
        upsert: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      },
    };
    service = new RolesService(db, { create: jest.fn() } as any);
  });
  it.each(['update', 'assignPermission', 'removePermission'])(
    'blocks cross-organization %s without writing',
    async (action) => {
      const operation =
        action === 'update'
          ? service.update('org-a', role.id, { description: 'changed' })
          : action === 'assignPermission'
            ? service.assignPermission('org-a', role.id, 'permission')
            : service.removePermission('org-a', role.id, 'permission');
      await expect(operation).rejects.toBeInstanceOf(NotFoundException);
      expect(db.role.update).not.toHaveBeenCalled();
      expect(db.rolePermission.upsert).not.toHaveBeenCalled();
      expect(db.rolePermission.delete).not.toHaveBeenCalled();
    },
  );
  it('scopes role updates and permission changes to the same organization', async () => {
    await service.update('org-b', role.id, { description: 'changed' });
    expect(db.role.update).toHaveBeenCalledWith({
      where: { id: role.id, organizationId: 'org-b' },
      data: { description: 'changed' },
    });
    await service.assignPermission('org-b', role.id, 'permission');
    expect(db.rolePermission.upsert).toHaveBeenCalled();
    await service.removePermission('org-b', role.id, 'permission');
    expect(db.rolePermission.delete).toHaveBeenCalled();
  });
});
