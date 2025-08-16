# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based architecture portfolio website for Braun & Eyer Architekturbüro built with Vite as the build tool. The application uses modern React patterns with a focus on SEO optimization, internationalization, and performance.

## Tech Stack

- **React 18** with React Router v6 for SPA routing
- **Vite** as the build tool and dev server (port 4028)
- **TailwindCSS** for styling with multiple plugins (forms, typography, animations)
- **Framer Motion** for animations and interactive effects
- **React Helmet** for dynamic SEO meta tags
- **React i18next** for internationalization (de, en, fr, it, es)
- **Redux Toolkit** for state management (if needed)
- **Playwright** for browser automation testing and MCP integration

## Commands

```bash
# Development
npm start          # Start dev server on port 4028

# Build
npm run build      # Generate sitemap and build with sourcemaps to /build directory

# Preview build
npm run serve      # Preview production build

# SEO & Sitemap
npm run generate-sitemap  # Generate sitemap.xml
npm run test:seo         # Run SEO tests
```

## Architecture

### Routing Structure
- Main router: `src/Routes.jsx`
- All routes wrapped with ErrorBoundary and ScrollToTop components
- Pages located in `src/pages/` with each page having its own directory
- Language-based routing: `/:lang/route-name` (e.g., `/de/projekte`, `/en/projects`)

### Component Organization
- **Pages**: `src/pages/[page-name]/index.jsx` - Full page components
- **Shared Components**: `src/components/` - Reusable components like SEO, ErrorBoundary
- **UI Components**: `src/components/ui/` - Small UI elements (Header, AnimatedText, CursorTrail, etc.)
- **Page-specific Components**: `src/pages/[page-name]/components/` - Components only used by that page
- **Footer Component**: `src/components/Footer.jsx` - Shared footer with social links and navigation

### Internationalization (i18n)
- **Configuration**: `src/i18n/i18n.js` - Main i18n setup
- **Translations**: `src/i18n/locales/[lang]/` - Translation files for each language
  - Supported languages: German (de), English (en), French (fr), Italian (it), Spanish (es)
  - Translation files: `translation.json`, `about.json`, `services.json`, `contact.json`
- **Language Detection**: Automatic detection from URL path
- **Language Switcher**: Available in Header component

### SEO Implementation
The project has comprehensive SEO optimization:
- **SEO Component**: `src/components/SEO.jsx` - Handles meta tags via React Helmet
- **Structured Data**: `src/utils/structuredData.js` - JSON-LD schema generators
- **Sitemap Generation**: `generate-sitemap.js` - Auto-generates sitemap during build
- Each page should implement SEO with proper meta tags and structured data

### Styling Pattern
- TailwindCSS utility classes for all styling
- Global styles in `src/styles/index.css` and `src/styles/tailwind.css`
- Configured with extensive Tailwind plugins for forms, typography, animations
- Custom cursor implementation with Framer Motion
- Background typography animations for visual interest
- Consistent design system:
  - Primary colors: `text-primary`, `bg-primary`
  - Secondary text: `text-text-secondary`
  - Accent colors: `text-accent`, `bg-accent`
  - Surface colors: `bg-surface`
  - Border colors: `border-border`

### Build Configuration
- Vite config in `vite.config.mjs`
- Output directory: `/build` (not /dist)
- Chunk size warning limit: 2000kb
- Uses `@dhiwise/component-tagger` plugin

## Key Implementation Patterns

### Adding New Pages
1. Create directory in `src/pages/[page-name]/`
2. Add `index.jsx` with the page component
3. Import and add route in `src/Routes.jsx`
4. Implement SEO component with appropriate meta tags
5. Add translations to `src/i18n/locales/[lang]/`
6. Include Header and Footer components
7. Add page to sitemap generator if needed

### Page Structure Template
```jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Footer from 'components/Footer';
import SEO from 'components/SEO';
import CursorTrail from 'components/ui/CursorTrail';

const PageName = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLang = location.pathname.split('/')[1] || i18n.language || 'de';

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <SEO title={t('page.title')} description={t('page.description')} />
      <Header />
      <CursorTrail />
      
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumb />
            {/* Page content */}
          </div>
        </section>
        
        {/* Content sections */}
      </main>
      
      <Footer />
    </div>
  );
};
```

### Internal Navigation
Always use React Router's Link component with language prefix:
```jsx
import { Link } from 'react-router-dom';

// Correct
<Link to={`/${currentLang}/page-name`}>Link Text</Link>

// Incorrect - will cause routing issues
<a href="/page-name">Link Text</a>
```

### SEO for New Pages
Always include SEO component with structured data:
```jsx
import SEO from 'components/SEO';
import { generateBreadcrumbSchema } from 'utils/structuredData';

// Generate appropriate schema
const schema = generateBreadcrumbSchema([...]);

// Use in component
<SEO 
  title="Page Title | Braun & Eyer"
  description="Description..."
  keywords="keywords"
  structuredData={schema}
/>
```

## Project Structure

### Main Pages
- **Landing Page**: `src/pages/landing/` - Main entry point with hero section
- **Homepage**: `src/pages/homepage/` - Alternative homepage layout
- **About Us**: `src/pages/about-us/` - Company information and team
- **Services**: `src/pages/services/` - Service offerings and process
- **Projects Gallery**: `src/pages/project-gallery/` - Portfolio showcase
- **Project Detail**: `src/pages/project-detail/` - Individual project pages
- **Contact**: `src/pages/contact/` - Contact form and information
- **Legal Pages**: 
  - `src/pages/impressum/` - Legal information (German law requirement)
  - `src/pages/datenschutz/` - Privacy policy (GDPR compliance)

### Component Styling Guidelines
- Use consistent card styling: `bg-surface rounded-lg p-6 lg:p-8 border border-border`
- Headers: `font-heading font-light` for main headers, `font-heading font-medium` for subheaders
- Body text: `font-body` with `text-text-secondary` for secondary content
- Interactive elements: Use `transition-colors duration-200` for smooth hover effects
- Spacing: Follow responsive padding pattern `px-4 sm:px-6 lg:px-8`

### Recent Updates (as of last session)
- Removed pricing/fee information from Services and Contact pages
- Updated Contact page headers: Left card shows "Büro" (Office), right shows "Kontakt aufnehmen" (Get in Touch)
- Removed budget field from contact form
- Standardized Impressum and Datenschutz pages with consistent styling
- Fixed internal navigation links to use proper language prefixes
- Added Footer component to all legal pages

## Important Files
- `SEO-IMPLEMENTATION.md` - Detailed SEO implementation guide
- `SEO-TESTING-GUIDE.md` - How to test SEO features
- `mcp_settings.json` - MCP (Model Context Protocol) configuration for Playwright automation
- `tailwind.config.js` - Tailwind CSS configuration with custom theme
- `vite.config.mjs` - Vite build configuration

## Testing & Quality Assurance
- Always test responsive design at mobile, tablet, and desktop breakpoints
- Verify language switching works correctly across all pages
- Ensure all internal links use React Router with proper language prefixes
- Check that SEO meta tags are properly set for each page
- Validate that footer appears consistently on all pages

## Performance Considerations
- Images should be optimized and use appropriate formats
- Use lazy loading for images below the fold
- Implement code splitting for route-based chunks
- Monitor bundle size to stay under 2000kb warning limit

## Accessibility
- Ensure proper heading hierarchy (h1 > h2 > h3)
- Include alt text for all images
- Maintain sufficient color contrast ratios
- Support keyboard navigation throughout the application