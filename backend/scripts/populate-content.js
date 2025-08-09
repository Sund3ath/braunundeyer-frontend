import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = 'http://localhost:3001/api';
let authToken = '';

// Architecture images from Unsplash (free to use)
const unsplashImages = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
    name: 'modern-villa.jpg',
    description: 'Modern Villa with Pool'
  },
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
    name: 'luxury-house.jpg',
    description: 'Luxury Modern House'
  },
  {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600',
    name: 'contemporary-home.jpg',
    description: 'Contemporary Home Design'
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600',
    name: 'modern-mansion.jpg',
    description: 'Modern Mansion Architecture'
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
    name: 'minimalist-house.jpg',
    description: 'Minimalist House Design'
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1600',
    name: 'glass-house.jpg',
    description: 'Modern Glass House'
  },
  {
    url: 'https://images.unsplash.com/photo-1567428485212-ce37bede71e1?w=1600',
    name: 'historic-building.jpg',
    description: 'Historic Building Renovation'
  },
  {
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600',
    name: 'office-building.jpg',
    description: 'Modern Office Building'
  }
];

// Login to get auth token
async function login() {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@braunundeyer.de',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    authToken = data.token;
    console.log('✅ Logged in successfully');
    return data;
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
}

// Update content
async function updateContent(key, value, language = 'de') {
  try {
    const response = await fetch(`${API_BASE}/content/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ value, language })
    });
    
    const data = await response.json();
    console.log(`✅ Updated content: ${key} (${language})`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to update ${key}:`, error);
  }
}

// Create project
async function createProject(projectData) {
  try {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(projectData)
    });
    
    const data = await response.json();
    console.log(`✅ Created project: ${projectData.title}`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to create project:`, error);
  }
}

// Populate homepage content
async function populateHomepageContent() {
  console.log('\n📝 Populating homepage content...\n');
  
  // German content
  await updateContent('hero_title', 'Innovative Architektur für moderne Lebensräume', 'de');
  await updateContent('hero_subtitle', 'Über 30 Jahre Erfahrung in Neubau und Altbausanierung', 'de');
  await updateContent('hero_description', 'Wir gestalten Räume, die inspirieren und Bestand haben', 'de');
  await updateContent('hero_image', '/assets/images/hero_modernbuilding_video.mp4', 'de');
  await updateContent('hero_cta_text', 'Projekte entdecken', 'de');
  
  await updateContent('about_title', 'Braun & Eyer Architekturbüro', 'de');
  await updateContent('about_subtitle', 'Tradition trifft Innovation', 'de');
  await updateContent('about_content', 
    'Seit über drei Jahrzehnten steht unser Architekturbüro für außergewöhnliche Baukunst, ' +
    'die Funktionalität mit Ästhetik verbindet. Wir spezialisieren uns auf innovative Neubauten ' +
    'und respektvolle Altbausanierungen, die den Charakter historischer Gebäude bewahren und ' +
    'gleichzeitig moderne Standards erfüllen.', 'de');
  await updateContent('about_image1', '/assets/images/ferienvilla.png', 'de');
  await updateContent('about_image2', '/assets/images/innenarchitektur.png', 'de');
  
  // English content
  await updateContent('hero_title', 'Innovative Architecture for Modern Living Spaces', 'en');
  await updateContent('hero_subtitle', 'Over 30 Years of Experience in New Construction and Building Renovation', 'en');
  await updateContent('hero_description', 'We create spaces that inspire and endure', 'en');
  await updateContent('hero_cta_text', 'Explore Projects', 'en');
  
  await updateContent('about_title', 'Braun & Eyer Architecture Office', 'en');
  await updateContent('about_subtitle', 'Tradition Meets Innovation', 'en');
  await updateContent('about_content', 
    'For over three decades, our architecture firm has stood for exceptional architectural art ' +
    'that combines functionality with aesthetics. We specialize in innovative new buildings ' +
    'and respectful renovations that preserve the character of historic buildings while ' +
    'meeting modern standards.', 'en');
  
  // French content
  await updateContent('hero_title', 'Architecture Innovante pour Espaces de Vie Modernes', 'fr');
  await updateContent('hero_subtitle', 'Plus de 30 Ans d\'Expérience en Construction Neuve et Rénovation', 'fr');
  await updateContent('hero_description', 'Nous créons des espaces qui inspirent et perdurent', 'fr');
  await updateContent('hero_cta_text', 'Découvrir les Projets', 'fr');
}

// Create sample projects
async function createSampleProjects() {
  console.log('\n🏗️ Creating sample projects...\n');
  
  const projects = [
    {
      title: 'Villa Moderne am See',
      description: 'Luxuriöse Villa mit nachhaltiger Bauweise und Panoramablick',
      location: 'Saarbrücken',
      area: '450 m²',
      year: 2024,
      category: 'Neubau',
      status: 'published',
      image: '/assets/images/ferienvilla.png',
      gallery: JSON.stringify([
        '/assets/images/ferienvilla.png',
        '/assets/images/innenarchitektur.png'
      ]),
      details: 'Diese moderne Villa verbindet luxuriöses Wohnen mit nachhaltiger Architektur. ' +
               'Große Glasfronten schaffen eine nahtlose Verbindung zwischen Innen- und Außenbereich.'
    },
    {
      title: 'Sanierung Gründerzeitvilla',
      description: 'Denkmalgerechte Sanierung mit moderner Haustechnik',
      location: 'Saarlouis',
      area: '380 m²',
      year: 2023,
      category: 'Altbausanierung',
      status: 'published',
      image: '/assets/images/sarnierung_alt_neu.png',
      gallery: JSON.stringify([
        '/assets/images/sarnierung_alt_neu.png',
        '/assets/images/alt_neu_ungestaltung.png'
      ]),
      details: 'Behutsame Sanierung einer historischen Villa unter Bewahrung der originalen ' +
               'Architekturelemente bei gleichzeitiger Integration moderner Gebäudetechnik.'
    },
    {
      title: 'Mehrfamilienhaus Stadtmitte',
      description: 'Energieeffizientes Wohngebäude mit 12 Einheiten',
      location: 'Homburg',
      area: '1200 m²',
      year: 2024,
      category: 'Neubau',
      status: 'published',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600'
      ]),
      details: 'Modernes Mehrfamilienhaus mit optimaler Raumnutzung und höchsten Energiestandards.'
    },
    {
      title: 'Bürogebäude Innovation Campus',
      description: 'Nachhaltiges Bürogebäude mit flexiblen Arbeitsflächen',
      location: 'Saarbrücken',
      area: '2800 m²',
      year: 2023,
      category: 'Gewerbebau',
      status: 'published',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600'
      ]),
      details: 'Innovatives Bürokonzept mit flexiblen Arbeitsbereichen und modernster Gebäudetechnik.'
    },
    {
      title: 'Einfamilienhaus mit Atrium',
      description: 'Modernes Einfamilienhaus mit zentralem Innenhof',
      location: 'St. Wendel',
      area: '280 m²',
      year: 2024,
      category: 'Neubau',
      status: 'published',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600'
      ]),
      details: 'Einzigartiges Wohnkonzept mit privatem Atrium als zentralem Lebensmittelpunkt.'
    },
    {
      title: 'Denkmalschutz Rathaus',
      description: 'Sanierung historisches Rathaus mit Barrierefreiheit',
      location: 'Ottweiler',
      area: '1500 m²',
      year: 2023,
      category: 'Altbausanierung',
      status: 'published',
      image: 'https://images.unsplash.com/photo-1567428485212-ce37bede71e1?w=800',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1567428485212-ce37bede71e1?w=1600',
        '/assets/images/alt_neu_ungestaltung.png'
      ]),
      details: 'Umfassende Sanierung unter Berücksichtigung des Denkmalschutzes mit Integration ' +
               'moderner Barrierefreiheit und Gebäudetechnik.'
    }
  ];
  
  // Delete existing projects first
  try {
    const existingProjects = await fetch(`${API_BASE}/projects`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await existingProjects.json();
    
    if (data.projects && data.projects.length > 0) {
      console.log(`Deleting ${data.projects.length} existing projects...`);
      for (const project of data.projects) {
        await fetch(`${API_BASE}/projects/${project.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      }
    }
  } catch (error) {
    console.log('No existing projects to delete');
  }
  
  // Create new projects
  for (const project of projects) {
    await createProject(project);
  }
}

