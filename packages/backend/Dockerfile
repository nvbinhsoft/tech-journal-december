# ===================================
# Stage 1: Build the application
# ===================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ===================================
# Stage 2: Production image
# ===================================
FROM node:20-alpine AS production

# Add labels for better container management
LABEL org.opencontainers.image.title="Tech Journal API"
LABEL org.opencontainers.image.description="NestJS API for Tech Journal blog"

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Switch to non-root user
USER nestjs

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

# Start the application
CMD ["node", "dist/main.js"]
