import { staticPageMetadata } from '@/lib/seo';
import { getSeoCopy } from '@/lib/seo-copy';
import { getUiCopy } from '@/lib/ui-copy';
import { webPageGraph, simpleBreadcrumbs } from '@/lib/schema';
import { SITE } from '@/lib/site';
import JsonLd from '@/components/JsonLd';
import PageHead from '@/components/site/PageHead';

// ISR: regenerate at most every 60 seconds.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return staticPageMetadata('imprint', lang);
}

/**
 * Impressum (German legal text, identical in every language; the aside says
 * so in the page language). Text unchanged from the previous version; only
 * the presentation moved to readable long-form typography.
 * TODO(client/lawyer): confirm the DDG references and the VSBG wording.
 */
export default async function ImpressumPage({ params }) {
  const { lang = 'de' } = await params;
  const copy = getUiCopy(lang);
  const seo = getSeoCopy(lang);

  return (
    <main id="main" className="legal">
      <JsonLd
        data={webPageGraph({
          lang,
          path: '/impressum',
          name: seo.imprint.title,
          breadcrumbs: simpleBreadcrumbs(lang, 'imprint', '/impressum'),
        })}
      />
      <PageHead
        title={seo.breadcrumb.imprint}
        aside={copy.legal.imprintAside}
        crumbs={[{ href: `/${lang}`, label: seo.breadcrumb.home }, { label: seo.breadcrumb.imprint }]}
        crumbsLabel={copy.common.breadcrumbs}
      />
      <div className="wrap">
        <div className="legal-body" lang="de">
          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            <strong>{SITE.legalName}</strong>
            <br />
            {SITE.address.street}
            <br />
            {SITE.address.postalCode} {SITE.address.city}
            <br />
            {SITE.address.countryName}
          </p>

          <h2>Vertreten durch</h2>
          <p>
            <strong>Christian F. Braun</strong>
            <br />
            Diplom-Ingenieur, Freier Architekt
            <br />
            Mitglied der Architektenkammer des Saarlandes
          </p>
          <p>
            <strong>Patric Eyer</strong>
            <br />
            Diplom-Ingenieur, Freier Architekt
            <br />
            Mitglied der Architektenkammer des Saarlandes
          </p>

          <h2>Kontakt</h2>
          <p>
            <strong>Telefon:</strong> <a href={`tel:${SITE.phone.e164}`}>{SITE.phone.display}</a>
            <br />
            <strong>Telefax:</strong> {SITE.fax.display}
            <br />
            <strong>E-Mail:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>

          <h2>Umsatzsteuer</h2>
          <p>
            <strong>Umsatzsteuer-Identifikationsnummer:</strong>
            <br />
            DE 202 945 356
          </p>

          <h2>Berufsrechtliche Regelungen</h2>
          <p>
            <strong>Berufsbezeichnung:</strong> Architekt
            <br />
            Verliehen durch: Bundesrepublik Deutschland
          </p>
          <p>
            <strong>Zuständige Kammer:</strong>
            <br />
            Architektenkammer des Saarlandes
            <br />
            Gerberstraße 21
            <br />
            66111 Saarbrücken
            <br />
            <a href={SITE.chamber.url} target="_blank" rel="noopener noreferrer">www.aksaarland.de</a>
          </p>
          <p><strong>Es gelten folgende berufsrechtliche Regelungen:</strong></p>
          <ul>
            <li>Architektengesetz des Saarlandes (SAKG)</li>
            <li>Berufsordnung der Architektenkammer des Saarlandes</li>
            <li>Honorarordnung für Architekten und Ingenieure (HOAI)</li>
          </ul>

          <h2>Haftpflichtversicherung</h2>
          <p>Berufshaftpflichtversicherung besteht über:</p>
          <p>
            <strong>AIA AG</strong>
            <br />
            Goetheallee 9
            <br />
            80637 München
          </p>

          <h2>Haftungsausschluss</h2>
          <h3>Haftung für Inhalte</h3>
          <p>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich.
          </p>
          <h3>Haftung für Links</h3>
          <p>
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
            Seiten verantwortlich.
          </p>
          <h3>Urheberrecht</h3>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
            des jeweiligen Autors bzw. Erstellers.
          </p>

          {/* The EU ODR platform was shut down on 20 July 2025 and the duty to
              link to it was repealed, so the link was removed. The § 36 VSBG
              statement stays. TODO(client/lawyer): confirm wording. */}
          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </div>
    </main>
  );
}
