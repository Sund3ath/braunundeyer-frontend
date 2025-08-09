import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  // Monitor console for errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console Error:', msg.text());
    }
  });

  // Monitor failed network requests
  page.on('requestfailed', request => {
    console.log('Request failed:', request.url(), '-', request.failure().errorText);
  });

  console.log('Navigating to updated homepage...');
  await page.goto('http://localhost:4028/de/homepage', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Wait for content to fully load
  await page.waitForTimeout(5000);
  
  console.log('\n=== Testing Video in Hero Section ===');
  
  // Check for video element
  const videoElement = await page.$('video');
  if (videoElement) {
    const videoSrc = await videoElement.getAttribute('src');
    const videoPoster = await videoElement.getAttribute('poster');
    const isVisible = await videoElement.isVisible();
    const isPaused = await videoElement.evaluate(video => video.paused);
    
    console.log('✓ Video element found');
    console.log(`  Source: ${videoSrc}`);
    console.log(`  Poster: ${videoPoster}`);
    console.log(`  Visible: ${isVisible}`);
    console.log(`  Playing: ${!isPaused}`);
    
    // Check if video contains expected file
    if (videoSrc && videoSrc.includes('hero_modernbuilding_video.mp4')) {
      console.log('  ✓ Correct video file loaded (hero_modernbuilding_video.mp4)');
    } else {
      console.log('  ✗ Video source does not match expected file');
    }
  } else {
    console.log('✗ No video element found in hero section');
  }
  
  console.log('\n=== Testing Local Images ===');
  
  // Check for specific local images
  const expectedLocalImages = [
    'ferienvilla.png',
    'innenarchitektur.png',
    'alt_neu_ungestaltung.png',
    'sarnierung_alt_neu.png'
  ];
  
  const images = await page.$$eval('img', imgs => 
    imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      loaded: img.complete && img.naturalWidth > 0,
      visible: img.offsetParent !== null
    }))
  );
  
  console.log(`Found ${images.length} total images on the page`);
  
  expectedLocalImages.forEach(expectedImg => {
    const found = images.find(img => img.src.includes(expectedImg));
    if (found) {
      console.log(`✓ ${expectedImg}: ${found.loaded ? 'Loaded' : 'NOT loaded'}, ${found.visible ? 'Visible' : 'Hidden'}`);
    } else {
      console.log(`✗ ${expectedImg}: Not found on page`);
    }
  });
  
  console.log('\n=== Testing Unsplash Images ===');
  
  const unsplashImages = images.filter(img => img.src.includes('unsplash'));
  if (unsplashImages.length > 0) {
    console.log(`✓ Found ${unsplashImages.length} Unsplash images`);
    unsplashImages.forEach((img, i) => {
      console.log(`  Image ${i + 1}: ${img.loaded ? 'Loaded' : 'NOT loaded'}, ${img.visible ? 'Visible' : 'Hidden'}`);
    });
  } else {
    console.log('✗ No Unsplash images found');
  }
  
  console.log('\n=== Checking for Broken Images ===');
  
  const brokenImages = images.filter(img => !img.loaded);
  if (brokenImages.length > 0) {
    console.log(`✗ Found ${brokenImages.length} broken images:`);
    brokenImages.forEach(img => {
      console.log(`  - ${img.src}`);
    });
  } else {
    console.log('✓ No broken images detected');
  }
  
  console.log('\n=== Checking for no_image.png fallbacks ===');
  
  const fallbackImages = images.filter(img => img.src.includes('no_image.png'));
  if (fallbackImages.length > 0) {
    console.log(`⚠ Found ${fallbackImages.length} images using no_image.png fallback`);
    console.log('This may indicate missing images that need to be addressed');
  } else {
    console.log('✓ No fallback images detected - all images loading from intended sources');
  }
  
  // Take screenshots for visual verification
  console.log('\n=== Taking Screenshots ===');
  
  // Full page screenshot
  await page.screenshot({ path: 'homepage-updated-full.png', fullPage: true });
  console.log('✓ Full page screenshot saved: homepage-updated-full.png');
  
  // Hero section only
  const heroSection = await page.$('section');
  if (heroSection) {
    await heroSection.screenshot({ path: 'homepage-updated-hero.png' });
    console.log('✓ Hero section screenshot saved: homepage-updated-hero.png');
  }
  
  // Scroll to projects section and screenshot
  await page.evaluate(() => {
    const projectsSection = document.querySelector('.grid');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'homepage-updated-projects.png' });
  console.log('✓ Projects section screenshot saved: homepage-updated-projects.png');
  
  console.log('\n=== Test Complete ===');
  console.log('Review the screenshots to visually verify all content is displaying correctly.');
  
  await browser.close();
})();