import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { setupTestEnv, loadApp, teardown, ADMIN_EMAIL } from './helpers/app.js';

// Small general limit so the test can hit it; login/contact use their defaults
setupTestEnv({ RATE_LIMIT_MAX_REQUESTS: '3' });

let app;
let db;
let isPrivateIp;

beforeAll(async () => {
  ({ app, db } = await loadApp());
  ({ isPrivateIp } = await import('../src/middleware/rate-limit.middleware.js'));
});

afterAll(async () => {
  await teardown(db);
});

describe('isPrivateIp', () => {
  test.each(['10.0.0.5', '172.18.0.3', '::ffff:172.18.0.3', '192.168.1.2', '127.0.0.1', '::1', '::ffff:127.0.0.1', 'fd00::1', 'fe80::1'])(
    '%s is private',
    (ip) => expect(isPrivateIp(ip)).toBe(true)
  );
  test.each(['8.8.8.8', '172.32.0.1', '::ffff:93.184.216.34', '2a00:1450::1', '', undefined])(
    '%s is not private',
    (ip) => expect(isPrivateIp(ip)).toBe(false)
  );
});

describe('general limiter and trust proxy', () => {
  test('requests from a private address (Next.js container) are not limited', async () => {
    for (let i = 0; i < 6; i += 1) {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(200);
    }
  });

  test('requests via nginx are counted per real client IP (last X-Forwarded-For hop)', async () => {
    const statuses = [];
    for (let i = 0; i < 5; i += 1) {
      // A client-supplied first entry must not change the bucket
      const res = await request(app).get('/api/projects').set('X-Forwarded-For', `1.2.3.${i}, 203.0.113.7`);
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 3)).toEqual([200, 200, 200]);
    expect(statuses[3]).toBe(429);

    const other = await request(app).get('/api/projects').set('X-Forwarded-For', '203.0.113.8');
    expect(other.status).toBe(200);
  });
});

// These run from 127.0.0.1 (no X-Forwarded-For): the general limiter skips
// private addresses, the login limiter must not.
describe('login limiter', () => {
  test('successful logins do not count', async () => {
    for (let i = 0; i < 12; i += 1) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
    }
  });

  test('10 failed logins per IP, then 429 (also for private addresses)', async () => {
    const statuses = [];
    for (let i = 0; i < 11; i += 1) {
      const res = await request(app).post('/api/auth/login').send({ email: ADMIN_EMAIL, password: `wrong-${i}` });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 10).every((s) => s === 401)).toBe(true);
    expect(statuses[10]).toBe(429);

    // correct password is blocked too while the window is exhausted
    const blocked = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
    expect(blocked.status).toBe(429);
  });
});

describe('contact limiter', () => {
  // From a private address: the general limiter is skipped, the contact
  // limiter is not.
  test('5 submissions per IP per 15 minutes, then 429', async () => {
    const statuses = [];
    for (let i = 0; i < 6; i += 1) {
      const res = await request(app)
        .post('/api/contact')
        .send({ name: 'A', email: 'a@example.com', message: `Nachricht ${i}` });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 5).every((s) => s === 503)).toBe(true); // no SMTP in tests
    expect(statuses[5]).toBe(429);
  });
});
