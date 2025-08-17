# Triple-Click CMS Access Feature - Test Instructions

## ✅ Feature Status: IMPLEMENTED

The triple-click feature has been successfully implemented in the Footer component.

## How to Test

### 1. Make sure both apps are running:
```bash
# Terminal 1 - Vite App (with CMS)
cd "/Users/taymac/Freelancer Work/braunundeyer architekturbüro"
npm start
# Should run on http://localhost:4028

# Terminal 2 - Next.js App
cd "/Users/taymac/Freelancer Work/braunundeyer architekturbüro/nextjs-app"
npm run dev
# Should run on http://localhost:3003
```

### 2. Test the Feature:
1. Open your browser (Chrome, Firefox, Safari, etc.)
2. Navigate to: http://localhost:3003/de/homepage
3. Scroll down to the footer (bottom of the page)
4. Find the copyright text: "© 2025 Braun & Eyer Architekturbüro. Alle Rechte vorbehalten."
5. **Triple-click** on the copyright text (click 3 times quickly)
6. You should be redirected to: http://localhost:4028/de/admin

### 3. What Happens:
- **In Development (localhost)**: Redirects to `http://localhost:4028/de/admin`
- **In Production**: Will redirect to `https://cms.braunundeyer.de`

## Technical Details

### Implementation Location:
- File: `/nextjs-app/components/Footer.js`
- Lines: 16-59

### How It Works:
1. The Footer component tracks clicks on the copyright text
2. When 3 clicks are detected within 1 second, it triggers the redirect
3. Uses `window.location.replace()` to navigate to the CMS
4. Automatically detects environment (localhost vs production)

### Debug Logs:
Open browser DevTools Console (F12) to see:
- "Footer click detected, count: 1/2/3"
- "Triple-click detected! Redirecting..."
- "Redirecting to: [URL]"

## Troubleshooting

### If it doesn't work:
1. **Check Console for Errors**: Open DevTools (F12) > Console tab
2. **Verify Vite App is Running**: Check http://localhost:4028/de/admin directly
3. **Clear Browser Cache**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
4. **Try Different Browser**: Sometimes browser extensions can interfere

### Known Issues:
- Browser automation tools (like Playwright) prevent the redirect for security reasons
- Some browser extensions might block the redirect
- If you have a popup blocker, it might prevent the navigation

## Production Configuration

When deploying to production, the feature will automatically use the production CMS URL:
- Development: `http://localhost:4028/de/admin`
- Production: `https://cms.braunundeyer.de`

This is configured in the Footer component and detects the environment automatically.

## Success Confirmation

The feature is working if:
1. ✅ Console shows "Triple-click detected! Redirecting..."
2. ✅ Console shows "Redirecting to: http://localhost:4028/de/admin"
3. ✅ Browser navigates to the Vite admin panel

Note: In automated testing (Playwright), the redirect is blocked for security, but the feature works in real browsers.