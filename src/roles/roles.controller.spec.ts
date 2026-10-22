import { Test } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';
import { PermissionsController } from '../permissions/permissions.controller';
import { PermissionsService } from '../permissions/permissions.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

describe('RolesController', () => {
  let app: INestApplication;
  const roles = {
    update: jest.fn().mockResolvedValue({}),
    assignPermission: jest.fn().mockResolvedValue({}),
    removePermission: jest.fn().mockResolvedValue({}),
  };
  const permissions = { findAll: jest.fn().mockResolvedValue([]) };
  const member = jest.fn();
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [RolesController, PermissionsController],
      providers: [
        { provide: RolesService, useValue: roles },
        { provide: PermissionsService, useValue: permissions },
        {
          provide: DatabaseService,
          useValue: { organizationMember: { findFirst: member } },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          if (!req.headers['x-test-user']) return false;
          req.user = {
            id: 'user',
            isPlatformAdmin: req.headers['x-test-user'] === 'platform',
          };
          return true;
        },
      })
      .compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    member.mockImplementation(async ({ where }) =>
      where.organizationId === 'org-a' && where.status === 'ACTIVE'
        ? { role: { name: 'ADMIN' } }
        : null,
    );
  });
  afterAll(async () => {
    await app.close();
  });
  it('passes explicit organization and resource IDs to the service', async () => {
    await request(app.getHttpServer())
      .patch('/organizations/org-a/roles/role-a')
      .set('x-test-user', 'editor')
      .send({ description: 'Updated' })
      .expect(200);
    expect(roles.update).toHaveBeenCalledWith('org-a', 'role-a', {
      description: 'Updated',
    });
    await request(app.getHttpServer())
      .post('/organizations/org-a/roles/role-a/permissions')
      .set('x-test-user', 'editor')
      .send({ permissionId: 'permission' })
      .expect(201);
    expect(roles.assignPermission).toHaveBeenCalledWith(
      'org-a',
      'role-a',
      'permission',
    );
    await request(app.getHttpServer())
      .delete('/organizations/org-a/roles/role-a/permissions/permission')
      .set('x-test-user', 'editor')
      .expect(200);
    expect(roles.removePermission).toHaveBeenCalledWith(
      'org-a',
      'role-a',
      'permission',
    );
  });
  it('rejects a different organization despite a forged organization header', async () => {
    await request(app.getHttpServer())
      .patch('/organizations/org-b/roles/role-b')
      .set('x-test-user', 'editor')
      .set('x-organization-id', 'org-a')
      .send({ description: 'Updated' })
      .expect(403);
    expect(roles.update).not.toHaveBeenCalled();
  });
  it('rejects non-admin members on permission assignment and removal', async () => {
    member.mockResolvedValue({ role: { name: 'VIEWER' } });
    await request(app.getHttpServer())
      .post('/organizations/org-a/roles/role-a/permissions')
      .set('x-test-user', 'editor')
      .send({ permissionId: 'permission' })
      .expect(403);
    await request(app.getHttpServer())
      .delete('/organizations/org-a/roles/role-a/permissions/permission')
      .set('x-test-user', 'editor')
      .expect(403);
    expect(roles.assignPermission).not.toHaveBeenCalled();
    expect(roles.removePermission).not.toHaveBeenCalled();
  });
  it('rejects unauthenticated requests and removes the ambiguous old role route', async () => {
    await request(app.getHttpServer())
      .patch('/organizations/org-a/roles/role-a')
      .send({})
      .expect(403);
    await request(app.getHttpServer())
      .patch('/roles/role-a')
      .set('x-test-user', 'editor')
      .send({})
      .expect(404);
  });
  it('requires platform administration for the global permission catalog', async () => {
    await request(app.getHttpServer())
      .get('/permissions')
      .set('x-test-user', 'editor')
      .set('x-organization-id', 'org-a')
      .expect(403);
    expect(permissions.findAll).not.toHaveBeenCalled();
    await request(app.getHttpServer())
      .get('/permissions')
      .set('x-test-user', 'platform')
      .expect(200, []);
  });
});
