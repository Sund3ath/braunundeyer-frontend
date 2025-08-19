# Production Deployment Guide

## Overview
This guide covers the complete deployment process for the Braun & Eyer Architekturbüro application suite on a Linux server.

## System Requirements

### Minimum Server Specifications
- **OS**: Ubuntu 20.04 LTS or newer (Debian 11+ also supported)
- **CPU**: 2 vCPUs minimum (4 recommended)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 50GB SSD minimum
- **Network**: Static IP address
- **Domains**: 
  - braunundeyer.de (main site)
  - api.braunundeyer.de (backend API)
  - cms.braunundeyer.de (admin panel)

### Software Requirements
- Docker 20.10+
- Docker Compose 2.0+
- Git
- UFW (firewall)
- Fail2ban
- Certbot (handled by Traefik)

## Quick Start

### 1. Initial Server Setup

```bash
# Connect to your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Create deployment directory
mkdir -p /opt/braunundeyer
cd /opt/braunundeyer

# Clone repository
git clone https://github.com/yourusername/braunundeyer.git .

# Make scripts executable
chmod +x deploy.sh
chmod +x scripts/*.sh
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

Required environment variables:
- `JWT_SECRET`: Generate with `openssl rand -base64 32`
- `SMTP_PASSWORD`: Your Strato email password
- `LETSENCRYPT_EMAIL`: Your email for SSL certificates
- `DEEPSEEK_API_KEY`: Your DeepSeek API key for translations

### 3. Run Installation

```bash
# Full installation (first time only)
sudo ./deploy.sh install
```

This will:
- Install Docker and Docker Compose
- Configure firewall (UFW)
- Setup Fail2ban for security
- Create necessary directories
- Build and start all containers
- Setup SSL certificates via Let's Encrypt

### 4. Configure DNS

Point your domains to the server IP:
```
A Record: braunundeyer.de → your-server-ip
A Record: www.braunundeyer.de → your-server-ip
A Record: api.braunundeyer.de → your-server-ip
A Record: cms.braunundeyer.de → your-server-ip
```

## Deployment Commands

### Deploy/Update Application
```bash
# Pull latest code and redeploy
sudo ./deploy.sh update

# Just redeploy (no code update)
sudo ./deploy.sh deploy
```

### Backup Management
```bash
# Create manual backup
sudo ./deploy.sh backup

# Restore from backup
sudo ./deploy.sh restore backup_20240119_120000.tar.gz

# List available backups
ls -la /var/backups/braunundeyer/
```

### Monitoring
```bash
# Check application status
sudo ./deploy.sh status

# View live logs
sudo ./deploy.sh logs

# Run health check
sudo ./scripts/healthcheck.sh
```

### Service Management
```bash
# Restart all services
sudo ./deploy.sh restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# Stop all services
docker-compose -f docker-compose.prod.yml stop

# Start all services
docker-compose -f docker-compose.prod.yml start
```

## Automated Tasks (Cron Jobs)

Setup automated tasks:
```bash
# Edit root's crontab
sudo crontab -e

# Add the following lines:
# Daily backup at 2 AM
0 2 * * * /opt/braunundeyer/scripts/backup.sh

# Health check every 5 minutes
*/5 * * * * /opt/braunundeyer/scripts/healthcheck.sh > /dev/null 2>&1

# Weekly restart (Sunday 4 AM)
0 4 * * 0 cd /opt/braunundeyer && docker-compose -f docker-compose.prod.yml restart

# Database optimization (weekly)
0 5 * * 0 docker exec braunundeyer-backend-prod sqlite3 /app/data/database.sqlite "VACUUM;"
```

## SSL Certificates

SSL certificates are automatically managed by Traefik with Let's Encrypt. They auto-renew before expiration.

### Manual Certificate Operations
```bash
# Check certificate status
docker exec braunundeyer-traefik cat /letsencrypt/acme.json | jq

# Force renewal (if needed)
docker-compose -f docker-compose.prod.yml restart traefik
```

## Security Configuration

### Firewall Rules
The installation script configures UFW with:
- SSH (port 22)
- HTTP (port 80) - redirects to HTTPS
- HTTPS (port 443)
- Backend API (port 3001) - internal only

### Fail2ban
Automatically blocks IPs with repeated failed login attempts.

### Security Headers
All applications include security headers:
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- Content-Security-Policy
- Referrer-Policy

## Database Management

### Access Database
```bash
# Connect to SQLite database
docker exec -it braunundeyer-backend-prod sqlite3 /app/data/database.sqlite

