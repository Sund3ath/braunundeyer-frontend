#!/bin/bash

# Database Backup Script for Braun & Eyer Production
# This script creates timestamped backups of the SQLite database from Docker volume

# Configuration
BACKUP_DIR="/home/braunundeyer-frontend/backups"
DOCKER_VOLUME_PATH="/var/lib/docker/volumes/braunundeyer-frontend_backend-db/_data/database.sqlite"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/database_backup_${TIMESTAMP}.sqlite"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if database file exists
if [ ! -f "$DOCKER_VOLUME_PATH" ]; then
    echo -e "${RED}Error: Database file not found at $DOCKER_VOLUME_PATH${NC}"
    exit 1
fi

# Create backup
echo "Creating database backup..."
sudo cp "$DOCKER_VOLUME_PATH" "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    # Get file size
    SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
    echo -e "${GREEN}✓ Backup created successfully!${NC}"
    echo "  Location: $BACKUP_FILE"
    echo "  Size: $SIZE"
    
    # Keep only last 7 backups (optional - remove if you want to keep all)
    echo "Cleaning old backups (keeping last 7)..."
    ls -t "$BACKUP_DIR"/database_backup_*.sqlite 2>/dev/null | tail -n +8 | xargs -r rm
    
    # List current backups
    echo -e "\nCurrent backups:"
    ls -lh "$BACKUP_DIR"/database_backup_*.sqlite | tail -5
else
    echo -e "${RED}✗ Backup failed!${NC}"
    exit 1
fi