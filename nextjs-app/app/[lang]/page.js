import { notFound } from 'next/navigation';
import Link from 'next/link';
import { homepageAPI } from '@/lib/api';
import { staticPageMetadata, isValidLocale } from '@/lib/seo';
import { getSeoCopy } from '@/lib/seo-copy';
import { getUiCopy } from '@/lib/ui-copy';
import { webPageGraph } from '@/lib/schema';
import { SITE } from '@/lib/site';
import { getProjectList, withCovers, isBuildPhase } from '@/lib/project-data';
import { getServicesConfig, getTeam } from '@/lib/cms-content';
import JsonLd from '@/components/JsonLd';
import Photo from '@/components/ui/Photo';
import BackdropType from '@/components/ui/BackdropType';
import HeroSlider from '@/components/home/HeroSlider';
import EntryOverlay from '@/components/home/EntryOverlay';
import { fmt } from '@/lib/fmt';

/**
 * Homepage, served at /{lang} (server component; /{lang}/homepage 308s here).
 * Sections: full-width hero carousel of the CMS hero slides (titles are h2),
 * intro with the page's single h1, three selected projects on a staggered
 * grid, the services as a typographic list, an office snippet with the team,
 * a contact block. Backdrop typography (decorative, CSS-generated words)
 * sits behind the sections. The optional intro overlay ("ENTER") is mounted
 * client-side only, on top of this fully server-rendered page.
 * Content comes from the CMS (hero slides, featured projects, services, team)
 * and lib/site.js; sections without data are omitted.
 */

// ISR: regenerate at most every 60 seconds (same freshness as before).
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return staticPageMetadata('home', lang);
}

const WORK_SLOTS = [
  { cls: 'w1', sizes: '(min-width: 1024px) 40vw, (min-width: 600px) 50vw, 100vw' },
  { cls: 'w2', sizes: '(min-width: 1024px) 50vw, (min-width: 600px) 50vw, 100vw' },
  { cls: 'w3', sizes: '(min-width: 1024px) 66vw, 92vw' },
];

function cleanText(t) {
  return String(t || '').replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim();
}

const COMPLETION = /^(?:fertigstellung|completion|completed)\s*:?\s*(\d{4})$/i;
const YEAR_RANGE = /^(\d{4})\s*[-–]\s*(\d{4})$/;

/**
 * CMS hero slide -> view model. The CMS mixes client and year in free text
 * ("Orbis SE , Fertigstellung 2025" / description "Fertigstellung  2025" /
 * "2023- 2026"); split it into a client line and a localised year line.
 */
function heroSlideView(slide, heroCopy) {
  const parts = [slide.subtitle, slide.description]
    .flatMap((t) => String(t || '').split(','))
    .map(cleanText)
    .filter(Boolean);
  let completed = null;
  const years = [];
  const rest = [];
  parts.forEach((p) => {
    const c = p.match(COMPLETION);
    const r = p.match(YEAR_RANGE);
    if (c) completed = c[1];
    else if (r) years.push(`${r[1]}–${r[2]}`);
    else if (/^\d{4}$/.test(p)) years.push(p);
    else if (!rest.includes(p)) rest.push(p);
  });
  const title = cleanText(slide.title);
  const client = rest.join(', ');
  return {
    id: String(slide.id ?? slide.image),
    src: slide.image,
    video: slide.video || null,
    title,
    client,
    meta: [completed && fmt(heroCopy.completed, { year: completed }), ...years].filter(Boolean).join(' · '),
    alt: [title, client].filter(Boolean).join(', ') || SITE.name,
  };
}

async function getHomepageConfig() {
  try {
    const config = await homepageAPI.getConfig();
    return config && typeof config === 'object' ? config : {};
  } catch {
    return {};
  }
}

export default async function HomePage({ params }) {
  const { lang = 'de' } = await params;
  // The layout already 404s unknown locales; bail out before any API calls.
  if (!isValidLocale(lang)) notFound();

  const copy = getUiCopy(lang);
  const seo = getSeoCopy(lang);

  const [config, list, servicesConfig, team] = await Promise.all([
    getHomepageConfig(),
    getProjectList(lang),
    getServicesConfig(),
    getTeam(lang),
  ]);

  // Runtime API failure: keep serving the last good ISR version.
  if (list.error && !isBuildPhase()) throw new Error('Projects API unavailable');

  // Hero carousel: the CMS hero slides with a real image (in CMS order);
  // without any, the selected projects' lead photos.
  const cmsSlides = (Array.isArray(config.heroSlides) ? config.heroSlides : [])
    .filter((s) => s && s.image)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Selected projects: CMS "featured" first, then the newest ones.
  const featuredIds = (Array.isArray(config.featuredProjects) ? config.featuredProjects : []).map((p) => String(p.id));
  const ordered = [
    ...featuredIds.map((id) => list.projects.find((p) => p.id === id)).filter(Boolean),
    ...list.projects.filter((p) => !featuredIds.includes(p.id)),
  ];
  const selected = await withCovers(ordered.slice(0, 3), lang);

  const heroSlides = cmsSlides.length
    ? cmsSlides.map((s) => heroSlideView(s, copy.home.hero))
    : selected.filter((p) => p.cover).map((p) => ({
      id: `p${p.id}`,
      src: p.cover.src,
      video: null,
      title: p.title,
      client: p.meta || '',
      meta: '',
      alt: p.cover.alt,
      w: p.cover.w,
      h: p.cover.h,
    }));

  const services = (servicesConfig?.services?.length ? servicesConfig.services : copy.services.fallback)
    .filter((s) => s && s.title)
    .map((s) => ({ id: String(s.id), title: cleanText(s.title), description: cleanText(s.description) }));

  return (
    <main id="main">
      <JsonLd
        data={webPageGraph({
          lang,
          path: '',
          name: seo.home.title,
          description: seo.home.description,
        })}
      />

      <EntryOverlay copy={copy.entry} typo={copy.typo} brand={SITE.name} />

      {heroSlides.length > 0 && (
        <HeroSlider
          slides={heroSlides}
          copy={copy.home.hero}
          workHref={`/${lang}/projekte`}
          contactHref={`/${lang}/kontakt`}
        />
      )}

      <section className="wrap cols intro has-bt" aria-labelledby="h-intro">
        <BackdropType variant="intro" words={copy.typo} />
        <h1 className="t-h1" id="h-intro">{seo.home.h1}</h1>
        <div className="intro-side">
          <p>{copy.home.intro}</p>
          <p className="t-meta">{copy.home.since}</p>
        </div>
      </section>

      {selected.length > 0 && (
        <section className="section has-bt" aria-labelledby="h-proj">
          <BackdropType variant="projects" words={copy.typo} />
          <div className="wrap">
            <div className="cols sec-head">
              <h2 className="t-h2" id="h-proj">{copy.home.selected}</h2>
              <Link className="link sec-link" href={`/${lang}/projekte`}>{copy.home.allProjects}</Link>
            </div>
            <div className="cols works">
              {selected.map((p, i) => (
                <article key={p.id} className={`work ${WORK_SLOTS[i].cls}${p.cover && p.cover.w < p.cover.h ? ' is-portrait' : ''}`}>
                  <Link href={p.href}>
                    {p.cover && (
                      <span className="ph">
                        <Photo src={p.cover.src} alt={p.cover.alt} width={p.cover.w} height={p.cover.h} sizes={WORK_SLOTS[i].sizes} className="w-full h-auto" />
                      </span>
                    )}
                    <h3 className="t-h3">{p.title}</h3>
                    {p.meta && <p className="t-meta">{p.meta}</p>}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="section has-bt" aria-labelledby="h-srv">
          <BackdropType variant="services" words={copy.typo} />
          <div className="wrap cols">
            <div className="srv-intro">
              <h2 className="t-h2" id="h-srv">{copy.home.services}</h2>
              <p>{copy.home.servicesIntro}</p>
              <Link className="link" href={`/${lang}/leistungen`}>{copy.home.servicesMore}</Link>
            </div>
            <ul className="srv-list">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/${lang}/leistungen#leistung-${s.id}`}>
                    <h3>{s.title}</h3>
                    {s.description && <p>{s.description}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section about-band has-bt" aria-labelledby="h-about">
        <BackdropType variant="office" words={copy.typo} tone="putz" />
        <div className="wrap cols">
          <h2 className="t-h2" id="h-about">{copy.home.office}</h2>
          <div className="about-body">
            <p className="t-lead">{copy.home.officeLead}</p>
            {team.length > 0 && (
              <ul className="team-list" aria-label={copy.home.team}>
                {team.map((m) => (
                  <li key={m.id}>
                    <span className="name">{m.name}</span>
                    {m.position && <span className="role">{m.position}</span>}
                  </li>
                ))}
              </ul>
            )}
            <p><Link className="link" href={`/${lang}/uber-uns`}>{copy.home.officeMore}</Link></p>
          </div>
        </div>
      </section>

      <section className="section wrap cols contact-cta has-bt" aria-labelledby="h-contact">
        <BackdropType variant="cta" words={copy.typo} />
        <div className="c-left">
          <h2 className="t-h2" id="h-contact">{copy.home.contactTitle}</h2>
          <p>{copy.home.contactText}</p>
        </div>
        <div className="c-right">
          <a className="phone" href={`tel:${SITE.phone.e164}`}>{SITE.phone.national}</a>
          <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <address>{SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}</address>
          <Link className="btn" href={`/${lang}/kontakt`}>{copy.home.contactButton}</Link>
        </div>
      </section>
    </main>
  );
}
