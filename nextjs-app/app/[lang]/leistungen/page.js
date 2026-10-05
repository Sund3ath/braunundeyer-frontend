import Link from 'next/link';
import { staticPageMetadata } from '@/lib/seo';
import { getSeoCopy } from '@/lib/seo-copy';
import { getUiCopy } from '@/lib/ui-copy';
import { webPageGraph, simpleBreadcrumbs } from '@/lib/schema';
import { SITE } from '@/lib/site';
import { getServicesConfig } from '@/lib/cms-content';
import { getImageDimensions } from '@/lib/image-meta';
import { processImageUrl } from '@/lib/utils/image-url';
import JsonLd from '@/components/JsonLd';
import PageHead from '@/components/site/PageHead';
import BackdropType from '@/components/ui/BackdropType';
import Photo from '@/components/ui/Photo';

// ISR: regenerate at most every 60 seconds.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return staticPageMetadata('services', lang);
}

const clean = (t) => String(t || '').replace(/[ \t]+/g, ' ').trim();
const lines = (t) => clean(t).split(/\n+/).map((s) => s.trim()).filter(Boolean);

/**
 * Services. Content comes from the CMS ("services": services, process steps,
 * building types). Without CMS data (e.g. during the build) the four core
 * services are listed with plain fallback copy and the CMS-only sections are
 * omitted rather than filled with placeholders.
 */
export default async function ServicesPage({ params }) {
  const { lang = 'de' } = await params;
  const copy = getUiCopy(lang);
  const seo = getSeoCopy(lang);
  const config = await getServicesConfig();

  const cmsServices = (config?.services || []).filter((s) => s && s.title);
  const services = (cmsServices.length ? cmsServices : copy.services.fallback).map((s) => ({
    id: String(s.id),
    title: clean(s.title),
    description: clean(s.description),
    details: lines(s.details),
    features: (Array.isArray(s.features) ? s.features : []).map(clean).filter(Boolean),
    timeline: clean(s.timeline),
    image: s.image ? processImageUrl(s.image) : null,
  }));
  const dims = await getImageDimensions(services.map((s) => s.image).filter(Boolean));
  const steps = (config?.processSteps || []).filter((s) => s && s.title);
  const kinds = (config?.categories || []).filter((c) => c && c.name);

  return (
    <main id="main">
      <JsonLd
        data={webPageGraph({
          lang,
          path: '/leistungen',
          name: seo.breadcrumb.services,
          description: seo.services.description,
          breadcrumbs: simpleBreadcrumbs(lang, 'services', '/leistungen'),
        })}
      />
      <div className="has-bt">
        <BackdropType variant="pageServices" words={copy.typo} />
      <PageHead
        title={seo.breadcrumb.services}
        aside={copy.services.intro}
        crumbs={[{ href: `/${lang}`, label: seo.breadcrumb.home }, { label: seo.breadcrumb.services }]}
        crumbsLabel={copy.common.breadcrumbs}
      />

      <div className="wrap" aria-label={copy.services.list} role="region">
        {services.map((s) => {
          const d = s.image ? dims.get(s.image) : null;
          const img = d && d.w && d.h ? { src: s.image, ...d } : null;
          return (
            <section key={s.id} id={`leistung-${s.id}`} className="cols srv-detail" aria-labelledby={`srv-${s.id}`}>
              <h2 className="t-h2 srv-title" id={`srv-${s.id}`}>{s.title}</h2>
              <div className="srv-text">
                {s.description && <p className="t-lead">{s.description}</p>}
                {s.details.map((t, i) => <p key={i} className="mt-4">{t}</p>)}
                {img && (
                  <span className="ph srv-media mt-6">
                    <Photo src={img.src} alt={s.title} width={img.w} height={img.h} sizes="(min-width: 1024px) 33vw, 100vw" className="w-full h-auto" />
                  </span>
                )}
              </div>
              {(s.features.length > 0 || s.timeline) && (
                <div className="srv-aside">
                  {s.features.length > 0 && (
                    <>
                      <h3 className="t-meta">{copy.services.features}</h3>
                      <ul className="plain mt-2">
                        {s.features.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </>
                  )}
                  {s.timeline && (
                    <p className="t-meta mt-5">{copy.services.timeline}: <span className="ink">{s.timeline}</span></p>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {steps.length > 0 && (
        <section className="section" aria-labelledby="h-process">
          <div className="wrap cols">
            <div className="side-head">
              <h2 className="t-h2" id="h-process">{copy.services.process}</h2>
              <p className="mt-4 t-body">{copy.services.processIntro}</p>
            </div>
            <ol className="steps">
              {steps.map((st, i) => (
                <li key={st.id || i}>
                  <span className="n" aria-hidden="true">{st.number || i + 1}</span>
                  <h3 className="t-h3">{clean(st.title)}</h3>
                  {st.description && <p>{clean(st.description)}</p>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {kinds.length > 0 && (
        <section className="section rule-top" aria-labelledby="h-kinds">
          <div className="wrap cols">
            <div className="side-head">
              <h2 className="t-h2" id="h-kinds">{copy.services.kinds}</h2>
              <p className="mt-4 t-body">{copy.services.kindsIntro}</p>
            </div>
            <ul className="kinds">
              {kinds.map((k, i) => (
                <li key={k.id || i}>
                  <h3 className="t-h3">{clean(k.name)}</h3>
                  {lines(k.description).map((t, j) => <p key={j} className="mt-2">{t}</p>)}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      </div>

      <section className="section about-band has-bt" aria-labelledby="h-cta">
        <BackdropType variant="cta" words={copy.typo} tone="putz" />
        <div className="wrap cols contact-cta">
          <div className="c-left">
            <h2 className="t-h2" id="h-cta">{copy.services.ctaTitle}</h2>
            <p>{copy.services.ctaText}</p>
          </div>
          <div className="c-right">
            <a className="phone" href={`tel:${SITE.phone.e164}`}>{SITE.phone.national}</a>
            <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <Link className="btn" href={`/${lang}/kontakt`}>{copy.services.ctaButton}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
