import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/db-simple.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get footer data
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { language = 'de' } = req.query;
    
    // Try to get footer data from content table
    const footerContent = await db.get(
      'SELECT * FROM content WHERE key = ? AND language = ?',
      ['footer', language]
    );
    
    if (footerContent && footerContent.value) {
      res.json({
        value: footerContent.value,
        language: footerContent.language,
        updated_at: footerContent.updated_at
      });
    } else {
      // Return default footer structure
      res.json({
        value: JSON.stringify(getDefaultFooterData()),
        language,
        isDefault: true
      });
    }
  } catch (error) {
    logger.error('Get footer error:', error);
    res.status(500).json({ error: 'Failed to fetch footer data' });
  }
});

// Update footer data
router.put('/',
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

      const { value, language = 'de' } = req.body;
      
      // Validate that value is valid JSON if it's a string
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch (e) {
          return res.status(400).json({ error: 'Invalid JSON in value field' });
        }
      }
      
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
        ['footer', valueToStore, language, req.user.id]
      );
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, details) VALUES (?, ?, ?, ?)',
        [req.user.id, 'update', 'footer', JSON.stringify({ language })]
      );
      
      logger.info(`Footer updated (${language}) by ${req.user.email}`);
      
      res.json({
        message: 'Footer updated successfully',
        language
      });
    } catch (error) {
      logger.error('Update footer error:', error);
      res.status(500).json({ error: 'Failed to update footer' });
    }
  }
);

// Get default footer data structure
function getDefaultFooterData() {
  return {
    companyInfo: {
      name: {
        de: 'Braun & Eyer Architekturbüro',
        en: 'Braun & Eyer Architecture Office',
        fr: 'Bureau d\'architecture Braun & Eyer',
        it: 'Studio di architettura Braun & Eyer',
        es: 'Oficina de arquitectura Braun & Eyer'
      },
      description: {
        de: 'Moderne Architektur und nachhaltiges Design seit 1995',
        en: 'Modern architecture and sustainable design since 1995',
        fr: 'Architecture moderne et design durable depuis 1995',
        it: 'Architettura moderna e design sostenibile dal 1995',
        es: 'Arquitectura moderna y diseño sostenible desde 1995'
      },
      logo: '/logo-footer.png',
      showLogo: true
    },
    quickLinks: [
      {
        id: '1',
        title: {
          de: 'Unternehmen',
          en: 'Company',
          fr: 'Entreprise',
          it: 'Azienda',
          es: 'Empresa'
        },
        links: [
          {
            label: { de: 'Über uns', en: 'About Us', fr: 'À propos', it: 'Chi siamo', es: 'Nosotros' },
            url: { de: '/de/uber-uns', en: '/en/about' },
            internal: true
          },
          {
            label: { de: 'Team', en: 'Team', fr: 'Équipe', it: 'Team', es: 'Equipo' },
            url: { de: '/de/team', en: '/en/team' },
            internal: true
          }
        ]
      },
      {
        id: '2',
        title: {
          de: 'Leistungen',
          en: 'Services',
          fr: 'Services',
          it: 'Servizi',
          es: 'Servicios'
        },
        links: [
          {
            label: { de: 'Neubau', en: 'New Construction', fr: 'Construction neuve', it: 'Nuova costruzione', es: 'Nueva construcción' },
            url: { de: '/de/leistungen#neubau', en: '/en/services#new-construction' },
            internal: true
          },
          {
            label: { de: 'Sanierung', en: 'Renovation', fr: 'Rénovation', it: 'Ristrutturazione', es: 'Renovación' },
            url: { de: '/de/leistungen#sanierung', en: '/en/services#renovation' },
            internal: true
          }
        ]
      }
    ],
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com/braunundeyer', enabled: true },
      { platform: 'instagram', url: 'https://instagram.com/braunundeyer', enabled: true },
      { platform: 'linkedin', url: 'https://linkedin.com/company/braunundeyer', enabled: true }
    ],
    newsletter: {
      enabled: true,
      title: {
        de: 'Newsletter',
        en: 'Newsletter',
        fr: 'Newsletter',
        it: 'Newsletter',
        es: 'Boletín'
      },
      description: {
        de: 'Bleiben Sie über unsere neuesten Projekte informiert',
        en: 'Stay informed about our latest projects',
        fr: 'Restez informé de nos derniers projets',
        it: 'Rimani informato sui nostri ultimi progetti',
        es: 'Manténgase informado sobre nuestros últimos proyectos'
      },
      placeholder: {
        de: 'Ihre E-Mail-Adresse',
        en: 'Your email address',
        fr: 'Votre adresse e-mail',
        it: 'Il tuo indirizzo email',
        es: 'Su dirección de correo'
      },
      buttonText: {
        de: 'Anmelden',
        en: 'Subscribe',
        fr: 'S\'abonner',
        it: 'Iscriviti',
        es: 'Suscribirse'
      }
    },
    copyright: {
      text: {
        de: '© 2024 Braun & Eyer Architekturbüro. Alle Rechte vorbehalten.',
        en: '© 2024 Braun & Eyer Architecture Office. All rights reserved.',
        fr: '© 2024 Bureau d\'architecture Braun & Eyer. Tous droits réservés.',
        it: '© 2024 Studio di architettura Braun & Eyer. Tutti i diritti riservati.',
        es: '© 2024 Oficina de arquitectura Braun & Eyer. Todos los derechos reservados.'
      },
      showYear: true
    },
    additionalInfo: {
      address: {
        street: 'Hauptstraße 123',
        city: '66111 Saarbrücken',
        country: 'Deutschland'
      },
      phone: '+49 681 123456',
      email: 'info@braunundeyer.de',
      showContactInfo: true
    }
  };
}

export default router;