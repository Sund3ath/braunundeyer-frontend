/**
 * Server-side image dimensions for CMS uploads (server components only).
 *
 * The API does not store width/height for uploads yet (design REVIEW §3: the
 * backend should compute width, height, dominant colour and an LQIP at upload
 * time). Until it does, we read just the file header with an HTTP Range
 * request (64 KB, rarely 512 KB) and parse JPEG / PNG / GIF / WebP sizes,
 * including the EXIF orientation that browsers and the Next.js image
 * optimizer apply (most portrait phone photos are stored rotated).
 *
 * Results are cached per URL with unstable_cache (survives ISR regenerations
 * and requests), so each image is probed about once a day. Network failures
 * are not cached; a missing file (404) is, and the image is dropped from the
 * gallery instead of rendering a broken tile.
 *
 * Extension point: when the API starts returning `width`/`height` (or
 * `dominant_color` / `blur_data_url`), pass them through in
 * lib/project-data.js and this probe is skipped for those images.
 */
import { unstable_cache } from 'next/cache';

const SMALL = 64 * 1024;
const LARGE = 512 * 1024;
const CONCURRENCY = 8;
const TIMEOUT_MS = 8000;

async function readHead(url, bytes) {
  const res = await fetch(url, {
    headers: { Range: `bytes=0-${bytes - 1}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status === 404 || res.status === 410) return { missing: true };
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  // A server that ignores Range answers 200 with the whole file: stop early.
  const reader = res.body.getReader();
  const chunks = [];
  let total = 0;
  while (total < bytes) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  reader.cancel().catch(() => {});
  const buf = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { buf.set(c, off); off += c.length; }
  return { buf, complete: total < bytes };
}

const u16 = (b, i, le) => (le ? b[i] | (b[i + 1] << 8) : (b[i] << 8) | b[i + 1]);
const u32 = (b, i, le) => (le
  ? (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16)) + b[i + 3] * 0x1000000
  : b[i] * 0x1000000 + ((b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]));

function exifOrientation(b, start, end) {
  // b[start..] = "Exif\0\0" + TIFF header
  const t = start + 6;
  if (t + 8 > end) return 1;
  const le = b[t] === 0x49; // "II"
  const ifd = t + u32(b, t + 4, le);
  if (ifd + 2 > end) return 1;
  const n = u16(b, ifd, le);
  for (let k = 0; k < n; k++) {
    const e = ifd + 2 + k * 12;
    if (e + 10 > end) break;
    if (u16(b, e, le) === 0x0112) return u16(b, e + 8, le) || 1;
  }
  return 1;
}

/** Returns { w, h } (display orientation), 'more' if more bytes are needed, or null. */
export function parseDimensions(b) {
  if (!b || b.length < 26) return null;
  // PNG
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { w: u32(b, 16, false), h: u32(b, 20, false) };
  }
  // GIF
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
    return { w: u16(b, 6, true), h: u16(b, 8, true) };
  }
  // WebP
  if (b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57 && b[9] === 0x45) {
    const chunk = String.fromCharCode(b[12], b[13], b[14], b[15]);
    if (chunk === 'VP8X') return { w: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), h: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
    if (chunk === 'VP8 ') return { w: u16(b, 26, true) & 0x3fff, h: u16(b, 28, true) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
    }
    return null;
  }
  // JPEG
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  let orientation = 1;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7) || m === 0xff) { i += m === 0xff ? 1 : 2; continue; }
    const len = u16(b, i + 2, false);
    if (m === 0xe1 && b[i + 4] === 0x45 && b[i + 5] === 0x78 && b[i + 6] === 0x69 && b[i + 7] === 0x66) {
      orientation = exifOrientation(b, i + 4, Math.min(b.length, i + 2 + len));
    }
    if ((m >= 0xc0 && m <= 0xcf) && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      const h = u16(b, i + 5, false);
      const w = u16(b, i + 7, false);
      return orientation >= 5 && orientation <= 8 ? { w: h, h: w } : { w, h };
    }
    i += 2 + len;
  }
  return 'more';
}

async function probeUncached(url) {
  let head = await readHead(url, SMALL);
  if (head.missing) return { missing: true };
  let dims = parseDimensions(head.buf);
  if (dims === 'more' && !head.complete) {
    head = await readHead(url, LARGE);
    if (head.missing) return { missing: true };
    dims = parseDimensions(head.buf);
  }
  if (dims && dims !== 'more' && dims.w > 0 && dims.h > 0) return { w: dims.w, h: dims.h };
  return { unknown: true };
}

const probeCached = unstable_cache(
  async (url) => probeUncached(url),
  ['image-dims-v1'],
  { revalidate: 60 * 60 * 24 },
);

// Also dedupe within one process (one render probes each URL once).
const inflight = new Map();

function probe(url) {
  if (!inflight.has(url)) {
    const p = probeCached(url).catch((err) => {
      // Network trouble: don't cache, don't fail the page; caller falls back
      // to an aspect-ratio placeholder and the browser learns the real size.
      if (process.env.NODE_ENV !== 'production') console.warn('[image-meta]', err.message);
      return { unknown: true };
    });
    inflight.set(url, p);
    // Forget after a minute so long-running servers pick up changed files.
    setTimeout(() => inflight.delete(url), 60_000).unref?.();
  }
  return inflight.get(url);
}

/**
 * Dimensions for many image URLs: Map(url -> {w,h} | {missing:true} | {unknown:true}).
 */
export async function getImageDimensions(urls) {
  const unique = [...new Set(urls.filter(Boolean))];
  const out = new Map();
  let next = 0;
  async function worker() {
    while (next < unique.length) {
      const url = unique[next++];
      out.set(url, await probe(url));
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, unique.length) }, worker));
  return out;
}
