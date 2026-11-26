import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { HealthController, PG_POOL } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: PG_POOL,
      // Connection settings come from DATABASE_URL in the environment.
      useFactory: (): Pool =>
        new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
    },
  ],
})
export class AppModule implements OnModuleDestroy {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  // Close the pool cleanly on shutdown so the process exits without hanging.
  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
