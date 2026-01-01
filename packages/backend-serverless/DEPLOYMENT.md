# Lambda Serverless Deployment Guide

This guide explains how to deploy the pure Lambda serverless backend to AWS.

## Prerequisites

1. **AWS Account** with CLI access configured
2. **MongoDB Atlas** cluster (same as NestJS backend)
3. **Node.js 20+** and npm
4. **Serverless Framework v3** (installed globally or locally)

## Infrastructure Changes from NestJS Backend

> [!IMPORTANT]
> If you've already set up infrastructure following `deploy/README-serverless.md`, you need to make these changes:

### CloudFront Behavior Update Required

The old NestJS backend used a `/v1/*` path pattern. The new pure Lambda backend uses different paths:

1. Go to **CloudFront** → Your Distribution → **Behaviors**
2. **Delete** the existing `/v1/*` behavior
3. **Create new behaviors** for each API path:

| Path Pattern | Origin | Cache Policy | Methods |
|--------------|--------|--------------|---------|
| `/public/*` | API Gateway | CachingDisabled | GET, HEAD, OPTIONS |
| `/auth/*` | API Gateway | CachingDisabled | ALL |
| `/admin/*` | API Gateway | CachingDisabled | ALL |

Alternatively, you can create a single behavior:

| Path Pattern | Origin | Cache Policy | Methods |
|--------------|--------|--------------|---------|
| `/api/*` | API Gateway | CachingDisabled | ALL |

Then update the frontend `VITE_API_URL` to use `/api` prefix.

### API Gateway Origin

When you deploy the new backend, you'll get a new API Gateway URL. Update the CloudFront origin:

1. Go to **Origins** tab
2. Edit or create new origin with the new API Gateway domain
3. **Origin path**: Leave empty (HTTP API doesn't need `/prod`)

---

## Deployment Steps

### Step 1: Install Dependencies

```bash
cd packages/backend-serverless
npm install
```

### Step 2: Configure Environment Variables

For **local deployment**, export variables:


```bash
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/tech-journal"
export JWT_SECRET="your-production-secret"
export JWT_EXPIRES_IN="86400"
```

### Step 3: Deploy to AWS

```bash
# Deploy to production
npm run deploy

# Or deploy to dev stage
npm run deploy:dev
```

### Step 4: Note the API Gateway URL

After deployment, you'll see output like:

```
endpoints:
  GET - https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com/public/articles
  GET - https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com/public/articles/{slug}
  ...
```

The base URL is: `https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com`

### Step 5: Update CloudFront (if using custom domain)

1. Add new origin:
   - **Origin domain**: `abc123xyz.execute-api.ap-southeast-1.amazonaws.com`
   - **Protocol**: HTTPS only
   - **Origin path**: Leave empty

2. Create behaviors as described above

### Step 6: Seed Database (First Time Only)

If this is a fresh database:

```bash
export MONGODB_URI="your-connection-string"
npm run seed
```

---

## CI/CD with GitHub Actions

The repository includes a GitHub Actions workflow that automatically deploys on push to `main`.

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Production JWT secret |
| `JWT_EXPIRES_IN` | Token expiration (seconds) |
| `CLOUDFRONT_DISTRIBUTION_ID` | For cache invalidation |

### Workflow File

The workflow in `.github/workflows/deploy-serverless.yml` will:
1. Install dependencies
2. Deploy backend to Lambda
3. Build and deploy frontend to S3
4. Invalidate CloudFront cache

---

## Monitoring & Logs

### View Logs

```bash
# View logs for a specific function
npx serverless logs -f publicGetArticles --stage prod

# Tail logs in real-time
npx serverless logs -f publicGetArticles --stage prod --tail
```

### CloudWatch

All Lambda logs are sent to CloudWatch Logs:
- Log Group: `/aws/lambda/tech-journal-api-prod-{functionName}`

---

## Useful Commands

```bash
# Deploy all functions
npm run deploy

# Deploy to dev stage
npm run deploy:dev

# View deployed info
npx serverless info --stage prod

# Remove entire stack
npm run remove

# Run locally
npm run offline
```

---

## Troubleshooting

### CORS Errors

The HTTP API Gateway is configured with CORS. If you still get errors:
1. Check CloudFront behaviors allow OPTIONS method
2. Verify `AllViewer` or `AllViewerAndCloudFrontHeaders-2022-06` origin request policy

### Cold Starts

Pure Lambda functions have much faster cold starts (~200-500ms) compared to NestJS (~2-5s). If you need even faster:
- Use provisioned concurrency (extra cost)
- Keep functions warm with scheduled pings

### MongoDB Connection Issues

The backend uses connection caching. If connections are failing:
1. Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0` for Lambda)
2. Verify `MONGODB_URI` is correct
3. Check Lambda timeout (currently 29s)

### Deployment Failures

```bash
# View detailed deployment logs
npx serverless deploy --verbose --stage prod

# Check AWS credentials
aws sts get-caller-identity
```

---

## Cost Estimate

| Service | Monthly Estimate |
|---------|------------------|
| Lambda (18 functions) | ~$0 (free tier: 1M requests) |
| HTTP API Gateway | ~$0 (free tier: 1M requests) |
| CloudWatch Logs | ~$0 (first 5GB free) |
| **Total** | **~$0/month** (within free tier) |

After free tier expires: ~$1-3/month for a low-traffic personal blog.
