import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:4028/de/homepage', { waitUntil: 'networkidle' });
  
  // Wait for content to load
  await page.waitForTimeout(3000);
  
  // Take viewport screenshot
  console.log('Taking viewport screenshot...');
  await page.screenshot({ path: 'homepage-viewport.png' });
  
  // Check for video element
  console.log('\n=== Checking Hero Video ===');
  const videoElement = await page.$('video');
  if (videoElement) {
    const videoSrc = await videoElement.getAttribute('src');
    const videoPoster = await videoElement.getAttribute('poster');
    console.log('✓ Video element found');
    console.log(`  Source: ${videoSrc}`);
    console.log(`  Poster: ${videoPoster}`);
    
    // Check if video is playing
    const isPaused = await videoElement.evaluate(video => video.paused);
    console.log(`  Playing: ${!isPaused}`);
  } else {
    console.log('✗ No video element found');
  }
  
  // Check for images in about section
  console.log('\n=== Checking About Section Images ===');
  
  // Scroll to about section
  const aboutSection = await page.$('#about, [id*="about"], .about-section');
  if (aboutSection) {
    await aboutSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Check for ferienvilla.png
    const ferienvillaImg = await page.$('img[src*="ferienvilla"]');
    if (ferienvillaImg) {
      const src = await ferienvillaImg.getAttribute('src');
      console.log(`✓ Ferienvilla image found: ${src}`);
      const isVisible = await ferienvillaImg.isVisible();
      console.log(`  Visible: ${isVisible}`);
    } else {
      console.log('✗ Ferienvilla image not found');
    }
    
    // Check for innenarchitektur.png
    const innenImg = await page.$('img[src*="innenarchitektur"]');
    if (innenImg) {
      const src = await innenImg.getAttribute('src');
      console.log(`✓ Innenarchitektur image found: ${src}`);
      const isVisible = await innenImg.isVisible();
      console.log(`  Visible: ${isVisible}`);
    } else {
      console.log('✗ Innenarchitektur image not found');
    }
    
    // Take screenshot of about section
    await page.screenshot({ path: 'homepage-about-section.png' });
  }
  
  // Check for project cards
  console.log('\n=== Checking Project Cards ===');
  
  // Scroll to projects section
  const projectsSection = await page.$('#projects, [id*="project"], .projects-section');
  if (projectsSection) {
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Get all project card images
    const projectImages = await page.$$('.project-card img, [class*="project"] img');
    console.log(`Found ${projectImages.length} project images`);
    
    for (let i = 0; i < projectImages.length; i++) {
      const img = projectImages[i];
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      const isVisible = await img.isVisible();
      
      console.log(`\nProject Image ${i + 1}:`);
      console.log(`  Source: ${src}`);
      console.log(`  Alt: ${alt}`);
      console.log(`  Visible: ${isVisible}`);
      
      // Check if it's Unsplash or local
      if (src && src.includes('unsplash')) {
        console.log(`  Type: Unsplash image`);
      } else if (src && src.includes('localhost')) {
        console.log(`  Type: Local image`);
      }
    }
    
    // Take screenshot of projects section
    await page.screenshot({ path: 'homepage-projects-section.png' });
  }
  
  // Take full page screenshot
  console.log('\n=== Taking full page screenshot ===');
  await page.screenshot({ path: 'homepage-full.png', fullPage: true });
  
  // Check for any broken images
  console.log('\n=== Checking for broken images ===');
  const brokenImages = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    const broken = [];
    images.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        broken.push({
          src: img.src,
          alt: img.alt || 'No alt text'
        });
      }
    });
    return broken;
  });
  
  if (brokenImages.length > 0) {
    console.log(`✗ Found ${brokenImages.length} broken images:`);
    brokenImages.forEach(img => {
      console.log(`  - ${img.src} (${img.alt})`);
    });
  } else {
    console.log('✓ No broken images found');
  }
  
  console.log('\n=== Screenshots saved ===');
  console.log('- homepage-viewport.png (initial viewport)');
  console.log('- homepage-about-section.png (about section)');
  console.log('- homepage-projects-section.png (projects section)');
  console.log('- homepage-full.png (full page)');
  
  await browser.close();
})();