import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  return new Promise((resolve, reject) => {
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../..', 'database.sqlite');
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error('Database connection failed:', err);
        reject(err);
        return;
      }
      
      logger.info('Connected to database for migration');
      
      // Create project_translations table
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS project_translations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER NOT NULL,
          language TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          location TEXT,
          area TEXT,
          details TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          UNIQUE(project_id, language)
        )
      `;
      
      db.run(createTableSQL, (err) => {
        if (err) {
          logger.error('Failed to create project_translations table:', err);
          reject(err);
        } else {
          logger.info('project_translations table created successfully');
          
          // Create index for better performance
          db.run('CREATE INDEX IF NOT EXISTS idx_project_translations_project_id ON project_translations(project_id)', (err) => {
            if (err) {
              logger.error('Failed to create index:', err);
            } else {
              logger.info('Index created successfully');
            }
            
            // Close database
            db.close((err) => {
              if (err) {
                logger.error('Error closing database:', err);
                reject(err);
              } else {
                logger.info('Migration completed successfully');
                resolve();
              }
            });
          });
        }
      });
    });
  });
}

// Run migration
runMigration()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });