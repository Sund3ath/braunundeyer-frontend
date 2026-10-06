import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { setupTestEnv, loadApp, signToken, teardown, BACKEND_DIR } from './helpers/app.js';

setupTestEnv();

const UPLOAD_DIR = path.join(BACKEND_DIR, 'uploads');
const TEAM_DIR = path.join(UPLOAD_DIR, 'team');
const teamDirExisted = fs.existsSync(TEAM_DIR);
const created = [];

let app;
let db;
let token;
let png;

beforeAll(async () => {
  ({ app, db } = await loadApp());
  token = await signToken(db);
  png = await sharp({ create: { width: 40, height: 30, channels: 3, background: '#888' } }).png().toBuffer();
  await db.run(`CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, position TEXT NOT NULL,
    position_en TEXT, position_fr TEXT, position_it TEXT, position_es TEXT,
    bio TEXT, bio_en TEXT, bio_fr TEXT, bio_it TEXT, bio_es TEXT,
    image TEXT, email TEXT, phone TEXT, linkedin TEXT, order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
});

afterAll(async () => {
  for (const file of created) {
    fs.rmSync(file, { force: true });
  }
  if (!teamDirExisted && fs.existsSync(TEAM_DIR) && fs.readdirSync(TEAM_DIR).length === 0) {
    fs.rmdirSync(TEAM_DIR);
  }
  await teardown(db);
});

const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>');
const html = Buffer.from('<html><script>alert(1)</script></html>');

describe('media upload whitelist', () => {
  test.each([
    ['.svg as image/svg+xml', svg, 'logo.svg', 'image/svg+xml'],
    ['.svg disguised as image/png', svg, 'logo.svg', 'image/png'],
    ['.html as text/html', html, 'page.html', 'text/html'],
    ['.html disguised as image/jpeg', html, 'page.html', 'image/jpeg'],
    ['.png with text/html MIME', () => png, 'photo.png', 'text/html'],
    ['.pdf', Buffer.from('%PDF-1.4'), 'doc.pdf', 'application/pdf'],
    ['.jpg with video MIME', () => png, 'photo.jpg', 'video/mp4'],
  ])('%s -> 415, nothing stored', async (_, buffer, filename, contentType) => {
    const before = await db.get('SELECT COUNT(*) AS n FROM media');
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', typeof buffer === 'function' ? buffer() : buffer, { filename, contentType });
    expect(res.status).toBe(415);
    const after = await db.get('SELECT COUNT(*) AS n FROM media');
    expect(after.n).toBe(before.n);
  });

  test('bulk upload rejects the batch if one file is not allowed', async () => {
    const res = await request(app)
      .post('/api/media/upload/bulk')
      .set('Authorization', `Bearer ${token}`)
      .attach('files', svg, { filename: 'x.svg', contentType: 'image/svg+xml' });
    expect(res.status).toBe(415);
  });

  test('upload without token -> 401', async () => {
    const res = await request(app).post('/api/media/upload').attach('image', png, { filename: 'a.png', contentType: 'image/png' });
    expect(res.status).toBe(401);
  });

  test('valid PNG: server-generated name, thumb- and medium- versions, same URL shape', async () => {
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', png, { filename: '../../etc/Evil Name.PNG', contentType: 'image/png' });
    expect(res.status).toBe(200);
    const { media } = res.body;
    expect(media.filename).toMatch(/^image-\d+-\d+\.png$/);
    expect(media.original_name).toBe('Evil Name.PNG');
    expect(media.url).toBe(`/uploads/${media.filename}`);
    expect(media.thumbnail).toBe(`/uploads/thumb-${media.filename}`);
    expect(media.medium).toBe(`/uploads/medium-${media.filename}`);

    for (const name of [media.filename, `thumb-${media.filename}`, `medium-${media.filename}`]) {
      const file = path.join(UPLOAD_DIR, name);
      created.push(file);
      expect(fs.existsSync(file)).toBe(true);
    }

    const served = await request(app).get(media.url);
    expect(served.status).toBe(200);
    expect(served.headers['content-type']).toBe('image/png');
  });
});

describe('team photo upload whitelist', () => {
  test('.svg -> 415', async () => {
    const res = await request(app)
      .post('/api/team')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test')
      .field('position', 'Architekt')
      .attach('image', svg, { filename: 'me.svg', contentType: 'image/svg+xml' });
    expect(res.status).toBe(415);
  });

  test('video is not accepted as a team photo', async () => {
    const res = await request(app)
      .post('/api/team')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test')
      .field('position', 'Architekt')
      .attach('image', Buffer.from('fake'), { filename: 'me.mp4', contentType: 'video/mp4' });
    expect(res.status).toBe(415);
  });

  test('valid PNG is stored in uploads/team and served at /uploads/team/...', async () => {
    const res = await request(app)
      .post('/api/team')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test')
      .field('position', 'Architekt')
      .attach('image', png, { filename: 'portrait.png', contentType: 'image/png' });
    expect(res.status).toBe(201);
    expect(res.body.image).toMatch(/^\/uploads\/team\/team-\d+-\d+\.png$/);
    const file = path.join(UPLOAD_DIR, 'team', path.basename(res.body.image));
    created.push(file);
    expect(fs.existsSync(file)).toBe(true);
    const served = await request(app).get(res.body.image);
    expect(served.status).toBe(200);
  });
});
