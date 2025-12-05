# API Reference Guide

This document supplements the OpenAPI specification with implementation notes for the NestJS backend.

## Base URL

- **Development**: `http://localhost:3000/v1`
- **Production**: `https://api.example.com/v1`

---

## Authentication

### JWT Token Strategy

The API uses JWT (JSON Web Token) for authentication.

**Token Configuration:**
```typescript
{
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',  // 3600 seconds
}
```

**Token Payload:**
```typescript
interface JwtPayload {
  sub: string;      // User ID
  email: string;    // User email
  role: string;     // User role (admin)
  iat: number;      // Issued at
  exp: number;      // Expiration
}
```

### Authentication Flow

1. Client sends `POST /auth/login` with email and password
2. Server validates credentials and returns JWT token
3. Client includes token in `Authorization: Bearer <token>` header
4. Server validates token on protected routes

---

## API Endpoints Summary

### Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/public/articles` | Get published articles |
| GET | `/public/articles/:slug` | Get article by slug |
| GET | `/public/tags` | Get all tags |
| GET | `/public/settings` | Get blog settings |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Admin login |
| POST | `/auth/logout` | Admin logout (requires auth) |
| GET | `/auth/me` | Get current user (requires auth) |

### Admin Endpoints (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/articles` | Get all articles (including drafts) |
| POST | `/admin/articles` | Create new article |
| GET | `/admin/articles/:id` | Get article by ID |
| PUT | `/admin/articles/:id` | Update article |
| DELETE | `/admin/articles/:id` | Delete article |
| GET | `/admin/tags` | Get all tags with counts |
| POST | `/admin/tags` | Create new tag |
| PUT | `/admin/tags/:id` | Update tag |
| DELETE | `/admin/tags/:id` | Delete tag |
| GET | `/admin/settings` | Get blog settings |
| PUT | `/admin/settings` | Update blog settings |
| POST | `/admin/upload` | Upload image |

---

## NestJS Module Structure

```
src/
├── app.module.ts
├── main.ts
├── config/
│   └── configuration.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── dto/
│       ├── login.dto.ts
│       └── login-response.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.service.ts
│   └── schemas/
│       └── user.schema.ts
├── articles/
│   ├── articles.module.ts
│   ├── articles.controller.ts
│   ├── articles.service.ts
│   ├── schemas/
│   │   └── article.schema.ts
│   └── dto/
│       ├── create-article.dto.ts
│       ├── update-article.dto.ts
│       └── article-query.dto.ts
├── tags/
│   ├── tags.module.ts
│   ├── tags.controller.ts
│   ├── tags.service.ts
│   ├── schemas/
│   │   └── tag.schema.ts
│   └── dto/
│       ├── create-tag.dto.ts
│       └── update-tag.dto.ts
├── settings/
│   ├── settings.module.ts
│   ├── settings.controller.ts
│   ├── settings.service.ts
│   ├── schemas/
│   │   └── settings.schema.ts
│   └── dto/
│       └── update-settings.dto.ts
├── upload/
│   ├── upload.module.ts
│   ├── upload.controller.ts
│   └── upload.service.ts
└── public/
    ├── public.module.ts
    └── public.controller.ts
```

---

## Response Wrapper

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... }  // Only for list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [...]  // Optional validation details
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Pagination

List endpoints support pagination with:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-indexed) |
| `limit` | number | 10 | Items per page (max: 100) |
| `sortBy` | string | createdAt | Sort field |
| `sortOrder` | string | desc | Sort direction |

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Filtering & Search

### Articles

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in title, excerpt, content |
| `tags` | string | Comma-separated tag IDs |
| `published` | boolean | Filter by published status (admin only) |

---

## File Upload

- **Endpoint**: `POST /admin/upload`
- **Content-Type**: `multipart/form-data`
- **Field name**: `file`
- **Supported formats**: jpg, png, gif, webp
- **Max file size**: 5MB (configurable)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/images/abc123.jpg",
    "filename": "abc123.jpg",
    "size": 102400,
    "mimeType": "image/jpeg"
  }
}
```
