/**
 * View models for projects and their photographs (server components only).
 *
 * Wraps lib/api/projects.js (unchanged data source, ISR-cached fetches) and
 * turns raw CMS records into what the pages render: cleaned facts, localised
 * category labels, de-duplicated image lists with real dimensions and alt
 * text that never says "undefined".
 */
import { getAllProjects } from './api/projects';
import { getImageDimensions } from './image-meta';
import { getUiCopy } from './ui-copy';
import {
  categoryKey, categoryLabel, meaningfulLocation, meaningfulArea, visibleStatus,
  projectMetaLine, composeAlt,
} from './media';

/**
 * True while `next build` prerenders pages. ISR pages use it to decide what to
 * do when the API fails: during the build they render their error/empty state
 * (the build must not fail because the API is briefly unreachable); at
 * runtime they throw, so Next.js keeps serving the last good version instead
 * of caching an error page for the next 60 seconds.
 */
export const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build';

/** Facet order for the known office categories (design REVIEW §3). */
export const KNOWN_CATEGORIES = ['neubau', 'altbausanierung', 'denkmalschutz', 'innenarchitektur'];

// Fallback aspect ratio while a size is unknown: most uploads are 4:3 photos.
const FALLBACK = { w: 4, h: 3 };

function clean(text) {
  return text ? String(text).replace(/\r\n/g, '\n').trim() : '';
}

function uniqueImages(p) {
  const list = Array.isArray(p.images) && p.images.length
    ? p.images
    : [p.image, ...(Array.isArray(p.gallery) ? p.gallery : [])];
  const seen = new Set();
  return list.filter((src) => {
    if (!src || typeof src !== 'string' || !src.trim() || seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

export function normalizeProject(p, lang) {
  const copy = getUiCopy(lang);
  const title = clean(p.title || p.name);
  const description = clean(p.description);
  const location = meaningfulLocation(p.location);
  const year = Number.parseInt(p.year, 10) || null;
  const catLabel = categoryLabel(p.category, copy.categories);
  return {
    id: String(p.id),
    title,
    // A description that only repeats the title is not a subtitle.
    subtitle: description && description.toLowerCase() !== title.toLowerCase() ? description : '',
    details: clean(p.details),
    location,
    year,
    categoryKey: categoryKey(p.category),
    categoryLabel: catLabel,
    area: meaningfulArea(p.area),
    status: visibleStatus(p.status),
    client: clean(p.client) || null,
    href: `/${lang}/projekte/${p.id}`,
    meta: projectMetaLine({ categoryLabel: catLabel, location, year }),
    updatedAt: p.updated_at || p.created_at || '',
    imageSrcs: uniqueImages(p),
    // Extension points (not in the API yet): per-image metadata keyed by src.
    imageMeta: p.image_meta || p.imageMeta || null,
  };
}

/** Newest first: year, then last update. */
export function sortProjects(list) {
  return [...list].sort((a, b) => (b.year || 0) - (a.year || 0) || String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

/**
 * Turn image URLs into image objects with dimensions and alt text.
 * Missing files (404) are dropped; unknown sizes get a 4:3 placeholder and
 * `known: false`, so the client can learn the natural size on load.
 */
export function buildImages(project, dims, lang, { limit } = {}) {
  const copy = getUiCopy(lang);
  const srcs = limit ? project.imageSrcs.slice(0, limit) : project.imageSrcs;
  const usable = srcs.filter((src) => !dims.get(src)?.missing);
  return usable.map((src, i) => {
    const meta = project.imageMeta?.[src] || {};
    const d = meta.width && meta.height ? { w: meta.width, h: meta.height } : dims.get(src);
    const known = Boolean(d && d.w && d.h);
    const { w, h } = known ? d : FALLBACK;
    return {
      id: `${project.id}-${i}`,
      src,
      w,
      h,
      known,
      color: meta.dominant_color || null,
      blur: meta.blur_data_url || null,
      caption: meta.caption || null,
      alt: composeAlt({
        alt: meta.alt,
        caption: meta.caption,
        title: project.title,
        categoryLabel: project.categoryLabel,
        location: project.location,
        n: i + 1,
        total: usable.length,
      }, copy.common),
    };
  });
}

/**
 * All published projects as view models, newest first.
 * @returns {{ projects: object[], error: boolean }}
 */
export async function getProjectList(lang) {
  let raw = [];
  let error = false;
  try {
    raw = await getAllProjects(lang, { throwOnError: true });
  } catch {
    error = true;
  }
  const projects = sortProjects(
    (Array.isArray(raw) ? raw : [])
      .filter((p) => !p.status || String(p.status).toLowerCase() === 'published')
      .map((p) => normalizeProject(p, lang)),
  );
  return { projects, error };
}

/** Attach the cover image (with dimensions) to each project. */
export async function withCovers(projects, lang) {
  const dims = await getImageDimensions(projects.map((p) => p.imageSrcs[0]));
  return projects.map((p) => {
    const [cover] = buildImages(p, dims, lang, { limit: 1 });
    return { ...p, cover: cover || null };
  });
}

/** Attach all images (with dimensions) to each project. */
export async function withAllImages(projects, lang) {
  const dims = await getImageDimensions(projects.flatMap((p) => p.imageSrcs));
  return projects.map((p) => {
    const images = buildImages(p, dims, lang);
    return { ...p, images, cover: images[0] || null, imageCount: images.length };
  });
}
