# Braun & Eyer Production Deployment Guide

## ⚠️ CRITICAL: Read This First!
This guide documents the CORRECT deployment process to avoid data loss and configuration issues.

## System Architecture
- **Backend API**: Express.js with SQLite (port 3001) → api.braunundeyer.de
- **Next.js Frontend**: SSR/SSG app (port 3000) → demo.braunundeyer.de  
- **Admin Panel**: React CMS (port 4029) → cms.braunundeyer.de
- **Reverse Proxy**: Nginx (NOT Traefik)
- **Database**: SQLite in Docker volume `backend-data`

---

## 🚀 CORRECT Deployment Process

### 1. Pre-Deployment Backup (MANDATORY)
```bash
# Backup current database
./scripts/backup-database.sh

# Verify backup
ls -lah /home/braunundeyer-frontend/backups/
```

### 2. Use the CORRECT Docker Compose File
```bash
# ✅ CORRECT - Use this file:
docker compose -f docker-compose.prod-nginx.yml [command]

# ❌ WRONG - DO NOT use:
# docker compose -f docker-compose.prod.yml  # This uses wrong volumes!
```

### 3. Build and Deploy
```bash
# Stop existing containers
docker compose -f docker-compose.prod-nginx.yml down

# Build all services
docker compose -f docker-compose.prod-nginx.yml build

# Start all services
docker compose -f docker-compose.prod-nginx.yml up -d

# Verify all are running
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 📁 Critical File & Volume Locations

### Database (MOST IMPORTANT)
- **Docker Volume Name**: `backend-data` ⚠️ NOT `backend-db`!
- **Container Path**: `/app/data/database.sqlite`
- **Host Path**: `/var/lib/docker/volumes/braunundeyer-frontend_backend-data/_data/database.sqlite`
- **Expected Size**: ~5-6MB (if only 364KB, data is missing!)

### Correct Port Mappings (REQUIRED)
```yaml
# In docker-compose.prod-nginx.yml:
backend:
  ports:
    - "127.0.0.1:3001:3001"  # Required for nginx
nextjs-app:
  ports:
    - "127.0.0.1:3000:3000"  # Required for nginx
admin-panel:
  ports:
    - "127.0.0.1:4029:80"    # Required for nginx
```

---

## 🔧 Environment Variables

### Backend Requirements
```bash
# Create .env file
cat > .env << EOF
JWT_SECRET=your-very-secure-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-min-32-chars
SMTP_PASSWORD=your-smtp-password
DEEPSEEK_API_KEY=sk-your-api-key
EOF
```

### Next.js Build Arguments (in docker-compose.prod-nginx.yml)
```yaml
build:
  args:
    - NEXT_PUBLIC_API_URL=http://api.braunundeyer.de/api
    - NEXT_PUBLIC_BACKEND_URL=http://api.braunundeyer.de
    - NEXT_PUBLIC_SITE_URL=http://demo.braunundeyer.de
    - API_URL_INTERNAL=http://api.braunundeyer.de/api  # Critical for SSG!
```

### CORS Configuration (MUST include all domains)
```yaml
environment:
  - ALLOWED_ORIGINS=http://demo.braunundeyer.de,https://demo.braunundeyer.de,http://braunundeyer.de,https://braunundeyer.de,http://cms.braunundeyer.de,https://cms.braunundeyer.de
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Database Data Loss After Restart
**Symptom**: CMS data missing after container restart
**Cause**: Using wrong Docker volume
**Fix**:
```bash
# Check both volumes
sudo ls -lah /var/lib/docker/volumes/braunundeyer-frontend_backend-data/_data/
sudo ls -lah /var/lib/docker/volumes/braunundeyer-frontend_backend-db/_data/

# Copy larger database to correct volume
sudo cp /var/lib/docker/volumes/braunundeyer-frontend_backend-data/_data/database.sqlite \
        /var/lib/docker/volumes/braunundeyer-frontend_backend-data/_data/database.sqlite

docker restart braunundeyer-backend-prod
```

### Issue 2: Homepage/Gallery Not Showing Content
**Symptom**: Projects page works but homepage/gallery empty
**Cause**: API returning no featured projects
**Fix**:
1. Edit `/nextjs-app/app/[lang]/homepage/page.js`
2. Change `featured: true` to `status: 'published'`
3. Rebuild: `docker compose -f docker-compose.prod-nginx.yml build nextjs-app`

