# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema (needed for postinstall prisma generate)
COPY prisma ./prisma

# Install all dependencies (including devDependencies for TypeScript compilation)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install production dependencies (including Prisma for client generation)
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client in production
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy any necessary config files
COPY --from=builder /app/.env.example ./.env.example

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    mkdir -p /data && \
    chown nodejs:nodejs /data

USER nodejs

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5001/health || exit 1

# Start the application with migrations
CMD ["./start.sh"]
