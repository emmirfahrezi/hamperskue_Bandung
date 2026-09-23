import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/hamperskue_db?schema=public';

    super({
      log: [
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });
  }

  async onModuleInit() {
    // If on Vercel and DATABASE_URL is localhost or empty, avoid hanging on unreachable TCP socket
    if (
      process.env.VERCEL &&
      (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1'))
    ) {
      this.logger.warn(
        '⚠️ DATABASE_URL is not set or points to localhost on Vercel. Database queries will fail until a cloud PostgreSQL DATABASE_URL is provided in Vercel settings.',
      );
      return;
    }

    try {
      // Prisma automatically connects on the first query, so we don't need to block bootstrap here
      // This speeds up Cold Starts on Vercel significantly.
      // await this.$connect();
      this.logger.log('✅ Prisma Service Initialized (will auto-connect on first query)');
    } catch (error: any) {
      this.logger.error(`❌ Prisma initialization error: ${error.message}`);
    }

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected');
    } catch (error: any) {
      this.logger.error(`Database disconnect error: ${error.message}`);
    }
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    return Promise.all(models.map((modelKey) => (this as any)[modelKey].deleteMany()));
  }
}
