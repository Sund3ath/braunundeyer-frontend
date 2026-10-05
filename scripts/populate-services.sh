#!/bin/bash

# Services data
SERVICES_DATA='{
  "key": "services",
  "value": "{\"services\":[{\"id\":\"1\",\"title\":\"Neubau\",\"description\":\"Moderne Neubauprojekte nach Ihren Wünschen\",\"icon\":\"Home\",\"details\":\"Von der ersten Idee bis zum schlüsselfertigen Gebäude begleiten wir Sie durch alle Projektphasen. Unsere erfahrenen Architekten und Ingenieure entwickeln maßgeschneiderte Konzepte, die Ihre individuellen Bedürfnisse mit modernster Technik und nachhaltigem Bauen verbinden.\",\"features\":[\"Energieeffizienz\",\"Moderne Architektur\",\"Individuelle Planung\",\"Nachhaltigkeit\"],\"image\":\"/uploads/services/neubau.jpg\",\"timeline\":\"6-12 Monate\"},{\"id\":\"2\",\"title\":\"Altbausanierung\",\"description\":\"Renovierung und Modernisierung bestehender Gebäude\",\"icon\":\"Building2\",\"details\":\"Wir erwecken historische Gebäude zu neuem Leben. Mit Respekt vor der bestehenden Bausubstanz und einem Auge für moderne Anforderungen entwickeln wir Sanierungskonzepte, die den Charakter erhalten und gleichzeitig zeitgemäßen Komfort bieten.\",\"features\":[\"Denkmalschutz\",\"Energetische Sanierung\",\"Modernisierung\",\"Werterhaltung\"],\"image\":\"/uploads/services/sanierung.jpg\",\"timeline\":\"3-9 Monate\"},{\"id\":\"3\",\"title\":\"Innenarchitektur\",\"description\":\"Gestaltung und Planung von Innenräumen\",\"icon\":\"Palette\",\"details\":\"Unsere Innenarchitekten schaffen Räume, die Funktionalität und Ästhetik perfekt vereinen. Von der Raumaufteilung über die Materialauswahl bis zur Lichtplanung entwickeln wir ganzheitliche Konzepte für Ihr Wohlbefinden.\",\"features\":[\"Raumkonzepte\",\"Lichtplanung\",\"Möbeldesign\",\"Farbkonzepte\"],\"image\":\"/uploads/services/innenarchitektur.jpg\",\"timeline\":\"2-6 Monate\"},{\"id\":\"4\",\"title\":\"Energieberatung\",\"description\":\"Nachhaltige und energieeffiziente Lösungen\",\"icon\":\"TreePine\",\"details\":\"Als zertifizierte Energieberater zeigen wir Ihnen Wege zu einem energieeffizienten und nachhaltigen Gebäude. Von der Analyse über die Förderberatung bis zur Umsetzung begleiten wir Sie auf dem Weg zu niedrigeren Energiekosten.\",\"features\":[\"Energieausweis\",\"KfW-Beratung\",\"Solarberatung\",\"Wärmepumpen\"],\"image\":\"/uploads/services/energieberatung.jpg\",\"timeline\":\"1-2 Monate\"}],\"categories\":[{\"id\":\"1\",\"name\":\"Wohnbau\",\"description\":\"Ein- und Mehrfamilienhäuser, Wohnungsbauten\"},{\"id\":\"2\",\"name\":\"Gewerbebau\",\"description\":\"Bürogebäude, Geschäfte und Industriebauten\"},{\"id\":\"3\",\"name\":\"Öffentliche Bauten\",\"description\":\"Schulen, Kindergärten und kommunale Gebäude\"},{\"id\":\"4\",\"name\":\"Sanierung\",\"description\":\"Modernisierung und energetische Sanierung\"}],\"processSteps\":[{\"id\":\"1\",\"number\":1,\"title\":\"Erstberatung\",\"description\":\"Unverbindliches Kennenlernen und Bedarfsanalyse\"},{\"id\":\"2\",\"number\":2,\"title\":\"Konzept & Planung\",\"description\":\"Entwicklung individueller Lösungskonzepte\"},{\"id\":\"3\",\"number\":3,\"title\":\"Ausführungsplanung\",\"description\":\"Detaillierte technische Planung\"},{\"id\":\"4\",\"number\":4,\"title\":\"Baubegleitung\",\"description\":\"Professionelle Überwachung der Bauausführung\"}]}",
  "language": "de"
}'

# Get auth token (using demo credentials)
echo "Getting auth token..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@braunundeyer.de","password":"admin123"}')

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "Failed to get auth token"
  exit 1
fi

echo "Token obtained successfully"

# Post services data
echo "Populating services data..."
RESPONSE=$(curl -s -X POST http://localhost:3001/api/content/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$SERVICES_DATA")

echo "Response: $RESPONSE"

echo ""
echo "✅ Services populated with:"
echo "  - 4 services (Neubau, Altbausanierung, Innenarchitektur, Energieberatung)"
echo "  - 4 categories (Wohnbau, Gewerbebau, Öffentliche Bauten, Sanierung)"
echo "  - 4 process steps"
echo ""
echo "📝 You can now adjust the images in the CMS admin panel:"
echo "   1. Navigate to: https://cms.braunundeyer.de"
echo "   2. Login with admin credentials"
echo "   3. Go to Services tab"
echo "   4. Edit each service to change the image URL"