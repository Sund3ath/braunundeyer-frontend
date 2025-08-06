import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://braunundeyer.de';

const staticPages = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString()
  },
  {
    url: '/projekte',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString()
  },
  {
    url: '/ueber-uns',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  {
    url: '/leistungen',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  {
    url: '/kontakt',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString()
  }
];

const projectPages = [
  { id: 'villa-modern', title: 'Villa Modern', category: 'neubau' },
  { id: 'altbau-revival', title: 'Altbau Revival', category: 'sanierung' },
  { id: 'eco-house', title: 'Eco House', category: 'neubau' },
  { id: 'historisches-ensemble', title: 'Historisches Ensemble', category: 'denkmalschutz' },
  { id: 'stadthaus-21', title: 'Stadthaus 21', category: 'neubau' },
  { id: 'kulturzentrum', title: 'Kulturzentrum', category: 'oeffentlich' }
].map(project => ({
  url: `/projekte/${project.id}`,
  changefreq: 'monthly',
  priority: 0.6,
  lastmod: new Date().toISOString()
}));

const allPages = [...staticPages, ...projectPages];

function generateSitemapXML(pages) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}

function generateRobotsTxt() {
  const robotsTxt = `# Braun & Eyer Architekturbüro Robots.txt
# https://www.robotstxt.org/robotstxt.html

# Allow all crawlers
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
Disallow: /*?*
Allow: /assets/images/
Allow: /*.css$
Allow: /*.js$

# Specific crawler rules
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml
`;
  
  return robotsTxt;
}

async function generateSitemap() {
  try {
    const sitemapXML = generateSitemapXML(allPages);
    const publicPath = path.join(process.cwd(), 'public');
    
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemapXML);
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
    
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(path.join(publicPath, 'robots.txt'), robotsTxt);
    console.log('✅ Robots.txt updated successfully at public/robots.txt');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();