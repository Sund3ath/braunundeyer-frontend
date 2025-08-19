# Admin Panel Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm install

# Development stage
FROM base AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4029
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# Builder stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build the application
ARG VITE_API_URL
ARG VITE_BACKEND_URL
ARG VITE_SITE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN npm run build

# Production stage - using nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx config for SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://backend:3001; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]