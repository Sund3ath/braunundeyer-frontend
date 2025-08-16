import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import SEO from 'components/SEO';
import CursorTrail from 'components/ui/CursorTrail';
import BackgroundTypography from 'components/ui/BackgroundTypography';
import Footer from 'components/Footer';
import { generateBreadcrumbSchema } from 'utils/structuredData';

const Impressum = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentLang = location.pathname.split('/')[1] || i18n.language || 'de';
  
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
      <CursorTrail />
      
      {/* Main Content */}
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border relative z-base">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumb />
            <div className="mt-6">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
                Impressum
              </h1>
              <p className="text-lg text-text-secondary font-body max-w-2xl">
                Rechtliche Informationen und Angaben gemäß § 5 TMG
              </p>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-16 lg:py-24 relative z-base">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
            <div className="space-y-12">
              {/* Company Information */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Angaben gemäß § 5 TMG</h2>
                <div className="space-y-2 text-text-secondary font-body">
                  <p className="font-semibold text-primary">Braun und Eyer Architekten GbR</p>
                  <p>Mainzerstraße 29</p>
                  <p>66111 Saarbrücken</p>
                </div>
              </div>

              {/* Representatives */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Vertreten durch</h2>
                <p className="text-text-secondary font-body mb-3">Die Gesellschafter:</p>
                <ul className="list-disc ml-6 space-y-1 text-text-secondary font-body">
                  <li>Dipl.-Ing. Architekt Herr Braun</li>
                  <li>Dipl.-Ing. Architekt Herr Eyer</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Kontakt</h2>
                <div className="space-y-3 text-text-secondary font-body">
                  <div className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="font-semibold text-primary">Telefon:</span>
                    <span>0681 - 95 41 74 88</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="font-semibold text-primary">E-Mail:</span>
                    <span>info@braunundeyer.de</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="font-semibold text-primary">Website:</span>
                    <span>www.braunundeyer.de</span>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
                <div className="space-y-4 text-text-secondary font-body">
                  <div>
                    <span className="font-semibold text-primary">Berufsbezeichnung:</span> Architekt
                  </div>
                  <div>
                    <p className="font-semibold text-primary mb-2">Zuständige Kammer:</p>
                    <div className="ml-4 space-y-1">
                      <p>Architektenkammer des Saarlandes</p>
                      <p>Neumarkt 11</p>
                      <p>66111 Saarbrücken</p>
                      <p>Tel: 0681 - 95 44 10</p>
                      <p><a href="https://www.aksaarland.de" className="text-accent hover:text-accent/80 transition-colors duration-200" target="_blank" rel="noopener noreferrer">www.aksaarland.de</a></p>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-primary">Verliehen in:</span> Deutschland
                  </div>
                  <div>
                    <span className="font-semibold text-primary">Eintragung:</span> Architektenliste der Architektenkammer des Saarlandes
                  </div>
                </div>
              </div>

              {/* Professional Regulations */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Berufsrechtliche Regelungen</h2>
                <ul className="list-disc ml-6 space-y-1 text-text-secondary font-body">
                  <li>Saarländisches Architektengesetz (SArchG)</li>
                  <li>Satzung der Architektenkammer des Saarlandes</li>
                  <li>Berufsordnung der Architektenkammer des Saarlandes</li>
                </ul>
                <p className="mt-4 text-text-secondary font-body">Die Regelungen finden sich im Detail auf der Website der Architektenkammer des Saarlandes.</p>
              </div>

              {/* Tax ID */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Umsatzsteuer-Identifikationsnummer</h2>
                <p className="text-text-secondary font-body mb-2">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                <p className="font-mono text-text-primary">DE XXX XXX XXX (bitte durch tatsächliche USt-IdNr. ersetzen)</p>
              </div>

              {/* Insurance */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Berufshaftpflichtversicherung</h2>
                <div className="space-y-3 text-text-secondary font-body">
                  <div>
                    <p className="font-semibold text-primary">Name und Sitz des Versicherers:</p>
                    <p>(Bitte ergänzen Sie hier Ihre Versicherungsdaten)</p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary">Geltungsraum der Versicherung:</span> Deutschland
                  </div>
                </div>
              </div>

              {/* Dispute Resolution */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Streitschlichtung</h2>
                <div className="space-y-3 text-text-secondary font-body">
                  <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
                  <p><a href="https://ec.europa.eu/consumers/odr/" className="text-accent hover:text-accent/80 transition-colors duration-200" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
                  <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                  <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Haftungsausschluss (Disclaimer)</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Haftung für Inhalte</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
            Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu 
            überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder 
            Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist 
                      jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
                      Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Haftung für Links</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für 
            diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder 
            Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße 
            überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der 
                      verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von 
                      Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Urheberrecht</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die 
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der 
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, 
            nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die 
            Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
                      Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen 
                      werden wir derartige Inhalte umgehend entfernen.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Protection */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Datenschutz</h2>
                <div className="space-y-3 text-text-secondary font-body">
                  <p>
                    Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten 
                    personenbezogene Daten erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden 
                    ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
                  </p>
                  <p>
                    Weitere Informationen zum Datenschutz finden Sie in unserer 
                    <Link to={`/${currentLang}/datenschutz`} className="text-accent hover:text-accent/80 transition-colors duration-200 ml-1">Datenschutzerklärung</Link>.
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-text-secondary font-body">Stand: Dezember 2024</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Impressum;