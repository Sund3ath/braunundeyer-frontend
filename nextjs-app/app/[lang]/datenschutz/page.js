'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function DatenschutzPage() {
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

      <Header dict={dict} lang={lang} />
      
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

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Speicherdauer</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, 
                      verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. 
                      Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung 
                      widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für 
                      die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche 
                      Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können 
                      eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf 
                      erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)</h3>
                    <div className="p-4 bg-accent/5 border-l-4 border-accent rounded">
                      <p className="text-sm font-body font-semibold text-primary uppercase mb-3">
                        Wenn die Datenverarbeitung auf Grundlage von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, haben Sie 
                        jederzeit das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, gegen die 
                        Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen; dies gilt auch für ein auf 
                        diese Bestimmungen gestütztes Profiling. Die jeweilige Rechtsgrundlage, auf denen eine Verarbeitung 
                        beruht, entnehmen Sie dieser Datenschutzerklärung. Wenn Sie Widerspruch einlegen, werden wir Ihre 
                        betroffenen personenbezogenen Daten nicht mehr verarbeiten, es sei denn, wir können zwingende 
                        schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten 
                        überwiegen oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von 
                        Rechtsansprüchen (Widerspruch nach Art. 21 Abs. 1 DSGVO).
                      </p>
                      <p className="text-sm font-body font-semibold text-primary uppercase mt-3">
                        Werden Ihre personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, so haben Sie das 
                        Recht, jederzeit Widerspruch gegen die Verarbeitung Sie betreffender personenbezogener Daten zum 
                        Zwecke derartiger Werbung einzulegen; dies gilt auch für das Profiling, soweit es mit solcher 
                        Direktwerbung in Verbindung steht. Wenn Sie widersprechen, werden Ihre personenbezogenen Daten 
                        anschließend nicht mehr zum Zwecke der Direktwerbung verwendet (Widerspruch nach Art. 21 Abs. 2 DSGVO).
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer 
                      Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres 
                      Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht 
                      unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Recht auf Datenübertragbarkeit</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines 
                      Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, 
                      maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten 
                      an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">SSL- bzw. TLS-Verschlüsselung</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, 
                      wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine 
                      SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die 
                      Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in 
                      Ihrer Browserzeile.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns 
                      übermitteln, nicht von Dritten mitgelesen werden.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Auskunft, Löschung und Berichtigung</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche 
                      Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den 
                      Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten. 
                      Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an 
                      uns wenden.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Recht auf Einschränkung der Verarbeitung</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. 
                      Hierzu können Sie sich jederzeit an uns wenden. Das Recht auf Einschränkung der Verarbeitung 
                      besteht in folgenden Fällen:
                    </p>
                    <ul className="list-disc ml-6 space-y-2 text-text-secondary font-body mb-3">
                      <li>
                        Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, 
                        benötigen wir in der Regel Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben Sie 
                        das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                      </li>
                      <li>
                        Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, können Sie 
                        statt der Löschung die Einschränkung der Datenverarbeitung verlangen.
                      </li>
                      <li>
                        Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung, 
                        Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen, haben Sie das Recht, statt 
                        der Löschung die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                      </li>
                      <li>
                        Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abwägung 
                        zwischen Ihren und unseren Interessen vorgenommen werden. Solange noch nicht feststeht, 
                        wessen Interessen überwiegen, haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer 
                        personenbezogenen Daten zu verlangen.
                      </li>
                    </ul>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen diese Daten – 
                      von ihrer Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung, Ausübung 
                      oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder 
                      juristischen Person oder aus Gründen eines wichtigen öffentlichen Interesses der Europäischen Union 
                      oder eines Mitgliedstaats verarbeitet werden.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Widerspruch gegen Werbe-E-Mails</h3>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von 
                      nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. 
                      Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten 
                      Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Section 4: Datenerfassung auf dieser Website */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">4. Datenerfassung auf dieser Website</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Cookies</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und richten 
                      auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung 
                      (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. 
                      Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben 
                      auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch 
                      Ihren Webbrowser erfolgt.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind technisch notwendig, da bestimmte 
                      Webseitenfunktionen ohne diese nicht funktionieren würden (z.B. die Warenkorbfunktion oder die 
                      Anzeige von Videos). Andere Cookies dienen dazu, das Nutzerverhalten auszuwerten oder Werbung 
                      anzuzeigen.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs (notwendige Cookies) oder 
                      zur Bereitstellung bestimmter, von Ihnen erwünschter Funktionen (funktionale Cookies, z. B. für 
                      die Warenkorbfunktion) oder zur Optimierung der Webseite (z.B. Cookies zur Messung des Webpublikums) 
                      erforderlich sind, werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern keine 
                      andere Rechtsgrundlage angegeben wird. Der Websitebetreiber hat ein berechtigtes Interesse an der 
                      Speicherung von Cookies zur technisch fehlerfreien und optimierten Bereitstellung seiner Dienste. 
                      Sofern eine Einwilligung zur Speicherung von Cookies abgefragt wurde, erfolgt die Speicherung der 
                      betreffenden Cookies ausschließlich auf Grundlage dieser Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); 
                      die Einwilligung ist jederzeit widerrufbar.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und 
                      Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell 
                      ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren. 
                      Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Server-Log-Dateien</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
                      Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-text-secondary font-body mb-3">
                      <li>Browsertyp und Browserversion</li>
                      <li>verwendetes Betriebssystem</li>
                      <li>Referrer URL</li>
                      <li>Hostname des zugreifenden Rechners</li>
                      <li>Uhrzeit der Serveranfrage</li>
                      <li>IP-Adresse</li>
                    </ul>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der 
                      Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und 
                      der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Kontaktformular</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
                      Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der 
                      Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht 
                      ohne Ihre Einwilligung weiter.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre 
                      Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher 
                      Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem 
                      berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen 
                      (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern 
                      diese abgefragt wurde.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung 
                      auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung 
                      entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche 
                      Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Anfrage per E-Mail, Telefon oder Telefax</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller 
                      daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres 
                      Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung 
                      weiter.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre 
                      Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher 
                      Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem 
                      berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen 
                      (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern 
                      diese abgefragt wurde.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns, bis Sie uns zur 
                      Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die 
                      Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihres Anliegens). Zwingende 
                      gesetzliche Bestimmungen – insbesondere gesetzliche Aufbewahrungsfristen – bleiben unberührt.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Section 5: Soziale Medien */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">5. Soziale Medien</h2>
                
                <div>
                  <h3 className="text-lg font-heading font-medium text-primary mb-3">Social-Media-Plugins mit Shariff</h3>
                  <p className="text-text-secondary font-body leading-relaxed mb-3">
                    Auf dieser Website werden derzeit keine Plugins von sozialen Medien verwendet (z. B. Facebook, 
                    Twitter, Instagram, Pinterest, XING, LinkedIn, Tumblr).
                  </p>
                  <p className="text-text-secondary font-body leading-relaxed">
                    Sollten wir in Zukunft Social-Media-Plugins einsetzen, verwenden wir diese nur zusammen mit der 
                    sogenannten „Shariff"-Lösung. Diese Anwendung verhindert, dass die auf dieser Website integrierten 
                    Plugins Daten schon beim ersten Betreten der Seite an den jeweiligen Anbieter übertragen.
                  </p>
                </div>
              </motion.div>

              {/* Section 6: Analyse-Tools und Werbung */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">6. Analyse-Tools und Werbung</h2>
                
                <div>
                  <h3 className="text-lg font-heading font-medium text-primary mb-3">Google Analytics</h3>
                  <p className="text-text-secondary font-body leading-relaxed mb-3">
                    Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die Google Ireland Limited („Google"), 
                    Gordon House, Barrow Street, Dublin 4, Irland.
                  </p>
                  <p className="text-text-secondary font-body leading-relaxed mb-3">
                    Google Analytics ermöglicht es dem Websitebetreiber, das Verhalten der Websitebesucher zu analysieren. Hierbei erhält der 
                    Websitebetreiber verschiedene Nutzungsdaten, wie z.B. Seitenaufrufe, Verweildauer, verwendete Betriebssysteme und Herkunft 
                    des Nutzers. Diese Daten werden von Google ggf. in einem Profil zusammengefasst, das dem jeweiligen Nutzer bzw. dessen 
                    Endgerät zugeordnet ist.
                  </p>
                  <p className="text-text-secondary font-body leading-relaxed mb-3">
                    Google Analytics verwendet Technologien, die die Wiedererkennung des Nutzers zum Zwecke der Analyse des Nutzerverhaltens 
                    ermöglichen (z.B. Cookies oder Device-Fingerprinting). Die von Google erfassten Informationen über die Benutzung dieser 
                    Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.
                  </p>
                  <p className="text-text-secondary font-body leading-relaxed mb-3">
                    Die Nutzung dieses Analyse-Tools erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein 
                    berechtigtes Interesse an der Analyse des Nutzerverhaltens, um sowohl sein Webangebot als auch seine Werbung zu optimieren. 
                    Sofern eine entsprechende Einwilligung abgefragt wurde (z. B. eine Einwilligung zur Speicherung von Cookies), erfolgt die 
                    Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO; die Einwilligung ist jederzeit widerrufbar.
                  </p>
                  <p className="text-text-secondary font-body leading-relaxed">
                    Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der EU-Kommission gestützt. Details finden Sie hier: 
                    <a href="https://privacy.google.com/businesses/controllerterms/mccs/" target="_blank" rel="noopener noreferrer" 
                       className="text-accent hover:text-accent/80 transition-colors duration-200 ml-1">
                      https://privacy.google.com/businesses/controllerterms/mccs/
                    </a>
                  </p>
                </div>
              </motion.div>

              {/* Section 7: Plugins und Tools */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">7. Plugins und Tools</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Google Maps</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Diese Seite nutzt den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited („Google"), 
                      Gordon House, Barrow Street, Dublin 4, Irland.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Diese 
                      Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. 
                      Der Anbieter dieser Seite hat keinen Einfluss auf diese Datenübertragung.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote 
                      und an einer leichten Auffindbarkeit der von uns auf der Website angegebenen Orte. Dies stellt ein 
                      berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar. Sofern eine entsprechende Einwilligung 
                      abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO; 
                      die Einwilligung ist jederzeit widerrufbar.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Mehr Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von Google: 
                      <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer" 
                         className="text-accent hover:text-accent/80 transition-colors duration-200 ml-1">
                        https://policies.google.com/privacy?hl=de
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-3">Google Web Fonts (lokales Hosting)</h3>
                    <p className="text-text-secondary font-body leading-relaxed mb-3">
                      Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Web Fonts, die von 
                      Google bereitgestellt werden. Die Google Fonts sind lokal installiert. Eine Verbindung zu Servern 
                      von Google findet dabei nicht statt.
                    </p>
                    <p className="text-text-secondary font-body leading-relaxed">
                      Weitere Informationen zu Google Web Fonts finden Sie unter{' '}
                      <a href="https://developers.google.com/fonts/faq" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors duration-200">
                        https://developers.google.com/fonts/faq
                      </a>{' '}
                      und in der Datenschutzerklärung von Google:{' '}
                      <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors duration-200">
                        https://policies.google.com/privacy?hl=de
                      </a>.
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
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">Datenschutz</h2>
                <div className="space-y-3 text-text-secondary font-body">
                  <p>
                    Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten 
                    personenbezogene Daten erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden 
                    ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
                  </p>
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