# Fix Instructions for Image Loading Issues

## Problem
Next.js Image component fails to load images in Docker environment due to network resolution issues between containers.

## Solution Steps

### 1. Environment Variable Configuration
Update your Docker Compose file to ensure proper URL configuration:

```yaml
# docker-compose.dev.yml
nextjs-app:
  environment:
    - BACKEND_URL=http://backend:3001  # Internal Docker URL
    - NEXT_PUBLIC_BACKEND_URL=http://localhost:3001  # Public URL for client
```

### 2. Update Image Components
When using Next.js Image component, process URLs first:

```javascript
// In your components
import Image from 'next/image';
import { processImageUrl } from '@/lib/utils/image-url';

// Before
<Image src={project.featured_image} ... />

// After
<Image src={processImageUrl(project.featured_image)} ... />
```

### 3. Server-Side Data Fetching
In your page.js files, process image URLs server-side:

```javascript
// app/[lang]/homepage/page.js
import { processImageUrls } from '@/lib/utils/image-url';

export default async function HomePage() {
  let homepageData = await homepageAPI.getConfig();
  
  // Process image URLs for Docker compatibility
  homepageData.heroSlides = processImageUrls(homepageData.heroSlides, ['image']);
  homepageData.featuredProjects = processImageUrls(homepageData.featuredProjects, ['featured_image']);
  
  return <HomepageClient {...homepageData} />;
}
```

### 4. Alternative: Use Plain img Tags (Quick Fix)
If Next.js Image optimization continues to fail, temporarily use standard img tags:

```javascript
// Replace
<Image src={imageUrl} width={800} height={600} alt="..." />

// With
<img src={processImageUrl(imageUrl)} alt="..." className="w-full h-auto" />
```

### 5. Rebuild and Restart
After making changes:

```bash
# Restart containers
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up --build
```

## Verification Steps

1. Check if backend is accessible from Next.js container:
```bash
docker exec braunundeyer-nextjs-dev curl http://backend:3001/uploads/test.jpg
```

2. Check Next.js logs for errors:
```bash
docker logs braunundeyer-nextjs-dev --tail 50
```

3. Verify image URLs in browser DevTools Network tab

## Long-term Solution

Consider using a CDN or object storage service (S3, Cloudinary) for images to avoid Docker networking complexity.