// Update services content
async function updateServicesContent() {
  console.log('\n🛠️ Updating services content...\n');
  
  // German
  await updateContent('services_title', 'Unsere Leistungen', 'de');
  await updateContent('services_subtitle', 'Komplettlösungen aus einer Hand', 'de');
  
  await updateContent('service1_title', 'Neubau', 'de');
  await updateContent('service1_description', 'Von der ersten Skizze bis zum schlüsselfertigen Gebäude begleiten wir Ihr Bauvorhaben.', 'de');
  await updateContent('service1_icon', 'Building', 'de');
  
  await updateContent('service2_title', 'Altbausanierung', 'de');
  await updateContent('service2_description', 'Fachgerechte Sanierung unter Berücksichtigung von Denkmalschutz und Energieeffizienz.', 'de');
  await updateContent('service2_icon', 'Home', 'de');
  
  await updateContent('service3_title', 'Ingenieursleistungen', 'de');
  await updateContent('service3_description', 'Statik, Haustechnik und Bauphysik - alles aus einer Hand.', 'de');
  await updateContent('service3_icon', 'Settings', 'de');
  
  // English
  await updateContent('services_title', 'Our Services', 'en');
  await updateContent('services_subtitle', 'Complete Solutions from a Single Source', 'en');
  
  await updateContent('service1_title', 'New Construction', 'en');
  await updateContent('service1_description', 'From the first sketch to the turnkey building, we accompany your construction project.', 'en');
  
  await updateContent('service2_title', 'Building Renovation', 'en');
  await updateContent('service2_description', 'Professional renovation considering heritage protection and energy efficiency.', 'en');
  
  await updateContent('service3_title', 'Engineering Services', 'en');
  await updateContent('service3_description', 'Structural engineering, building services and building physics - all from one source.', 'en');
}

// Update contact content
async function updateContactContent() {
  console.log('\n📞 Updating contact content...\n');
  
  await updateContent('contact_title', 'Kontakt', 'de');
  await updateContent('contact_subtitle', 'Wir freuen uns auf Ihre Anfrage', 'de');
  await updateContent('contact_address', 'Musterstraße 123\n66111 Saarbrücken\nDeutschland', 'de');
  await updateContent('contact_phone', '+49 (0) 681 12345678', 'de');
  await updateContent('contact_email', 'info@braunundeyer.de', 'de');
  await updateContent('contact_hours', 'Mo-Fr: 8:00 - 18:00 Uhr\nSa: 9:00 - 13:00 Uhr', 'de');
  
  await updateContent('contact_title', 'Contact', 'en');
  await updateContent('contact_subtitle', 'We look forward to your inquiry', 'en');
  await updateContent('contact_address', 'Musterstraße 123\n66111 Saarbrücken\nGermany', 'en');
  await updateContent('contact_hours', 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 1:00 PM', 'en');
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting content population...\n');
    
    await login();
    await populateHomepageContent();
    await createSampleProjects();
    await updateServicesContent();
    await updateContactContent();
    
    console.log('\n✨ Content population completed successfully!');
    console.log('\n📌 Note: Some images are from Unsplash and will load from the internet.');
    console.log('   Local images are served from /assets/images/\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
main();