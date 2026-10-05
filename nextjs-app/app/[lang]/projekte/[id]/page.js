import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectById } from '@/lib/api/projects';
import { pageMetadata, summarize } from '@/lib/seo';
import { getSeoCopy } from '@/lib/seo-copy';
import { getUiCopy } from '@/lib/ui-copy';
import { fmt } from '@/lib/fmt';
import { publicAssetUrl } from '@/lib/site';
import { projectGraph, isMeaningfulLocation } from '@/lib/schema';
import { getProjectList, normalizeProject, withAllImages, withCovers } from '@/lib/project-data';
import JsonLd from '@/components/JsonLd';
import Photo from '@/components/ui/Photo';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ProjectLightbox from '@/components/projects/ProjectLightbox';
import BackdropType from '@/components/ui/BackdropType';

/**
 * Incremental static regeneration: pages are rendered on first request, cached
 * and refreshed at most every 60 seconds (same freshness as the other pages).
 * Before, this route was fully dynamic (`cache-control: private, no-store`).
 * generateStaticParams returning [] enables on-demand ISR without needing the
 * API at build time.
 */
export const revalidate = 60;

export async function generateStaticParams() {
  return [];
}

function projectTitle(project) {
  return project.title || project.name || '';
}

/** Meta description from CMS text; composed from facts when the text is thin. */
function projectDescription(project, lang) {
  const copy = getSeoCopy(lang).project;
  const title = projectTitle(project);
  const clean = (t) => (t ? String(t).replace(/\s+/g, ' ').trim() : '');
  const description = clean(project.description);
  const details = clean(project.details);

  const rich = [description, details].find(
    (t) => t && t.length >= 70 && t.toLowerCase() !== title.toLowerCase()
  );
  if (rich) return summarize(rich, 155);

  const lead = description && description.toLowerCase() !== title.toLowerCase()
    ? `${title} – ${description.replace(/[.\s]+$/, '')}`
    : title;
  const facts = [
    project.category,
    isMeaningfulLocation(project.location) ? project.location : null,
    project.year,
  ].filter(Boolean).join(', ');
  return summarize(`${lead}${facts ? ` (${facts})` : ''}. ${copy.byline}`, 155);
}

export async function generateMetadata({ params }) {
  const { lang = 'de', id } = await params;
  const copy = getSeoCopy(lang);

  let project = null;
  try {
    project = await getProjectById(id, lang, { throwOnError: true });
  } catch {
    // API unavailable: the page itself will error; keep metadata minimal.
    return { title: copy.breadcrumb.projects, robots: { index: false, follow: true } };
  }
  if (!project) {
    return { title: copy.project.notFoundTitle, robots: { index: false, follow: true } };
  }

  const title = projectTitle(project);
  const location = isMeaningfulLocation(project.location) ? project.location : null;
  const cover = publicAssetUrl(project.image) || publicAssetUrl(project.images?.[0]);

  return pageMetadata({
    lang,
    route: 'project',
    path: `/projekte/${project.id}`,
    title: location ? `${title}, ${location}` : title,
    description: projectDescription(project, lang),
    type: 'article',
    ...(cover ? { image: { url: cover, alt: title } } : {}),
  });
}

// Editorial rhythm of the image sequence (design mockup project-detail.html).
// A CMS "layout" per image can override this later (extension point).
const RHYTHM = ['pair', 'bleed', 'stagger', 'single'];
const SEQUENCE_LIMIT = 12;

function buildSequence(images) {
  const groups = [];
  let i = 0;
  let k = 0;
  while (i < images.length) {
    const kind = RHYTHM[k % RHYTHM.length];
    k += 1;
    const a = images[i];
    if (kind === 'pair' || kind === 'stagger') {
      if (images[i + 1]) { groups.push({ kind, imgs: [a, images[i + 1]] }); i += 2; }
      else { groups.push({ kind: 'single', imgs: [a] }); i += 1; }
    } else if (kind === 'bleed') {
      // Only landscape photos are cropped to the 21:10 band.
      if (a.w / a.h >= 1.25) { groups.push({ kind, imgs: [a] }); i += 1; }
    } else {
      groups.push({ kind: 'single', imgs: [a] });
      i += 1;
    }
  }
  return groups;
}

const SIZES = {
  pair: '(min-width: 600px) 50vw, 100vw',
  stagger: '(min-width: 600px) 46vw, 100vw',
  single: '(min-width: 600px) 75vw, 100vw',
  bleed: '100vw',
};

