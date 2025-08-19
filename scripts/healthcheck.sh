#!/bin/bash

# Health Check Script for Braun & Eyer
# Monitors application health and sends alerts if issues detected

set -e

# Configuration
LOG_FILE="/var/log/braunundeyer-health.log"
ALERT_EMAIL="admin@braunundeyer.de"
FRONTEND_URL="https://demo.braunundeyer.de"
API_URL="https://api.demo.braunundeyer.de/health"
CMS_URL="https://cms.demo.braunundeyer.de"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Log function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
    echo -e "$1"
}

# Check function
check_service() {
    local url=$1
    local name=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" $url)
    
    if [ $response -eq 200 ] || [ $response -eq 301 ] || [ $response -eq 302 ]; then
        log_message "${GREEN}✓ $name is healthy (HTTP $response)${NC}"
        return 0
    else
        log_message "${RED}✗ $name is down (HTTP $response)${NC}"
        return 1
    fi
}

# Check Docker containers
check_containers() {
    log_message "${YELLOW}Checking Docker containers...${NC}"
    
    containers=("braunundeyer-backend-prod" "braunundeyer-nextjs-prod" "braunundeyer-admin-prod" "braunundeyer-traefik")
    
    for container in "${containers[@]}"; do
        if docker ps | grep -q $container; then
            log_message "${GREEN}✓ $container is running${NC}"
        else
            log_message "${RED}✗ $container is not running${NC}"
            # Try to restart the container
            docker-compose -f /opt/braunundeyer/docker-compose.prod.yml restart $(echo $container | sed 's/braunundeyer-//' | sed 's/-prod//')
        fi
    done
}

# Check disk space
check_disk_space() {
    log_message "${YELLOW}Checking disk space...${NC}"
    
    usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ $usage -gt 90 ]; then
        log_message "${RED}✗ Disk usage critical: $usage%${NC}"
        # Send alert
        echo "Disk usage is at $usage% on Braun & Eyer server" | mail -s "ALERT: Disk Space Critical" $ALERT_EMAIL
    elif [ $usage -gt 80 ]; then
        log_message "${YELLOW}⚠ Disk usage warning: $usage%${NC}"
    else
        log_message "${GREEN}✓ Disk usage normal: $usage%${NC}"
    fi
}

# Check memory usage
check_memory() {
    log_message "${YELLOW}Checking memory usage...${NC}"
    
    memory_usage=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    
    if [ $memory_usage -gt 90 ]; then
        log_message "${RED}✗ Memory usage critical: $memory_usage%${NC}"
        # Send alert
        echo "Memory usage is at $memory_usage% on Braun & Eyer server" | mail -s "ALERT: Memory Usage Critical" $ALERT_EMAIL
    elif [ $memory_usage -gt 80 ]; then
        log_message "${YELLOW}⚠ Memory usage warning: $memory_usage%${NC}"
    else
        log_message "${GREEN}✓ Memory usage normal: $memory_usage%${NC}"
    fi
}

# Check SSL certificates
check_ssl() {
    log_message "${YELLOW}Checking SSL certificates...${NC}"
    
    domains=("demo.braunundeyer.de" "api.demo.braunundeyer.de" "cms.demo.braunundeyer.de")
    
    for domain in "${domains[@]}"; do
        expiry_date=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
        
        if [ -n "$expiry_date" ]; then
            expiry_epoch=$(date -d "$expiry_date" +%s)
            current_epoch=$(date +%s)
            days_left=$(( ($expiry_epoch - $current_epoch) / 86400 ))
            
            if [ $days_left -lt 7 ]; then
                log_message "${RED}✗ SSL certificate for $domain expires in $days_left days${NC}"
                echo "SSL certificate for $domain expires in $days_left days" | mail -s "ALERT: SSL Certificate Expiring" $ALERT_EMAIL
            elif [ $days_left -lt 30 ]; then
                log_message "${YELLOW}⚠ SSL certificate for $domain expires in $days_left days${NC}"
            else
                log_message "${GREEN}✓ SSL certificate for $domain valid for $days_left days${NC}"
            fi
        else
            log_message "${RED}✗ Could not check SSL certificate for $domain${NC}"
        fi
    done
}

# Main health check
main() {
    log_message "========================================="
    log_message "Starting health check..."
    
    # Check services
    check_service $FRONTEND_URL "Frontend"
    check_service $API_URL "API"
    check_service $CMS_URL "CMS"
    
    # Check containers
    check_containers
    
    # Check resources
    check_disk_space
    check_memory
    
    # Check SSL
    check_ssl
    
    log_message "Health check completed"
    log_message "========================================="
}

# Run main function
main