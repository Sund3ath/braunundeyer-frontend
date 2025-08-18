import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import db from '../config/db-simple.js';

const router = express.Router();

// Get services configuration
router.get('/content/services', authenticate, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM content WHERE key = ? AND language = ?');
    const content = stmt.get('services', 'de');
    
    if (content) {
      res.json(content);
    } else {
      // Return default services structure
      res.json({
        key: 'services',
        value: JSON.stringify({
          services: [
            {
              id: '1',
              title: 'Neubau',
              description: 'Moderne Neubauprojekte nach höchsten Standards',
              icon: 'Home',
              details: 'Wir planen und realisieren Neubauprojekte von der ersten Skizze bis zur Schlüsselübergabe.',
              features: ['Energieeffizient', 'Nachhaltig', 'Modern'],
              image: '/uploads/neubau.jpg'
            },
            {
              id: '2',
              title: 'Sanierung',
              description: 'Altbausanierung und Modernisierung',
              icon: 'Building2',
              details: 'Fachgerechte Sanierung und Modernisierung von Bestandsgebäuden.',
              features: ['Denkmalschutz', 'Energetische Sanierung', 'Modernisierung'],
              image: '/uploads/sanierung.jpg'
            }
          ],
          categories: [
            { id: '1', name: 'Wohnbau', description: 'Private Wohnprojekte' },
            { id: '2', name: 'Gewerbebau', description: 'Büro- und Geschäftsgebäude' },
            { id: '3', name: 'Sanierung', description: 'Altbausanierung und Modernisierung' }
          ],
          processSteps: [
            { id: '1', number: 1, title: 'Erstberatung', description: 'Kostenlose Erstberatung und Bedarfsanalyse' },
            { id: '2', number: 2, title: 'Konzept', description: 'Entwicklung des Architekturkonzepts' },
            { id: '3', number: 3, title: 'Planung', description: 'Detaillierte Ausführungsplanung' },
            { id: '4', number: 4, title: 'Umsetzung', description: 'Baubegleitung und Qualitätskontrolle' }
          ]
        }),
        language: 'de'
      });
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services configuration' });
  }
});

// Get contact settings
router.get('/content/contact-settings', authenticate, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM content WHERE key = ? AND language = ?');
    const content = stmt.get('contact-settings', 'de');
    
    if (content) {
      res.json(content);
    } else {
      // Return default contact settings
      res.json({
        key: 'contact-settings',
        value: JSON.stringify({
          officeInfo: {
            companyName: 'Braun & Eyer Architekturbüro',
            street: 'Hauptstraße 123',
            zipCode: '66111',
            city: 'Saarbrücken',
            country: 'Deutschland',
            phone: '+49 681 123456',
            fax: '+49 681 123457',
            email: 'info@braunundeyer.de',
            vatId: 'DE123456789',
            registrationCourt: 'Amtsgericht Saarbrücken',
            registrationNumber: 'HRB 12345'
          },
          openingHours: [
            { day: 'Monday', dayDe: 'Montag', open: '09:00', close: '18:00', closed: false },
            { day: 'Tuesday', dayDe: 'Dienstag', open: '09:00', close: '18:00', closed: false },
            { day: 'Wednesday', dayDe: 'Mittwoch', open: '09:00', close: '18:00', closed: false },
            { day: 'Thursday', dayDe: 'Donnerstag', open: '09:00', close: '18:00', closed: false },
            { day: 'Friday', dayDe: 'Freitag', open: '09:00', close: '17:00', closed: false },
            { day: 'Saturday', dayDe: 'Samstag', open: '10:00', close: '14:00', closed: false },
            { day: 'Sunday', dayDe: 'Sonntag', open: '', close: '', closed: true }
          ],
          mapSettings: {
            latitude: 49.2327,
            longitude: 7.0055,
            zoom: 15,
            mapStyle: 'streets',
            showMarker: true,
            markerTitle: 'Braun & Eyer Architekturbüro'
          },
          formSettings: {
            recipientEmail: 'info@braunundeyer.de',
            ccEmails: [],
            emailSubjectPrefix: '[Website Contact]',
            autoReply: true,
            autoReplySubject: 'Vielen Dank für Ihre Nachricht',
            autoReplyMessage: 'Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.',
            requiredFields: ['name', 'email', 'message'],
            optionalFields: ['phone', 'company', 'projectType'],
            enableCaptcha: true,
            saveToDatabase: true,
            notifySlack: false,
            slackWebhook: ''
          },
          socialLinks: [
            { platform: 'Facebook', url: 'https://facebook.com/braunundeyer', icon: 'Facebook', active: true },
            { platform: 'Instagram', url: 'https://instagram.com/braunundeyer', icon: 'Instagram', active: true },
            { platform: 'LinkedIn', url: 'https://linkedin.com/company/braunundeyer', icon: 'Linkedin', active: true },
            { platform: 'Twitter', url: '', icon: 'Twitter', active: false },
            { platform: 'YouTube', url: '', icon: 'Youtube', active: false }
          ]
        }),
        language: 'de'
      });
    }
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    res.status(500).json({ error: 'Failed to fetch contact settings' });
  }
});

export default router;