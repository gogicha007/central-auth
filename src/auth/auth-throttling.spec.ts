import 'reflect-metadata';
import {
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

describe('Authentication rate limits (isolated HTTP fixtures)', () => {
  let app: INestApplication;
  const auth = { login: jest.fn(), refresh: jest.fn(), signUp: jest.fn() };
  const verifyPassword = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();
    auth.login.mockResolvedValue({ accessToken: 'fixture' });
    auth.refresh.mockResolvedValue({ accessToken: 'fixture' });
    auth.signUp.mockResolvedValue({ message: 'Created' });
    verifyPassword.mockImplementation((context) => {
      const req = context.switchToHttp().getRequest();
      if (req.body.password === 'invalid')
        throw new UnauthorizedException('Invalid credentials');
      req.user = { id: 'fixture-user' };
      return true;
    });
    const module = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          { name: 'default', limit: 10, ttl: 60_000 },
          { name: 'ipStrict', limit: 5, ttl: 900_000 },
          { name: 'emailStrict', limit: 3, ttl: 900_000 },
        ]),
      ],
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: auth }],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: verifyPassword })
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
  afterEach(async () => {
    await app.close();
  });

  it('allows twenty refreshes without an access token and blocks the twenty-first before processing', async () => {
    for (let i = 0; i < 20; i++) {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'fixture' })
        .expect(201);
    }
    const blocked = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: 'fixture' })
      .expect(429);
    expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);
    expect(auth.refresh).toHaveBeenCalledTimes(20);
    expect(auth.refresh).toHaveBeenCalledWith(
      'fixture',
      expect.any(String),
      undefined,
    );
  });
  it('allows five logins and blocks further password verification', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'fixture@example.com', password: 'valid' })
        .expect(201);
    }
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'fixture@example.com', password: 'valid' })
      .expect(429);
    expect(verifyPassword).toHaveBeenCalledTimes(5);
    expect(auth.login).toHaveBeenCalledTimes(5);
  });
  it('counts failed logins too, before the local guard', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'fixture@example.com', password: 'invalid' })
        .expect(401);
    }
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'fixture@example.com', password: 'invalid' })
      .expect(429);
    expect(verifyPassword).toHaveBeenCalledTimes(5);
    expect(auth.login).not.toHaveBeenCalled();
  });
  it('limits signup and keeps its counter independent of refresh', async () => {
    const body = {
      email: 'fixture@example.com',
      password: 'fixture-password',
      firstName: 'Test',
      lastName: 'User',
    };
    for (let i = 0; i < 5; i++)
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(body)
        .expect(201);
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(body)
      .expect(429);
    expect(auth.signUp).toHaveBeenCalledTimes(5);
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: 'fixture' })
      .expect(201);
  });
  it('does not let a forged forwarding header reset the IP counter', async () => {
    for (let i = 0; i < 5; i++)
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'invalid' })
        .expect(401);
    await request(app.getHttpServer())
      .post('/auth/login')
      .set('x-forwarded-for', '198.51.100.77')
      .send({ password: 'invalid' })
      .expect(429);
    expect(verifyPassword).toHaveBeenCalledTimes(5);
  });
  it('validates refresh input before invoking token processing', async () => {
    for (const body of [{}, { refreshToken: 42 }, { refreshToken: '' }]) {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send(body)
        .expect(400);
    }
    expect(auth.refresh).not.toHaveBeenCalled();
  });
});
