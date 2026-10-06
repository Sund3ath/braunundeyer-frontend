import { describe, test, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { setupTestEnv, teardown } from './helpers/app.js';

// A dummy (non-secret) password so the route builds a transporter. nodemailer
// itself is mocked: nothing leaves the machine.
setupTestEnv({ SMTP_PASSWORD: 'dummy-test-password', CONTACT_RATE_LIMIT_MAX: '1000' });

const sendMail = jest.fn();
jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: () => ({
      verify: (cb) => cb && cb(null, true),
      sendMail,
    }),
  },
}));

let app;
let db;

beforeAll(async () => {
  ({ default: app } = await import('../src/server.js'));
  ({ default: db } = await import('../src/config/db-simple.js'));
  await db.initialize();
  await new Promise((resolve) => setTimeout(resolve, 1200));
});

afterAll(async () => {
  await teardown(db);
});

beforeEach(() => {
  sendMail.mockReset();
});

const attack = {
  name: '<img src=x onerror=alert(1)>\r\nBcc: victim@example.com',
  email: 'attacker@example.com',
  phone: '<b>1</b>',
  projectType: '<script>alert(1)</script>',
  timeline: '"quoted" & \'single\'',
  message: '<a href="https://evil.example">click</a>\nzweite Zeile',
};

describe('POST /api/contact with working SMTP', () => {
  test('success keeps the old response shape and marks the row as e-mailed', async () => {
    sendMail.mockResolvedValue({ messageId: 'test-id' });
    const res = await request(app).post('/api/contact').send({
      name: 'Erika',
      email: 'erika@example.com',
      message: 'Hallo',
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: 'Ihre Nachricht wurde erfolgreich gesendet' });

    const row = await db.get('SELECT emailed, email_error FROM contact_messages ORDER BY id DESC LIMIT 1');
    expect(row).toEqual({ emailed: 1, email_error: null });
    expect(sendMail).toHaveBeenCalledTimes(2); // notification + auto-reply
  });

  test('all user input is HTML-escaped and headers contain no line breaks', async () => {
    sendMail.mockResolvedValue({ messageId: 'test-id' });
    const res = await request(app).post('/api/contact').send(attack);
    expect(res.status).toBe(200);

    const [notification] = sendMail.mock.calls[0];
    expect(notification.html).not.toMatch(/<img|<script|<b>1|<a href/);
    expect(notification.html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(notification.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(notification.html).toContain('&quot;quoted&quot; &amp; &#39;single&#39;');
    expect(notification.subject).not.toMatch(/[\r\n]/);
    expect(notification.from.name).not.toMatch(/[\r\n"<>]/);
    expect(notification.replyTo.address).toBe('attacker@example.com');

    const [autoReply] = sendMail.mock.calls[1];
    expect(autoReply.to).toBe('attacker@example.com');
    // fixed text only: nothing the visitor typed ends up in the auto-reply
    expect(autoReply.html).not.toContain('img');
    expect(autoReply.text).not.toContain('onerror');
  });

  test('a failing auto-reply does not turn a delivered enquiry into an error', async () => {
    sendMail.mockResolvedValueOnce({ messageId: 'ok' }).mockRejectedValueOnce(Object.assign(new Error('x'), { code: 'EENVELOPE' }));
    const res = await request(app).post('/api/contact').send({ name: 'A', email: 'a@example.com', message: 'B' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('SMTP failure -> row kept, 503 mail_unavailable, error code stored', async () => {
    sendMail.mockRejectedValue(Object.assign(new Error('auth failed'), { code: 'EAUTH' }));
    const res = await request(app).post('/api/contact').send({ name: 'A', email: 'a@example.com', message: 'Bitte zurückrufen' });
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ success: false, error: 'mail_unavailable', saved: true });
    const row = await db.get('SELECT message, emailed, email_error FROM contact_messages ORDER BY id DESC LIMIT 1');
    expect(row).toEqual({ message: 'Bitte zurückrufen', emailed: 0, email_error: 'EAUTH' });
  });
});
