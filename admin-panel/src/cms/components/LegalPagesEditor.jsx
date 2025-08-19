import React, { useState, useEffect, useRef } from 'react';
import Icon from 'components/AppIcon';
import { contentAPI } from '../../services/api';

const LegalPagesEditor = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('impressum');
  const [activeLang, setActiveLang] = useState('de');
  const [content, setContent] = useState({
    impressum: {},
    datenschutz: {}
  });
  const [versions, setVersions] = useState({
    impressum: [],
    datenschutz: []
  });
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const editorRef = useRef(null);

  const languages = ['de', 'en', 'fr', 'it', 'es'];
  
  const defaultContent = {
    impressum: {
      de: `<h1>Impressum</h1>
<h2>Angaben gemäß § 5 TMG</h2>
<p><strong>Braun & Eyer Architekturbüro</strong><br>
Hauptstraße 123<br>
66111 Saarbrücken<br>
Deutschland</p>

<h2>Vertreten durch:</h2>
<p>Max Braun<br>
Lisa Eyer</p>

<h2>Kontakt:</h2>
<p>Telefon: +49 681 123456<br>
Telefax: +49 681 123457<br>
E-Mail: info@braunundeyer.de</p>

<h2>Registereintrag:</h2>
<p>Eintragung im Handelsregister.<br>
Registergericht: Amtsgericht Saarbrücken<br>
Registernummer: HRB 12345</p>

<h2>Umsatzsteuer-ID:</h2>
<p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br>
DE123456789</p>

<h2>Berufsbezeichnung und berufsrechtliche Regelungen:</h2>
<p>Berufsbezeichnung: Architekt<br>
Zuständige Kammer: Architektenkammer des Saarlandes<br>
Verliehen in: Deutschland</p>

<h2>Streitschlichtung</h2>
<p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
<a href="https://ec.europa.eu/consumers/odr/" target="_blank">https://ec.europa.eu/consumers/odr/</a><br>
Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>`,
      en: `<h1>Legal Notice</h1>
<h2>Information according to § 5 TMG</h2>
<p><strong>Braun & Eyer Architecture Office</strong><br>
Hauptstraße 123<br>
66111 Saarbrücken<br>
Germany</p>

<h2>Represented by:</h2>
<p>Max Braun<br>
Lisa Eyer</p>

<h2>Contact:</h2>
<p>Phone: +49 681 123456<br>
Fax: +49 681 123457<br>
Email: info@braunundeyer.de</p>`,
      fr: `<h1>Mentions légales</h1>
<h2>Informations selon § 5 TMG</h2>
<p><strong>Bureau d'architecture Braun & Eyer</strong><br>
Hauptstraße 123<br>
66111 Sarrebruck<br>
Allemagne</p>`,
      it: `<h1>Impronta</h1>
<h2>Informazioni secondo § 5 TMG</h2>
<p><strong>Studio di architettura Braun & Eyer</strong><br>
Hauptstraße 123<br>
66111 Saarbrücken<br>
Germania</p>`,
      es: `<h1>Aviso legal</h1>
<h2>Información según § 5 TMG</h2>
<p><strong>Oficina de arquitectura Braun & Eyer</strong><br>
Hauptstraße 123<br>
66111 Saarbrücken<br>
Alemania</p>`
    },
    datenschutz: {
      de: `<h1>Datenschutzerklärung</h1>
<h2>1. Datenschutz auf einen Blick</h2>
<h3>Allgemeine Hinweise</h3>
<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>

<h3>Datenerfassung auf dieser Website</h3>
<p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br>
Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>

<p><strong>Wie erfassen wir Ihre Daten?</strong><br>
Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>

<p>Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).</p>

<h2>2. Hosting</h2>
<p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
<h3>Externes Hosting</h3>
<p>Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.</p>

<h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
<h3>Datenschutz</h3>
<p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>`,
      en: `<h1>Privacy Policy</h1>
<h2>1. Privacy at a Glance</h2>
<h3>General Information</h3>
<p>The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you.</p>

<h3>Data Collection on This Website</h3>
<p><strong>Who is responsible for data collection on this website?</strong><br>
Data processing on this website is carried out by the website operator. You can find their contact details in the imprint of this website.</p>`,
      fr: `<h1>Politique de confidentialité</h1>
<h2>1. Confidentialité en un coup d'œil</h2>
<h3>Informations générales</h3>
<p>Les informations suivantes donnent un aperçu simple de ce qui arrive à vos données personnelles lorsque vous visitez ce site Web.</p>`,
      it: `<h1>Informativa sulla privacy</h1>
<h2>1. Privacy a colpo d'occhio</h2>
<h3>Informazioni generali</h3>
<p>Le seguenti informazioni forniscono una semplice panoramica di cosa succede ai tuoi dati personali quando visiti questo sito web.</p>`,
      es: `<h1>Política de privacidad</h1>
<h2>1. Privacidad de un vistazo</h2>
<h3>Información general</h3>
<p>La siguiente información proporciona una descripción general simple de lo que sucede con sus datos personales cuando visita este sitio web.</p>`
    }
  };

  useEffect(() => {
    fetchLegalContent();
    fetchVersionHistory();
  }, []);

  const fetchLegalContent = async () => {
    try {
      setLoading(true);
      
      // Try to fetch impressum and datenschutz content from the content API
      const impressumResponse = await contentAPI.getByKey('legal_impressum', 'de').catch(() => null);
      const datenschutzResponse = await contentAPI.getByKey('legal_datenschutz', 'de').catch(() => null);
      
      let loadedContent = { ...defaultContent };
      
      if (impressumResponse && impressumResponse.value) {
        try {
          const impressumData = JSON.parse(impressumResponse.value);
          loadedContent.impressum = { ...defaultContent.impressum, ...impressumData };
        } catch (e) {
          // If not JSON, treat as HTML for de language
          loadedContent.impressum.de = impressumResponse.value;
        }
      }
      
      if (datenschutzResponse && datenschutzResponse.value) {
        try {
          const datenschutzData = JSON.parse(datenschutzResponse.value);
          loadedContent.datenschutz = { ...defaultContent.datenschutz, ...datenschutzData };
        } catch (e) {
          // If not JSON, treat as HTML for de language
          loadedContent.datenschutz.de = datenschutzResponse.value;
        }
      }
      
      setContent(loadedContent);
    } catch (error) {
      console.error('Error fetching legal content:', error);
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersionHistory = async () => {
    // Version history is not implemented in the backend yet
    // For now, we'll just use local storage
    try {
      const storedVersions = localStorage.getItem('legal_versions');
      if (storedVersions) {
        setVersions(JSON.parse(storedVersions));
      }
    } catch (error) {
      console.error('Error fetching version history:', error);
    }
  };

  const saveLegalContent = async () => {
    try {
      setLoading(true);
      
      // Save current version to history
      const currentVersion = {
        timestamp: new Date().toISOString(),
        content: content[activeTab][activeLang],
        author: 'Admin',
        message: 'Manual save'
      };
      
      const newVersions = {
        ...versions,
        [activeTab]: [currentVersion, ...(versions[activeTab] || [])].slice(0, 10) // Keep last 10 versions
      };
      
      // Save impressum content
      await contentAPI.update(
        'legal_impressum',
        JSON.stringify(content.impressum),
        'de'
      );
      
      // Save datenschutz content
      await contentAPI.update(
        'legal_datenschutz',
        JSON.stringify(content.datenschutz),
        'de'
      );
      
      // Save version history to localStorage (since backend doesn't have version API yet)
      localStorage.setItem('legal_versions', JSON.stringify(newVersions));
      
      setVersions(newVersions);
      alert('Legal content saved successfully!');
    } catch (error) {
      console.error('Error saving legal content:', error);
      alert('Failed to save legal content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (value) => {
    setContent(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [activeLang]: value
      }
    }));
  };

  const restoreVersion = (version) => {
    if (window.confirm('Are you sure you want to restore this version?')) {
      updateContent(version.content);
      setShowVersionHistory(false);
    }
  };

  const insertTemplate = (template) => {
    const templates = {
      cookiePolicy: `<h2>Cookie-Richtlinie</h2>
<p>Diese Website verwendet Cookies, um Ihr Browsing-Erlebnis zu verbessern. Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden.</p>
<h3>Arten von Cookies</h3>
<ul>
<li><strong>Notwendige Cookies:</strong> Erforderlich für den Betrieb der Website</li>
<li><strong>Analytische Cookies:</strong> Helfen uns zu verstehen, wie Besucher die Website nutzen</li>
<li><strong>Marketing-Cookies:</strong> Werden verwendet, um Besuchern relevante Werbung zu zeigen</li>
</ul>`,
      gdprRights: `<h2>Ihre Rechte nach DSGVO</h2>
<ul>
<li><strong>Auskunftsrecht:</strong> Sie haben das Recht, Auskunft über Ihre gespeicherten Daten zu erhalten</li>
<li><strong>Berichtigungsrecht:</strong> Sie können die Berichtigung unrichtiger Daten verlangen</li>
<li><strong>Löschungsrecht:</strong> Sie können die Löschung Ihrer Daten verlangen</li>
<li><strong>Einschränkung der Verarbeitung:</strong> Sie können die Einschränkung der Verarbeitung verlangen</li>
<li><strong>Datenübertragbarkeit:</strong> Sie haben das Recht auf Datenübertragbarkeit</li>
<li><strong>Widerspruchsrecht:</strong> Sie können der Verarbeitung Ihrer Daten widersprechen</li>
</ul>`,
      contactForm: `<h2>Kontaktformular</h2>
<p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
<p>Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b) DSGVO.</p>`,
      analytics: `<h2>Google Analytics</h2>
<p>Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.</p>
<p>Google Analytics verwendet sogenannte Cookies. Das sind Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen.</p>`
    };

    const currentContent = content[activeTab][activeLang] || '';
    updateContent(currentContent + '\n\n' + templates[template]);
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `legal-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatButtons = [
    { command: 'bold', icon: 'Bold', title: 'Bold' },
    { command: 'italic', icon: 'Italic', title: 'Italic' },
    { command: 'underline', icon: 'Underline', title: 'Underline' },
    { command: 'strikeThrough', icon: 'Strikethrough', title: 'Strikethrough' },
    { divider: true },
    { command: 'formatBlock', value: 'h1', icon: 'Heading1', title: 'Heading 1' },
    { command: 'formatBlock', value: 'h2', icon: 'Heading2', title: 'Heading 2' },
    { command: 'formatBlock', value: 'h3', icon: 'Heading3', title: 'Heading 3' },
    { command: 'formatBlock', value: 'p', icon: 'Pilcrow', title: 'Paragraph' },
    { divider: true },
    { command: 'insertUnorderedList', icon: 'List', title: 'Bullet List' },
    { command: 'insertOrderedList', icon: 'ListOrdered', title: 'Numbered List' },
    { divider: true },
    { command: 'createLink', icon: 'Link', title: 'Insert Link' },
    { command: 'unlink', icon: 'Unlink', title: 'Remove Link' },
    { divider: true },
    { command: 'justifyLeft', icon: 'AlignLeft', title: 'Align Left' },
    { command: 'justifyCenter', icon: 'AlignCenter', title: 'Align Center' },
    { command: 'justifyRight', icon: 'AlignRight', title: 'Align Right' },
    { command: 'justifyFull', icon: 'AlignJustify', title: 'Justify' }
  ];

  const executeCommand = (command, value = null) => {
    if (command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else {
      document.execCommand(command, false, value);
    }
    
    // Update content after command execution
    if (editorRef.current) {
      updateContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Legal Pages Editor</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <Icon name="History" size={16} className="inline mr-2" />
            Version History
          </button>
          <button
            onClick={exportContent}
            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <Icon name="Download" size={16} className="inline mr-2" />
            Export
          </button>
          <button
            onClick={saveLegalContent}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Icon name="Save" size={16} className="inline mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('impressum')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'impressum'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Impressum
          </button>
          <button
            onClick={() => setActiveTab('datenschutz')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'datenschutz'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Datenschutz
          </button>
        </nav>
      </div>

      {/* Language Selector */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm font-medium text-gray-700">Language:</span>
        <div className="flex space-x-2">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 rounded text-sm ${
                activeLang === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          <Icon name={previewMode ? 'Edit' : 'Eye'} size={16} className="inline mr-1" />
          {previewMode ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Templates */}
      <div className="mb-4 flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Insert Template:</span>
        <button
          onClick={() => insertTemplate('cookiePolicy')}
          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          Cookie Policy
        </button>
        <button
          onClick={() => insertTemplate('gdprRights')}
          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          GDPR Rights
        </button>
        <button
          onClick={() => insertTemplate('contactForm')}
          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          Contact Form
        </button>
        <button
          onClick={() => insertTemplate('analytics')}
          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          Analytics
        </button>
      </div>

      {/* Editor Toolbar */}
      {!previewMode && (
        <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap items-center space-x-1">
          {formatButtons.map((btn, index) => (
            btn.divider ? (
              <div key={index} className="w-px h-6 bg-gray-300 mx-1" />
            ) : (
              <button
                key={index}
                onClick={() => executeCommand(btn.command, btn.value)}
                className="p-2 hover:bg-gray-200 rounded"
                title={btn.title}
              >
                <Icon name={btn.icon} size={16} />
              </button>
            )
          ))}
        </div>
      )}

      {/* Editor/Preview */}
      <div className={`border ${!previewMode ? 'border-t-0' : ''} border-gray-300 rounded-${previewMode ? 'lg' : 'b-lg'} p-4 min-h-[500px] bg-white`}>
        {previewMode ? (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content[activeTab][activeLang] || '' }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="outline-none prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content[activeTab][activeLang] || '' }}
            onInput={(e) => updateContent(e.target.innerHTML)}
            style={{ minHeight: '400px' }}
          />
        )}
      </div>

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Version History - {activeTab === 'impressum' ? 'Impressum' : 'Datenschutz'}</h3>
              <button
                onClick={() => setShowVersionHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              {(versions[activeTab] || []).length === 0 ? (
                <p className="text-gray-500">No version history available</p>
              ) : (
                (versions[activeTab] || []).map((version, index) => (
                  <div key={index} className="border rounded p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{new Date(version.timestamp).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">By: {version.author}</p>
                        {version.message && (
                          <p className="text-sm text-gray-500 mt-1">{version.message}</p>
                        )}
                      </div>
                      <button
                        onClick={() => restoreVersion(version)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalPagesEditor;
