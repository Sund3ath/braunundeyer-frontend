import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = 'http://localhost:3001/api';
let authToken = '';

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

// Update project
async function updateProject(id, projectData) {
  try {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(projectData)
    });
    
    const data = await response.json();
    console.log(`✅ Updated project ${id}: ${projectData.title}`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to update project ${id}:`, error);
  }
}

// Get all projects
async function getProjects() {
  try {
    const response = await fetch(`${API_BASE}/projects`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('❌ Failed to get projects:', error);
    return [];
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

// Fix all images
async function fixAllImages() {
  console.log('\n🖼️ Fixing all image paths...\n');
  
  // Fix content images
  console.log('📝 Updating content images...\n');
  
  // Hero section - use the video
  await updateContent('hero_image', '/assets/images/hero_modernbuilding_video.mp4', 'de');
  await updateContent('hero_image', '/assets/images/hero_modernbuilding_video.mp4', 'en');
  await updateContent('hero_image', '/assets/images/hero_modernbuilding_video.mp4', 'fr');
  
  // About section images
  await updateContent('about_image1', '/assets/images/ferienvilla.png', 'de');
  await updateContent('about_image2', '/assets/images/innenarchitektur.png', 'de');
  await updateContent('about_image1', '/assets/images/ferienvilla.png', 'en');
  await updateContent('about_image2', '/assets/images/innenarchitektur.png', 'en');
  
  // Fix projects
  console.log('\n🏗️ Updating project images...\n');
  
  const projects = await getProjects();
  
  if (projects.length > 0) {
    // Update Villa Moderne am See
    const villa = projects.find(p => p.title === 'Villa Moderne am See');
    if (villa) {
      await updateProject(villa.id, {
        ...villa,
        image: '/assets/images/ferienvilla.png',
        featured_image: '/assets/images/ferienvilla.png',
        gallery: JSON.stringify([
          '/assets/images/ferienvilla.png',
          '/assets/images/innenarchitektur.png',
          '/assets/images/placeholder.png'
        ])
      });
    }
    
    // Update Sanierung Gründerzeitvilla
    const sanierung = projects.find(p => p.title === 'Sanierung Gründerzeitvilla');
    if (sanierung) {
      await updateProject(sanierung.id, {
        ...sanierung,
        image: '/assets/images/sarnierung_alt_neu.png',
        featured_image: '/assets/images/sarnierung_alt_neu.png',
        gallery: JSON.stringify([
          '/assets/images/sarnierung_alt_neu.png',
          '/assets/images/alt_neu_ungestaltung.png',
          '/assets/images/placeholder.png'
        ])
      });
    }
    
    // Update Mehrfamilienhaus Stadtmitte
    const mehrfam = projects.find(p => p.title === 'Mehrfamilienhaus Stadtmitte');
    if (mehrfam) {
      await updateProject(mehrfam.id, {
        ...mehrfam,
        image: '/assets/images/placeholder.png',
        featured_image: '/assets/images/placeholder.png',
        gallery: JSON.stringify([
          '/assets/images/placeholder.png',
          '/assets/images/ferienvilla.png'
        ])
      });
    }
    
    // Update Bürogebäude Innovation Campus
    const buero = projects.find(p => p.title === 'Bürogebäude Innovation Campus');
    if (buero) {
      await updateProject(buero.id, {
        ...buero,
        image: '/assets/images/innenarchitektur.png',
        featured_image: '/assets/images/innenarchitektur.png',
        gallery: JSON.stringify([
          '/assets/images/innenarchitektur.png',
          '/assets/images/placeholder.png'
        ])
      });
    }
    
    // Update Einfamilienhaus mit Atrium
    const einfam = projects.find(p => p.title === 'Einfamilienhaus mit Atrium');
    if (einfam) {
      await updateProject(einfam.id, {
        ...einfam,
        image: '/assets/images/alt_neu_ungestaltung.png',
        featured_image: '/assets/images/alt_neu_ungestaltung.png',
        gallery: JSON.stringify([
          '/assets/images/alt_neu_ungestaltung.png',
          '/assets/images/placeholder.png'
        ])
      });
    }
    
    // Update Denkmalschutz Rathaus
    const rathaus = projects.find(p => p.title === 'Denkmalschutz Rathaus');
    if (rathaus) {
      await updateProject(rathaus.id, {
        ...rathaus,
        image: '/assets/images/sarnierung_alt_neu.png',
        featured_image: '/assets/images/sarnierung_alt_neu.png',
        gallery: JSON.stringify([
          '/assets/images/sarnierung_alt_neu.png',
          '/assets/images/alt_neu_ungestaltung.png',
          '/assets/images/placeholder.png'
        ])
      });
    }
  }
  
  console.log('\n✨ All images have been fixed!');
  console.log('🌐 Visit http://localhost:4028/de/homepage to see the updated images\n');
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting image fix...\n');
    
    await login();
    await fixAllImages();
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
main();