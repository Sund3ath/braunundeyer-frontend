'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function DatenschutzClient({ dict, lang, navigationSettings }) {
  const breadcrumbItems = [
    { href: `/${lang}/homepage`, label: dict?.nav?.home || 'Startseite' },
    { label: 'Datenschutz' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Typography */}
      <div className="absolute inset-0 w-full pointer-events-none">
        <motion.div
          className="absolute text-[9rem] opacity-[0.03] text-gray-400 font-thin select-none whitespace-nowrap"
          style={{ left: "65%", top: "35%" }}
          animate={{
            x: [0, 18, -12, 0],
            y: [0, -10, 7, 0],
            rotate: [0, 0.25, -0.15, 0],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          SCHUTZ
        </motion.div>
        <motion.div
          className="absolute text-7xl opacity-[0.04] text-gray-400 font-thin select-none whitespace-nowrap"
          style={{ left: "8%", top: "65%" }}
          animate={{
            x: [0, -12, 10, 0],
            y: [0, 12, -8, 0],
            rotate: [0, -0.3, 0.4, 0],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            delay: 6,
            ease: "linear"
          }}
        >
          DATEN
        </motion.div>
      </div>

      <Header dict={dict.translation || dict} lang={lang} navigationSettings={navigationSettings} />
      
      {/* Main Content */}
      <main className="pt-20 lg:pt-24 relative z-10">
        {/* Hero Section */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-6">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
                Datenschutzerklärung
              </h1>
              <p className="text-lg text-text-secondary font-body max-w-2xl">
                Informationen zum Schutz Ihrer persönlichen Daten gemäß DSGVO
              </p>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              
              {/* Section 1: Datenschutz auf einen Blick */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">1. Datenschutz auf einen Blick</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Allgemeine Hinweise</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
                      Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit 
                      denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz 
                      entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Datenerfassung auf dieser Website</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-body font-semibold text-primary mb-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
                        <p className="text-text-secondary font-body leading-relaxed">
                          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                          können Sie dem Impressum dieser Website entnehmen.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-body font-semibold text-primary mb-2">Wie erfassen wir Ihre Daten?</h4>
                        <p className="text-text-secondary font-body leading-relaxed mb-3">
                          Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich 
                          z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                        </p>
                        <p className="text-text-secondary font-body leading-relaxed">
                          Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere 
                          IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem 
                          oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese 
                          Website betreten.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-body font-semibold text-primary mb-2">Wofür nutzen wir Ihre Daten?</h4>
                        <p className="text-text-secondary font-body leading-relaxed">
                          Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. 
                          Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-body font-semibold text-primary mb-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
                        <p className="text-text-secondary font-body leading-relaxed mb-3">
                          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer 
                          gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung 
                          oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt 
                          haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das 
                          Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten 
                          zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                        </p>
                        <p className="text-text-secondary font-body leading-relaxed">
                          Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section 2: Hosting */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">2. Hosting und Content Delivery Networks (CDN)</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Externes Hosting</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, 
                      die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann 
                      es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, 
                      Kontaktdaten, Namen, Webseitenzugriffe und sonstige Daten, die über eine Website generiert werden, 
                      handeln.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und 
                      bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und 
                      effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter 
                      (Art. 6 Abs. 1 lit. f DSGVO).
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Unser Hoster wird Ihre Daten nur insoweit verarbeiten, wie dies zur Erfüllung seiner 
                      Leistungspflichten erforderlich ist und unsere Weisungen in Bezug auf diese Daten befolgen.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-body font-semibold text-primary mb-2">Abschluss eines Vertrages über Auftragsverarbeitung</h4>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Um die datenschutzkonforme Verarbeitung zu gewährleisten, haben wir einen Vertrag über 
                      Auftragsverarbeitung mit unserem Hoster geschlossen.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Section 3: Allgemeine Hinweise und Pflichtinformationen */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">3. Allgemeine Hinweise und Pflichtinformationen</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Datenschutz</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
                      Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften 
                      sowie dieser Datenschutzerklärung.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. 
                      Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. 
                      Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. 
                      Sie erläutert auch, wie und zu welchem Zweck das geschieht.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) 
                      Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist 
                      nicht möglich.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Hinweis zur verantwortlichen Stelle</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                    </p>
                    <div className="ml-4 space-y-1 text-text-secondary font-body mb-3">
                      <p className="font-semibold text-primary">Braun und Eyer Architekten GbR</p>
                      <p>Mainzerstraße 29</p>
                      <p>66111 Saarbrücken</p>
                      <p className="mt-2">Telefon: +49 681 95417488</p>
                      <p>E-Mail: info@braunundeyer.de</p>
                    </div>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit 
                      anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, 
                      E-Mail-Adressen o. Ä.) entscheidet.
                    </p>
                  </div>

                  {/* Additional sections condensed for brevity */}
                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Ihre Rechte</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung 
                      Ihrer personenbezogenen Daten. Bei Fragen wenden Sie sich jederzeit an uns.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Data Protection Link to Impressum */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Kontakt</h2>
                <div className="space-y-3 text-text-secondary font-body">
                  <p>
                    Weitere Informationen zu unseren Kontaktdaten finden Sie in unserem{' '}
                    <Link href={`/${lang}/impressum`} className="text-accent hover:text-accent/80 transition-colors duration-200">
                      Impressum
                    </Link>.
                  </p>
                </div>
              </motion.div>

              {/* Last Updated */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-text-secondary font-body">Stand: Dezember 2024</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer dict={dict} lang={lang} />
    </div>
  );
}