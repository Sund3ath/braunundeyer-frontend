import Link from 'next/link';
import { staticPageMetadata } from '@/lib/seo';
import { getSeoCopy } from '@/lib/seo-copy';
import { getUiCopy } from '@/lib/ui-copy';
import { webPageGraph, simpleBreadcrumbs } from '@/lib/schema';
import { SITE } from '@/lib/site';
import { getTeam } from '@/lib/cms-content';
import JsonLd from '@/components/JsonLd';
import PageHead from '@/components/site/PageHead';
import BackdropType from '@/components/ui/BackdropType';
import Photo from '@/components/ui/Photo';

// ISR: regenerate at most every 60 seconds.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return staticPageMetadata('about', lang);
}

/**
 * The office: facts from lib/site.js, the team from the CMS (names, roles,
 * portraits, contact). No timeline, awards or testimonials until they are
 * verified and supplied by the office.
 */
export default async function AboutPage({ params }) {
  const { lang = 'de' } = await params;
  const copy = getUiCopy(lang);
  const seo = getSeoCopy(lang);
  const team = await getTeam(lang);

  const facts = [
    [copy.about.founded, SITE.foundingYear],
    [copy.about.seat, `${SITE.address.city}, ${SITE.address.region}`],
    [copy.about.partners, SITE.founders.map((f) => f.name).join(', ')],
    [copy.about.chamber, <a key="aks" className="link" href={SITE.chamber.url} rel="noopener" target="_blank">{SITE.chamber.name}</a>],
  ];

  return (
    <main id="main">
      <JsonLd
        data={webPageGraph({
          lang,
          path: '/uber-uns',
          type: 'AboutPage',
          name: seo.breadcrumb.about,
          description: seo.about.description,
          breadcrumbs: simpleBreadcrumbs(lang, 'about', '/uber-uns'),
        })}
      />
      <div className="has-bt">
        <BackdropType variant="pageOffice" words={copy.typo} />
      <PageHead
        title={seo.breadcrumb.about}
        crumbs={[{ href: `/${lang}`, label: seo.breadcrumb.home }, { label: seo.breadcrumb.about }]}
        crumbsLabel={copy.common.breadcrumbs}
      />

      <section className="wrap cols pd-body" aria-labelledby="h-office" style={{ paddingTop: 0 }}>
        <aside className="pd-facts">
          <h2 className="sr-only" id="h-office">{copy.about.facts}</h2>
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div key={k} className="contents">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="pd-text">
          <p className="t-lead">{copy.about.lead}</p>
          <p className="t-prose mt-6">{copy.about.text}</p>
        </div>
      </section>

      {team.length > 0 && (
        <section className="section rule-top" aria-labelledby="h-team">
          <div className="wrap">
            <h2 className="t-h2" id="h-team" style={{ marginBottom: 'var(--s-7)' }}>{copy.about.team}</h2>
            <ul className="team-grid">
              {team.map((m) => (
                <li key={m.id} className="member">
                  {m.image && (
                    <span className="ph block" style={{ aspectRatio: '4 / 5' }}>
                      <Photo src={m.image} alt={m.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 600px) 45vw, 90vw" className="object-cover" />
                    </span>
                  )}
                  <h3 className="t-h3">{m.name}</h3>
                  {m.position && <p className="t-small muted">{m.position}</p>}
                  {m.bio && <p className="t-small mt-2">{m.bio}</p>}
                  {(m.email || m.phone) && (
                    <dl>
                      {m.email && (
                        <div>
                          <dt className="sr-only">{copy.about.email}</dt>
                          <dd><a className="link" href={`mailto:${m.email}`}>{m.email.toLowerCase()}</a></dd>
                        </div>
                      )}
                      {m.phone && (
                        <div>
                          <dt className="sr-only">{copy.about.phone}</dt>
                          <dd><a className="link" href={`tel:${m.phone.replace(/[^\d+]/g, '')}`}>{m.phone}</a></dd>
                        </div>
                      )}
                    </dl>
                  )}
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
            <h2 className="t-h2" id="h-cta">{copy.about.ctaTitle}</h2>
            <p>{copy.about.ctaText}</p>
          </div>
          <div className="c-right">
            <a className="phone" href={`tel:${SITE.phone.e164}`}>{SITE.phone.national}</a>
            <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <Link className="btn" href={`/${lang}/kontakt`}>{copy.about.ctaButton}</Link>
            <Link className="link t-small" href={`/${lang}/projekte`}>{copy.about.projectsLink}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
