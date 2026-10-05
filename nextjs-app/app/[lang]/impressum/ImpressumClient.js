'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ImpressumClient({ dict, lang, navigationSettings }) {
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

      <Header dict={dict} lang={lang} navigationSettings={navigationSettings} />
      
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
                  <p><strong className="text-text-primary">Braun & Eyer Architekten GbR</strong></p>
                  <p>Mainzerstrasse 29</p>
                  <p>66111 Saarbrücken</p>
                  <p>Deutschland</p>
                </div>
              </motion.div>
              
              {/* Partners */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Vertreten durch</h2>
                <div className="space-y-4 text-text-secondary font-body">
                  <div>
                    <p><strong className="text-text-primary">Christian F. Braun</strong></p>
                    <p>Diplom-Ingenieur, Freier Architekt</p>
                    <p>Mitglied der Architektenkammer des Saarlandes</p>
                  </div>
                  <div>
                    <p><strong className="text-text-primary">Patric Eyer</strong></p>
                    <p>Diplom-Ingenieur, Freier Architekt</p>
                    <p>Mitglied der Architektenkammer des Saarlandes</p>
                  </div>
                </div>
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
                <div className="space-y-2 text-text-secondary font-body">
                  <p>
                    <strong className="text-text-primary">Telefon:</strong>{' '}
                    <a href="tel:+4968195417488" className="text-accent hover:underline">
                      +49 681 954 174 88
                    </a>
                  </p>
                  <p>
                    <strong className="text-text-primary">Telefax:</strong>{' '}
                    <a href="tel:+4968195417487" className="text-accent hover:underline">
                      +49 681 954 174 87
                    </a>
                  </p>
                  <p>
                    <strong className="text-text-primary">E-Mail:</strong>{' '}
                    <a href="mailto:info@braunundeyer.de" className="text-accent hover:underline">
                      info@braunundeyer.de
                    </a>
                  </p>
                </div>
              </motion.div>
              
              {/* Tax Information */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Umsatzsteuer</h2>
                <div className="space-y-2 text-text-secondary font-body">
                  <p>
                    <strong className="text-text-primary">Umsatzsteuer-Identifikationsnummer:</strong><br />
                    DE 202 945 356
                  </p>
                </div>
              </motion.div>
              
              {/* Professional Registration */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Berufsrechtliche Regelungen</h2>
                <div className="space-y-4 text-text-secondary font-body">
                  <div>
                    <p><strong className="text-text-primary">Berufsbezeichnung:</strong> Architekt</p>
                    <p>Verliehen durch: Bundesrepublik Deutschland</p>
                  </div>
                  <div>
                    <p><strong className="text-text-primary">Zuständige Kammer:</strong></p>
                    <p>Architektenkammer des Saarlandes</p>
                    <p>Gerberstraße 21</p>
                    <p>66111 Saarbrücken</p>
                    <p>
                      <a href="https://www.aksaarland.de" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        www.aksaarland.de
                      </a>
                    </p>
                  </div>
                  <div>
                    <p><strong className="text-text-primary">Es gelten folgende berufsrechtliche Regelungen:</strong></p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>Architektengesetz des Saarlandes (SAKG)</li>
                      <li>Berufsordnung der Architektenkammer des Saarlandes</li>
                      <li>Honorarordnung für Architekten und Ingenieure (HOAI)</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              {/* Insurance */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Haftpflichtversicherung</h2>
                <div className="space-y-2 text-text-secondary font-body">
                  <p>Berufshaftpflichtversicherung besteht über:</p>
                  <p><strong className="text-text-primary">AIA AG</strong></p>
                  <p>Goetheallee 9</p>
                  <p>80637 München</p>
                </div>
              </motion.div>
              
              {/* Disclaimer */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Haftungsausschluss</h2>
                <div className="space-y-4 text-text-secondary font-body">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-text-primary mb-2">Haftung für Inhalte</h3>
                    <p className="text-sm leading-relaxed">
                      Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                      Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
                      Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                      nach den allgemeinen Gesetzen verantwortlich.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-medium text-text-primary mb-2">Haftung für Links</h3>
                    <p className="text-sm leading-relaxed">
                      Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
                      Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                      Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                      Seiten verantwortlich.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-medium text-text-primary mb-2">Urheberrecht</h3>
                    <p className="text-sm leading-relaxed">
                      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                      dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der 
                      Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung 
                      des jeweiligen Autors bzw. Erstellers.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* EU Dispute Resolution */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">EU-Streitschlichtung</h2>
                <div className="space-y-2 text-text-secondary font-body">
                  <p className="text-sm leading-relaxed">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                    <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      https://ec.europa.eu/consumers/odr
                    </a>
                  </p>
                  <p className="text-sm leading-relaxed">
                    Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, 
                    an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
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