import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = '/home/braunundeyer-frontend/backend/database.sqlite';

async function populateServices() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  const servicesData = {
    services: [
      {
        id: '1',
        title: 'Neubau',
        description: 'Moderne Neubauprojekte nach Ihren Wünschen',
        icon: 'Home',
        details: 'Von der ersten Idee bis zum schlüsselfertigen Gebäude begleiten wir Sie durch alle Projektphasen. Unsere erfahrenen Architekten und Ingenieure entwickeln maßgeschneiderte Konzepte, die Ihre individuellen Bedürfnisse mit modernster Technik und nachhaltigem Bauen verbinden.',
        features: ['Energieeffizienz', 'Moderne Architektur', 'Individuelle Planung', 'Nachhaltigkeit'],
        image: '/uploads/neubau.jpg',
        timeline: '6-12 Monate'
      },
      {
        id: '2',
        title: 'Altbausanierung',
        description: 'Renovierung und Modernisierung bestehender Gebäude',
        icon: 'Building2',
        details: 'Wir erwecken historische Gebäude zu neuem Leben. Mit Respekt vor der bestehenden Bausubstanz und einem Auge für moderne Anforderungen entwickeln wir Sanierungskonzepte, die den Charakter erhalten und gleichzeitig zeitgemäßen Komfort bieten.',
        features: ['Denkmalschutz', 'Energetische Sanierung', 'Modernisierung', 'Werterhaltung'],
        image: '/uploads/sanierung.jpg',
        timeline: '3-9 Monate'
      },
      {
        id: '3',
        title: 'Innenarchitektur',
        description: 'Gestaltung und Planung von Innenräumen',
        icon: 'Palette',
        details: 'Unsere Innenarchitekten schaffen Räume, die Funktionalität und Ästhetik perfekt vereinen. Von der Raumaufteilung über die Materialauswahl bis zur Lichtplanung entwickeln wir ganzheitliche Konzepte für Ihr Wohlbefinden.',
        features: ['Raumkonzepte', 'Lichtplanung', 'Möbeldesign', 'Farbkonzepte'],
        image: '/uploads/innenarchitektur.jpg',
        timeline: '2-6 Monate'
      },
      {
        id: '4',
        title: 'Energieberatung',
        description: 'Nachhaltige und energieeffiziente Lösungen',
        icon: 'TreePine',
        details: 'Als zertifizierte Energieberater zeigen wir Ihnen Wege zu einem energieeffizienten und nachhaltigen Gebäude. Von der Analyse über die Förderberatung bis zur Umsetzung begleiten wir Sie auf dem Weg zu niedrigeren Energiekosten.',
        features: ['Energieausweis', 'KfW-Beratung', 'Solarberatung', 'Wärmepumpen'],
        image: '/uploads/energieberatung.jpg',
        timeline: '1-2 Monate'
      }
    ],
    categories: [
      {
        id: '1',
        name: 'Wohnbau',
        description: 'Ein- und Mehrfamilienhäuser, Wohnungsbauten'
      },
      {
        id: '2',
        name: 'Gewerbebau',
        description: 'Bürogebäude, Geschäfte und Industriebauten'
      },
      {
        id: '3',
        name: 'Öffentliche Bauten',
        description: 'Schulen, Kindergärten und kommunale Gebäude'
      },
      {
        id: '4',
        name: 'Sanierung',
        description: 'Modernisierung und energetische Sanierung'
      }
    ],
    processSteps: [
      {
        id: '1',
        number: 1,
        title: 'Erstberatung',
        description: 'Unverbindliches Kennenlernen und Bedarfsanalyse'
      },
      {
        id: '2',
        number: 2,
        title: 'Konzept & Planung',
        description: 'Entwicklung individueller Lösungskonzepte'
      },
      {
        id: '3',
        number: 3,
        title: 'Ausführungsplanung',
        description: 'Detaillierte technische Planung'
      },
      {
        id: '4',
        number: 4,
        title: 'Baubegleitung',
        description: 'Professionelle Überwachung der Bauausführung'
      }
    ]
  };

  try {
    // Check if services content exists
    const existing = await db.get(
      'SELECT * FROM content WHERE key = ? AND language = ?',
      ['services', 'de']
    );

    if (existing) {
      // Update existing
      await db.run(
        'UPDATE content SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ? AND language = ?',
        [JSON.stringify(servicesData), 'services', 'de']
      );
      console.log('Services content updated successfully');
    } else {
      // Insert new
      await db.run(
        'INSERT INTO content (key, value, language, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        ['services', JSON.stringify(servicesData), 'de']
      );
      console.log('Services content created successfully');
    }

    console.log('Services populated with:');
    console.log('- 4 services (Neubau, Altbausanierung, Innenarchitektur, Energieberatung)');
    console.log('- 4 categories');
    console.log('- 4 process steps');
    console.log('\nYou can now adjust the images in the CMS admin panel under the Services tab.');
  } catch (error) {
    console.error('Error populating services:', error);
  } finally {
    await db.close();
  }
}

populateServices();