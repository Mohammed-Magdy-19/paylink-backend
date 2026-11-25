import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { HealthController, PG_POOL } from '../src/health.controller';

describe('GET /health', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Mock the pg Pool so the test verifies the endpoint without a live DB.
    const mockPool = {
      query: jest.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PG_POOL, useValue: mockPool }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 200 and { status: "ok" }', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
