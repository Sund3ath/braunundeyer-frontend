#!/bin/bash

# Automated Backup Script for Braun & Eyer
# Can be added to crontab for daily backups

set -e

# Configuration
BACKUP_PATH="/var/backups/braunundeyer"
RETENTION_DAYS=30
LOG_FILE="/var/log/braunundeyer-backup.log"

# Create log entry
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
}

# Start backup
log_message "Starting backup..."

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_PATH/$TIMESTAMP"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
if docker exec braunundeyer-backend-prod sqlite3 /app/data/database.sqlite ".backup $BACKUP_DIR/database.sqlite" 2>> $LOG_FILE; then
    log_message "Database backup successful"
else
    log_message "Database backup failed"
    exit 1
fi

# Backup uploads
if docker cp braunundeyer-backend-prod:/app/uploads $BACKUP_DIR/uploads 2>> $LOG_FILE; then
    log_message "Uploads backup successful"
else
    log_message "Uploads backup failed"
    exit 1
fi

# Compress backup
if tar -czf "$BACKUP_PATH/backup_$TIMESTAMP.tar.gz" -C $BACKUP_PATH $TIMESTAMP 2>> $LOG_FILE; then
    log_message "Backup compressed successfully"
    rm -rf $BACKUP_DIR
else
    log_message "Backup compression failed"
    exit 1
fi

# Remove old backups
find $BACKUP_PATH -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
log_message "Old backups cleaned up"

# Calculate backup size
BACKUP_SIZE=$(du -h "$BACKUP_PATH/backup_$TIMESTAMP.tar.gz" | cut -f1)
log_message "Backup completed successfully. Size: $BACKUP_SIZE"

# Send notification (optional - configure email)
# echo "Backup completed: backup_$TIMESTAMP.tar.gz ($BACKUP_SIZE)" | mail -s "Braun & Eyer Backup Success" admin@braunundeyer.de

exit 0