### Issue 3: Images Not Loading (404)
**Symptom**: Images return 404 errors
**Cause**: Missing port mapping
**Fix**: Ensure ports are mapped in docker-compose.prod-nginx.yml

### Issue 4: Wrong Docker Compose File Used
**Symptom**: Various issues after deployment
**Fix**: ALWAYS use `docker-compose.prod-nginx.yml`
```bash
# Stop wrong setup
docker compose -f docker-compose.prod.yml down

# Start correct setup
docker compose -f docker-compose.prod-nginx.yml up -d
```

---

## 🔄 Database Backup & Recovery

### Automatic Daily Backups (Already Configured)
```bash
# Runs daily at 2:00 AM via cron
sudo crontab -l | grep backup
# Output: 0 2 * * * /home/braunundeyer-frontend/scripts/backup-database.sh
```

### Manual Backup
```bash
./scripts/backup-database.sh
```

### Restore from Backup
```bash
# List backups
ls -lah /home/braunundeyer-frontend/backups/

# Restore specific backup
sudo cp /home/braunundeyer-frontend/backups/database_backup_[TIMESTAMP].sqlite \
        /var/lib/docker/volumes/braunundeyer-frontend_backend-data/_data/database.sqlite

docker restart braunundeyer-backend-prod
```

---

## 🔍 Monitoring & Verification

### Check Service Health
```bash
# Container status (all should be healthy/running)
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# API endpoints
curl -I http://api.braunundeyer.de/api/projects
curl -I http://demo.braunundeyer.de/de/homepage
curl -I http://localhost:4029

# Database size (should be ~5-6MB)
sudo ls -lah /var/lib/docker/volumes/braunundeyer-frontend_backend-data/_data/database.sqlite
```

### View Logs
```bash
docker logs braunundeyer-backend-prod --tail 50
docker logs braunundeyer-nextjs-prod --tail 50
docker logs braunundeyer-admin-prod --tail 50
```

---

## 🚨 Emergency Recovery Process

If everything is broken:

```bash
# 1. Stop everything
docker compose -f docker-compose.prod-nginx.yml down

# 2. Find the latest backup
ls -lah /home/braunundeyer-frontend/backups/

# 3. Restore database
sudo cp /home/braunundeyer-frontend/backups/database_backup_[LATEST].sqlite \
        /var/lib/docker/volumes/braunundeyer-frontend_backend-data/_data/database.sqlite

# 4. Rebuild everything
docker compose -f docker-compose.prod-nginx.yml build

# 5. Start services
docker compose -f docker-compose.prod-nginx.yml up -d

# 6. Verify
docker ps --format "table {{.Names}}\t{{.Status}}"
curl -I http://api.braunundeyer.de/api/projects
```

---

## ✅ Deployment Checklist

Before any deployment:
- [ ] Backup database with `./scripts/backup-database.sh`
- [ ] Using `docker-compose.prod-nginx.yml` (NOT docker-compose.prod.yml)
- [ ] Environment variables set in `.env`
- [ ] CORS includes all domains
- [ ] Port mappings configured (3001, 3000, 4029)
- [ ] Database volume is `backend-data` (NOT backend-db)
- [ ] API_URL_INTERNAL set for Next.js build

After deployment:
- [ ] All containers showing as healthy/running
- [ ] Homepage shows projects and hero image
- [ ] Gallery page loads images
- [ ] Admin panel accessible
- [ ] Database size is ~5-6MB (not 364KB)

---

## 📝 Key Commands Reference

```bash
# Deployment
docker compose -f docker-compose.prod-nginx.yml build
docker compose -f docker-compose.prod-nginx.yml up -d

# Backup
./scripts/backup-database.sh

# Logs
docker logs braunundeyer-backend-prod --tail 50
docker logs braunundeyer-nextjs-prod --tail 50

# Status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Restart individual service
docker compose -f docker-compose.prod-nginx.yml restart [service-name]
```

---

## ⚠️ DO NOT DO THIS

1. **NEVER** use `docker compose down -v` (deletes volumes/data!)
2. **NEVER** use `docker-compose.prod.yml` (wrong volume configuration)
3. **NEVER** deploy without backup
4. **NEVER** change database volume from `backend-data` to `backend-db`
5. **NEVER** remove port mappings from docker-compose

---

Last Updated: August 20, 2025
Critical Config File: `/home/braunundeyer-frontend/docker-compose.prod-nginx.yml`