import db from '../config/db-simple.js';
import logger from '../utils/logger.js';

const runMigration = async () => {
  try {
    // Create team_members table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        position_en TEXT,
        position_fr TEXT,
        position_it TEXT,
        position_es TEXT,
        bio TEXT,
        bio_en TEXT,
        bio_fr TEXT,
        bio_it TEXT,
        bio_es TEXT,
        image TEXT,
        email TEXT,
        phone TEXT,
        linkedin TEXT,
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info('Team members table created successfully');

    // Insert sample team members
    const sampleMembers = [
      {
        name: 'Thomas Braun',
        position: 'Geschäftsführer & Architekt',
        position_en: 'CEO & Architect',
        bio: 'Mit über 20 Jahren Erfahrung in der Architektur leitet Thomas Braun unser Büro mit Leidenschaft und Expertise.',
        bio_en: 'With over 20 years of experience in architecture, Thomas Braun leads our office with passion and expertise.',
        email: 'thomas.braun@braunundeyer.de',
        order_index: 1
      },
      {
        name: 'Sarah Eyer',
        position: 'Partnerin & Architektin',
        position_en: 'Partner & Architect',
        bio: 'Sarah Eyer bringt innovative Designkonzepte und nachhaltige Lösungen in jedes Projekt ein.',
        bio_en: 'Sarah Eyer brings innovative design concepts and sustainable solutions to every project.',
        email: 'sarah.eyer@braunundeyer.de',
        order_index: 2
      },
      {
        name: 'Michael Schmidt',
        position: 'Projektleiter',
        position_en: 'Project Manager',
        bio: 'Als erfahrener Projektleiter sorgt Michael für die reibungslose Abwicklung aller Bauprojekte.',
        bio_en: 'As an experienced project manager, Michael ensures the smooth execution of all construction projects.',
        email: 'michael.schmidt@braunundeyer.de',
        order_index: 3
      },
      {
        name: 'Lisa Wagner',
        position: 'Innenarchitektin',
        position_en: 'Interior Designer',
        bio: 'Lisa Wagner spezialisiert sich auf die Gestaltung inspirierender und funktionaler Innenräume.',
        bio_en: 'Lisa Wagner specializes in creating inspiring and functional interior spaces.',
        email: 'lisa.wagner@braunundeyer.de',
        order_index: 4
      }
    ];

    for (const member of sampleMembers) {
      const existing = await db.get('SELECT id FROM team_members WHERE email = ?', [member.email]);
      if (!existing) {
        await db.run(
          `INSERT INTO team_members (name, position, position_en, bio, bio_en, email, order_index) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [member.name, member.position, member.position_en, member.bio, member.bio_en, member.email, member.order_index]
        );
        logger.info(`Added team member: ${member.name}`);
      }
    }

    logger.info('Team members migration completed successfully');
  } catch (error) {
    logger.error('Team members migration failed:', error);
    throw error;
  }
};

// Run migration if executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default runMigration;