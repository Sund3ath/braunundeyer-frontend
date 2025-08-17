'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ImpressumPage() {
  const params = useParams();
  const lang = params.lang || 'de';
  const [dict, setDict] = useState({});

  // Load translations
  useEffect(() => {
    import(`@/lib/locales/${lang}/translation.json`).then(module => {
      setDict(module.default);
    });
  }, [lang]);

  const breadcrumbItems = [
    { href: `/${lang}/homepage`, label: dict?.nav?.home || 'Startseite' },
    { label: 'Impressum' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Typography */}
      <div className="absolute inset-0 w-full pointer-events-none">
        <motion.div
          className="absolute text-[8rem] opacity-[0.03] text-gray-400 font-thin select-none whitespace-nowrap"
          style={{ left: "60%", top: "40%" }}
          animate={{
            x: [0, 15, -10, 0],
            y: [0, -8, 5, 0],
            rotate: [0, 0.2, -0.1, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          RECHT
        </motion.div>
        <motion.div
          className="absolute text-6xl opacity-[0.04] text-gray-400 font-thin select-none whitespace-nowrap"
          style={{ left: "10%", top: "70%" }}
          animate={{
            x: [0, -10, 8, 0],
            y: [0, 10, -6, 0],
            rotate: [0, -0.2, 0.3, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            delay: 5,
            ease: "linear"
          }}
        >
          LEGAL
        </motion.div>
      </div>

      <Header dict={dict} lang={lang} />
      
      {/* Main Content */}
      <main className="pt-20 lg:pt-24 relative z-10">
        {/* Hero Section */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumb items={breadcrumbItems} />
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
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
            <div className="space-y-12">
              {/* Company Information */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Angaben gemäß § 5 TMG</h2>
                <div className="space-y-2 text-text-secondary font-body">
                  <p className="font-semibold text-primary">Braun und Eyer Architekten GbR</p>
                  <p>Mainzerstraße 29</p>
                  <p>66111 Saarbrücken</p>
                </div>
              </motion.div>

              {/* Representatives */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Vertreten durch</h2>
                <p className="text-text-secondary font-body mb-3">Die Gesellschafter:</p>
                <ul className="list-disc ml-6 space-y-1 text-text-secondary font-body">
                  <li>Dipl.-Ing. Architekt Christian F. Braun</li>
                  <li>Dipl.-Ing. Architekt Patric Eyer</li>
                </ul>
              </motion.div>

              {/* Contact */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Kontakt</h2>
                <div className="space-y-3 text-text-secondary font-body">
                  <div className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="font-semibold text-primary">Telefon:</span>
                    <span>+49 681 95417488</span>
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
              </motion.div>

              {/* Professional Information */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
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
                      <p>66117 Saarbrücken</p>
                      <p>Tel: +49 681 954410</p>
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
              </motion.div>

              {/* Professional Regulations */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Berufsrechtliche Regelungen</h2>
                <ul className="list-disc ml-6 space-y-1 text-text-secondary font-body">
                  <li>Saarländisches Architektengesetz (SArchG)</li>
                  <li>Satzung der Architektenkammer des Saarlandes</li>
                  <li>Berufsordnung der Architektenkammer des Saarlandes</li>
                </ul>
                <p className="mt-4 text-text-secondary font-body">Die Regelungen finden sich im Detail auf der Website der Architektenkammer des Saarlandes.</p>
              </motion.div>

              {/* Tax ID */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Umsatzsteuer-Identifikationsnummer</h2>
                <p className="text-text-secondary font-body mb-2">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                <p className="font-mono text-text-primary">DE 123 456 789</p>
              </motion.div>

              {/* Insurance */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Berufshaftpflichtversicherung</h2>
                <div className="space-y-3 text-text-secondary font-body">
                  <div>
                    <p className="font-semibold text-primary">Name und Sitz des Versicherers:</p>
                    <p>AIA AG</p>
                    <p>Kaistraße 13</p>
                    <p>40221 Düsseldorf</p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary">Geltungsraum der Versicherung:</span> Deutschland und Europa
                  </div>
                </div>
              </motion.div>

              {/* Dispute Resolution */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Streitschlichtung</h2>
                <div className="space-y-3 text-text-secondary font-body">
                  <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
                  <p><a href="https://ec.europa.eu/consumers/odr/" className="text-accent hover:text-accent/80 transition-colors duration-200" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
                  <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                  <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
                </div>
              </motion.div>

              {/* Disclaimer */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
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
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer dict={dict} lang={lang} />
    </div>
  );
}