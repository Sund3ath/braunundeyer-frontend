const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Homepage
  console.log('Saving Homepage...');
  await page.goto('http://localhost:4028/homepage', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.pdf({
    path: 'braun-eyer-pdfs/01-startseite.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  // Projekte
  console.log('Saving Projekte...');
  await page.goto('http://localhost:4028/project-gallery', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.pdf({
    path: 'braun-eyer-pdfs/02-projekte.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  // Über uns
  console.log('Saving Über uns...');
  await page.goto('http://localhost:4028/about-us', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.pdf({
    path: 'braun-eyer-pdfs/03-ueber-uns.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  // Leistungen
  console.log('Saving Leistungen...');
  await page.goto('http://localhost:4028/services', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.pdf({
    path: 'braun-eyer-pdfs/04-leistungen.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  // Kontakt
  console.log('Saving Kontakt...');
  await page.goto('http://localhost:4028/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.pdf({
    path: 'braun-eyer-pdfs/05-kontakt.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  await browser.close();
  console.log('All PDFs saved successfully!');
})();