# Export database
docker exec braunundeyer-backend-prod sqlite3 /app/data/database.sqlite .dump > backup.sql

# Import database
docker exec -i braunundeyer-backend-prod sqlite3 /app/data/database.sqlite < backup.sql
```

### Database Optimization
```bash
# Vacuum database (reduces size)
docker exec braunundeyer-backend-prod sqlite3 /app/data/database.sqlite "VACUUM;"

# Analyze database (improves query performance)
docker exec braunundeyer-backend-prod sqlite3 /app/data/database.sqlite "ANALYZE;"
```

## Monitoring & Logs

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# System logs
tail -f /var/log/braunundeyer-backup.log
tail -f /var/log/braunundeyer-health.log
```

### Check Resource Usage
```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h

# Process list
htop
```

## Troubleshooting

### Common Issues

#### 1. Container Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Rebuild container
docker-compose -f docker-compose.prod.yml build --no-cache [service-name]
docker-compose -f docker-compose.prod.yml up -d [service-name]
```

#### 2. SSL Certificate Issues
```bash
# Check Traefik logs
docker-compose -f docker-compose.prod.yml logs traefik

# Reset certificates
rm -rf /opt/braunundeyer/letsencrypt/acme.json
touch /opt/braunundeyer/letsencrypt/acme.json
chmod 600 /opt/braunundeyer/letsencrypt/acme.json
docker-compose -f docker-compose.prod.yml restart traefik
```

#### 3. Database Locked
```bash
# Restart backend
docker-compose -f docker-compose.prod.yml restart backend

# If persists, check for locks
docker exec braunundeyer-backend-prod lsof /app/data/database.sqlite
```

#### 4. Out of Disk Space
```bash
# Clean Docker resources
docker system prune -a -f

# Remove old backups
find /var/backups/braunundeyer -name "backup_*.tar.gz" -mtime +30 -delete

# Clear logs
truncate -s 0 /var/log/braunundeyer-*.log
```

## Performance Optimization

### 1. Enable Caching
Already configured in production builds with:
- Next.js static optimization
- Browser caching headers
- CDN-ready asset optimization

### 2. Database Optimization
```bash
# Run weekly via cron
docker exec braunundeyer-backend-prod sqlite3 /app/data/database.sqlite "VACUUM; ANALYZE;"
```

### 3. Image Optimization
- Images are automatically optimized by Next.js
- Thumbnails generated for uploads
- WebP format support

## Scaling Considerations

### Horizontal Scaling
For high traffic, consider:
1. Load balancer (HAProxy/Nginx)
2. Multiple application instances
3. Separate database server (PostgreSQL/MySQL)
4. CDN for static assets (Cloudflare)

### Vertical Scaling
Increase server resources:
```bash
# Update Docker resource limits in docker-compose.prod.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Backup Strategy

### Automated Backups
- Daily backups at 2 AM
- 30-day retention
- Stored in `/var/backups/braunundeyer/`

### Manual Backup
```bash
sudo ./deploy.sh backup
```

### Off-site Backup (Recommended)
```bash
# Sync to remote server
rsync -avz /var/backups/braunundeyer/ user@backup-server:/backups/braunundeyer/

# Or use rclone for cloud storage
rclone sync /var/backups/braunundeyer/ remote:braunundeyer-backups/
```

## Updates & Maintenance

### Regular Updates
```bash
# Weekly system updates
apt update && apt upgrade -y

# Docker updates
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Application updates
./deploy.sh update
```

### Health Monitoring
The health check script runs every 5 minutes and checks:
- Service availability
- Container status
- Disk space
- Memory usage
- SSL certificate expiry

## Support & Contact

For issues or questions:
- Check logs first: `./deploy.sh logs`
- Run health check: `./scripts/healthcheck.sh`
- Review this documentation

## Security Best Practices

1. **Keep system updated**: Run security updates regularly
2. **Use strong passwords**: Minimum 16 characters for all accounts
3. **Limit SSH access**: Use SSH keys, disable root login
4. **Monitor logs**: Check for suspicious activity
5. **Regular backups**: Test restore process periodically
6. **Firewall rules**: Only open necessary ports
7. **SSL/TLS**: Always use HTTPS, keep certificates valid

## License

This deployment configuration is proprietary to Braun & Eyer Architekturbüro.