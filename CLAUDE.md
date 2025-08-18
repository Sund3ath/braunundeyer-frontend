# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-application architecture portfolio system for Braun & Eyer Architekturbüro with four main components:
1. **React App** (Vite) - Original portfolio website on port 4028
2. **Next.js App** - Modern SSR/ISR migration on port 3000  
3. **Admin Panel** (React/Vite) - Full-featured CMS on port 4029
4. **Backend API** (Express/SQLite) - RESTful API on port 3001

## Commands

### Development with Docker
```bash
# Start all services
docker compose -f docker-compose.dev.yml up

# Restart specific service
docker compose -f docker-compose.dev.yml restart nextjs-app

# View logs
docker compose -f docker-compose.dev.yml logs -f [service-name]

# Production deployment
docker compose -f docker-compose.prod.yml up -d
```

### React App (Original)
```bash
cd /                          # Root directory
npm start                     # Dev server on port 4028  
npm run build                 # Build with sitemap to /build
npm run generate-sitemap      # Generate sitemap.xml
npm run test:seo              # Run SEO tests
```

### Next.js App
```bash
cd nextjs-app
npm run dev                   # Dev server on port 3000
npm run build                 # Production build
npm run start                 # Production server
npm run lint                  # Run ESLint
```

### Admin Panel
```bash
cd admin-panel
npm run dev                   # Dev server on port 4029
npm run build                 # Production build
npm run preview               # Preview production build
```

### Backend API
```bash
cd backend
npm start                     # Production server on port 3001
npm run dev                   # Development with nodemon
npm run migrate               # Run database migrations
```

## High-Level Architecture

### Application Communication Flow
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Next.js App │────▶│  Backend API │◀────│ Admin Panel  │
│   Port 3000  │     │   Port 3001  │     │  Port 4029   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                     ┌──────▼──────┐
                     │   SQLite    │
                     │   Database  │
                     └─────────────┘
