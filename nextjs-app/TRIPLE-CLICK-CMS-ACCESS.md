# Triple-Click CMS Access Feature

## Overview
The footer copyright text includes a hidden triple-click feature that provides access to the CMS at `https://cms.braunundeyer.de`.

## How It Works

### User Interaction
1. Navigate to any page on the website
2. Scroll to the footer
3. Triple-click (3 rapid clicks) on the copyright text: "© 2025 Braun & Eyer Architekturbüro. Alle Rechte vorbehalten."
4. The browser will redirect to the CMS subdomain: `https://cms.braunundeyer.de`

### Technical Implementation

#### Footer Component (`/components/Footer.js`)
```javascript
const handleCopyrightClick = () => {
  // Clear previous timeout
  if (clickTimeoutRef.current) {
    clearTimeout(clickTimeoutRef.current);
  }
  
  setClickCount(prev => prev + 1);
  
  if (clickCount >= 2) { // Triple click (3 clicks)
    if (onCopyrightClick) {
      onCopyrightClick();
    } else {
      // Redirect to CMS subdomain
      window.location.href = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.braunundeyer.de';
    }
    setClickCount(0);
  } else {
    // Reset count after 1 second
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);
  }
};
```

#### Environment Configuration (`.env.local`)
```
NEXT_PUBLIC_CMS_URL=https://cms.braunundeyer.de
```

## Features
- **Hidden Access**: No visible UI elements indicate the CMS access point
- **Triple-Click Activation**: Requires exactly 3 clicks within 1 second
- **Auto-Reset**: Click counter resets after 1 second of inactivity
- **Fallback URL**: Uses environment variable with hardcoded fallback to `https://cms.braunundeyer.de`
- **Cursor Style**: Copyright text shows pointer cursor on hover
- **User Select Disabled**: Text selection is disabled to prevent accidental text selection during clicks

## Pages with Triple-Click Feature
The feature is available on all pages that include the Footer component:
- Homepage (`/de/homepage`)
- Projects Gallery (`/de/projekte`)
- Project Details (`/de/projekte/[id]`)
- Services (`/de/leistungen`)
- About Us (`/de/uber-uns`)
- Contact (`/de/kontakt`)
- Impressum (`/de/impressum`)
- Datenschutz (`/de/datenschutz`)

## Testing
1. Open the website in a browser
2. Navigate to any page with a footer
3. Triple-click on the copyright text
4. Verify redirection to `https://cms.braunundeyer.de`

## Security Note
This is a hidden feature intended for administrative access. The actual authentication and authorization are handled by the CMS application at the subdomain.