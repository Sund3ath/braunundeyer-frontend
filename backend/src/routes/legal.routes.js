import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/db-simple.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get legal page content (impressum or datenschutz)
router.get('/:page', optionalAuth, async (req, res) => {
  try {
    const { page } = req.params; // 'impressum' or 'datenschutz'
    const { language = 'de' } = req.query;
    
    if (!['impressum', 'datenschutz'].includes(page)) {
      return res.status(400).json({ error: 'Invalid legal page. Must be impressum or datenschutz' });
    }
    
    const key = `legal_${page}`;
    
    // Try to get legal content from content table
    const legalContent = await db.get(
      'SELECT * FROM content WHERE key = ? AND language = ?',
      [key, language]
    );
    
    if (legalContent && legalContent.value) {
      res.json({
        value: legalContent.value,
        language: legalContent.language,
        updated_at: legalContent.updated_at
      });
    } else {
      // Return default legal content
      res.json({
        value: JSON.stringify(getDefaultLegalContent(page, language)),
        language,
        isDefault: true
      });
    }
  } catch (error) {
    logger.error('Get legal content error:', error);
    res.status(500).json({ error: 'Failed to fetch legal content' });
  }
});

// Update legal page content
router.put('/:page',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('value').notEmpty(),
    body('language').optional().isIn(['de', 'en', 'fr', 'it', 'es'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { page } = req.params;
      const { value, language = 'de' } = req.body;
      
      if (!['impressum', 'datenschutz'].includes(page)) {
        return res.status(400).json({ error: 'Invalid legal page. Must be impressum or datenschutz' });
      }
      
      const key = `legal_${page}`;
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
      
      // Use UPSERT pattern
      await db.run(
        `INSERT INTO content (key, value, language, updated_by, created_at, updated_at) 
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT(key, language) 
         DO UPDATE SET 
           value = excluded.value,
           updated_by = excluded.updated_by,
           updated_at = CURRENT_TIMESTAMP`,
        [key, valueToStore, language, req.user.id]
      );
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, details) VALUES (?, ?, ?, ?)',
        [req.user.id, 'update', 'legal', JSON.stringify({ page, language })]
      );
      
      logger.info(`Legal page ${page} updated (${language}) by ${req.user.email}`);
      
      res.json({
        message: 'Legal content updated successfully',
        page,
        language
      });
    } catch (error) {
      logger.error('Update legal content error:', error);
      res.status(500).json({ error: 'Failed to update legal content' });
    }
  }
);

// Get all legal pages versions (for history)
router.get('/:page/versions', 
  authenticate,
  authorize('admin', 'editor'),
  async (req, res) => {
    try {
      const { page } = req.params;
      const { language = 'de' } = req.query;
      
      if (!['impressum', 'datenschutz'].includes(page)) {
        return res.status(400).json({ error: 'Invalid legal page' });
      }
      
      // For now, return empty array as we don't have versioning implemented in DB
      // This could be extended to track versions in a separate table
      res.json({
        versions: [],
        page,
        language
      });
    } catch (error) {
      logger.error('Get legal versions error:', error);
      res.status(500).json({ error: 'Failed to fetch versions' });
    }
  }
);

// Get default legal content
function getDefaultLegalContent(page, language = 'de') {
  const defaults = {
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
DE123456789</p>`,
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
<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>

<h2>2. Hosting</h2>
<p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
<h3>Externes Hosting</h3>
<p>Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.</p>`,
      en: `<h1>Privacy Policy</h1>
<h2>1. Privacy at a Glance</h2>
<h3>General Information</h3>
<p>The following information provides a simple overview of what happens to your personal data when you visit this website.</p>`,
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
  
  return defaults[page]?.[language] || defaults[page]?.['de'] || '';
}

export default router;