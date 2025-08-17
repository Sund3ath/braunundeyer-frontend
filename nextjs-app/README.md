# Braun & Eyer Architekturbüro - Next.js Migration

## Overview
This is the Next.js 15 migration of the Braun & Eyer Architekturbüro website, featuring Server-Side Rendering (SSR) for improved SEO across 5 languages (German, English, French, Italian, Spanish).

## Features
- ✅ **Next.js 15 App Router** - Modern React framework with SSR/SSG
- ✅ **Multi-language Support** - Full i18n with 5 languages
- ✅ **SEO Optimized** - Server-side rendering for better search engine visibility
- ✅ **Dynamic Routing** - Language-based routing with automatic detection
- ✅ **API Integration** - Connected to existing backend (port 3001)
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Image Optimization** - Next.js Image component for performance

## Project Structure
```
nextjs-app/
├── app/
│   ├── [lang]/                    # Dynamic language routing
│   │   ├── page.js                # Homepage
│   │   ├── layout.js              # Language layout
│   │   ├── projekte/              # Projects gallery
│   │   │   ├── page.js
│   │   │   └── [id]/              # Project detail
│   │   │       └── page.js
│   │   ├── uber-uns/              # About page
│   │   ├── leistungen/            # Services
│   │   ├── kontakt/               # Contact
│   │   ├── impressum/             # Legal - Imprint
│   │   └── datenschutz/           # Legal - Privacy
│   ├── layout.js                  # Root layout
│   └── globals.css                # Global styles
├── components/                     # Reusable components
│   ├── Header.js
│   ├── Footer.js
│   └── LanguageSwitcher.js
├── lib/                           # Utilities and configurations
│   ├── api.js                    # API client
│   ├── i18n.js                   # i18n configuration
│   ├── dictionaries.js           # Translation loader
│   └── locales/                  # Translation files
├── public/                        # Static assets
└── middleware.js                  # Language detection middleware
```

## Development

### Prerequisites
- Node.js 18+ 
- Backend API running on port 3001

### Installation
```bash
npm install
```

### Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_CMS_URL=https://cms.braunundeyer.de
NEXT_PUBLIC_SITE_URL=https://braunundeyer.de
```

### Running Development Server
```bash
npm run dev
```
Access at: http://localhost:3000

### Building for Production
```bash
npm run build
npm start
```

## Migration Status

### ✅ Completed
- Next.js 15 project setup with App Router
- Tailwind CSS configuration
- i18n middleware and language routing
- Translation files migration
- Header and Footer components
- Homepage implementation
- Projects gallery page
- About Us page
- API integration setup

### 🚧 In Progress
- Project detail page with dynamic routing
- Services page
- Contact page with form
- Legal pages (Impressum, Datenschutz)

### 📋 TODO
- Complete remaining page migrations
- Implement contact form functionality  
- Add sitemap generation
- Set up robots.txt
- Optimize images with Next.js Image
- Add structured data for SEO
- Performance optimization
- Testing and QA

## Key Differences from React/Vite Version

1. **Routing**: App Router instead of React Router
2. **SEO**: Server-side rendering with metadata API
3. **i18n**: Middleware-based language detection
4. **Data Fetching**: Server Components with async/await
5. **Images**: Next.js Image component for optimization

## CMS Separation
The CMS will be deployed separately on `cms.braunundeyer.de` subdomain, maintaining the existing React-based admin interface. The main website fetches content via API from the backend.

## Deployment
The application is ready for deployment on:
- Vercel (recommended)
- AWS Amplify
- Netlify
- Self-hosted with Node.js

## API Endpoints
The backend API runs on port 3001 with endpoints:
- `/api/projects` - Project listings
- `/api/content` - CMS content
- `/api/media` - Media assets
- `/api/auth` - Authentication (CMS only)

## Language Support
- 🇩🇪 German (de) - Default
- 🇬🇧 English (en)
- 🇫🇷 French (fr)
- 🇮🇹 Italian (it) 
- 🇪🇸 Spanish (es)

## Performance Optimizations
- Static generation for unchanging pages
- ISR for project pages
- Image optimization with Next.js Image
- Code splitting automatic with App Router
- Font optimization with next/font

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
Private - Braun & Eyer Architekturbüro