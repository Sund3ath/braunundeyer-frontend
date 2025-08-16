import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://braunundeyer.de';
const languages = ['de', 'en', 'fr', 'it', 'es'];
const defaultLanguage = 'de';

// Routes configuration with priority and change frequency
const routes = [
  { path: '/homepage', priority: 1.0, changefreq: 'weekly' },
  { path: '/projekte', priority: 0.9, changefreq: 'weekly' },
  { path: '/uber-uns', priority: 0.8, changefreq: 'monthly' },
  { path: '/leistungen', priority: 0.8, changefreq: 'monthly' },
  { path: '/kontakt', priority: 0.7, changefreq: 'monthly' },
  { path: '/impressum', priority: 0.3, changefreq: 'yearly' },
  { path: '/datenschutz', priority: 0.3, changefreq: 'yearly' }
];

// Dynamic project routes (you can expand this with actual project data)
const projectRoutes = [
  { path: '/projekte/1', priority: 0.7, changefreq: 'monthly' },
  { path: '/projekte/2', priority: 0.7, changefreq: 'monthly' },
  { path: '/projekte/3', priority: 0.7, changefreq: 'monthly' },
  { path: '/projekte/4', priority: 0.7, changefreq: 'monthly' },
  { path: '/projekte/5', priority: 0.7, changefreq: 'monthly' },
  { path: '/projekte/6', priority: 0.7, changefreq: 'monthly' }
];

const allRoutes = [...routes, ...projectRoutes];

// Generate language-specific sitemap
function generateLanguageSitemap(lang) {
  const lastmod = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  
  allRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}/${lang}${route.path}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    
    // Add hreflang links for all languages
    languages.forEach(altLang => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${SITE_URL}/${altLang}${route.path}"/>\n`;
    });
    
    // Add x-default for default language
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${defaultLanguage}${route.path}"/>\n`;
    
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate sitemap index
function generateSitemapIndex() {
  const lastmod = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add main sitemap
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/sitemap-main.xml</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += '  </sitemap>\n';
  
  // Add language-specific sitemaps
  languages.forEach(lang => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${SITE_URL}/sitemap-${lang}.xml</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });
  
  xml += '</sitemapindex>';
  
  return xml;
}

// Generate main sitemap with all URLs and hreflang
function generateMainSitemap() {
  const lastmod = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  
  // Add root URL
  xml += '  <url>\n';
  xml += `    <loc>${SITE_URL}/</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  languages.forEach(lang => {
    xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}/${lang}"/>\n`;
  });
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>\n`;
  xml += '  </url>\n';
  
  // Add all routes for all languages
  allRoutes.forEach(route => {
    languages.forEach(lang => {
      xml += '  <url>\n';
      xml += `    <loc>${SITE_URL}/${lang}${route.path}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      
      // Add hreflang for all language versions
      languages.forEach(altLang => {
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${SITE_URL}/${altLang}${route.path}"/>\n`;
      });
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${defaultLanguage}${route.path}"/>\n`;
      
      xml += '  </url>\n';
    });
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate robots.txt with sitemap references
function generateRobotsTxt() {
  let content = '# Robots.txt for Braun & Eyer Architekturbüro\n';
  content += '# Generated: ' + new Date().toISOString() + '\n\n';
  
  content += 'User-agent: *\n';
  content += 'Allow: /\n';
  content += 'Disallow: /admin\n';
  content += 'Disallow: /api/\n';
  content += 'Disallow: /*.json$\n';
  content += 'Disallow: /private/\n\n';
  
  // Add sitemap references
  content += `Sitemap: ${SITE_URL}/sitemap.xml\n`;
  content += `Sitemap: ${SITE_URL}/sitemap-main.xml\n`;
  languages.forEach(lang => {
    content += `Sitemap: ${SITE_URL}/sitemap-${lang}.xml\n`;
  });
  
  // Add crawl delay
  content += '\n# Crawl delay\n';
  content += 'Crawl-delay: 1\n';
  
  return content;
}

// Main execution
async function generateSitemaps() {
  try {
    const publicDir = path.join(__dirname, 'public');
    
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Generate sitemap index
    const sitemapIndex = generateSitemapIndex();
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);
    console.log('✅ Generated sitemap.xml (index)');
    
    // Generate main sitemap
    const mainSitemap = generateMainSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap-main.xml'), mainSitemap);
    console.log('✅ Generated sitemap-main.xml');
    
    // Generate language-specific sitemaps
    languages.forEach(lang => {
      const langSitemap = generateLanguageSitemap(lang);
      fs.writeFileSync(path.join(publicDir, `sitemap-${lang}.xml`), langSitemap);
      console.log(`✅ Generated sitemap-${lang}.xml`);
    });
    
    // Generate robots.txt
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    console.log('✅ Generated robots.txt');
    
    console.log('\n🎉 All sitemaps generated successfully!');
    console.log(`📍 Files saved to: ${publicDir}`);
    console.log('\n📋 Generated files:');
    console.log('  - sitemap.xml (index)');
    console.log('  - sitemap-main.xml (all URLs)');
    languages.forEach(lang => {
      console.log(`  - sitemap-${lang}.xml`);
    });
    console.log('  - robots.txt');
    
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

// Run the generator
generateSitemaps();