import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Pool } from 'pg';

// Injection token for the shared PostgreSQL connection pool.
export const PG_POOL = 'PG_POOL';

@Controller('health')
export class HealthController {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  // Verifies the database is reachable; returns 503 if the query fails.
  @Get()
  async check(): Promise<{ status: string }> {
    try {
      await this.pool.query('SELECT 1');
      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException({ status: 'error' });
    }
  }
}
