# Deployment Guide for Braun & Eyer Architekturbüro

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Production Setup](#production-setup)
4. [Domain Configuration](#domain-configuration)
5. [SSL Certificates](#ssl-certificates)
6. [Backup and Restore](#backup-and-restore)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, for using Makefile commands)
- Git

### System Requirements
- **Development**: 4GB RAM, 10GB disk space
- **Production**: 8GB RAM, 20GB disk space
- **OS**: Linux (Ubuntu 20.04+ recommended), macOS, or Windows with WSL2

## Development Setup

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-repo/braunundeyer-architekturbuero.git
cd braunundeyer-architekturbuero

# Start development environment
make dev

# Or without make:
docker-compose -f docker-compose.dev.yml up -d
```

### Access Development Services
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:4029
- **Next.js App**: http://localhost:3000

### Development Commands
```bash
# View logs
make logs-dev

# Stop services
make down-dev

# Rebuild containers
make build-dev

# Access container shell
make shell-backend  # Backend shell
make shell-admin    # Admin panel shell
make shell-nextjs   # Next.js shell
```

## Production Setup

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configure Environment
```bash
# Copy and configure production environment
cp .env.production.example .env.production
nano .env.production

# Required configurations:
# - JWT_SECRET: Generate with: openssl rand -base64 32
# - LETSENCRYPT_EMAIL: Your email for SSL certificates
# - SMTP settings for email functionality
```

### 3. Deploy to Production
```bash
# Build and start production containers
make prod

# Or without make:
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### 4. Initial Database Setup
```bash
# Create initial admin user
docker exec braunundeyer-backend-prod node src/scripts/create-admin.js

# Run migrations if needed
docker exec braunundeyer-backend-prod node src/migrations/run.js
```

## Domain Configuration

### DNS Settings
Add the following A records to your domain:

| Subdomain | Type | Value | Description |
|-----------|------|-------|-------------|
| @ | A | YOUR_SERVER_IP | Main website |
| www | CNAME | braunundeyer.de | WWW redirect |
| api | A | YOUR_SERVER_IP | Backend API |
| cms | A | YOUR_SERVER_IP | Admin panel |

### Nginx Configuration (Alternative to Traefik)
If not using Traefik, configure Nginx:

```nginx
# /etc/nginx/sites-available/braunundeyer.de
server {
    listen 80;
    server_name braunundeyer.de www.braunundeyer.de;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name braunundeyer.de;
    
    ssl_certificate /etc/letsencrypt/live/braunundeyer.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/braunundeyer.de/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Similar configuration for api.braunundeyer.de and cms.braunundeyer.de
```

## SSL Certificates

### Automatic SSL with Traefik
Traefik automatically manages SSL certificates via Let's Encrypt. Ensure:
1. Ports 80 and 443 are open
2. DNS is properly configured
3. Email is set in `.env.production`

### Manual SSL with Certbot
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d braunundeyer.de -d www.braunundeyer.de
sudo certbot --nginx -d api.braunundeyer.de
sudo certbot --nginx -d cms.braunundeyer.de

# Auto-renewal
sudo certbot renew --dry-run
```

## Backup and Restore

### Automated Backups
```bash
# Create backup script
cat > /usr/local/bin/backup-braunundeyer.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/braunundeyer"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker exec braunundeyer-backend-prod tar -czf - /app/data > $BACKUP_DIR/db-$DATE.tar.gz

# Backup uploads
docker exec braunundeyer-backend-prod tar -czf - /app/uploads > $BACKUP_DIR/uploads-$DATE.tar.gz

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-braunundeyer.sh

# Add to crontab (daily at 3 AM)
echo "0 3 * * * /usr/local/bin/backup-braunundeyer.sh" | sudo crontab -
```

### Manual Backup
```bash
make backup
```

### Restore from Backup
```bash
make restore FILE=backups/db-backup-20250118-120000.tar.gz
```

## Monitoring

### Health Checks
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check service health
curl https://api.braunundeyer.de/health
curl https://cms.braunundeyer.de
curl https://braunundeyer.de
```

### Log Monitoring
```bash
# View all logs
make logs-prod

# View specific service logs
docker logs braunundeyer-backend-prod -f
docker logs braunundeyer-admin-prod -f
docker logs braunundeyer-nextjs-prod -f
```

### Resource Monitoring
```bash
# Check resource usage
docker stats

# Check disk usage
df -h
docker system df
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Containers won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check port conflicts
sudo netstat -tulpn | grep -E ':(80|443|3000|3001)'

# Reset and restart
make clean
make prod
```

#### 2. SSL certificate issues
```bash
# Check Traefik logs
docker logs braunundeyer-traefik

# Manually trigger renewal
docker exec braunundeyer-traefik traefik renew --cert.resolvers=letsencrypt

# Check certificate status
docker exec braunundeyer-traefik cat /letsencrypt/acme.json | jq
```

#### 3. Database connection issues
```bash
# Check database file permissions
docker exec braunundeyer-backend-prod ls -la /app/data

# Recreate database
docker exec braunundeyer-backend-prod node src/scripts/init-db.js
```

#### 4. Upload issues
```bash
# Check upload directory permissions
docker exec braunundeyer-backend-prod ls -la /app/uploads

# Fix permissions
docker exec braunundeyer-backend-prod chown -R nodejs:nodejs /app/uploads
```

#### 5. Performance issues
```bash
# Restart services
docker-compose -f docker-compose.prod.yml restart

# Clear Next.js cache
docker exec braunundeyer-nextjs-prod rm -rf .next/cache

# Prune Docker system
docker system prune -a --volumes
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Enable automatic security updates
- [ ] Configure fail2ban for SSH
- [ ] Regular backups configured
- [ ] SSL certificates working
- [ ] Environment variables secured
- [ ] Database encrypted
- [ ] File upload restrictions configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Regular security updates

## Maintenance

### Weekly Tasks
- Check disk space
- Review error logs
- Test backups
- Update dependencies (development)

### Monthly Tasks
- Security updates
- Performance review
- Backup retention cleanup
- SSL certificate check

### Quarterly Tasks
- Full system backup
- Disaster recovery test
- Security audit
- Performance optimization

## Support

For issues or questions:
- Check logs: `make logs-prod`
- Review this documentation
- Contact: support@braunundeyer.de