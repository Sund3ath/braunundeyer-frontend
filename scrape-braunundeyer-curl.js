import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function scrapeBraunundEyerWithCurl() {
  try {
    console.log('Scraping www.braunundeyer.de mit curl...');
    
    // Website mit curl herunterladen
    const { stdout, stderr } = await execAsync('curl -s -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" https://www.braunundeyer.de');
    
    if (stderr) {
      console.error('Curl-Fehler:', stderr);
      return;
    }
    
    // HTML-Inhalt speichern
    fs.writeFileSync('braunundeyer-raw.html', stdout);
    console.log('Roher HTML-Inhalt gespeichert in: braunundeyer-raw.html');
    
    // Einfache Textextraktion (HTML-Tags entfernen)
    const textContent = stdout
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Scripts entfernen
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Styles entfernen
      .replace(/<[^>]*>/g, ' ') // HTML-Tags entfernen
      .replace(/\s+/g, ' ') // Mehrfache Leerzeichen reduzieren
      .trim();
    
    fs.writeFileSync('braunundeyer-text.txt', textContent);
    console.log('Textinhalt gespeichert in: braunundeyer-text.txt');
    
    // Titel extrahieren
    const titleMatch = stdout.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Titel nicht gefunden';
    
    // Meta-Beschreibung extrahieren
    const descMatch = stdout.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : 'Beschreibung nicht gefunden';
    
    // Links extrahieren
    const linkMatches = stdout.match(/<a[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)<\/a>/gi) || [];
    const links = linkMatches.map(link => {
      const hrefMatch = link.match(/href=["\']([^"\']*)["\']/i);
      const textMatch = link.match(/>([^<]*)</);
      return {
        url: hrefMatch ? hrefMatch[1] : '',
        text: textMatch ? textMatch[1].trim() : ''
      };
    }).filter(link => link.url && link.text);
    
    // Bilder extrahieren
    const imgMatches = stdout.match(/<img[^>]*src=["\']([^"\']*)["\'][^>]*>/gi) || [];
    const images = imgMatches.map(img => {
      const srcMatch = img.match(/src=["\']([^"\']*)["\']/i);
      const altMatch = img.match(/alt=["\']([^"\']*)["\']/i);
      return {
        src: srcMatch ? srcMatch[1] : '',
        alt: altMatch ? altMatch[1] : ''
      };
    }).filter(img => img.src);
    
    // Metadaten zusammenstellen
    const metadata = {
      title,
      description,
      url: 'https://www.braunundeyer.de',
      scrapedAt: new Date().toISOString(),
      links: links.slice(0, 20), // Erste 20 Links
      images: images.slice(0, 10), // Erste 10 Bilder
      textLength: textContent.length
    };
    
    fs.writeFileSync('braunundeyer-curl-metadata.json', JSON.stringify(metadata, null, 2));
    console.log('Metadaten gespeichert in: braunundeyer-curl-metadata.json');
    
    console.log('\nErgebnisse:');
    console.log('Titel:', title);
    console.log('Beschreibung:', description);
    console.log('Anzahl Links:', links.length);
    console.log('Anzahl Bilder:', images.length);
    console.log('Textlänge:', textContent.length, 'Zeichen');
    
  } catch (error) {
    console.error('Fehler beim Scraping mit curl:', error.message);
  }
}

// Skript ausführen
scrapeBraunundEyerWithCurl();