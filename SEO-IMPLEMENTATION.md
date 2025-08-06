# SEO Implementation for Braun & Eyer Architekturbüro

## Overview
This document outlines the comprehensive SEO optimization implemented for the Braun & Eyer Architekturbüro website.

## Implementation Details

### 1. Meta Tags & React Helmet
- **Location**: `src/components/SEO.jsx`
- **Features**:
  - Dynamic title, description, and keywords
  - Open Graph tags for social media sharing
  - Twitter Card support
  - Canonical URLs
  - Language alternates support
  - Viewport and theme-color settings

### 2. Structured Data (JSON-LD)
- **Location**: `src/utils/structuredData.js`
- **Schemas Implemented**:
  - Organization Schema
  - Website Schema
  - Service Schema
  - Project/CreativeWork Schema
  - Breadcrumb Schema
  - FAQ Schema
  - LocalBusiness Schema
  - Person Schema

### 3. Page-Specific SEO

#### Homepage (`src/pages/homepage/index.jsx`)
- Combined Organization, Website, and LocalBusiness schemas
- Optimized for brand searches

#### About Us (`src/pages/about-us/index.jsx`)
- Breadcrumb navigation
- Team member Person schemas
- Company philosophy and history keywords

#### Services (`src/pages/services/index.jsx`)
- Service schema with detailed offerings
- FAQ schema for common questions
- Service-specific keywords

#### Contact (`src/pages/contact/index.jsx`)
- LocalBusiness schema with contact details
- Location and opening hours
- Contact-specific keywords

#### Project Gallery (`src/pages/project-gallery/index.jsx`)
- Portfolio keywords
- Breadcrumb navigation

#### Project Detail (`src/pages/project-detail/index.jsx`)
- Dynamic SEO based on project data
- CreativeWork schema for each project
- Project-specific images and descriptions

### 4. Technical SEO

#### Sitemap
- **Location**: `public/sitemap.xml`
- **Generator**: `generate-sitemap.js`
- Includes all main pages and project pages
- Auto-generated during build process

#### Robots.txt
- **Location**: `public/robots.txt`
- Optimized crawl directives
- Blocks unwanted bots
- Points to sitemap location

### 5. Performance Optimizations
- Lazy loading for images
- Optimized viewport settings
- Mobile-responsive design
- Clean URL structure

## Usage

### Adding SEO to New Pages
```jsx
import SEO from 'components/SEO';
import { generateBreadcrumbSchema } from 'utils/structuredData';

// In your component
const schema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://braunundeyer.de' },
  { name: 'Page Name', url: 'https://braunundeyer.de/page-path' }
]);

return (
  <>
    <SEO 
      title="Page Title | Braun & Eyer"
      description="Page description..."
      keywords="relevant, keywords"
      structuredData={schema}
    />
    {/* Page content */}
  </>
);
```

### Updating Sitemap
1. Add new pages to `generate-sitemap.js`
2. Run `npm run generate-sitemap`
3. Or build will automatically generate it: `npm run build`

## Best Practices
1. Keep titles under 60 characters
2. Keep descriptions between 150-160 characters
3. Use relevant, specific keywords
4. Update structured data when content changes
5. Test with Google's Rich Results Test
6. Monitor in Google Search Console

## SEO Checklist
- ✅ Meta tags on all pages
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Structured data (JSON-LD)
- ✅ XML Sitemap
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Mobile responsive
- ✅ Fast loading times
- ✅ Clean URL structure
- ✅ Breadcrumb navigation
- ✅ Alt text for images
- ✅ Semantic HTML

## Testing Tools
- Google PageSpeed Insights
- Google Rich Results Test
- Google Mobile-Friendly Test
- Facebook Sharing Debugger
- Twitter Card Validator
- Schema.org Validator

## Future Improvements
- [ ] Add hreflang tags for multi-language support
- [ ] Implement dynamic sitemap generation from database
- [ ] Add review/rating schema when available
- [ ] Implement AMP pages for mobile
- [ ] Add web vitals monitoring
- [ ] Implement advanced image optimization
- [ ] Add RSS feed for projects