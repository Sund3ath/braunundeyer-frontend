# Production Deployment Guide

## Architecture Overview

The application consists of three main components that can be deployed on a single Linux server:

1. **Backend API** (Port 3001) - Express.js API server
2. **Admin Panel** (Port 4029) - React Vite application for CMS
3. **Next.js Frontend** (Port 3000) - Public-facing website

## Server Requirements

- Linux server (Ubuntu 20.04+ or similar)
- Node.js 18+ and npm
- Nginx (for reverse proxy)
- PM2 (for process management)
- SQLite3
- 2GB+ RAM recommended
- SSL certificates (Let's Encrypt recommended)

## Deployment Structure

```
/var/www/braunundeyer/
├── backend/           # API server
│   ├── uploads/       # User uploaded images
│   └── database/      # SQLite database
├── admin-panel/       # Admin CMS
└── nextjs-app/        # Public website
```

## Environment Configuration

### 1. Backend API (.env)
```bash
# /var/www/braunundeyer/backend/.env
NODE_ENV=production
PORT=3001
DATABASE_PATH=./database/braun_eyer.db
JWT_SECRET=your-secure-jwt-secret-here
ALLOWED_ORIGINS=https://braunundeyer.de,https://admin.braunundeyer.de
UPLOAD_DIR=./uploads
```

### 2. Admin Panel (.env)
```bash
# /var/www/braunundeyer/admin-panel/.env
VITE_API_URL=https://api.braunundeyer.de/api
VITE_APP_URL=https://admin.braunundeyer.de
```

### 3. Next.js Frontend (.env.production)
```bash
# /var/www/braunundeyer/nextjs-app/.env.production
NEXT_PUBLIC_API_URL=https://api.braunundeyer.de/api
NEXT_PUBLIC_BACKEND_URL=https://api.braunundeyer.de
NEXT_PUBLIC_SITE_URL=https://braunundeyer.de
```

## Nginx Configuration

### Main site (braunundeyer.de)
```nginx
server {
    listen 443 ssl http2;
    server_name braunundeyer.de www.braunundeyer.de;
    
    ssl_certificate /etc/letsencrypt/live/braunundeyer.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/braunundeyer.de/privkey.pem;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### API subdomain (api.braunundeyer.de)
```nginx
server {
    listen 443 ssl http2;
    server_name api.braunundeyer.de;
    
    ssl_certificate /etc/letsencrypt/live/api.braunundeyer.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.braunundeyer.de/privkey.pem;
    
    # CORS headers
    add_header Access-Control-Allow-Origin "https://braunundeyer.de" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    
    # Static files with caching
    location /uploads {
        alias /var/www/braunundeyer/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeout for large file uploads
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        client_max_body_size 50M;
    }
}
```

### Admin subdomain (admin.braunundeyer.de)
```nginx
server {
    listen 443 ssl http2;
    server_name admin.braunundeyer.de;
    
    ssl_certificate /etc/letsencrypt/live/admin.braunundeyer.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.braunundeyer.de/privkey.pem;
    
    # Basic authentication (optional)
    # auth_basic "Admin Access";
    # auth_basic_user_file /etc/nginx/.htpasswd;
    
    location / {
        proxy_pass http://localhost:4029;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Deployment Steps

### 1. Initial Setup
```bash
# Create application directory
sudo mkdir -p /var/www/braunundeyer
cd /var/www/braunundeyer

# Clone repositories or upload files
# Set proper permissions
sudo chown -R www-data:www-data /var/www/braunundeyer
```

### 2. Backend Deployment
```bash
cd /var/www/braunundeyer/backend
npm install --production
npm run build  # If you have a build step

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Initialize database
npm run migrate  # If you have migrations
```

### 3. Admin Panel Deployment
```bash
cd /var/www/braunundeyer/admin-panel
npm install
npm run build

# The built files will be in dist/
# Serve with a static server or PM2
```

### 4. Next.js Deployment
```bash
cd /var/www/braunundeyer/nextjs-app
npm install
npm run build
```

### 5. PM2 Process Management

Create PM2 ecosystem file:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'braun-api',
      cwd: '/var/www/braunundeyer/backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      max_memory_restart: '500M'
    },
    {
      name: 'braun-admin',
      cwd: '/var/www/braunundeyer/admin-panel',
      script: 'npm',
      args: 'run preview',
      env: {
        NODE_ENV: 'production',
        PORT: 4029
      }
    },
    {
      name: 'braun-nextjs',
      cwd: '/var/www/braunundeyer/nextjs-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '1G'
    }
  ]
};
```

Start all services:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions to enable auto-start
```

## Performance Optimizations

### 1. Image Optimization
- Images uploaded through admin panel are automatically served with caching headers
- Next.js Image component automatically optimizes images
- Consider using WebP format for better compression

### 2. Caching Strategy
- Static assets: 30 days cache
- API responses: Consider implementing Redis for API caching
- Next.js: Built-in ISR (Incremental Static Regeneration) support

### 3. CDN Integration (Optional)
- Use Cloudflare or similar CDN for static assets
- Configure proper cache headers
- Enable Brotli compression

## Monitoring

### PM2 Monitoring
```bash
pm2 monit           # Real-time monitoring
pm2 logs            # View logs
pm2 status          # Check status
```

### Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Backup Strategy

### Daily Backups
```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/braunundeyer"
DATE=$(date +%Y%m%d)

# Backup database
cp /var/www/braunundeyer/backend/database/braun_eyer.db $BACKUP_DIR/db_$DATE.db

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/braunundeyer/backend/uploads

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Security Considerations

1. **SSL/TLS**: Always use HTTPS in production
2. **Firewall**: Configure UFW or iptables
3. **Rate Limiting**: Already implemented in backend
4. **File Upload Validation**: Implement file type and size validation
5. **Environment Variables**: Never commit .env files
6. **Database**: Regular backups and consider encryption at rest
7. **Admin Access**: Consider IP whitelisting for admin panel

## Troubleshooting

### Images not loading
- Check file permissions in uploads directory
- Verify Nginx proxy configuration
- Check CORS headers in backend

### 502 Bad Gateway
- Ensure all services are running: `pm2 status`
- Check logs: `pm2 logs`
- Verify ports are correct

### Performance Issues
- Monitor with `pm2 monit`
- Check Nginx access logs for slow requests
- Consider implementing caching layer

## Update Procedure

```bash
# 1. Backup current deployment
./backup.sh

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
npm install

# 4. Build applications
npm run build

# 5. Restart services
pm2 restart all

# 6. Verify deployment
curl https://braunundeyer.de/health
```

## Support

For issues or questions about deployment, ensure you have:
- Application logs from PM2
- Nginx error logs
- Browser console errors (if applicable)
- Network tab information for failed requests