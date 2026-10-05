import Link from 'next/link';
import { staticPageMetadata } from '@/lib/seo';
import { getSeoCopy } from '@/lib/seo-copy';
import { getUiCopy } from '@/lib/ui-copy';
import { webPageGraph, simpleBreadcrumbs } from '@/lib/schema';
import { getProjectList, withAllImages, KNOWN_CATEGORIES } from '@/lib/project-data';
import JsonLd from '@/components/JsonLd';
import GalleryView from '@/components/gallery/GalleryView';
import PageHead from '@/components/site/PageHead';

/**
 * Gallery. The server fetches all published projects and their photographs
 * (with real dimensions, see lib/image-meta.js) and renders every tile with
 * descriptive alt text into the HTML, so the page is crawlable without JS.
 * Filter state comes from the URL (?kategorie=&jahr=&ansicht=&projekt=), so
 * the page renders per request; the API and image probes behind it are
 * cached (60 s / 24 h), so requests don't hit the backend.
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  return staticPageMetadata('gallery', lang);
}

/** Round-robin through projects (newest first) so rows mix formats. */
function interleave(projects) {
  const out = [];
  const max = Math.max(0, ...projects.map((p) => p.images.length));
  for (let k = 0; k < max; k++) {
    projects.forEach((p) => { if (p.images[k]) out.push({ ...p.images[k], projectId: p.id }); });
  }
  return out;
}

const first = (v) => (Array.isArray(v) ? v[0] : v);

export default async function GalleryPage({ params, searchParams }) {
  const { lang = 'de' } = await params;
  const sp = (await searchParams) || {};
  const copy = getUiCopy(lang);
  const seo = getSeoCopy(lang);

  const { projects: list, error } = await getProjectList(lang);
  const withImages = (await withAllImages(list, lang)).filter((p) => p.images.length);

  const projects = withImages.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    href: p.href,
    location: p.location,
    year: p.year,
    categoryKey: p.categoryKey,
    categoryLabel: p.categoryLabel,
    meta: p.meta,
    metaShort: [p.location, p.year].filter(Boolean).join(', '),
  }));

  const images = interleave(withImages).map((m) => ({
    id: m.id,
    projectId: m.projectId,
    src: m.src,
    w: m.w,
    h: m.h,
    known: m.known,
    alt: m.alt,
    caption: m.caption,
  }));

  // Facets: the office's four categories always (zero counts are shown dimmed),
  // plus any other category that appears in the data.
  const present = new Map(projects.map((p) => [p.categoryKey, p.categoryLabel]));
  const categories = [
    ...KNOWN_CATEGORIES.map((key) => ({ key, label: copy.categories[key] })),
    ...[...present.entries()].filter(([key]) => key && !KNOWN_CATEGORIES.includes(key)).map(([key, label]) => ({ key, label })),
  ];
  const years = [...new Set(projects.map((p) => p.year).filter(Boolean))].sort((a, b) => b - a).map(String);

  const cat = first(sp.kategorie);
  const year = first(sp.jahr);
  const project = first(sp.projekt);
  const initial = {
    cat: categories.some((c) => c.key === cat) ? cat : 'alle',
    year: years.includes(year) ? year : 'alle',
    view: first(sp.ansicht) === 'projekt' ? 'projekt' : 'raster',
    project: projects.some((p) => p.id === project) ? project : null,
  };

  return (
    <main id="main">
      <JsonLd
        data={webPageGraph({
          lang,
          path: '/gallery',
          type: 'CollectionPage',
          name: seo.breadcrumb.gallery,
          description: seo.gallery.description,
          breadcrumbs: simpleBreadcrumbs(lang, 'gallery', '/gallery'),
        })}
      />
      <PageHead
        title={seo.breadcrumb.gallery}
        aside={copy.gallery.intro}
        crumbs={[{ href: `/${lang}`, label: seo.breadcrumb.home }, { label: seo.breadcrumb.gallery }]}
        crumbsLabel={copy.common.breadcrumbs}
      />
      <GalleryView
        lang={lang}
        images={images}
        projects={projects}
        categories={categories}
        years={years}
        initial={initial}
        error={error}
        copy={copy.gallery}
        common={copy.common}
        lightboxCopy={copy.lightbox}
      />
      <div className="wrap">
        <div className="g-more">
          <p className="t-h3">{copy.gallery.moreTitle}</p>
          <Link className="link" href={`/${lang}/projekte`}>{copy.gallery.moreLink}</Link>
        </div>
      </div>
    </main>
  );
}
