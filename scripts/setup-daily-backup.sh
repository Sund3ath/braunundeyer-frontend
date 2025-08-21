#!/bin/bash

# Setup daily database backup cron job

SCRIPT_PATH="/home/braunundeyer-frontend/scripts/backup-database.sh"
CRON_TIME="0 2 * * *"  # Daily at 2 AM

# Add to root's crontab (since we need sudo for Docker volume access)
(sudo crontab -l 2>/dev/null | grep -v "$SCRIPT_PATH"; echo "$CRON_TIME $SCRIPT_PATH") | sudo crontab -

echo "Daily backup cron job configured!"
echo "Backups will run daily at 2:00 AM"
echo ""
echo "Current cron jobs:"
sudo crontab -l | grep backup-database