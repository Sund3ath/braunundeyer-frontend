#!/bin/bash

# Setup Cron Jobs for Braun & Eyer

# Add this to root's crontab:
# sudo crontab -e

cat << 'EOF'
# Braun & Eyer Automated Tasks

# Daily backup at 2 AM
0 2 * * * /opt/braunundeyer/scripts/backup.sh

# Health check every 5 minutes
*/5 * * * * /opt/braunundeyer/scripts/healthcheck.sh > /dev/null 2>&1

# Clean up old logs weekly (Sunday at 3 AM)
0 3 * * 0 find /var/log -name "braunundeyer-*.log" -mtime +30 -delete

# Restart containers weekly (Sunday at 4 AM) to prevent memory leaks
0 4 * * 0 cd /opt/braunundeyer && docker-compose -f docker-compose.prod.yml restart

# Update SSL certificates (runs daily but only renews if needed)
0 0 * * * docker exec braunundeyer-traefik traefik --certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json

# Database optimization (weekly)
0 5 * * 0 docker exec braunundeyer-backend-prod sqlite3 /app/data/database.sqlite "VACUUM;"

EOF

echo "Copy the above cron entries and add them using: sudo crontab -e"