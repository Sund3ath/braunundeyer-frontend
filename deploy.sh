#!/bin/bash

# Braun & Eyer Production Deployment Script
# Usage: ./deploy.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="braunundeyer"
DEPLOY_PATH="/opt/braunundeyer"
BACKUP_PATH="/var/backups/braunundeyer"
ENV_FILE=".env.production"

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# Install Docker and Docker Compose if not present
install_dependencies() {
    print_info "Checking dependencies..."
    
    # Install Docker
    if ! command -v docker &> /dev/null; then
        print_info "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        print_success "Docker installed"
    else
        print_success "Docker already installed"
    fi
    
    # Install Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_info "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        print_success "Docker Compose installed"
    else
        print_success "Docker Compose already installed"
    fi
    
    # Install other tools
    apt-get update
    apt-get install -y git nginx certbot python3-certbot-nginx ufw fail2ban
}

# Setup firewall
setup_firewall() {
    print_info "Setting up firewall..."
    
    ufw --force enable
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3001/tcp  # Backend API
    
    print_success "Firewall configured"
}

# Setup fail2ban for security
setup_fail2ban() {
    print_info "Setting up fail2ban..."
    
    systemctl enable fail2ban
    systemctl start fail2ban
    
    print_success "Fail2ban configured"
}

# Create necessary directories
setup_directories() {
    print_info "Creating directories..."
    
    mkdir -p $DEPLOY_PATH
    mkdir -p $BACKUP_PATH
    mkdir -p $DEPLOY_PATH/letsencrypt
    mkdir -p $DEPLOY_PATH/uploads
    mkdir -p $DEPLOY_PATH/database
    
    print_success "Directories created"
}

# Clone or update repository
update_code() {
    print_info "Updating code..."
    
    cd $DEPLOY_PATH
    
    if [ -d ".git" ]; then
        git pull origin main
    else
        git clone https://github.com/yourusername/braunundeyer.git .
    fi
    
    print_success "Code updated"
}

# Setup environment variables
setup_env() {
    print_info "Setting up environment variables..."
    
    if [ ! -f "$DEPLOY_PATH/$ENV_FILE" ]; then
        cp $DEPLOY_PATH/.env.production.example $DEPLOY_PATH/$ENV_FILE
        print_error "Please edit $DEPLOY_PATH/$ENV_FILE with your production values"
        exit 1
    fi
    
    print_success "Environment variables configured"
}

# Build and start containers
deploy() {
    print_info "Building and deploying containers..."
    
    cd $DEPLOY_PATH
    
    # Load environment variables
    export $(cat $ENV_FILE | xargs)
    
    # Stop existing containers
    docker-compose -f docker-compose.prod.yml down
    
    # Build and start new containers
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Application deployed"
}

# Backup database and uploads
backup() {
    print_info "Creating backup..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR="$BACKUP_PATH/$TIMESTAMP"
    
    mkdir -p $BACKUP_DIR
    
    # Backup database
    docker exec braunundeyer-backend-prod sqlite3 /app/data/database.sqlite ".backup $BACKUP_DIR/database.sqlite"
    
    # Backup uploads
    docker cp braunundeyer-backend-prod:/app/uploads $BACKUP_DIR/uploads
    
    # Compress backup
    tar -czf "$BACKUP_PATH/backup_$TIMESTAMP.tar.gz" -C $BACKUP_PATH $TIMESTAMP
    rm -rf $BACKUP_DIR
    
    # Remove old backups (keep last 30 days)
    find $BACKUP_PATH -name "backup_*.tar.gz" -mtime +30 -delete
    
    print_success "Backup created: backup_$TIMESTAMP.tar.gz"
}

# Restore from backup
restore() {
    if [ -z "$1" ]; then
        print_error "Please specify backup file"
        echo "Available backups:"
        ls -la $BACKUP_PATH/*.tar.gz
        exit 1
    fi
    
    print_info "Restoring from backup: $1"
    
    # Stop containers
    docker-compose -f docker-compose.prod.yml stop
    
    # Extract backup
    TEMP_DIR="/tmp/restore_$$"
    mkdir -p $TEMP_DIR
    tar -xzf "$BACKUP_PATH/$1" -C $TEMP_DIR
    
    # Restore database
    docker cp $TEMP_DIR/*/database.sqlite braunundeyer-backend-prod:/app/data/database.sqlite
    
    # Restore uploads
    docker cp $TEMP_DIR/*/uploads braunundeyer-backend-prod:/app/
    
    # Cleanup
    rm -rf $TEMP_DIR
    
    # Start containers
    docker-compose -f docker-compose.prod.yml start
    
    print_success "Restore completed"
}

# Check application status
status() {
    print_info "Checking application status..."
    
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    print_info "Container logs (last 20 lines):"
    docker-compose -f docker-compose.prod.yml logs --tail=20
}

# View logs
logs() {
    docker-compose -f docker-compose.prod.yml logs -f
}

# Restart services
restart() {
    print_info "Restarting services..."
    
    docker-compose -f docker-compose.prod.yml restart
    
    print_success "Services restarted"
}

# Update only (pull latest code and rebuild)
update() {
    update_code
    deploy
}

# SSL Certificate setup
setup_ssl() {
    print_info "Setting up SSL certificates..."
    
    # This will be handled by Traefik with Let's Encrypt
    # Just ensure the acme.json file has correct permissions
    touch $DEPLOY_PATH/letsencrypt/acme.json
    chmod 600 $DEPLOY_PATH/letsencrypt/acme.json
    
    print_success "SSL setup completed"
}

# Main installation
install() {
    check_root
    install_dependencies
    setup_firewall
    setup_fail2ban
    setup_directories
    update_code
    setup_env
    setup_ssl
    deploy
    
    print_success "Installation completed!"
    print_info "Please configure your DNS to point to this server:"
    print_info "  - braunundeyer.de → $(curl -s ifconfig.me)"
    print_info "  - api.braunundeyer.de → $(curl -s ifconfig.me)"
    print_info "  - cms.braunundeyer.de → $(curl -s ifconfig.me)"
}

# Help function
show_help() {
    echo "Braun & Eyer Deployment Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  install   - Full installation (first time setup)"
    echo "  deploy    - Deploy/redeploy the application"
    echo "  update    - Update code and redeploy"
    echo "  backup    - Create backup of database and uploads"
    echo "  restore   - Restore from backup"
    echo "  status    - Check application status"
    echo "  logs      - View application logs"
    echo "  restart   - Restart all services"
    echo "  help      - Show this help message"
}

# Main script logic
case "$1" in
    install)
        install
        ;;
    deploy)
        check_root
        deploy
        ;;
    update)
        check_root
        update
        ;;
    backup)
        backup
        ;;
    restore)
        check_root
        restore "$2"
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    restart)
        check_root
        restart
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        exit 1
        ;;
esac