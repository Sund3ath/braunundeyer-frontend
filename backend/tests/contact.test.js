import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { setupTestEnv, loadApp, signToken, teardown } from './helpers/app.js';

// No SMTP configured: SMTP_PASSWORD is empty (set by setupTestEnv)
setupTestEnv({ CONTACT_RATE_LIMIT_MAX: '1000' });

let app;
let db;

beforeAll(async () => {
  ({ app, db } = await loadApp());
});

afterAll(async () => {
  await teardown(db);
});

const valid = {
  name: 'Erika Mustermann',
  email: 'erika@example.com',
  phone: '+49 681 123',
  projectType: 'neubau',
  timeline: 'Frühjahr',
  message: 'Wir planen ein Haus.',
  language: 'de',
};

describe('POST /api/contact without SMTP', () => {
  test('stores the message and answers honestly with 503 mail_unavailable', async () => {
    const res = await request(app).post('/api/contact').send(valid);
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ success: false, error: 'mail_unavailable', saved: true });

    const row = await db.get('SELECT * FROM contact_messages ORDER BY id DESC LIMIT 1');
    expect(row).toMatchObject({
      name: valid.name,
      email: valid.email,
      phone: valid.phone,
      project_type: 'neubau',
      timeline: 'Frühjahr',
      message: valid.message,
      language: 'de',
      emailed: 0,
      email_error: 'smtp_not_configured',
    });
    expect(row.subject).toBe('Neue Kontaktanfrage von Erika Mustermann - neubau');
    expect(row.created_at).toBeTruthy();
  });

  test('admin can list stored messages', async () => {
    const token = await signToken(db);
    const res = await request(app).get('/api/contact/messages').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.messages.length).toBeGreaterThanOrEqual(1);
    expect(res.body.messages[0].email).toBe(valid.email);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
  });
});

describe('validation', () => {
  test.each([
    ['missing name', { ...valid, name: '' }],
    ['missing email', { ...valid, email: '' }],
    ['missing message', { ...valid, message: '   ' }],
    ['invalid email', { ...valid, email: 'not-an-email' }],
    ['name > 200', { ...valid, name: 'a'.repeat(201) }],
    ['email > 254', { ...valid, email: `${'a'.repeat(250)}@example.com` }],
    ['message > 5000', { ...valid, message: 'a'.repeat(5001) }],
    ['non-string field', { ...valid, name: { $gt: '' } }],
  ])('%s -> 400 and nothing stored', async (_, body) => {
    const before = await db.get('SELECT COUNT(*) AS n FROM contact_messages');
    const res = await request(app).post('/api/contact').send(body);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    const after = await db.get('SELECT COUNT(*) AS n FROM contact_messages');
    expect(after.n).toBe(before.n);
  });

  test('limits are inclusive (200 / 5000 characters are fine)', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...valid, name: 'a'.repeat(200), message: 'b'.repeat(5000) });
    expect(res.status).toBe(503);
    expect(res.body.saved).toBe(true);
  });

  test('line breaks are stripped from single-line fields', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...valid, name: 'Eve\r\nBcc: victim@example.com', projectType: 'x\ny' });
    expect(res.status).toBe(503);
    const row = await db.get('SELECT name, subject, project_type FROM contact_messages ORDER BY id DESC LIMIT 1');
    expect(row.name).not.toMatch(/[\r\n]/);
    expect(row.subject).not.toMatch(/[\r\n]/);
    expect(row.project_type).toBe('x y');
  });

  test('unknown language codes are not stored', async () => {
    await request(app).post('/api/contact').send({ ...valid, language: '<script>' });
    const row = await db.get('SELECT language FROM contact_messages ORDER BY id DESC LIMIT 1');
    expect(row.language).toBeNull();
  });
});
