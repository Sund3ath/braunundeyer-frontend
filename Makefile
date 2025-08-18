# Makefile for Braun & Eyer Architekturbüro Docker Setup

.PHONY: help dev prod build-dev build-prod up-dev up-prod down-dev down-prod logs-dev logs-prod clean migrate backup restore

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development Commands
dev: up-dev ## Start development environment

build-dev: ## Build development containers
	docker-compose -f docker-compose.dev.yml build

up-dev: ## Start development containers
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Development environment started!"
	@echo "Backend API: http://localhost:3001"
	@echo "Admin Panel: http://localhost:4029"
	@echo "Next.js App: http://localhost:3000"

down-dev: ## Stop development containers
	docker-compose -f docker-compose.dev.yml down

logs-dev: ## View development logs
	docker-compose -f docker-compose.dev.yml logs -f

# Production Commands
prod: up-prod ## Start production environment

build-prod: ## Build production containers
	docker-compose -f docker-compose.prod.yml build

up-prod: ## Start production containers
	@if [ ! -f .env.production ]; then \
		echo "Error: .env.production file not found!"; \
		echo "Please copy .env.production.example to .env.production and configure it."; \
		exit 1; \
	fi
	docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
	@echo "Production environment started!"
	@echo "API: https://api.braunundeyer.de"
	@echo "CMS: https://cms.braunundeyer.de"
	@echo "Website: https://braunundeyer.de"

down-prod: ## Stop production containers
	docker-compose -f docker-compose.prod.yml down

logs-prod: ## View production logs
	docker-compose -f docker-compose.prod.yml logs -f

# Database Commands
migrate: ## Run database migrations
	docker exec braunundeyer-backend-dev node src/migrations/run.js

backup: ## Backup production database and uploads
	@mkdir -p backups
	@echo "Backing up database..."
	docker exec braunundeyer-backend-prod tar -czf - /app/data > backups/db-backup-$$(date +%Y%m%d-%H%M%S).tar.gz
	@echo "Backing up uploads..."
	docker exec braunundeyer-backend-prod tar -czf - /app/uploads > backups/uploads-backup-$$(date +%Y%m%d-%H%M%S).tar.gz
	@echo "Backup completed!"

restore: ## Restore from backup (Usage: make restore FILE=backups/db-backup-xxx.tar.gz)
	@if [ -z "$(FILE)" ]; then \
		echo "Error: Please specify backup file with FILE=path/to/backup.tar.gz"; \
		exit 1; \
	fi
	@echo "Restoring from $(FILE)..."
	docker exec -i braunundeyer-backend-prod tar -xzf - -C / < $(FILE)
	@echo "Restore completed!"

# Utility Commands
clean: ## Clean up Docker resources
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f

shell-backend: ## Open shell in backend container
	docker exec -it braunundeyer-backend-dev sh

shell-admin: ## Open shell in admin container
	docker exec -it braunundeyer-admin-dev sh

shell-nextjs: ## Open shell in nextjs container
	docker exec -it braunundeyer-nextjs-dev sh

# Testing Commands
test-dev: ## Run tests in development
	docker exec braunundeyer-backend-dev npm test
	docker exec braunundeyer-admin-dev npm test
	docker exec braunundeyer-nextjs-dev npm test

# SSL Certificate Commands (Production)
ssl-renew: ## Renew SSL certificates
	docker exec braunundeyer-traefik traefik renew --cert.resolvers=letsencrypt