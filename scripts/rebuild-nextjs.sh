#!/bin/bash
# Script to rebuild Next.js app
# This script runs on the host system, not inside Docker

echo "===========================================" 
echo "Starting Next.js app rebuild..."
echo "Timestamp: $(date)"
echo "===========================================" 

cd /home/braunundeyer-frontend

# Build and deploy Next.js app with Docker Compose
echo "Building Next.js app container..."
docker compose -f docker-compose.prod-nginx.yml up -d --build nextjs-app

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "===========================================" 
    echo "✓ Next.js app rebuilt successfully!"
    echo "✓ The new version is now live."
    echo "Completed at: $(date)"
    echo "===========================================" 
    
    # Log to file
    echo "$(date): Next.js rebuild successful" >> /home/braunundeyer-frontend/logs/rebuild.log
    exit 0
else
    echo "===========================================" 
    echo "✗ Error: Failed to rebuild Next.js app"
    echo "Failed at: $(date)"
    echo "===========================================" 
    
    # Log error to file
    echo "$(date): Next.js rebuild failed" >> /home/braunundeyer-frontend/logs/rebuild.log
    exit 1
fi