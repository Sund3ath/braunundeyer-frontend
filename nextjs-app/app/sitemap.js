export default function sitemap() {
  const baseUrl = 'https://braunundeyer.de';
  const languages = ['de', 'en', 'fr', 'it', 'es'];
  
  const routes = [
    '',
    '/homepage',
    '/projekte',
    '/leistungen',
    '/uber-uns',
    '/kontakt',
    '/impressum',
    '/datenschutz',
  ];

  // Generate URLs for all routes in all languages
  const urls = [];
  
  languages.forEach(lang => {
    routes.forEach(route => {
      urls.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/homepage' ? 'weekly' : 'monthly',
        priority: route === '' || route === '/homepage' ? 1 : 
                 route === '/projekte' || route === '/leistungen' ? 0.9 :
                 route === '/uber-uns' || route === '/kontakt' ? 0.8 :
                 0.5,
        alternates: {
          languages: languages.reduce((acc, l) => {
            acc[l] = `${baseUrl}/${l}${route}`;
            return acc;
          }, {})
        }
      });
    });
    
    // Add project detail pages (example with 12 projects)
    for (let i = 1; i <= 12; i++) {
      urls.push({
        url: `${baseUrl}/${lang}/projekte/${i}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: languages.reduce((acc, l) => {
            acc[l] = `${baseUrl}/${l}/projekte/${i}`;
            return acc;
          }, {})
        }
      });
    }
  });

  return urls;
}