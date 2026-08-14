import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { HealthIndicatorService, HealthIndicatorResult } from '@nestjs/terminus';

function isFalseLike(value: string | undefined) {
  if (!value) {
    return false;
  }

  return ['0', 'false', 'no', 'off'].includes(value.trim().toLowerCase());
}

function normalizeConnectionString(
  connectionString: string | undefined,
  allowInsecureTls: boolean,
) {
  if (!connectionString) {
    return connectionString;
  }

  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get('sslmode');

    if (allowInsecureTls && sslmode === 'require') {
      url.searchParams.set('uselibpqcompat', 'true');
      return url.toString();
    }

    if (
      !allowInsecureTls &&
      sslmode === 'require' &&
      url.searchParams.get('uselibpqcompat') !== 'true'
    ) {
      url.searchParams.set('sslmode', 'verify-full');
      return url.toString();
    }

    return url.toString();
  } catch {
    return connectionString;
  }
}

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService
  ) {
    const allowInsecureTls = isFalseLike(
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED,
    );
    const connectionString = normalizeConnectionString(
      process.env.DATABASE_URL,
      allowInsecureTls,
    );
    const pool = new PrismaPg({
      connectionString,
      ssl: allowInsecureTls ? { rejectUnauthorized: false } : undefined,
    });

    super({ adapter: pool });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key)

    try {
      await this.$queryRaw`SELECT 1`;

      return indicator.up()
    } catch (error) {
      return indicator.down({ message: (error as Error).message })
    }
  }
}
