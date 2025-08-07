# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based architecture portfolio website for Braun & Eyer Architekturbüro built with Vite as the build tool. The application uses modern React patterns with a focus on SEO optimization and performance.

## Tech Stack

- **React 18** with React Router v6 for SPA routing
- **Vite** as the build tool and dev server (port 4028)
- **TailwindCSS** for styling with multiple plugins (forms, typography, animations)
- **Framer Motion** for animations
- **React Helmet** for dynamic SEO meta tags
- **Redux Toolkit** for state management (if needed)
- **Playwright** for browser automation testing

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

### Component Organization
- **Pages**: `src/pages/[page-name]/index.jsx` - Full page components
- **Shared Components**: `src/components/` - Reusable components like SEO, ErrorBoundary
- **UI Components**: `src/components/ui/` - Small UI elements (Header, AnimatedText, etc.)
- **Page-specific Components**: `src/pages/[page-name]/components/` - Components only used by that page

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
5. Add page to sitemap generator if needed

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

### Project Data Structure
The project appears to be for an architecture firm with:
- Landing page with animations and effects
- Project gallery and detail pages
- Service descriptions
- About/Contact/Legal pages (Impressum, Datenschutz)

## Important Files
- `SEO-IMPLEMENTATION.md` - Detailed SEO implementation guide
- `SEO-TESTING-GUIDE.md` - How to test SEO features
- `mcp_settings.json` - MCP (Model Context Protocol) configuration for Playwright automation