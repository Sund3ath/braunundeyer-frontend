/**
 * Test harness: isolated temp SQLite DB, test-only secrets, no real .env.
 *
 * Call setupTestEnv() at the top of a test file BEFORE importing the app
 * (use loadApp(), which imports dynamically). The working directory is moved
 * into a temp folder so dotenv cannot pick up backend/.env.
 */
import os from 'os';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BACKEND_DIR = path.resolve(__dirname, '../..');
export const ADMIN_EMAIL = 'admin@test.local';

let tmpDir;

export const setupTestEnv = (extra = {}) => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bue-backend-test-'));

  Object.assign(process.env, {
    NODE_ENV: 'test',
    DATABASE_PATH: path.join(tmpDir, 'test.sqlite'),
    LOG_DIR: path.join(tmpDir, 'logs'),
    JWT_SECRET: crypto.randomBytes(32).toString('hex'),
    JWT_REFRESH_SECRET: crypto.randomBytes(32).toString('hex'),
    ADMIN_EMAIL,
    ADMIN_PASSWORD: crypto.randomBytes(12).toString('hex'),
    SMTP_PASSWORD: '',
    DEEPSEEK_API_KEY: '',
    USE_S3: 'false',
    ...extra,
  });

  // dotenv.config() in server.js resolves .env from the cwd
  process.chdir(tmpDir);
  return tmpDir;
};

export const loadApp = async () => {
  const { default: app } = await import('../../src/server.js');
  const { default: db } = await import('../../src/config/db-simple.js');
  await db.initialize();
  // analytics.routes.js creates its tables 1 s after module load
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return { app, db };
};

export const signToken = async (db, { email = ADMIN_EMAIL, role } = {}) => {
  const { default: jwt } = await import('jsonwebtoken');
  let user = await db.get('SELECT id, email, role FROM users WHERE email = ?', [email]);
  if (!user) {
    const result = await db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, 'not-a-real-hash', 'Test User', role || 'user']
    );
    user = { id: result.lastInsertRowid, email, role: role || 'user' };
  }
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const teardown = async (db) => {
  try {
    await db?.close();
  } catch {
    // ignore
  }
  process.chdir(BACKEND_DIR);
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
};
