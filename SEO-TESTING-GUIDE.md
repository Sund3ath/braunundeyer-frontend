# SEO Testing Guide for Braun & Eyer Website

## 🧪 Local Testing (Before Deployment)

### 1. Start Your Development Server
```bash
npm start
```
Then open http://localhost:5173 in your browser

### 2. Browser DevTools Testing

#### Check Meta Tags
1. Right-click → "View Page Source" or "Inspect"
2. Look in `<head>` section for:
   - `<title>` tags
   - `<meta name="description">`
   - `<meta property="og:*">` (Open Graph)
   - `<meta name="twitter:*">` (Twitter Cards)

#### Check Structured Data
1. Open DevTools Console
2. Search for `<script type="application/ld+json">` in Elements tab
3. Copy the JSON content and validate it

### 3. React Helmet Testing
```bash
# Install React Helmet testing tool
npm install --save-dev react-helmet-async

# Check if Helmet is rendering correctly
# In browser console while app is running:
document.querySelectorAll('meta').forEach(meta => console.log(meta))
```

## 🔧 Online Testing Tools (Most Important!)

### 1. **Google Rich Results Test** ⭐
**URL**: https://search.google.com/test/rich-results
- Test your structured data
- See how your page appears in Google search
- **How to use**:
  1. Deploy your site or use ngrok for local testing
  2. Enter your URL
  3. Check for errors and warnings

### 2. **Google PageSpeed Insights** ⭐
**URL**: https://pagespeed.web.dev/
- Tests Core Web Vitals
- SEO audit included
- Mobile & Desktop scores
- **Key metrics to check**:
  - Performance score (aim for >90)
  - SEO score (should be 100)
  - Best practices

### 3. **Google Mobile-Friendly Test**
**URL**: https://search.google.com/test/mobile-friendly
- Ensures mobile optimization
- Critical for SEO rankings

### 4. **Facebook Sharing Debugger**
**URL**: https://developers.facebook.com/tools/debug/
- Test Open Graph tags
- See preview of shared links
- Clear Facebook's cache

### 5. **Twitter Card Validator**
**URL**: https://cards-dev.twitter.com/validator
- Test Twitter Card implementation
- Preview how tweets will appear

### 6. **Schema Markup Validator**
**URL**: https://validator.schema.org/
- Validate your JSON-LD structured data
- Check for syntax errors

### 7. **SEO Site Checkup**
**URL**: https://seositecheckup.com/
- Comprehensive SEO audit
- Free basic report

## 📊 Chrome Extensions for Testing

### Install These Extensions:
1. **SEO META in 1 CLICK**
   - Shows all meta tags instantly
   - Headers analysis
   - Schema.org data

2. **Lighthouse** (Built into Chrome DevTools)
   - Press F12 → Lighthouse tab
   - Run audit for:
     - Performance
     - SEO
     - Best Practices
     - Accessibility

3. **Wappalyzer**
   - Detect technologies used
   - SEO tools detection

4. **Structured Data Testing Tool**
   - Validates structured data
   - Shows rich snippets preview

## 🚀 Quick Local Test Script

Create this test file to check SEO locally: