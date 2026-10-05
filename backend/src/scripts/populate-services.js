import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the data folder path
const dbPath = path.join(__dirname, '../../data/database.sqlite');
const db = new Database(dbPath);

const servicesData = {
  services: [
    {
      id: '1',
      title: 'Neubau',
      description: 'Moderne Neubauprojekte nach Ihren Wünschen',
      icon: 'Home',
      details: 'Von der ersten Idee bis zum schlüsselfertigen Gebäude begleiten wir Sie durch alle Projektphasen. Unsere erfahrenen Architekten und Ingenieure entwickeln maßgeschneiderte Konzepte, die Ihre individuellen Bedürfnisse mit modernster Technik und nachhaltigem Bauen verbinden.',
      features: ['Energieeffizienz', 'Moderne Architektur', 'Individuelle Planung', 'Nachhaltigkeit'],
      image: '/uploads/services/neubau.jpg',
      timeline: '6-12 Monate'
    },
    {
      id: '2',
      title: 'Altbausanierung',
      description: 'Renovierung und Modernisierung bestehender Gebäude',
      icon: 'Building2',
      details: 'Wir erwecken historische Gebäude zu neuem Leben. Mit Respekt vor der bestehenden Bausubstanz und einem Auge für moderne Anforderungen entwickeln wir Sanierungskonzepte, die den Charakter erhalten und gleichzeitig zeitgemäßen Komfort bieten.',
      features: ['Denkmalschutz', 'Energetische Sanierung', 'Modernisierung', 'Werterhaltung'],
      image: '/uploads/services/sanierung.jpg',
      timeline: '3-9 Monate'
    },
    {
      id: '3',
      title: 'Innenarchitektur',
      description: 'Gestaltung und Planung von Innenräumen',
      icon: 'Palette',
      details: 'Unsere Innenarchitekten schaffen Räume, die Funktionalität und Ästhetik perfekt vereinen. Von der Raumaufteilung über die Materialauswahl bis zur Lichtplanung entwickeln wir ganzheitliche Konzepte für Ihr Wohlbefinden.',
      features: ['Raumkonzepte', 'Lichtplanung', 'Möbeldesign', 'Farbkonzepte'],
      image: '/uploads/services/innenarchitektur.jpg',
      timeline: '2-6 Monate'
    },
    {
      id: '4',
      title: 'Energieberatung',
      description: 'Nachhaltige und energieeffiziente Lösungen',
      icon: 'TreePine',
      details: 'Als zertifizierte Energieberater zeigen wir Ihnen Wege zu einem energieeffizienten und nachhaltigen Gebäude. Von der Analyse über die Förderberatung bis zur Umsetzung begleiten wir Sie auf dem Weg zu niedrigeren Energiekosten.',
      features: ['Energieausweis', 'KfW-Beratung', 'Solarberatung', 'Wärmepumpen'],
      image: '/uploads/services/energieberatung.jpg',
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
  const stmt = db.prepare('SELECT * FROM content WHERE key = ? AND language = ?');
  const existing = stmt.get('services', 'de');

  if (existing) {
    // Update existing
    const updateStmt = db.prepare(`
      UPDATE content 
      SET value = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE key = ? AND language = ?
    `);
    updateStmt.run(JSON.stringify(servicesData), 'services', 'de');
    console.log('Services content updated successfully');
  } else {
    // Insert new
    const insertStmt = db.prepare(`
      INSERT INTO content (key, value, language, created_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    insertStmt.run('services', JSON.stringify(servicesData), 'de');
    console.log('Services content created successfully');
  }

  console.log('\n✅ Services populated with:');
  console.log('  - 4 services (Neubau, Altbausanierung, Innenarchitektur, Energieberatung)');
  console.log('  - 4 categories (Wohnbau, Gewerbebau, Öffentliche Bauten, Sanierung)');
  console.log('  - 4 process steps');
  console.log('\n📝 You can now adjust the images in the CMS admin panel under the Services tab.');
  console.log('   Navigate to: https://cms.braunundeyer.de');
  console.log('   Go to Services tab and edit each service to change the image URL.');
} catch (error) {
  console.error('Error populating services:', error);
} finally {
  db.close();
}