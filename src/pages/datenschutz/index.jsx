import React from 'react';
import { motion } from 'framer-motion';
import Header from 'components/ui/Header';
import SEO from 'components/SEO';
import { generateBreadcrumbSchema } from 'utils/structuredData';

const Datenschutz = () => {
  const breadcrumbs = [
    { name: 'Home', url: 'https://braunundeyer.de' },
    { name: 'Datenschutz', url: 'https://braunundeyer.de/datenschutz' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Datenschutzerklärung | Braun & Eyer Architekturbüro"
        description="Datenschutzerklärung der Braun und Eyer Architekten GbR. Informationen zum Datenschutz gemäß DSGVO."
        keywords="Datenschutz, DSGVO, Datenschutzerklärung, Braun Eyer Architekturbüro"
        structuredData={generateBreadcrumbSchema(breadcrumbs)}
        noindex={true}
      />
      <Header />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-20 max-w-4xl"
      >
        <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Allgemeine Hinweise</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
            Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit 
            denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz 
            entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Datenerfassung auf dieser Website</h3>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
            können Sie dem Impressum dieser Website entnehmen.
          </p>

          <h4 className="text-lg font-semibold mt-4 mb-2">Wie erfassen wir Ihre Daten?</h4>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich 
            z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere 
            IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem 
            oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese 
            Website betreten.
          </p>

          <h4 className="text-lg font-semibold mt-4 mb-2">Wofür nutzen wir Ihre Daten?</h4>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. 
            Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
          </p>

          <h4 className="text-lg font-semibold mt-4 mb-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer 
            gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung 
            oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt 
            haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das 
            Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten 
            zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. Hosting und Content Delivery Networks (CDN)</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Externes Hosting</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, 
            die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann 
            es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, 
            Kontaktdaten, Namen, Webseitenzugriffe und sonstige Daten, die über eine Website generiert werden, 
            handeln.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und 
            bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und 
            effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter 
            (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Unser Hoster wird Ihre Daten nur insoweit verarbeiten, wie dies zur Erfüllung seiner 
            Leistungspflichten erforderlich ist und unsere Weisungen in Bezug auf diese Daten befolgen.
          </p>

          <h4 className="text-lg font-semibold mt-4 mb-2">Abschluss eines Vertrages über Auftragsverarbeitung</h4>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Um die datenschutzkonforme Verarbeitung zu gewährleisten, haben wir einen Vertrag über 
            Auftragsverarbeitung mit unserem Hoster geschlossen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Datenschutz</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
            Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften 
            sowie dieser Datenschutzerklärung.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. 
            Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. 
            Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. 
            Sie erläutert auch, wie und zu welchem Zweck das geschieht.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) 
            Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist 
            nicht möglich.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Hinweis zur verantwortlichen Stelle</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
          </p>
          <div className="mb-4 pl-4 text-gray-700">
            <p><strong>Braun und Eyer Architekten GbR</strong></p>
            <p>Mainzerstraße 29</p>
            <p>66111 Saarbrücken</p>
            <p className="mt-2">Telefon: +49 (0) 681 - 954 174 88</p>
            <p>E-Mail: info@braunundeyer.de</p>
          </div>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit 
            anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, 
            E-Mail-Adressen o. Ä.) entscheidet.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Speicherdauer</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, 
            verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. 
            Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung 
            widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für 
            die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche 
            Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können 
            eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf 
            erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)</h3>
          <div className="mb-4 p-4 bg-gray-100 border-l-4 border-primary">
            <p className="text-sm leading-relaxed font-semibold uppercase">
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
            <p className="text-sm leading-relaxed font-semibold uppercase mt-3">
              Werden Ihre personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, so haben Sie das 
              Recht, jederzeit Widerspruch gegen die Verarbeitung Sie betreffender personenbezogener Daten zum 
              Zwecke derartiger Werbung einzulegen; dies gilt auch für das Profiling, soweit es mit solcher 
              Direktwerbung in Verbindung steht. Wenn Sie widersprechen, werden Ihre personenbezogenen Daten 
              anschließend nicht mehr zum Zwecke der Direktwerbung verwendet (Widerspruch nach Art. 21 Abs. 2 DSGVO).
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer 
            Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres 
            Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht 
            unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Recht auf Datenübertragbarkeit</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines 
            Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, 
            maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten 
            an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">SSL- bzw. TLS-Verschlüsselung</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, 
            wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine 
            SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die 
            Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in 
            Ihrer Browserzeile.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns 
            übermitteln, nicht von Dritten mitgelesen werden.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Auskunft, Löschung und Berichtigung</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche 
            Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den 
            Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten. 
            Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an 
            uns wenden.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Recht auf Einschränkung der Verarbeitung</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. 
            Hierzu können Sie sich jederzeit an uns wenden. Das Recht auf Einschränkung der Verarbeitung 
            besteht in folgenden Fällen:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-2">
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
          <p className="mb-4 text-gray-700 leading-relaxed">
            Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen diese Daten – 
            von ihrer Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung, Ausübung 
            oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder 
            juristischen Person oder aus Gründen eines wichtigen öffentlichen Interesses der Europäischen Union 
            oder eines Mitgliedstaats verarbeitet werden.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Widerspruch gegen Werbe-E-Mails</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von 
            nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. 
            Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten 
            Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Datenerfassung auf dieser Website</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Cookies</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und richten 
            auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung 
            (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. 
            Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben 
            auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch 
            Ihren Webbrowser erfolgt.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind technisch notwendig, da bestimmte 
            Webseitenfunktionen ohne diese nicht funktionieren würden (z.B. die Warenkorbfunktion oder die 
            Anzeige von Videos). Andere Cookies dienen dazu, das Nutzerverhalten auszuwerten oder Werbung 
            anzuzeigen.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
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
          <p className="mb-4 text-gray-700 leading-relaxed">
            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und 
            Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell 
            ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren. 
            Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Server-Log-Dateien</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
            Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der 
            Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und 
            der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Kontaktformular</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
            Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der 
            Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht 
            ohne Ihre Einwilligung weiter.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre 
            Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher 
            Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem 
            berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen 
            (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern 
            diese abgefragt wurde.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung 
            auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung 
            entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche 
            Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Anfrage per E-Mail, Telefon oder Telefax</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller 
            daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres 
            Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung 
            weiter.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre 
            Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher 
            Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem 
            berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen 
            (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern 
            diese abgefragt wurde.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns, bis Sie uns zur 
            Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die 
            Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihres Anliegens). Zwingende 
            gesetzliche Bestimmungen – insbesondere gesetzliche Aufbewahrungsfristen – bleiben unberührt.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Soziale Medien</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Social-Media-Plugins mit Shariff</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Auf dieser Website werden derzeit keine Plugins von sozialen Medien verwendet (z. B. Facebook, 
            Twitter, Instagram, Pinterest, XING, LinkedIn, Tumblr).
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Sollten wir in Zukunft Social-Media-Plugins einsetzen, verwenden wir diese nur zusammen mit der 
            sogenannten „Shariff"-Lösung. Diese Anwendung verhindert, dass die auf dieser Website integrierten 
            Plugins Daten schon beim ersten Betreten der Seite an den jeweiligen Anbieter übertragen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Analyse-Tools und Werbung</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Strato Web Analytics</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Diese Website nutzt die Analysedienste von Strato Webanalytics. Anbieter ist die Strato AG, 
            Pascalstraße 10, 10587 Berlin.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Im Rahmen der Analysen mit Strato können u. a. Besucherzahlen und –verhalten (z. B. Anzahl der 
            Seitenaufrufe, Dauer eines Webseitenbesuchs, Absprungraten), Besucherquellen (d. h., von welcher 
            Seite der Besucher kommt), Besucherstandorte sowie technische Daten (Browser- und 
            Betriebssystemversionen) analysiert werden. Zu diesem Zweck speichert Strato insbesondere 
            folgende Daten:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
            <li>Referrer (zuvor besuchte Webseite)</li>
            <li>angeforderte Webseite oder Datei</li>
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>verwendeter Gerätetyp</li>
            <li>Uhrzeit des Zugriffs</li>
            <li>IP-Adresse in anonymisierter Form (wird nur zur Feststellung des Orts des Zugriffs verwendet)</li>
          </ul>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die Datenerfassung erfolgt laut Strato vollständig anonymisiert, sodass sie nicht zu einzelnen 
            Personen zurückverfolgt werden kann. Cookies werden von Strato-Webanalytics nicht gespeichert.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Die Speicherung und Analyse der Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. 
            Der Websitebetreiber hat ein berechtigtes Interesse an der statistischen Analyse des 
            Nutzerverhaltens, um sowohl sein Webangebot als auch seine Werbung zu optimieren. Sofern eine 
            entsprechende Einwilligung abgefragt wurde (z. B. eine Einwilligung zur Speicherung von Cookies), 
            erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO; die 
            Einwilligung ist jederzeit widerrufbar.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Wir haben mit Strato einen Vertrag zur Auftragsverarbeitung abgeschlossen. Dieser Vertrag soll 
            den datenschutzkonformen Umgang mit Ihren personenbezogenen Daten durch Strato sicherstellen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Plugins und Tools</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Google Web Fonts (lokales Hosting)</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Web Fonts, die von 
            Google bereitgestellt werden. Die Google Fonts sind lokal installiert. Eine Verbindung zu Servern 
            von Google findet dabei nicht statt.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Weitere Informationen zu Google Web Fonts finden Sie unter{' '}
            <a href="https://developers.google.com/fonts/faq" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              https://developers.google.com/fonts/faq
            </a>{' '}
            und in der Datenschutzerklärung von Google:{' '}
            <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              https://policies.google.com/privacy?hl=de
            </a>.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">Stand: Dezember 2024</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Datenschutz;