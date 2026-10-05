import Link from 'next/link';
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
  return staticPageMetadata('privacy', lang);
}

/**
 * Datenschutzerklärung (German legal text, identical in every language).
 * Text unchanged from the previous version; only the presentation moved to
 * readable long-form typography. Controller details come from lib/site.js.
 * TODO(client/lawyer): the text does not yet describe the contact form,
 * the cookie banner / visitor statistics or the font and image delivery.
 */
export default async function DatenschutzPage({ params }) {
  const { lang = 'de' } = await params;
  const copy = getUiCopy(lang);
  const seo = getSeoCopy(lang);

  return (
    <main id="main" className="legal">
      <JsonLd
        data={webPageGraph({
          lang,
          path: '/datenschutz',
          name: seo.privacy.title,
          breadcrumbs: simpleBreadcrumbs(lang, 'privacy', '/datenschutz'),
        })}
      />
      <PageHead
        title={lang === 'de' ? 'Datenschutzerklärung' : seo.privacy.title}
        aside={copy.legal.privacyAside}
        crumbs={[{ href: `/${lang}`, label: seo.breadcrumb.home }, { label: seo.breadcrumb.privacy }]}
        crumbsLabel={copy.common.breadcrumbs}
      />
      <div className="wrap">
        <div className="legal-body" lang="de">
          <h2>1. Datenschutz auf einen Blick</h2>
          <h3>Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
            Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit
            denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz
            entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
          </p>
          <h3>Datenerfassung auf dieser Website</h3>
          <h4>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
          <p>
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten
            können Sie dem Impressum dieser Website entnehmen.
          </p>
          <h4>Wie erfassen wir Ihre Daten?</h4>
          <p>
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich
            z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
          </p>
          <p>
            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere
            IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem
            oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese
            Website betreten.
          </p>
          <h4>Wofür nutzen wir Ihre Daten?</h4>
          <p>
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten.
            Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
          </p>
          <h4>Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
          <p>
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
            gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung
            oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt
            haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das
            Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten
            zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
          </p>
          <p>Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.</p>

          <h2>2. Hosting und Content Delivery Networks (CDN)</h2>
          <h3>Externes Hosting</h3>
          <p>
            Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten,
            die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann
            es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten,
            Kontaktdaten, Namen, Webseitenzugriffe und sonstige Daten, die über eine Website generiert werden,
            handeln.
          </p>
          <p>
            Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und
            bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und
            effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter
            (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
          <p>
            Unser Hoster wird Ihre Daten nur insoweit verarbeiten, wie dies zur Erfüllung seiner
            Leistungspflichten erforderlich ist und unsere Weisungen in Bezug auf diese Daten befolgen.
          </p>
          <h4>Abschluss eines Vertrages über Auftragsverarbeitung</h4>
          <p>
            Um die datenschutzkonforme Verarbeitung zu gewährleisten, haben wir einen Vertrag über
            Auftragsverarbeitung mit unserem Hoster geschlossen.
          </p>

          <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
          <h3>Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln
            Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften
            sowie dieser Datenschutzerklärung.
          </p>
          <p>
            Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben.
            Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können.
            Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen.
            Sie erläutert auch, wie und zu welchem Zweck das geschieht.
          </p>
          <p>
            Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail)
            Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist
            nicht möglich.
          </p>
          <h3>Hinweis zur verantwortlichen Stelle</h3>
          <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
          <p>
            <strong>{SITE.legalName}</strong>
            <br />
            {SITE.address.street}
            <br />
            {SITE.address.postalCode} {SITE.address.city}
          </p>
          <p>
            Telefon: <a href={`tel:${SITE.phone.e164}`}>{SITE.phone.display}</a>
            <br />
            E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <p>
            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit
            anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen,
            E-Mail-Adressen o. Ä.) entscheidet.
          </p>
          <h3>Ihre Rechte</h3>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung
            Ihrer personenbezogenen Daten. Bei Fragen wenden Sie sich jederzeit an uns.
          </p>

          <h2>Kontakt</h2>
          <p>
            Weitere Informationen zu unseren Kontaktdaten finden Sie in unserem{' '}
            <Link href={`/${lang}/impressum`}>Impressum</Link>.
          </p>

          <p className="t-meta" style={{ marginTop: 'var(--s-8)' }}>Stand: Dezember 2024</p>
        </div>
      </div>
    </main>
  );
}
