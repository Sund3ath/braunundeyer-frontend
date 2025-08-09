import React from 'react';
import { motion } from 'framer-motion';
import Header from 'components/ui/Header';
import SEO from 'components/SEO';
import CursorTrail from 'components/ui/CursorTrail';
import BackgroundTypography from 'components/ui/BackgroundTypography';
import { generateBreadcrumbSchema } from 'utils/structuredData';

const Impressum = () => {
  const breadcrumbs = [
    { name: 'Home', url: 'https://braunundeyer.de' },
    { name: 'Impressum', url: 'https://braunundeyer.de/impressum' }
  ];

  // Very subtle background typography for legal pages
  const backgroundWords = [
    { 
      text: "RECHT", 
      size: "text-[8rem]", 
      opacity: "opacity-[0.03]", 
      position: { left: "60%", top: "40%" },
      animation: "large",
      delay: 0,
      duration: 40
    },
    { 
      text: "LEGAL", 
      size: "text-6xl", 
      opacity: "opacity-[0.04]", 
      position: { left: "10%", top: "70%" },
      animation: "small",
      delay: 5,
      duration: 35
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      
      {/* Background Typography - now properly positioned */}
      <BackgroundTypography words={backgroundWords} />
      <SEO 
        title="Impressum | Braun & Eyer Architekturbüro"
        description="Impressum der Braun und Eyer Architekten GbR. Angaben gemäß § 5 TMG."
        keywords="Impressum, Rechtliche Hinweise, Braun Eyer Architekturbüro"
        structuredData={generateBreadcrumbSchema(breadcrumbs)}
        noindex={true}
      />
      <Header />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 pt-32 pb-20 max-w-4xl relative z-base"
      >
        <h1 className="text-4xl font-bold mb-8">Impressum</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
          <div className="space-y-2">
            <p><strong>Braun und Eyer Architekten GbR</strong></p>
            <p>Mainzerstraße 29</p>
            <p>66111 Saarbrücken</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vertreten durch</h2>
          <p>Die Gesellschafter:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Dipl.-Ing. Architekt Herr Braun</li>
            <li>Dipl.-Ing. Architekt Herr Eyer</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
          <div className="space-y-2">
            <p><strong>Telefon:</strong> 0681 - 95 41 74 88</p>
            <p><strong>E-Mail:</strong> info@braunundeyer.de</p>
            <p><strong>Website:</strong> www.braunundeyer.de</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
          <div className="space-y-3">
            <p><strong>Berufsbezeichnung:</strong> Architekt</p>
            <p><strong>Zuständige Kammer:</strong></p>
            <div className="ml-4 space-y-1">
              <p>Architektenkammer des Saarlandes</p>
              <p>Neumarkt 11</p>
              <p>66111 Saarbrücken</p>
              <p>Tel: 0681 - 95 44 10</p>
              <p><a href="https://www.aksaarland.de" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.aksaarland.de</a></p>
            </div>
            <p className="mt-3"><strong>Verliehen in:</strong> Deutschland</p>
            <p><strong>Eintragung:</strong> Architektenliste der Architektenkammer des Saarlandes</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Berufsrechtliche Regelungen</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Saarländisches Architektengesetz (SArchG)</li>
            <li>Satzung der Architektenkammer des Saarlandes</li>
            <li>Berufsordnung der Architektenkammer des Saarlandes</li>
          </ul>
          <p className="mt-3">Die Regelungen finden sich im Detail auf der Website der Architektenkammer des Saarlandes.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Umsatzsteuer-Identifikationsnummer</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
          <p className="font-mono">DE XXX XXX XXX (bitte durch tatsächliche USt-IdNr. ersetzen)</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Berufshaftpflichtversicherung</h2>
          <div className="space-y-2">
            <p><strong>Name und Sitz des Versicherers:</strong></p>
            <p>(Bitte ergänzen Sie hier Ihre Versicherungsdaten)</p>
            <p><strong>Geltungsraum der Versicherung:</strong> Deutschland</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Streitschlichtung</h2>
          <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
          <p><a href="https://ec.europa.eu/consumers/odr/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
          <p className="mt-3">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          <p className="mt-3">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Haftungsausschluss (Disclaimer)</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Haftung für Inhalte</h3>
          <p className="text-sm leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
            Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu 
            überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder 
            Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist 
            jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Haftung für Links</h3>
          <p className="text-sm leading-relaxed">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für 
            diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder 
            Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße 
            überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der 
            verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von 
            Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Urheberrecht</h3>
          <p className="text-sm leading-relaxed">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die 
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der 
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, 
            nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die 
            Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
            Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen 
            werden wir derartige Inhalte umgehend entfernen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Datenschutz</h2>
          <p>
            Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten 
            personenbezogene Daten erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden 
            ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
          </p>
          <p className="mt-3">
            Weitere Informationen zum Datenschutz finden Sie in unserer 
            <a href="/datenschutz" className="text-primary hover:underline ml-1">Datenschutzerklärung</a>.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">Stand: Dezember 2024</p>
        </div>
      </motion.div>
      <CursorTrail />
    </div>
  );
};

export default Impressum;