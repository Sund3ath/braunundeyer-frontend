import puppeteer from 'puppeteer';
import chalk from 'chalk';
import fs from 'fs';

const BASE_URL = 'http://localhost:5173';

const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/ueber-uns', name: 'About Us' },
  { path: '/projekte', name: 'Projects' },
  { path: '/leistungen', name: 'Services' },
  { path: '/kontakt', name: 'Contact' },
  { path: '/projekte?id=1', name: 'Project Detail' }
];

const requiredMetaTags = [
  'description',
  'keywords',
  'author',
  'viewport',
  'robots'
];

const requiredOGTags = [
  'og:title',
  'og:description',
  'og:image',
  'og:url',
  'og:type',
  'og:site_name'
];

const requiredTwitterTags = [
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image'
];

async function testPage(browser, page) {
  console.log(chalk.blue(`\n📄 Testing: ${page.name} (${page.path})`));
  console.log('─'.repeat(50));

  const browserPage = await browser.newPage();
  await browserPage.goto(`${BASE_URL}${page.path}`, { waitUntil: 'networkidle0' });

  // Test Title
  const title = await browserPage.title();
  if (title && title.length > 0) {
    console.log(chalk.green('✅ Title:'), title);
    if (title.length > 60) {
      console.log(chalk.yellow('   ⚠️  Title is too long (>60 chars)'));
    }
  } else {
    console.log(chalk.red('❌ No title found'));
  }

  // Test Meta Tags
  console.log(chalk.cyan('\n🏷️  Meta Tags:'));
  for (const tag of requiredMetaTags) {
    const content = await browserPage.$eval(
      `meta[name="${tag}"]`,
      el => el ? el.content : null
    ).catch(() => null);

    if (content) {
      console.log(chalk.green(`  ✅ ${tag}:`), content.substring(0, 100) + (content.length > 100 ? '...' : ''));
      
      if (tag === 'description' && (content.length < 150 || content.length > 160)) {
        console.log(chalk.yellow(`     ⚠️  Description should be 150-160 chars (current: ${content.length})`));
      }
    } else {
      console.log(chalk.red(`  ❌ ${tag}: Not found`));
    }
  }

  // Test Open Graph Tags
  console.log(chalk.cyan('\n📱 Open Graph Tags:'));
  for (const tag of requiredOGTags) {
    const content = await browserPage.$eval(
      `meta[property="${tag}"]`,
      el => el ? el.content : null
    ).catch(() => null);

    if (content) {
      console.log(chalk.green(`  ✅ ${tag}:`), content.substring(0, 60) + (content.length > 60 ? '...' : ''));
    } else {
      console.log(chalk.red(`  ❌ ${tag}: Not found`));
    }
  }

  // Test Twitter Cards
  console.log(chalk.cyan('\n🐦 Twitter Cards:'));
  for (const tag of requiredTwitterTags) {
    const content = await browserPage.$eval(
      `meta[name="${tag}"]`,
      el => el ? el.content : null
    ).catch(() => null);

    if (content) {
      console.log(chalk.green(`  ✅ ${tag}:`), content.substring(0, 60) + (content.length > 60 ? '...' : ''));
    } else {
      console.log(chalk.red(`  ❌ ${tag}: Not found`));
    }
  }

  // Test Structured Data
  console.log(chalk.cyan('\n📊 Structured Data:'));
  const structuredData = await browserPage.$$eval(
    'script[type="application/ld+json"]',
    scripts => scripts.map(s => s.innerHTML)
  );

  if (structuredData.length > 0) {
    console.log(chalk.green(`  ✅ Found ${structuredData.length} structured data block(s)`));
    structuredData.forEach((data, index) => {
      try {
        const parsed = JSON.parse(data);
        const types = parsed['@type'] || (parsed['@graph'] ? 'Multiple types' : 'Unknown');
        console.log(chalk.gray(`     - Block ${index + 1}: ${types}`));
      } catch (e) {
        console.log(chalk.red(`     ❌ Invalid JSON in block ${index + 1}`));
      }
    });
  } else {
    console.log(chalk.red('  ❌ No structured data found'));
  }

  // Test Canonical URL
  const canonical = await browserPage.$eval(
    'link[rel="canonical"]',
    el => el ? el.href : null
  ).catch(() => null);

  if (canonical) {
    console.log(chalk.green('\n🔗 Canonical URL:'), canonical);
  } else {
    console.log(chalk.yellow('\n⚠️  No canonical URL found'));
  }

  // Test Language
  const lang = await browserPage.$eval(
    'html',
    el => el ? el.lang : null
  ).catch(() => null);

  if (lang) {
    console.log(chalk.green('🌐 Language:'), lang);
  } else {
    console.log(chalk.yellow('⚠️  No language attribute found'));
  }

  await browserPage.close();
}

async function checkRobotsTxt() {
  console.log(chalk.blue('\n🤖 Checking robots.txt'));
  console.log('─'.repeat(50));
  
  const robotsPath = './public/robots.txt';
  if (fs.existsSync(robotsPath)) {
    const content = fs.readFileSync(robotsPath, 'utf8');
    console.log(chalk.green('✅ robots.txt found'));
    
    if (content.includes('Sitemap:')) {
      console.log(chalk.green('✅ Sitemap reference found'));
    } else {
      console.log(chalk.yellow('⚠️  No sitemap reference in robots.txt'));
    }
  } else {
    console.log(chalk.red('❌ robots.txt not found'));
  }
}

async function checkSitemap() {
  console.log(chalk.blue('\n🗺️  Checking sitemap.xml'));
  console.log('─'.repeat(50));
  
  const sitemapPath = './public/sitemap.xml';
  if (fs.existsSync(sitemapPath)) {
    const content = fs.readFileSync(sitemapPath, 'utf8');
    const urlCount = (content.match(/<url>/g) || []).length;
    console.log(chalk.green(`✅ sitemap.xml found with ${urlCount} URLs`));
  } else {
    console.log(chalk.red('❌ sitemap.xml not found'));
  }
}

async function runTests() {
  console.log(chalk.bold.cyan('\n🔍 SEO Testing Report for Braun & Eyer Website\n'));
  console.log(chalk.gray('Make sure your dev server is running on ' + BASE_URL));
  console.log('═'.repeat(50));

  // Check static files first
  checkRobotsTxt();
  checkSitemap();

  // Launch browser for page testing
  console.log(chalk.blue('\n🌐 Starting browser tests...'));
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const page of pages) {
      await testPage(browser, page);
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error during testing:'), error.message);
    console.log(chalk.yellow('\n💡 Make sure your development server is running:'));
    console.log(chalk.gray('   npm start'));
  } finally {
    await browser.close();
  }

  // Summary
  console.log(chalk.bold.cyan('\n📋 Testing Complete!\n'));
  console.log(chalk.yellow('Next steps:'));
  console.log('1. Fix any ❌ errors shown above');
  console.log('2. Address ⚠️  warnings for better SEO');
  console.log('3. Test with online tools (see SEO-TESTING-GUIDE.md)');
  console.log('4. Deploy and test on production URL');
}

// Run the tests
runTests().catch(console.error);