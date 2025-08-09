import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console Error:', msg.text());
    }
  });

  // Log network failures
  page.on('requestfailed', request => {
    console.log('Request failed:', request.url(), request.failure().errorText);
  });

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:4028/de/homepage', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Wait for content
  await page.waitForTimeout(5000);
  
  // Get page structure
  console.log('\n=== Page Structure Analysis ===');
  
  const pageStructure = await page.evaluate(() => {
    const structure = {
      title: document.title,
      sections: [],
      videos: [],
      images: [],
      backgroundImages: []
    };
    
    // Find all main sections
    const sections = document.querySelectorAll('section, [class*="section"], div[id]');
    sections.forEach(section => {
      if (section.id || section.className) {
        structure.sections.push({
          tag: section.tagName,
          id: section.id || null,
          className: section.className || null,
          hasContent: section.textContent.trim().length > 0
        });
      }
    });
    
    // Find all videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      structure.videos.push({
        src: video.src || video.querySelector('source')?.src || null,
        poster: video.poster || null,
        autoplay: video.autoplay,
        muted: video.muted,
        loop: video.loop,
        isVisible: video.offsetParent !== null,
        parentClass: video.parentElement?.className || null
      });
    });
    
    // Find all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      structure.images.push({
        src: img.src,
        alt: img.alt || null,
        loading: img.loading || null,
        isVisible: img.offsetParent !== null,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        parentClass: img.parentElement?.className || null
      });
    });
    
    // Check for background images in hero section
    const heroElements = document.querySelectorAll('[class*="hero"], .hero-section, #hero');
    heroElements.forEach(elem => {
      const bgImage = window.getComputedStyle(elem).backgroundImage;
      if (bgImage && bgImage !== 'none') {
        structure.backgroundImages.push({
          element: elem.className || elem.id,
          backgroundImage: bgImage
        });
      }
    });
    
    return structure;
  });
  
  console.log('\nPage Title:', pageStructure.title);
  
  console.log('\n=== Sections Found ===');
  pageStructure.sections.forEach(section => {
    console.log(`- ${section.tag} ${section.id ? `#${section.id}` : ''} ${section.className ? `.${section.className.split(' ').join('.')}` : ''}`);
  });
  
  console.log('\n=== Videos ===');
  if (pageStructure.videos.length > 0) {
    pageStructure.videos.forEach((video, i) => {
      console.log(`\nVideo ${i + 1}:`);
      console.log(`  Source: ${video.src}`);
      console.log(`  Poster: ${video.poster}`);
      console.log(`  Visible: ${video.isVisible}`);
      console.log(`  Settings: autoplay=${video.autoplay}, muted=${video.muted}, loop=${video.loop}`);
      console.log(`  Parent: ${video.parentClass}`);
    });
  } else {
    console.log('No video elements found on the page');
  }
  
  console.log('\n=== Images ===');
  if (pageStructure.images.length > 0) {
    console.log(`Found ${pageStructure.images.length} images:`);
    pageStructure.images.forEach((img, i) => {
      console.log(`\nImage ${i + 1}:`);
      console.log(`  Source: ${img.src}`);
      console.log(`  Alt: ${img.alt}`);
      console.log(`  Visible: ${img.isVisible}`);
      console.log(`  Loaded: ${img.complete && img.naturalWidth > 0}`);
      console.log(`  Dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
      console.log(`  Parent: ${img.parentClass}`);
      
      // Check if it's a local or external image
      if (img.src.includes('localhost')) {
        console.log(`  Type: Local image`);
        
        // Check specific expected images
        if (img.src.includes('ferienvilla')) {
          console.log(`  ✓ This is the Ferienvilla image`);
        } else if (img.src.includes('innenarchitektur')) {
          console.log(`  ✓ This is the Innenarchitektur image`);
        } else if (img.src.includes('hero_modernbuilding')) {
          console.log(`  ✓ This is a hero building image`);
        }
      } else if (img.src.includes('unsplash')) {
        console.log(`  Type: Unsplash image`);
      }
    });
  } else {
    console.log('No img elements found on the page');
  }
  
  console.log('\n=== Background Images ===');
  if (pageStructure.backgroundImages.length > 0) {
    pageStructure.backgroundImages.forEach(bg => {
      console.log(`Element: ${bg.element}`);
      console.log(`Background: ${bg.backgroundImage}`);
    });
  } else {
    console.log('No background images found in hero sections');
  }
  
  // Check for specific expected content
  console.log('\n=== Checking Expected Content ===');
  
  // Check if hero video exists
  const heroVideo = await page.$('video[src*="hero_modernbuilding_video"]');
  if (heroVideo) {
    console.log('✓ Hero video (hero_modernbuilding_video.mp4) found');
  } else {
    console.log('✗ Hero video (hero_modernbuilding_video.mp4) NOT found');
    
    // Check if there's any video in hero section
    const anyHeroVideo = await page.$('.hero-section video, [class*="hero"] video');
    if (anyHeroVideo) {
      const src = await anyHeroVideo.getAttribute('src');
      console.log(`  Found different video in hero: ${src}`);
    }
  }
  
  // Check network requests for media files
  console.log('\n=== Media File Requests ===');
  const mediaRequests = [];
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('.mp4') || url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.webp')) {
      mediaRequests.push({
        url: url,
        method: request.method(),
        resourceType: request.resourceType()
      });
    }
  });
  
  // Reload to capture requests
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  if (mediaRequests.length > 0) {
    console.log('Media files requested:');
    mediaRequests.forEach(req => {
      console.log(`  - ${req.url}`);
    });
  }
  
  // Take annotated screenshots
  console.log('\n=== Taking Annotated Screenshots ===');
  
  // Highlight videos
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach(video => {
      video.style.border = '3px solid red';
      video.style.boxShadow = '0 0 10px red';
    });
  });
  
  // Highlight images
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(img => {
      img.style.border = '3px solid blue';
      img.style.boxShadow = '0 0 10px blue';
    });
  });
  
  await page.screenshot({ path: 'homepage-annotated.png', fullPage: true });
  console.log('Saved annotated screenshot: homepage-annotated.png');
  
  await browser.close();
})();