# Tech Journal - Serverless Deployment Guide

Deploy Tech Journal to AWS serverless architecture (S3 + CloudFront + Lambda).

**Estimated Monthly Cost**: ~$1-3/month (vs ~$10/month on EC2)

---

## Architecture

```
User → CloudFront → S3 (Frontend static files)
                 → API Gateway → Lambda (NestJS API)
                                       ↓
                               MongoDB Atlas
```

---

## Prerequisites

1. **AWS Account** with CLI access configured
2. **MongoDB Atlas** cluster (free tier works)
3. **Custom Domain** (optional) with DNS access
4. **GitHub Repository** with Secrets configured

---

## One-Time AWS Setup

### Step 1: Create IAM User for CI/CD

```bash
# Create user
aws iam create-user --user-name tech-journal-cicd

# Attach required policies
aws iam attach-user-policy --user-name tech-journal-cicd \
  --policy-arn arn:aws:iam::aws:policy/AWSLambda_FullAccess
aws iam attach-user-policy --user-name tech-journal-cicd \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam attach-user-policy --user-name tech-journal-cicd \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess
aws iam attach-user-policy --user-name tech-journal-cicd \
  --policy-arn arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator
aws iam attach-user-policy --user-name tech-journal-cicd \
  --policy-arn arn:aws:iam::aws:policy/IAMFullAccess
aws iam attach-user-policy --user-name tech-journal-cicd \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess

# Create access keys (SAVE THESE!)
aws iam create-access-key --user-name tech-journal-cicd
```

### Step 2: Create S3 Bucket

```bash
# Replace YOUR_USERNAME with your GitHub username (lowercase)
aws s3 mb s3://tech-journal-frontend-YOUR_USERNAME --region ap-southeast-1
```

### Step 3: Request ACM Certificate (for custom domain)

> **Note**: Must be in `us-east-1` region for CloudFront!

```bash
aws acm request-certificate \
  --domain-name your-domain.com \
  --subject-alternative-names "techjournal.your-domain.com" \
  --validation-method DNS \
  --region us-east-1

# Add the DNS CNAME record shown, then wait for validation
```

### Step 4: Deploy Backend (First Time)

```bash
cd packages/backend
npm install
npm run build:lambda

# Set environment variables
export MONGODB_URI="mongodb+srv://..."
export JWT_SECRET="your-secret"
export JWT_EXPIRES_IN="86400"

# Deploy
npx serverless deploy --stage prod

# Note the API Gateway URL in output (needed for CloudFront)
```

### Step 5: Create CloudFront Distribution

1. **Go to CloudFront** → Create Distribution

2. **Origin 1 (S3)**:
   - Domain: `tech-journal-frontend-YOUR_USERNAME.s3.ap-southeast-1.amazonaws.com`
   - Origin access: Origin Access Control (OAC) → Create new

3. **Origin 2 (API Gateway)**:
   - Domain: `xxxxxx.execute-api.ap-southeast-1.amazonaws.com`
   - Origin path: `/prod`

4. **Behaviors**:
   | Path | Origin | Methods |
   |------|--------|---------|
   | Default (`*`) | S3 | GET, HEAD |
   | `/v1/*` | API Gateway | ALL methods |

5. **Settings**:
   - Alternate domain: `techjournal.your-domain.com`
   - SSL certificate: Select your ACM certificate
   - Default root object: `index.html`

6. **Error Pages**: Add custom error response:
   - HTTP 403 → `/index.html` (200 OK) - for SPA routing

7. **Copy the Distribution ID** for GitHub Secrets

### Step 6: Update S3 Bucket Policy

After creating CloudFront, update S3 bucket policy:

```bash
cat > /tmp/bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "CloudFrontAccess",
    "Effect": "Allow",
    "Principal": {"Service": "cloudfront.amazonaws.com"},
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::tech-journal-frontend-YOUR_USERNAME/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::YOUR_AWS_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
      }
    }
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket tech-journal-frontend-YOUR_USERNAME \
  --policy file:///tmp/bucket-policy.json
```

### Step 7: Configure GitHub Secrets

Go to **GitHub Repository** → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `AWS_ACCESS_KEY_ID` | From Step 1 |
| `AWS_SECRET_ACCESS_KEY` | From Step 1 |
| `CLOUDFRONT_DISTRIBUTION_ID` | From Step 5 |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your production JWT secret |
| `JWT_EXPIRES_IN` | `86400` (optional, defaults to 24h) |

### Step 8: Update DNS

Add CNAME record pointing your domain to CloudFront:
- **Name**: `techjournal` (or your subdomain)
- **Value**: `xxxxxx.cloudfront.net`

---

## Deployment

After initial setup, deployment is automatic:

1. Push code to `main` branch
2. GitHub Actions builds and deploys:
   - Backend → Lambda (via Serverless Framework)
   - Frontend → S3 + CloudFront cache invalidation

---

## Local Development

### Standard Development (Recommended)

```bash
# Terminal 1: Backend
cd packages/backend
npm run start:dev  # http://localhost:3000

# Terminal 2: Frontend  
cd packages/frontend
npm run dev  # http://localhost:5173
```

### Test Lambda Locally

```bash
cd packages/backend
npm run build:lambda
npx serverless offline --stage dev
# API at http://localhost:3000/v1
```

---

## Troubleshooting

### Lambda Cold Starts
- First request after idle may take 2-5 seconds
- Subsequent requests are fast (~100-200ms)
- Consider provisioned concurrency if needed (~$15/month extra)

### CORS Errors
- Check CloudFront behavior for `/v1/*` allows all HTTP methods
- Verify API Gateway has CORS enabled

### 403 on SPA Routes
- Ensure CloudFront has custom error response: 403 → `/index.html` (200)

---

## Cost Breakdown

| Service | Monthly Estimate |
|---------|------------------|
| Lambda | ~$0 (free tier: 1M requests) |
| API Gateway | ~$0 (free tier: 1M requests) |
| S3 | ~$0.02 |
| CloudFront | ~$0.10 |
| **Total** | **~$0.12/month** (first year with free tier) |

After free tier: ~$1-3/month for low-traffic personal blog.
