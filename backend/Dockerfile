# Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Development stage
FROM base AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3001
CMD ["npm", "run", "dev"]

# Builder stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Production stage
FROM base AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/uploads ./uploads

# Create necessary directories with proper permissions
RUN mkdir -p logs uploads && \
    chown -R nodejs:nodejs logs uploads

USER nodejs

EXPOSE 3001

CMD ["node", "src/server.js"]