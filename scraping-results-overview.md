# Scraping-Ergebnisse für www.braunundeyer.de

## Generierte Dateien

### 1. Scraping-Skripte
- **`scrape-braunundeyer.js`** - Firecrawl-basiertes Scraping-Skript (benötigt API-Schlüssel)
- **`scrape-braunundeyer-curl.js`** - Curl-basiertes Scraping-Skript (verwendet, da kein API-Schlüssel verfügbar)

### 2. Rohdaten
- **`braunundeyer-raw.html`** - Kompletter HTML-Quellcode der Website
- **`braunundeyer-text.txt`** - Extrahierter Textinhalt ohne HTML-Tags
- **`braunundeyer-curl-metadata.json`** - Strukturierte Metadaten (Links, Bilder, etc.)

### 3. Aufbereitete Daten
- **`braunundeyer-structured.md`** - Strukturierte Zusammenfassung der Website-Inhalte

## Wichtigste Erkenntnisse

### Unternehmensdaten
- **Name**: Braun & Eyer Architekten GbR
- **Standort**: Saarbrücken, Mainzerstrasse 29
- **Kontakt**: 0681 - 95 41 74 88, info@braunundeyer.de

### Leistungsspektrum
1. Neubau
2. Altbausanierung
3. Innenarchitektur
4. Design
5. Wohnungsbau
6. Denkmalschutz

### Website-Status
Die Website befindet sich in einer Überarbeitungsphase mit dem Hinweis:
"Wir entwickeln ständig neue Ideen. Dieses mal ist unsere Onlinepräsenz an der Reihe."

## Technische Details
- **Scraping-Methode**: curl mit Node.js
- **Extrahierte Links**: 31
- **Gefundene Bilder**: 13
- **Textlänge**: 2.350 Zeichen
- **CMS**: Vermutlich CM4all

## Verwendung der Skripte

### Mit Firecrawl API (wenn API-Schlüssel verfügbar):
```bash
# API-Schlüssel als Umgebungsvariable setzen
export FIRECRAWL_API_KEY="your-api-key"
node scrape-braunundeyer.js
```

### Mit curl (ohne API-Schlüssel):
```bash
node scrape-braunundeyer-curl.js
```

## Nächste Schritte
Falls eine tiefere Analyse gewünscht ist, könnten folgende Aktionen durchgeführt werden:
1. Scraping der Unterseiten (Projekte, Leistungen, etc.)
2. Bildanalyse der Projektfotos
3. Strukturierte Extraktion der Projektdaten
4. Vergleich mit anderen Architekturbüros in der Region