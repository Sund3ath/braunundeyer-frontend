# Development Setup - Braun & Eyer Architecture Website

## Overview
This document describes the development environment setup for testing the Next.js migration alongside the existing Vite application with CMS/Admin panel.

## Running Applications

### 1. Next.js Application (Main Website)
- **URL**: http://localhost:3003
- **Start Command**: `cd nextjs-app && npm run dev`
- **Purpose**: New SEO-optimized website

### 2. Vite Application (Admin Panel)
- **URL**: http://localhost:4028
- **Admin Panel**: http://localhost:4028/de/admin
- **Start Command**: `cd .. && npm start`
- **Purpose**: Existing CMS/Admin panel

### 3. Backend API
- **URL**: http://localhost:3001
- **Start Command**: `cd backend && npm start`
- **Purpose**: API for both applications

## Triple-Click CMS Access Feature

### How It Works
1. Navigate to any page in the Next.js app
2. Scroll to the footer
3. Triple-click on the copyright text: "© 2025 Braun & Eyer Architekturbüro. Alle Rechte vorbehalten."
4. You will be redirected to:
   - **Development**: http://localhost:4028/de/admin (Vite admin panel)
   - **Production**: https://cms.braunundeyer.de (CMS subdomain)

### Configuration

#### Development (.env.development)
```env
NEXT_PUBLIC_CMS_URL=http://localhost:4028/de/admin
NEXT_PUBLIC_VITE_URL=http://localhost:4028
NODE_ENV=development
```

#### Production (.env.production)
```env
NEXT_PUBLIC_CMS_URL=https://cms.braunundeyer.de
NODE_ENV=production
```

## Testing Workflow

### 1. Start All Services
```bash
# Terminal 1 - Backend API
cd backend
npm start

# Terminal 2 - Vite App (Admin Panel)
cd ..
npm start

# Terminal 3 - Next.js App
cd nextjs-app
npm run dev
```

### 2. Test Triple-Click Feature
1. Open http://localhost:3003/de in your browser
2. Navigate to any page with a footer
3. Triple-click the copyright text
4. Verify redirect to http://localhost:4028/de/admin

### 3. Test Admin Panel Access
1. The admin panel can also be accessed via keyboard shortcut in Vite app:
   - Press `Ctrl/Cmd + Shift + L` to open login modal
2. Or directly navigate to http://localhost:4028/de/admin

## Environment Variables

### Next.js App
- `.env.local` - Local overrides (not committed)
- `.env.development` - Development defaults
- `.env.production` - Production settings

### Important Variables
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_CMS_URL` - CMS/Admin panel URL
- `NODE_ENV` - Environment (development/production)

## Features Status

✅ **Completed**:
- Next.js migration of all pages
- SEO optimization with SSR
- Multi-language support (DE, EN, FR, IT, ES)
- Triple-click CMS access
- API integration
- Enter animation from landing to homepage
- Responsive design
- Custom cursor effects

🔧 **In Development**:
- Testing triple-click feature
- CMS data integration
- Performance optimization

## Production Deployment

When ready for production:

1. **Build Next.js App**:
```bash
cd nextjs-app
npm run build
```

2. **Configure Production Environment**:
- Update DNS to point main domain to Next.js app
- Configure subdomain `cms.braunundeyer.de` for CMS
- Update environment variables for production URLs

3. **Deploy**:
- Deploy Next.js app to main domain
- Deploy CMS to subdomain or keep using existing Vite app

## Troubleshooting

### Port Already in Use
If you get port conflicts:
- Next.js uses port 3003 (will auto-increment if busy)
- Vite uses port 4028
- Backend API uses port 3001

### Triple-Click Not Working
1. Check browser console for errors
2. Verify both apps are running
3. Clear browser cache
4. Check environment variables are loaded

### CMS Access Issues
1. Ensure Vite app is running on port 4028
2. Check http://localhost:4028/de/admin directly
3. Verify login credentials for admin panel

## Notes
- The Vite app contains the existing CMS/Admin panel
- Next.js app is the new SEO-optimized frontend
- Both apps share the same backend API
- In production, CMS will be on a separate subdomain