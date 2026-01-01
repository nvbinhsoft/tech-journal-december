# Tech Journal - Pure Lambda Serverless Backend

A pure AWS Lambda serverless backend for Tech Journal blog application. Each API endpoint is a separate Lambda function for optimal cold start performance, independent scaling, and easier debugging.

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │            API Gateway (HTTP API v2)    │
                    └────────────────────┬────────────────────┘
                                         │
    ┌────────────────┬───────────────────┼───────────────────┬────────────────┐
    │                │                   │                   │                │
    ▼                ▼                   ▼                   ▼                ▼
┌────────┐    ┌───────────┐       ┌───────────┐       ┌──────────┐    ┌───────────┐
│ Public │    │   Auth    │       │  Articles │       │   Tags   │    │ Settings  │
│ (4λ)   │    │   (3λ)    │       │   (5λ)    │       │   (4λ)   │    │   (2λ)    │
└────────┘    └───────────┘       └───────────┘       └──────────┘    └───────────┘
    │                │                   │                   │                │
    └────────────────┴───────────────────┼───────────────────┴────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │    MongoDB Atlas    │
                              └─────────────────────┘
```

## Features

- **18 Individual Lambda Functions** - One per endpoint for optimal performance
- **HTTP API Gateway v2** - Lower latency and cost than REST API
- **JWT Authentication** - Stateless auth with jsonwebtoken
- **MongoDB Atlas** - Managed database with connection caching
- **ESBuild Bundling** - Fast builds with tree-shaking

## API Endpoints

### Public (No Auth)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/public/articles` | List published articles |
| GET | `/public/articles/{slug}` | Get article by slug |
| GET | `/public/tags` | List all tags |
| GET | `/public/settings` | Get blog settings |

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | ❌ | Admin login |
| POST | `/auth/logout` | ✅ | Logout (stateless) |
| GET | `/auth/me` | ✅ | Get current user |

### Admin (JWT Required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/articles` | List all articles |
| GET | `/admin/articles/{id}` | Get article by ID |
| POST | `/admin/articles` | Create article |
| PUT | `/admin/articles/{id}` | Update article |
| DELETE | `/admin/articles/{id}` | Delete article |
| GET | `/admin/tags` | List all tags |
| POST | `/admin/tags` | Create tag |
| PUT | `/admin/tags/{id}` | Update tag |
| DELETE | `/admin/tags/{id}` | Delete tag |
| GET | `/admin/settings` | Get settings |
| PUT | `/admin/settings` | Update settings |

## Local Development

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Serverless Framework v3

### Setup

```bash
cd packages/backend-serverless
npm install
```

### Environment Variables

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/tech-journal
JWT_SECRET=your-development-secret
JWT_EXPIRES_IN=86400
```

### Run Locally

```bash
# Start serverless-offline
npm run offline

# API available at:
# http://localhost:3001/public/articles
# http://localhost:3001/auth/login
# etc.
```

### Seed Database

```bash
# Set MONGODB_URI first
export MONGODB_URI="mongodb://localhost:27017/tech-journal"
npm run seed
```

This creates:
- Admin user: `admin@techjournal.com` / `admin123`
- Default tags (JavaScript, TypeScript, React, etc.)
- Default blog settings

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

```bash
# Set environment variables
export MONGODB_URI="your-mongodb-uri"
export JWT_SECRET="your-jwt-secret"

# Deploy to AWS
npm run deploy
```

## Project Structure

```
packages/backend-serverless/
├── package.json
├── serverless.yml
├── tsconfig.json
├── DEPLOYMENT.md
└── src/
    ├── lib/
    │   ├── database.ts      # MongoDB connection (cached)
    │   ├── auth.ts          # JWT utilities
    │   └── response.ts      # API response helpers
    ├── models/
    │   ├── Article.ts
    │   ├── Tag.ts
    │   ├── User.ts
    │   └── Settings.ts
    ├── functions/
    │   ├── public/          # 4 Lambda functions
    │   ├── auth/            # 3 Lambda functions
    │   └── admin/           # 11 Lambda functions
    │       ├── articles/
    │       ├── tags/
    │       └── settings/
    └── scripts/
        └── seed.ts
```

## Comparison with NestJS Backend

| Aspect | NestJS (backend) | Pure Lambda (backend-serverless) |
|--------|------------------|----------------------------------|
| Cold Start | ~2-5s | ~200-500ms |
| Bundle Size | ~50MB | ~2-5MB per function |
| Scaling | One Lambda scales | Per-endpoint scaling |
| Debugging | Complex (one codebase) | Simple (per function) |
| Deployment | Single deployment | Individual functions |
| Best For | EC2/Container | Serverless |

## Migration Notes

This backend uses the **same MongoDB database** as the NestJS backend, so:
- Existing data is preserved
- Both backends can run simultaneously (if needed)
- The old `packages/backend` is kept for EC2 deployments
