# ===================================
# Stage 1: Build the application
# ===================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_MOCK_DATA=false

# Set environment variables for build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_MOCK_DATA=${VITE_MOCK_DATA}

# Build the application
RUN npm run build

# ===================================
# Stage 2: Production with Nginx
# ===================================
FROM nginx:alpine AS production

# Add labels for better container management
LABEL org.opencontainers.image.title="Tech Journal Frontend"
LABEL org.opencontainers.image.description="React frontend for Tech Journal blog"

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
