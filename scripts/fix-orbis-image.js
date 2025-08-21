import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Open database
const dbPath = path.join(__dirname, '../backend/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Update Orbis project image
db.run(
  'UPDATE projects SET image = ? WHERE id = ?',
  ['/uploads/image-1755629310402-338232393.jpeg', 13],
  function(err) {
    if (err) {
      console.error('Error updating Orbis image:', err);
      process.exit(1);
    } else {
      console.log('✓ Successfully updated Orbis image');
      console.log(`  Project ID: 13`);
      console.log(`  New image: /uploads/image-1755629310402-338232393.jpeg`);
      
      // Also update in homepage content if needed
      db.get(
        "SELECT value FROM content WHERE key = 'homepage'",
        (err, row) => {
          if (err) {
            console.error('Error reading homepage content:', err);
            db.close();
            return;
          }
          
          if (row && row.value) {
            try {
              const content = JSON.parse(row.value);
              
              // Update featured projects if Orbis is there
              if (content.featuredProjects) {
                content.featuredProjects = content.featuredProjects.map(project => {
                  if (project.id === 13 || project.title === 'Orbis') {
                    project.image = 'http://api.braunundeyer.de/uploads/image-1755629310402-338232393.jpeg';
                    console.log('✓ Updated Orbis in homepage featured projects');
                  }
                  return project;
                });
                
                // Save updated content
                db.run(
                  "UPDATE content SET value = ? WHERE key = 'homepage'",
                  [JSON.stringify(content)],
                  (err) => {
                    if (err) {
                      console.error('Error updating homepage content:', err);
                    } else {
                      console.log('✓ Homepage content updated');
                    }
                    db.close();
                  }
                );
              } else {
                db.close();
              }
            } catch (e) {
              console.error('Error parsing homepage content:', e);
              db.close();
            }
          } else {
            db.close();
          }
        }
      );
    }
  }
);