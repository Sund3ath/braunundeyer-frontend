import { staticPageMetadata } from '@/lib/seo';
import { getSeoCopy } from '@/lib/seo-copy';
import { getUiCopy } from '@/lib/ui-copy';
import { webPageGraph, simpleBreadcrumbs } from '@/lib/schema';
import { SITE } from '@/lib/site';
import { getContactSettings } from '@/lib/cms-content';
import JsonLd from '@/components/JsonLd';
import PageHead from '@/components/site/PageHead';
import BackdropType from '@/components/ui/BackdropType';
import ContactForm from '@/components/contact/ContactForm';

// ISR: regenerate at most every 60 seconds.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return staticPageMetadata('contact', lang);
}

const DAY_INDEX = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };

/** Weekday name in the page language (CMS stores English + German names). */
function weekday(entry, lang) {
  const i = DAY_INDEX[String(entry.day || '').toLowerCase()];
  if (i === undefined) return entry.dayDe || entry.day || '';
  // 2024-01-01 was a Monday.
  return new Intl.DateTimeFormat(lang, { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i)));
}

const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, '')}`;

/** Only links to an actual profile, never a bare platform home page. */
function isProfileUrl(url) {
  try {
    const u = new URL(url);
    return /^https?:$/.test(u.protocol) && u.pathname.replace(/\/+$/, '').length > 1;
  } catch {
    return false;
  }
}

/**
 * Contact. Office data from the CMS ("contact-settings") with lib/site.js as
 * fallback; the form posts to the existing backend endpoint. The previous
 * Google Maps iframe (third-party embed loaded without consent, placeholder
 * place id) is replaced by a plain link that opens the route in Google Maps.
 */
export default async function ContactPage({ params }) {
  const { lang = 'de' } = await params;
  const copy = getUiCopy(lang);
  const seo = getSeoCopy(lang);
  const settings = await getContactSettings();

  const office = settings?.officeInfo || {};
  const street = office.street || SITE.address.street;
  const zip = office.zipCode || SITE.address.postalCode;
  const city = office.city || SITE.address.city;
  const phone = office.phone || SITE.phone.national;
  const fax = office.fax || SITE.fax.display;
  const email = office.email || SITE.email;
  const hours = Array.isArray(settings?.openingHours) && settings.openingHours.length ? settings.openingHours : SITE.openingHours;
  const social = (settings?.socialLinks || []).filter((l) => l && l.active && isProfileUrl(l.url));
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name}, ${street}, ${zip} ${city}`)}`;

  return (
    <main id="main">
      <JsonLd
        data={webPageGraph({
          lang,
          path: '/kontakt',
          type: 'ContactPage',
          name: seo.breadcrumb.contact,
          description: seo.contact.description,
          breadcrumbs: simpleBreadcrumbs(lang, 'contact', '/kontakt'),
        })}
      />
      <div className="has-bt">
        <BackdropType variant="contact" words={copy.typo} />
        <PageHead
          title={seo.breadcrumb.contact}
          aside={copy.contact.intro}
          crumbs={[{ href: `/${lang}`, label: seo.breadcrumb.home }, { label: seo.breadcrumb.contact }]}
          crumbsLabel={copy.common.breadcrumbs}
        />

        <div className="wrap cols contact-grid">
          <div className="c-info">
            <section aria-labelledby="ci-address">
              <h2 id="ci-address">{copy.contact.address}</h2>
              <address>
                {office.companyName || SITE.legalName}
                <br />
                {street}
                <br />
                {zip} {city}
              </address>
              <a className="link t-small" href={mapsHref} rel="noopener" target="_blank">{copy.contact.route}</a>
            </section>
            <section aria-labelledby="ci-phone">
              <h2 id="ci-phone">{copy.contact.phone}</h2>
              <a className="t-h3" style={{ textDecoration: 'none' }} href={office.phone ? telHref(office.phone) : `tel:${SITE.phone.e164}`}>{phone}</a>
              {fax && <p className="t-meta">{copy.contact.fax} {fax}</p>}
            </section>
            <section aria-labelledby="ci-email">
              <h2 id="ci-email">{copy.contact.email}</h2>
              <a className="link" href={`mailto:${email}`}>{email}</a>
            </section>
            {hours.length > 0 && (
              <section aria-labelledby="ci-hours">
                <h2 id="ci-hours">{copy.contact.hours}</h2>
                <dl className="hours">
                  {hours.map((h) => (
                    <div key={h.day || h.dayDe} className="contents">
                      <dt>{weekday(h, lang)}</dt>
                      <dd>{h.closed ? copy.contact.closed : `${h.open}–${h.close}`}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            {social.length > 0 && (
              <section aria-labelledby="ci-online">
                <h2 id="ci-online">{copy.contact.online}</h2>
                <ul>
                  {social.map((l) => (
                    <li key={l.url}><a className="link" href={l.url} rel="noopener noreferrer" target="_blank">{l.platform || new URL(l.url).hostname}</a></li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          <div className="c-form">
            <ContactForm copy={copy.contact.form} privacyHref={`/${lang}/datenschutz`} email={email} />
          </div>
        </div>
      </div>
    </main>
  );
}