```

### Database Schema (SQLite)
Key tables and relationships:
- **projects** → **project_translations** (1:N) - Multilingual project data
- **projects** → **hero_slides** (N:1) - Homepage carousel references
- **team_members** - Employee profiles with translations
- **media** - File management with categories and SEO metadata
- **content** - Key-value store for dynamic page content
- **users** - Admin authentication with JWT tokens
- **analytics_*** - Visitor tracking and metrics (pageviews, sessions, visitors)
- **navigation_items** - Hierarchical menu structure
- **services** - Service offerings with translations

### API Endpoint Structure
```
/api/auth                     # JWT authentication
/api/projects                 # Projects CRUD with translations
/api/team                     # Team members management
/api/media                    # File upload with automatic thumbnails
/api/content/{key}            # CMS content (services, footer, navigation)
/api/analytics                # Dashboard metrics and tracking
/api/translate                # DeepSeek AI translation service
/api/services                 # Service categories and process steps
```

### Authentication Flow
1. Login at `/api/auth/login` returns JWT token
2. Store token in localStorage as `token`
3. Include in headers: `Authorization: Bearer {token}`
4. Middleware validates with `authorize(['admin'])` pattern

### Image Handling Strategy
1. **Upload**: Files go to `backend/uploads/`
2. **Processing**: Auto-generates `thumb-` and `medium-` versions
3. **Docker**: Use relative URLs, rewritten to backend container
4. **Next.js**: Image component with blur placeholders
5. **Serving**: Static files at `/uploads/*` via Express

## Next.js App Structure

### App Router Layout
```
app/
  [lang]/                     # Language parameter (de/en/fr/it/es)
    layout.js                 # Root layout with providers
    homepage/                 # Main landing page
      page.js                 # Server component with data fetching
      HomepageClient.js       # Client component with interactivity
    projekte/                 # Projects gallery
      [id]/                   # Dynamic project details
    leistungen/               # Services page
    uber-uns/                 # About page
    kontakt/                  # Contact page
    impressum/                # Legal information (German requirement)
    datenschutz/              # Privacy policy (GDPR)
  api/                        # API routes
    analytics/                # Analytics endpoints
    images/                   # Image proxy routes
```

### Key Implementation Patterns

#### Server Components with Presigned URLs
```javascript
// app/[lang]/homepage/page.js
async function getHomepageDataWithPresignedUrls() {
  const backendUrl = process.env.BACKEND_URL || 'http://backend:3001';
  // Fix URLs for Docker: replace localhost with relative paths
  featuredProjects = featuredProjects.map(project => ({
    ...project,
    featured_image: project.featured_image?.replace('http://localhost:3001', '')
  }));
}
```

#### API Client Pattern
```javascript
// lib/api-client.js
const token = localStorage.getItem('token');
const headers = token ? { Authorization: `Bearer ${token}` } : {};
```

#### Image Configuration (next.config.mjs)
```javascript
images: {
  domains: ['localhost', 'braunundeyer.de'],
  remotePatterns: [
    { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/uploads/**' }
  ]
}
```

## Admin Panel Architecture

### Core CMS Components
Located in `admin-panel/src/cms/`:

**Content Management**
- `ProjectManager.jsx` - Projects with gallery and translations
- `TeamManager.jsx` - Employee profiles with roles
- `ServicesEditor.jsx` - Service categories and process steps
- `ContactSettings.jsx` - Office info, hours, form configuration

**Site Configuration**
- `NavigationManager.jsx` - Drag-and-drop menu builder
- `FooterManager.jsx` - Footer links and social media
- `SEOManager.jsx` - Meta tags, sitemap, robots.txt
- `LegalPagesEditor.jsx` - WYSIWYG with version history

**Media & Analytics**
- `MediaLibraryEnhanced.jsx` - Bulk upload with categories
- `AnalyticsDashboardEnhanced.jsx` - Visitor metrics and charts

### State Management
Uses Redux Toolkit with slices:
- `authSlice` - Authentication state
- `contentSlice` - CMS content cache
- `mediaSlice` - Media library state

## React App (Original Portfolio)

### Routing Structure
- Main router: `src/Routes.jsx`
- Language-based: `/:lang/route-name` (e.g., `/de/projekte`)
- All routes wrapped with `ErrorBoundary` and `ScrollToTop`

### Component Organization
```
src/
  pages/                      # Page components with own directories
    [page-name]/
      index.jsx               # Main page component
      components/             # Page-specific components
  components/                 # Shared components
    ui/                       # Reusable UI elements
      Header.jsx
      AnimatedText.jsx
      CursorTrail.jsx
    SEO.jsx                   # Meta tags via React Helmet
    Footer.jsx                # Global footer
  i18n/                       # Internationalization
    locales/
      [de|en|fr|it|es]/       # Language files
  utils/
    structuredData.js         # JSON-LD generators
```

### Styling System
- TailwindCSS with custom theme
- Design tokens: `text-primary`, `bg-surface`, `border-border`
- Responsive padding: `px-4 sm:px-6 lg:px-8`
- Card pattern: `bg-surface rounded-lg p-6 lg:p-8 border border-border`
- Animations: Framer Motion with custom cursor trail

## Environment Variables

### Backend (.env)
```env
DATABASE_PATH=./database.sqlite
JWT_SECRET=your-secret-key
DEEPSEEK_API_KEY=sk-xxx          # AI translation
PORT=3001
CORS_ORIGIN=http://localhost:3000,http://localhost:4029
```

### Next.js (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
BACKEND_URL=http://backend:3001  # Docker internal
```

### Docker Compose Environment
- Development: `docker-compose.dev.yml` - hot reload, debug logging
- Production: `docker-compose.prod.yml` - optimized builds, Traefik labels

## Critical Implementation Notes

### Database Operations
```javascript
// Use db.exec() for CREATE TABLE statements
db.exec(`CREATE TABLE IF NOT EXISTS table_name ...`);

// Use db.run() for INSERT/UPDATE with parameters
db.run(sql, params, callback);
```

### Authorization Middleware
```javascript
// Correct: Single parameter for roles
export const authorize = (roles) => { /* ... */ }

// Wrong: Spread operator causes issues
export const authorize = (...roles) => { /* ... */ }
```

### Docker Networking
- Services communicate via container names (e.g., `backend:3001`)
- Next.js rewrites `/uploads/*` to backend container
- Use environment-specific URLs for internal vs external access

### Common Issues & Solutions

**Image Loading in Docker**
- Problem: Images fail with localhost URLs
- Solution: Use relative URLs, configure Next.js rewrites

**Authentication Persistence**
- Problem: Token lost on refresh
- Solution: Store in localStorage, check on mount

**CORS Errors**
- Problem: Cross-origin blocked
- Solution: Configure CORS_ORIGIN for all client ports

**Database Migrations**
- Problem: Schema changes not applied
- Solution: Run `npm run migrate` in backend

**React 19 Compatibility**
- Problem: Package conflicts with React 19
- Solution: Use React 18.3.1, compatible package versions

## Testing Approach

### SEO Testing
```bash
npm run test:seo              # Validates meta tags and structured data
```

### Responsive Testing
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

### Language Testing
- Verify all 5 languages render correctly
- Check URL routing with language prefixes
- Validate translation keys exist

### Performance Metrics
- Bundle size < 2MB warning threshold
- Lighthouse scores > 90
- Image optimization with webp format
- Code splitting by route