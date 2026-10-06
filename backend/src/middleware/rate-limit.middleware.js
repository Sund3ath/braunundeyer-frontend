import rateLimit from 'express-rate-limit';

/**
 * True for loopback, private (RFC 1918), link-local and unique-local addresses,
 * including the IPv4-mapped IPv6 form Node reports ("::ffff:172.18.0.3").
 *
 * In production the backend port is bound to 127.0.0.1 and only reached by
 * the host nginx (which sets X-Forwarded-For, so req.ip is the real client)
 * and by the Next.js container over the Docker network (no X-Forwarded-For,
 * so req.ip is the container's private address).
 */
export const isPrivateIp = (ip = '') => {
  let addr = String(ip).trim().toLowerCase();
  if (addr.startsWith('::ffff:')) addr = addr.slice(7);

  if (addr === '::1' || addr === 'localhost') return true;
  if (/^(fc|fd)[0-9a-f]{2}:/.test(addr)) return true; // fc00::/7
  if (/^fe[89ab][0-9a-f]:/.test(addr)) return true; // fe80::/10

  const m = addr.match(/^(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
  );
};

const intFromEnv = (name, fallback) => {
  const value = parseInt(process.env[name], 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const FIFTEEN_MINUTES = 15 * 60 * 1000;

/**
 * Login: counts only failed attempts (4xx/5xx), per client IP.
 * Never skipped for private addresses.
 */
export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: intFromEnv('LOGIN_RATE_LIMIT_MAX', 10),
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

/** Token refresh: counts only failed refreshes, per client IP. */
export const refreshLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: intFromEnv('REFRESH_RATE_LIMIT_MAX', 30),
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many token refresh attempts. Please log in again later.' },
});

/** Contact form: every submission counts, per client IP. */
export const contactLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: intFromEnv('CONTACT_RATE_LIMIT_MAX', 5),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'too_many_requests' },
});
