import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { setupTestEnv, loadApp, signToken, teardown } from './helpers/app.js';

setupTestEnv();

let app;
let db;
let adminToken;
let userToken;
let projectId;

beforeAll(async () => {
  ({ app, db } = await loadApp());
  adminToken = await signToken(db);
  userToken = await signToken(db, { email: 'someone@test.local', role: 'user' });
  const result = await db.run(
    'INSERT INTO projects (title, description, status) VALUES (?, ?, ?)',
    ['Testprojekt', 'Beschreibung', 'published']
  );
  projectId = result.lastInsertRowid;
  await db.run(`CREATE TABLE IF NOT EXISTS project_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    language TEXT NOT NULL,
    title TEXT, description TEXT, location TEXT, area TEXT, details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, language)
  )`);
});

afterAll(async () => {
  await teardown(db);
});

describe('project translations', () => {
  test('POST /project/:id/:lang without token -> 401, nothing written', async () => {
    const res = await request(app)
      .post(`/api/project-translations/project/${projectId}/en`)
      .send({ title: 'Defaced' });
    expect(res.status).toBe(401);
    const row = await db.get('SELECT * FROM project_translations WHERE project_id = ?', [projectId]);
    expect(row).toBeUndefined();
  });

  test('POST /bulk-translate/:id without token -> 401', async () => {
    const res = await request(app).post(`/api/project-translations/bulk-translate/${projectId}`).send({});
    expect(res.status).toBe(401);
  });

  test('POST /project/:id/:lang with role "user" -> 403', async () => {
    const res = await request(app)
      .post(`/api/project-translations/project/${projectId}/en`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Nope' });
    expect(res.status).toBe(403);
  });

  test('POST /project/:id/:lang with admin token -> 201', async () => {
    const res = await request(app)
      .post(`/api/project-translations/project/${projectId}/en`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Test project' });
    expect(res.status).toBe(201);
  });

  test('public GETs stay public', async () => {
    const list = await request(app).get('/api/project-translations/language/en');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.projects)).toBe(true);
    expect(list.body.pagination).toBeDefined();
    const one = await request(app).get(`/api/project-translations/project/${projectId}/en`);
    expect(one.status).toBe(200);
    expect(one.body.title).toBe('Test project');
  });
});

describe('registration', () => {
  test('POST /api/auth/register no longer exists', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'evil@example.com', password: 'secret123', name: 'Evil' });
    expect(res.status).toBe(404);
    const user = await db.get('SELECT id FROM users WHERE email = ?', ['evil@example.com']);
    expect(user).toBeUndefined();
  });
});

describe('analytics', () => {
  test.each(['/api/analytics/dashboard', '/api/analytics/realtime', '/api/analytics/stats'])(
    'GET %s without token -> 401',
    async (url) => {
      const res = await request(app).get(url);
      expect(res.status).toBe(401);
    }
  );

  test('GET /dashboard with role "user" -> 403', async () => {
    const res = await request(app).get('/api/analytics/dashboard').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  test.each(['/api/analytics/dashboard?range=7d', '/api/analytics/realtime', '/api/analytics/stats'])(
    'GET %s with admin token -> 200',
    async (url) => {
      const res = await request(app).get(url).set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    }
  );

  test('tracking POSTs stay public', async () => {
    const pv = await request(app).post('/api/analytics/pageview').send({ visitorId: 'v1', path: '/de' });
    expect(pv.status).toBe(200);
    const visitor = await request(app).post('/api/analytics/visitor').send({ visitorId: 'v1' });
    expect(visitor.status).toBe(200);
    const ev = await request(app).post('/api/analytics/event').send({ visitorId: 'v1', eventName: 'x' });
    expect(ev.status).toBe(200);
  });
});

describe('translate, settings, contact admin endpoints', () => {
  test('translate without token -> 401, with role "user" -> 403', async () => {
    const anon = await request(app).post('/api/translate').send({ text: 'Hallo', targetLanguage: 'en' });
    expect(anon.status).toBe(401);
    const user = await request(app)
      .post('/api/translate')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ text: 'Hallo', targetLanguage: 'en' });
    expect(user.status).toBe(403);
    const cache = await request(app).delete('/api/translate/cache').set('Authorization', `Bearer ${userToken}`);
    expect(cache.status).toBe(403);
  });

  test('settings GET with role "user" -> 403, admin -> 200', async () => {
    const user = await request(app).get('/api/settings').set('Authorization', `Bearer ${userToken}`);
    expect(user.status).toBe(403);
    const admin = await request(app).get('/api/settings').set('Authorization', `Bearer ${adminToken}`);
    expect(admin.status).toBe(200);
  });

  test('GET /api/contact/messages and /test are admin-only', async () => {
    expect((await request(app).get('/api/contact/messages')).status).toBe(401);
    expect((await request(app).get('/api/contact/test')).status).toBe(401);
    const user = await request(app).get('/api/contact/messages').set('Authorization', `Bearer ${userToken}`);
    expect(user.status).toBe(403);
    const admin = await request(app).get('/api/contact/messages').set('Authorization', `Bearer ${adminToken}`);
    expect(admin.status).toBe(200);
    expect(Array.isArray(admin.body.messages)).toBe(true);
  });

  test('rebuild endpoints are gone', async () => {
    const res = await request(app).post('/api/rebuild/trigger').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  test('a forged token signed with another secret is rejected', async () => {
    const { default: jwt } = await import('jsonwebtoken');
    const forged = jwt.sign({ id: 1, role: 'admin' }, 'dev-secret-key');
    const res = await request(app).get('/api/analytics/stats').set('Authorization', `Bearer ${forged}`);
    expect(res.status).toBe(401);
  });

  test('JSON bodies above 2 MB are rejected', async () => {
    const big = 'x'.repeat(2.5 * 1024 * 1024);
    const res = await request(app)
      .post('/api/analytics/event')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ eventName: 'big', eventData: big }));
    expect(res.status).toBe(413);
  });
});

describe('public GET endpoints used by the Next.js app keep working', () => {
  test('GET /api/projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.projects)).toBe(true);
  });

  test('GET /api/content/services and /api/content/contact-settings', async () => {
    expect((await request(app).get('/api/content/services')).status).toBeLessThan(500);
    expect((await request(app).get('/api/content/contact-settings')).status).toBeLessThan(500);
  });

  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
