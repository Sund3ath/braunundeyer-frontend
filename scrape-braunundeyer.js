import FirecrawlApp from '@mendable/firecrawl-js';
import fs from 'fs';

// Firecrawl App initialisieren
// Hinweis: Sie benötigen einen API-Schlüssel von firecrawl.dev
// Setzen Sie FIRECRAWL_API_KEY als Umgebungsvariable oder ersetzen Sie 'your-api-key' durch Ihren tatsächlichen Schlüssel
const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || 'your-api-key'
});

async function scrapeBraunundEyer() {
  try {
    console.log('Scraping www.braunundeyer.de...');
    
    // Website scrapen
    const scrapeResult = await app.scrapeUrl('https://www.braunundeyer.de', {
      formats: ['markdown', 'html'],
      onlyMainContent: true,
      includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'a', 'img'],
      excludeTags: ['script', 'style', 'nav', 'footer'],
      waitFor: 2000 // 2 Sekunden warten, damit die Seite vollständig geladen wird
    });

    console.log('Scrape Result:', JSON.stringify(scrapeResult, null, 2));

    if (scrapeResult.success && scrapeResult.data) {
      console.log('Scraping erfolgreich!');
      
      // Markdown-Inhalt speichern
      if (scrapeResult.data.markdown) {
        fs.writeFileSync('braunundeyer-content.md', scrapeResult.data.markdown);
        console.log('Markdown-Inhalt gespeichert in: braunundeyer-content.md');
      }
      
      // HTML-Inhalt speichern
      if (scrapeResult.data.html) {
        fs.writeFileSync('braunundeyer-content.html', scrapeResult.data.html);
        console.log('HTML-Inhalt gespeichert in: braunundeyer-content.html');
      }
      
      // Metadaten anzeigen
      if (scrapeResult.data.metadata) {
        console.log('\nMetadaten:');
        console.log('Titel:', scrapeResult.data.metadata.title);
        console.log('Beschreibung:', scrapeResult.data.metadata.description);
        console.log('URL:', scrapeResult.data.metadata.sourceURL);
        
        // Metadaten als JSON speichern
        fs.writeFileSync('braunundeyer-firecrawl-metadata.json', JSON.stringify(scrapeResult.data.metadata, null, 2));
        console.log('Metadaten gespeichert in: braunundeyer-firecrawl-metadata.json');
      }
      
      // Vollständige Daten als JSON speichern
      fs.writeFileSync('braunundeyer-firecrawl-full-data.json', JSON.stringify(scrapeResult.data, null, 2));
      console.log('Vollständige Daten gespeichert in: braunundeyer-firecrawl-full-data.json');
      
    } else {
      console.error('Scraping fehlgeschlagen:', scrapeResult.error || 'Unbekannter Fehler');
      console.log('Vollständige Antwort:', JSON.stringify(scrapeResult, null, 2));
    }
    
  } catch (error) {
    console.error('Fehler beim Scraping:', error.message);
    console.error('Stack:', error.stack);
    
    // Fallback: Einfaches Scraping ohne erweiterte Optionen
    console.log('\nVersuche einfaches Scraping...');
    try {
      const simpleScrape = await app.scrapeUrl('https://www.braunundeyer.de');
      console.log('Simple Scrape Result:', JSON.stringify(simpleScrape, null, 2));
      
      if (simpleScrape.success && simpleScrape.data && simpleScrape.data.markdown) {
        fs.writeFileSync('braunundeyer-simple.md', simpleScrape.data.markdown);
        console.log('Einfaches Scraping erfolgreich! Inhalt gespeichert in: braunundeyer-simple.md');
      } else {
        console.log('Einfaches Scraping hat keine Markdown-Daten zurückgegeben');
        if (simpleScrape.data) {
          fs.writeFileSync('braunundeyer-simple-data.json', JSON.stringify(simpleScrape.data, null, 2));
          console.log('Einfache Scraping-Daten gespeichert in: braunundeyer-simple-data.json');
        }
      }
    } catch (fallbackError) {
      console.error('Auch einfaches Scraping fehlgeschlagen:', fallbackError.message);
      console.error('Fallback Stack:', fallbackError.stack);
    }
  }
}

// Skript ausführen
scrapeBraunundEyer();