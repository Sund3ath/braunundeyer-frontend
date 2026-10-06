import { describe, test, expect, afterAll } from '@jest/globals';
import { setupTestEnv, teardown } from './helpers/app.js';

setupTestEnv();

// Imported after setupTestEnv() so no real .env/DB is touched
const { authorize } = await import('../src/middleware/auth.middleware.js');

afterAll(async () => {
  await teardown();
});

const run = (middleware, user) => {
  const result = { status: null, nextCalled: false };
  const req = { user };
  const res = {
    status(code) {
      result.status = code;
      return this;
    },
    json() {
      return this;
    },
  };
  middleware(req, res, () => {
    result.nextCalled = true;
  });
  return result;
};

describe('authorize()', () => {
  test.each([
    ['string', authorize('admin')],
    ['array', authorize(['admin'])],
    ['spread', authorize('admin', 'editor')],
    ['array with two roles', authorize(['admin', 'editor'])],
  ])('%s form lets an admin through', (_, mw) => {
    expect(run(mw, { role: 'admin' }).nextCalled).toBe(true);
  });

  test('spread and array forms both allow every listed role', () => {
    expect(run(authorize('admin', 'editor'), { role: 'editor' }).nextCalled).toBe(true);
    expect(run(authorize(['admin', 'editor']), { role: 'editor' }).nextCalled).toBe(true);
  });

  test('roles that are not listed are rejected with 403', () => {
    expect(run(authorize('admin'), { role: 'editor' })).toEqual({ status: 403, nextCalled: false });
    expect(run(authorize(['admin']), { role: 'user' })).toEqual({ status: 403, nextCalled: false });
    expect(run(authorize('admin', 'editor'), { role: 'user' })).toEqual({ status: 403, nextCalled: false });
  });

  test('missing user -> 401', () => {
    expect(run(authorize('admin'), undefined)).toEqual({ status: 401, nextCalled: false });
  });
});
