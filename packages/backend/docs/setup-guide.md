# Project Setup Guide

This guide covers the initial setup and configuration for the Engineering Chronicle Blog API.

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or yarn/pnpm)
- **MongoDB**: 6.0 or higher
- **Git**: For version control

---

## Project Initialization

### 1. Create NestJS Project

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create new project
nest new tech-journal-api

# Navigate to project
cd tech-journal-api
```

### 2. Install Dependencies

```bash
# MongoDB/Mongoose
npm install @nestjs/mongoose mongoose

# Authentication
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt

# Validation
npm install class-validator class-transformer

# Configuration
npm install @nestjs/config

# File Upload
npm install @nestjs/platform-express
npm install -D @types/multer

# API Documentation
npm install @nestjs/swagger swagger-ui-express

# Utility
npm install uuid slugify sanitize-html
npm install -D @types/uuid @types/sanitize-html
```

---

## Configuration

### Environment Variables

Create `.env` file:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/tech-journal

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=3600

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Admin (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
```

Create `.env.example` as a template:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/tech-journal

# JWT
JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=3600

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Admin (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

---

## Configuration Module

Create `src/config/configuration.ts`:

```typescript
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'v1',
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tech-journal',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10) || 3600,
  },
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'Admin123!',
  },
});
```

---

## Docker Support (Optional)

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/tech-journal
      - JWT_SECRET=dev-secret-key
    depends_on:
      - mongo
    volumes:
      - ./uploads:/app/uploads

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

---

## Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "seed": "ts-node src/database/seed.ts"
  }
}
```

---

## Project Structure

```
tech-journal-api/
├── docs/                    # Documentation
│   ├── database-design.md
│   ├── api-reference.md
│   └── setup-guide.md
├── src/
│   ├── app.module.ts        # Root module
│   ├── main.ts              # Entry point
│   ├── config/              # Configuration
│   ├── common/              # Shared utilities
│   ├── auth/                # Authentication module
│   ├── users/               # Users module
│   ├── articles/            # Articles module
│   ├── tags/                # Tags module
│   ├── settings/            # Settings module
│   ├── upload/              # File upload module
│   ├── public/              # Public endpoints
│   └── database/            # Seeding and migrations
├── test/                    # E2E tests
├── uploads/                 # Uploaded files
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
└── tsconfig.json
```

---

## Running the Application

### Development

```bash
# Start MongoDB (if not using Docker)
mongod --dbpath /path/to/data

# Start in development mode
npm run start:dev
```

### Production

```bash
# Build
npm run build

# Start
npm run start:prod
```

### With Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

---

## Database Seeding

Run seed script to create initial data:

```bash
npm run seed
```

This creates:
- Default admin user
- Sample tags
- Default blog settings
- (Optional) Sample articles

---

## API Documentation

Swagger documentation is available at:

- **Development**: `http://localhost:3000/api-docs`

---

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## Git Ignore

Add to `.gitignore`:

```
# Dependencies
node_modules/

# Build
dist/

# Environment
.env
.env.local

# Uploads
uploads/*
!uploads/.gitkeep

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store

# Logs
*.log
npm-debug.log*

# Test
coverage/
```
