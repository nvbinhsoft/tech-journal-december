# Tech Journal Monorepo

A unified repository for Tech Journal's frontend (React) and backend (NestJS) applications.

## Structure

```
tech-journal-monorepo/
├── packages/
│   ├── frontend/          # React + Vite frontend
│   └── backend/           # NestJS API
├── deploy/                # AWS deployment scripts
├── docker-compose.prod.yml
└── package.json           # Workspace root
```

## Quick Start

### Install Dependencies

```bash
npm install
```

This will install dependencies for both frontend and backend using npm workspaces.

### Development

```bash
# Run frontend dev server (http://localhost:8080)
npm run dev:frontend

# Run backend dev server (http://localhost:3000)
npm run dev:backend
```

### Build

```bash
# Build both projects
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

### Docker Production Build

```bash
# Build Docker images
npm run docker:build

# Start containers
npm run docker:up

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

## Working with Individual Packages

```bash
# Install package in frontend
npm install <package-name> -w packages/frontend

# Install package in backend
npm install <package-name> -w packages/backend

# Run scripts in specific workspace
npm run <script> -w packages/frontend
npm run <script> -w packages/backend
```

## Deployment

See [deploy/README.md](deploy/README.md) for AWS deployment instructions.

## Environment Variables

Each package has its own environment configuration:

- **Frontend**: `packages/frontend/.env.example`
- **Backend**: `packages/backend/.env.example`
- **Production**: `packages/backend/.env.production.example`

## Tech Stack

| Package | Technologies |
|---------|-------------|
| Frontend | React, Vite, TailwindCSS, Zustand |
| Backend | NestJS, MongoDB, Passport JWT |

## License

MIT
