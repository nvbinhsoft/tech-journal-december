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
aws s3 mb s3://tech-journal-frontend-nvbinhsoft --region ap-southeast-1
```

### Step 3: Request ACM Certificate (for custom domain)

> **Note**: Must be in `us-east-1` region for CloudFront!

```bash
aws acm request-certificate \
  --domain-name nvbinhsoft.cloud \
  --validation-method DNS \
  --region us-east-1

# Add the DNS CNAME record shown, then wait for validation
```

### Step 4: Deploy Backend (Manual / Local Only)

> **Important**: This step is for the **manual/local deployment** (Case 1). Since `serverless.yml` reads from your local shell environment using `${env:VAR}`, you MUST manually export these variables before deploying.

```bash
cd packages/backend
npm install
npm run build:lambda

# CASE 1: MANUAL LOCAL DEPLOYMENT
# We must manually export these because we are not using the automated CI/CD yet.
export MONGODB_URI="mongodb+srv://nvbinhsoft_db_user:1n1wWucoot38fhtv@cluster0.ufphuxp.mongodb.net/tech-journal?appName=Cluster0"
export JWT_SECRET="your-secret"
export JWT_EXPIRES_IN="86400"

# Deploy
npx serverless deploy --stage prod

# Note the API Gateway URL in output (needed for CloudFront)
```

### Step 5: Create CloudFront Distribution

1. **Go to CloudFront** → Create Distribution

2. **Step A: Configure the First Origin (S3)**
   In the "Create Distribution" wizard:
   - **Origin domain**: Click the field and select your S3 bucket (`tech-journal-frontend-nvbinhsoft.s3...`) from the dropdown.
     > *Tip: You must select it from the dropdown for the "Origin access" options to appear.*
   - **Origin access**: Select **"Origin access control settings (recommended)"**.
     - Click **"Create control setting"** (keep defaults) and click Create.
   - **Origin path**: Leave empty.

   **Default Cache Behavior**:
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD
   - **Restrict viewer access**: No

3. **Step B: Create Distribution**
   - **Web Application Firewall (WAF)**: Enable security protections (or leave default).
   - Click **Create Distribution**.
   > *Note: If you don't see options for Domain or SSL yet, don't worry! We will add them in **Step E**.*

4. **Step C: Add Backend Origin (After Creation)**
   Wait for the distribution to be created, then click on its ID to edit it.
   - Go to the **Origins** tab → **Create origin**.
   - **Origin domain**: Paste your API Gateway domain (`xxxxxx.execute-api.ap-southeast-1.amazonaws.com`).
     - *Note: Do not include `https://` or the path.*
   - **Origin path**: `/prod` (Important! This points to your deployed stage).
   - **Protocol**: HTTPS only.
   - Click **Create Origin**.

5. **Step D: Connect Backend Behavior**
   - Go to the **Behaviors** tab → **Create behavior**.
   - **Path pattern**: `/v1/*`
   - **Origin**: Select your API Gateway origin.
   - **Viewer protocol policy**: HTTPS only.
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE.
   - **Cache key and origin requests**:
     - Select **"Cache policy and origin request policy (recommended)"**.
     - Cache policy: `CachingDisabled` (since it's an API).
     - Origin request policy: `AllViewer` (passes auth headers to Lambda).
   - Click **Create behavior**.

6. **Step E: Configure Domain & SSL (General Settings)**
   - Go to the **General** tab of your distribution → **Edit**.
   - **Alternate domain name (CNAME)**: Add `techjournal.nvbinhsoft.cloud`.
   - **Custom SSL certificate**: Select your ACM certificate.
   - **Default root object**: `index.html` (Crucial for React apps!).
   - Click **Save changes**.

7. **Final Configuration**:
   - Copy the **Distribution ID** for GitHub Secrets.
   - Wait for the distribution status to change from "Deploying" to "Enabled" (can take 5-10 mins).

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
    "Resource": "arn:aws:s3:::tech-journal-frontend-nvbinhsoft/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::135808924033:distribution/E2YLZB2694OVZ3"
      }
    }
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket tech-journal-frontend-nvbinhsoft \
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

There are two main ways to deploy this application:

### Case 1: Manual / Local Deployment
Follow **Step 4** above. You must manually `export` environment variables in your terminal because the `serverless.yml` config pulls them from the current shell environment (`${env:VAR}`).

### Case 2: Automated CI/CD (Recommended)
Once you have configured **GitHub Secrets** (Step 7), deployment is fully automated. You do **not** need to manually export anything.

1. Push code to `main` branch.
2. The GitHub Action (`.github/workflows/deploy-serverless.yml`) will:
   - Inject the variables from **GitHub Secrets** into the build environment.
   - Run `serverless deploy`, automatically picking up the values.

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
