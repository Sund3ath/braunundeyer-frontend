import Link from 'next/link';
import { staticPageMetadata } from '@/lib/seo';
import { getSeoCopy } from '@/lib/seo-copy';
import { getUiCopy } from '@/lib/ui-copy';
import { webPageGraph, simpleBreadcrumbs } from '@/lib/schema';
import { getProjectList, withCovers, KNOWN_CATEGORIES, isBuildPhase } from '@/lib/project-data';
import JsonLd from '@/components/JsonLd';
import PageHead from '@/components/site/PageHead';
import BackdropType from '@/components/ui/BackdropType';
import ProjectIndex from '@/components/projects/ProjectIndex';

// ISR: regenerate at most every 60 seconds.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return staticPageMetadata('projects', lang);
}

export default async function ProjectsPage({ params }) {
  const { lang = 'de' } = await params;
  const copy = getUiCopy(lang);
  const seo = getSeoCopy(lang);

  const { projects: list, error } = await getProjectList(lang);
  // Runtime API failure: keep serving the last good ISR version.
  if (error && !isBuildPhase()) throw new Error('Projects API unavailable');
  const projects = await withCovers(list, lang);

  // Category facets in office order, then any other CMS category.
  const counts = new Map();
  projects.forEach((p) => {
    if (!p.categoryKey) return;
    const c = counts.get(p.categoryKey) || { key: p.categoryKey, label: p.categoryLabel, count: 0 };
    c.count += 1;
    counts.set(p.categoryKey, c);
  });
  const categories = [
    ...KNOWN_CATEGORIES.filter((k) => counts.has(k)).map((k) => counts.get(k)),
    ...[...counts.values()].filter((c) => !KNOWN_CATEGORIES.includes(c.key)),
  ];

  const items = projects.map((p) => ({
    id: p.id,
    href: p.href,
    title: p.title,
    meta: p.meta,
    categoryKey: p.categoryKey,
    categoryLabel: p.categoryLabel,
    cover: p.cover ? { src: p.cover.src, w: p.cover.w, h: p.cover.h, alt: p.cover.alt } : null,
  }));

  return (
    <main id="main">
      <JsonLd
        data={webPageGraph({
          lang,
          path: '/projekte',
          type: 'CollectionPage',
          name: seo.breadcrumb.projects,
          description: seo.projects.description,
          breadcrumbs: simpleBreadcrumbs(lang, 'projects', '/projekte'),
        })}
      />
      <div className="has-bt">
        <BackdropType variant="pageProjects" words={copy.typo} />
      <PageHead
        title={seo.breadcrumb.projects}
        aside={copy.projects.intro}
        crumbs={[{ href: `/${lang}`, label: seo.breadcrumb.home }, { label: seo.breadcrumb.projects }]}
        crumbsLabel={copy.common.breadcrumbs}
      />
      <div className="wrap">
        {error && items.length === 0 ? (
          <div className="g-empty" role="alert">
            <h2 className="t-h3">{copy.projects.error}</h2>
            <p><a className="btn btn--ghost" href={`/${lang}/projekte`}>{copy.projects.reload}</a></p>
          </div>
        ) : items.length === 0 ? (
          <p className="g-empty">{copy.projects.empty}</p>
        ) : (
          <ProjectIndex projects={items} categories={categories} copy={copy.projects} />
        )}
        <div className="g-more">
          <p className="t-body">{copy.projects.galleryHint}</p>
          <Link className="link" href={`/${lang}/gallery`}>{copy.projects.toGallery}</Link>
        </div>
      </div>
      </div>
    </main>
  );
}
