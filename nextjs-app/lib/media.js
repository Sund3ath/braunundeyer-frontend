/**
 * Client-safe helpers for project images and project facts.
 *
 * Image sources stay whatever lib/api resolves them to (absolute backend URLs
 * that next.config.mjs `images.remotePatterns` allows), so every image goes
 * through the Next.js image optimizer: resized WebP, never the multi-MB
 * original upload.
 */
import { fmt } from './fmt';

// Must match next.config.mjs images.deviceSizes + images.imageSizes.
const OPTIMIZER_WIDTHS = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/**
 * URL of the Next.js image optimizer for `src` at (at least) `width` px. Same
 * format as next/image's default loader, so a URL requested by a gallery tile
 * is reused from cache by the lightbox.
 */
export function optimizedImageUrl(src, width = 1080, quality = 75) {
  if (!src) return '';
  const w = OPTIMIZER_WIDTHS.find((x) => x >= width) || OPTIMIZER_WIDTHS[OPTIMIZER_WIDTHS.length - 1];
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality}`;
}

/** "Altbausanierung" -> "altbausanierung", "Innen-Architektur" -> "innen-architektur" */
export function categoryKey(label) {
  return String(label || '')
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Placeholder locations in the CMS ("Divers") are not facts for visitors.
const PLACEHOLDER_LOCATIONS = new Set(['divers', 'diverse', '-', '.', '']);
export function meaningfulLocation(location) {
  const l = String(location ?? '').trim();
  return PLACEHOLDER_LOCATIONS.has(l.toLowerCase()) ? null : l;
}

// Placeholder areas in the CMS ("", ".", "0", "xm2", "x m2") are hidden.
// Strip the unit first ("m2", "m²", "qm") so "xm2" doesn't count as a number.
export function meaningfulArea(area) {
  const a = String(area ?? '').trim();
  return /[1-9]/.test(a.replace(/m\s*[2²]|qm/gi, '')) ? a : null;
}

// Publication states are internal CMS values, not facts for visitors.
const INTERNAL_STATUSES = new Set(['published', 'draft', 'archived', 'unpublished', 'private']);
export function visibleStatus(status) {
  const s = String(status ?? '').trim();
  return s && !INTERNAL_STATUSES.has(s.toLowerCase()) ? s : null;
}

/** Localised category label; unknown CMS categories are shown as entered. */
export function categoryLabel(category, categories = {}) {
  const key = categoryKey(category);
  return categories[key] || (category ? String(category).trim() : '');
}

/** "Neubau, Saarbrücken, 2025" (skips missing parts). */
export function projectMetaLine({ categoryLabel: cat, location, year }) {
  return [cat, location, year].filter(Boolean).join(', ');
}

/**
 * Alt text for a project photo. Uses CMS alt/caption when present (extension
 * point), else "Orbis, Neubau, Saarbrücken – Aufnahme 3 von 12". Never
 * contains "undefined".
 */
export function composeAlt({ alt, caption, title, categoryLabel: cat, location, n, total }, common) {
  if (alt && String(alt).trim()) return String(alt).trim();
  const head = [title, cat, location].filter(Boolean).join(', ');
  const base = caption ? `${head}: ${caption}` : head;
  const counter = n ? (total ? fmt(common.imageOf, { n, total }) : fmt(common.imageN, { n })) : '';
  return [base, counter].filter(Boolean).join(' – ') || counter;
}