export default async function ProjectDetailPage({ params }) {
  const { lang = 'de', id } = await params;

  // Throws on API errors (-> error page, ISR keeps the last good version);
  // returns null only when the project really does not exist (-> 404).
  const project = await getProjectById(id, lang, { throwOnError: true });
  if (!project) {
    notFound();
  }

  const copy = getUiCopy(lang);
  const seo = getSeoCopy(lang);
  const [p] = await withAllImages([normalizeProject(project, lang)], lang);
  const images = p.images;
  const lead = images[0] || null;
  const rest = images.slice(1);
  const sequence = buildSequence(rest.slice(0, SEQUENCE_LIMIT));
  const total = images.length;

  // Next project (newest first, wrapping around).
  let next = null;
  try {
    const { projects } = await getProjectList(lang);
    const at = projects.findIndex((x) => x.id === p.id);
    const candidate = projects.length > 1 ? projects[(at + 1) % projects.length] : null;
    if (candidate && candidate.id !== p.id) [next] = await withCovers([candidate], lang);
  } catch {
    next = null;
  }

  const paragraphs = (p.details && p.details !== p.subtitle ? p.details : '')
    .split(/\n{1,}/)
    .map((t) => t.trim())
    .filter(Boolean);

  const facts = [
    [copy.project.location, p.location],
    [copy.project.year, p.year],
    [copy.project.category, p.categoryLabel],
    [copy.project.area, p.area],
    [copy.project.status, p.status],
    [copy.project.count, total || null],
  ].filter(([, v]) => v);

  const lbItems = images.map((img) => ({
    src: img.src, w: img.w, h: img.h, known: img.known, alt: img.alt,
    title: p.title, caption: img.caption, meta: p.meta, href: null,
  }));
  const indexOf = (img) => images.indexOf(img);
  const enlarge = (img) => fmt(copy.common.enlarge, { label: fmt(copy.common.imageOf, { n: indexOf(img) + 1, total }) });
  const viewAll = fmt(copy.project.viewAll, { n: total });

  const shot = (img, sizes, extraClass = '') => (
    <button type="button" className="shot" data-lb={indexOf(img)} aria-label={enlarge(img)}>
      <span className={`ph ${extraClass}`.trim()}>
        <Photo src={img.src} alt={img.alt} width={img.w} height={img.h} sizes={sizes} className="w-full h-auto" />
      </span>
    </button>
  );

  return (
    <main id="main">
      <JsonLd data={projectGraph({ lang, project: { ...project, title: projectTitle(project) }, description: projectDescription(project, lang) })} />

      <div className="has-bt">
        <BackdropType variant="projectHead" words={copy.typo} />
      <div className="wrap cols page-head">
        <Breadcrumbs
          label={copy.common.breadcrumbs}
          items={[
            { href: `/${lang}`, label: seo.breadcrumb.home },
            { href: `/${lang}/projekte`, label: seo.breadcrumb.projects },
            { label: p.title },
          ]}
        />
        <h1 className="t-display">{p.title}</h1>
        {p.subtitle && <p className="t-lead page-aside">{p.subtitle}</p>}
      </div>
      </div>

      <ProjectLightbox items={lbItems} copy={copy.lightbox}>
        {lead && (
          <figure className="wrap pd-lead">
            <button type="button" className="shot" data-lb="0" aria-label={enlarge(lead)}>
              <span className="ph pd-lead-media">
                <Photo src={lead.src} alt={lead.alt} fill priority sizes="(min-width: 1520px) 1440px, calc(100vw - 32px)" className="object-cover" />
              </span>
            </button>
            <figcaption className="t-meta">
              <span>{p.meta}</span>
              {total > 1 && <button type="button" className="link t-small" data-lb="0">{viewAll}</button>}
            </figcaption>
          </figure>
        )}

        <section className="wrap cols pd-body" aria-label={copy.project.description}>
          <aside className="pd-facts">
            <h2 className="sr-only">{copy.project.facts}</h2>
            <dl className="facts">
              {facts.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
          {paragraphs.length > 0 && (
            <div className="pd-text t-prose">
              {paragraphs.map((t, i) => <p key={i}>{t}</p>)}
            </div>
          )}
        </section>

        {sequence.length > 0 && (
          <section className="seq has-bt" aria-label={copy.project.sequence}>
            <BackdropType variant="sequence" words={copy.typo} />
            {sequence.map((g, gi) => {
              if (g.kind === 'bleed') {
                const img = g.imgs[0];
                return (
                  <figure key={gi} className="bleed">
                    <button type="button" className="shot" data-lb={indexOf(img)} aria-label={enlarge(img)}>
                      <span className="ph bleed-media">
                        <Photo src={img.src} alt={img.alt} fill sizes={SIZES.bleed} className="object-cover" />
                      </span>
                    </button>
                  </figure>
                );
              }
              return (
                <div key={gi} className={`wrap cols ${g.kind}${g.kind === 'single' && g.imgs[0].w < g.imgs[0].h ? ' is-portrait' : ''}`}>
                  {g.imgs.map((img) => (
                    <figure key={img.id}>{shot(img, SIZES[g.kind])}</figure>
                  ))}
                </div>
              );
            })}
            <div className="wrap seq-end">
              {total > 1 && <button type="button" className="btn btn--ghost" data-lb="0">{viewAll}</button>}
              <Link className="link t-small" href={`/${lang}/gallery?projekt=${p.id}&ansicht=projekt`}>{copy.project.openInGallery}</Link>
            </div>
          </section>
        )}
      </ProjectLightbox>

      {next && (
        <nav className="wrap pd-next" aria-label={copy.project.nextNav}>
          <Link href={next.href}>
            <span className="txt">
              <span className="t-meta">{copy.project.next}</span>
              <br />
              <span className="t-h1">{next.title}</span>
              {next.meta && (<><br /><span className="t-meta">{next.meta}</span></>)}
            </span>
            {next.cover && (
              <span className="thumb">
                <span className="ph">
                  <Photo src={next.cover.src} alt="" width={next.cover.w} height={next.cover.h} sizes="(min-width: 1024px) 22vw, 50vw" className="w-full h-auto" />
                </span>
              </span>
            )}
          </Link>
        </nav>
      )}
    </main>
  );
}
