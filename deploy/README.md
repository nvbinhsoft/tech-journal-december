# Tech Journal - Deployment Guide

This guide details the CI/CD deployment process for the Tech Journal MVP using **GitHub Actions**, **GitHub Container Registry (GHCR)**, and **AWS EC2**.

---

## Architecture Overview

1.  **CI (GitHub Actions)**: Builds Docker images on every push to `main` and pushes them to `ghcr.io`.
2.  **CD (EC2)**: Pulls the pre-built images from `ghcr.io` and runs them using `docker-compose`.
    - **No source code** is needed on the server.
    - **No build tools** (Node.js, npm) are needed on the server.
    - Only `docker-compose.prod.yml` and `.env.production` are required.

---

## Prerequisites

1.  **GitHub Repository**: Must be public (for free GHCR) or you need a PAT for private access.
2.  **AWS Account**: EC2 instance (t2.micro is sufficient).
3.  **MongoDB Atlas**: Free tier cluster.
4.  **GitHub Secrets**: Configure `VITE_API_BASE_URL` in your repository settings (Settings -> Secrets & variables -> Actions).

---

## Step 1: Configure GitHub Repository

This setup is required for the CI/CD pipeline to work.

### 1. Repository Settings
1.  Go to your GitHub Repository.
2.  Navigate to **Settings**.
3.  On the left sidebar, click **Actions** -> **General**.
4.  Ensure **Workflow permissions** is set to "Read and write permissions" (required to push packages).

### 2. Configure Secrets
We need to provide environment variables to the build process via GitHub Secrets.

*Currently, no build secrets are required for the standard flow.*

*(Note: `GITHUB_TOKEN` is automatically provided by GitHub, you don't need to add it manually)*

### 3. Verify Workflow
1.  Push your code to the `main` branch.
2.  Go to the **Actions** tab in your repository.
3.  You should see a workflow run named "CI/CD Pipeline".
4.  Once green (successful), go to your profile -> **Packages** to confirm the images exist:
    - `tech-journal-backend`
    - `tech-journal-frontend`

---

## Step 2: Setup EC2 Server

SSH into your fresh EC2 instance:
```bash
ssh -i key.pem ubuntu@<your-ec2-ip>
```

### 1. Install Docker & Docker Compose
We provide a setup script to automate this:
```bash
curl -O https://raw.githubusercontent.com/nvbinhsoft/tech-journal-december/main/deploy/aws-setup.sh
chmod +x aws-setup.sh
sudo ./aws-setup.sh
# Exit and re-login to apply group changes
exit
ssh -i key.pem ubuntu@<your-ec2-ip>
```

### 2. Prepare Application Directory
Create the folder and necessary files. YOU DO NOT NEED TO CLONE THE REPO.

```bash
sudo mkdir -p /opt/tech-journal
sudo chown ubuntu:ubuntu /opt/tech-journal
cd /opt/tech-journal
```

### 3. Download Docker Compose File
Download the production compose file directly:
```bash
curl -L https://raw.githubusercontent.com/nvbinhsoft/tech-journal-december/main/docker-compose.prod.yml -o docker-compose.prod.yml
```
*Note: We use `docker-compose.prod.yml` but will run it as the main composition.*

### 4. Create Environment File
Create `.env.production`:
```bash
nano .env.production
```
Paste your production variables:
```env
# Git Hub Repository Owner (lowercase) - REQUIRED for image name
GITHUB_REPOSITORY_OWNER=nvbinhsoft

# Production Config
NODE_ENV=production
MONGODB_URI=mongodb+srv://tech-journal-user:PASSWORD@cluster.mongodb.net/tech-journal?retryWrites=true&w=majority
JWT_SECRET=your-secure-secret-here
JWT_EXPIRES_IN=86400
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strongpassword
VITE_API_BASE_URL=http://YOUR_EC2_IP:3000/v1
```

> **Important**: You MUST set `GITHUB_REPOSITORY_OWNER` to your GitHub username (lowercase) so docker-compose knows which image to pull.

---

## Step 3: Deployment

Now start the application. Docker will automatically pull the images from GHCR.

```bash
# Pull latest images and start containers
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Verify running
docker-compose -f docker-compose.prod.yml ps
```

---

## Step 4: Updates & Rollbacks

### To Update (Continuous Deployment)
1.  Push changes to `main` on GitHub.
2.  Wait for GitHub Action to finish building.
3.  On EC2, run:
    ```bash
    cd /opt/tech-journal
    docker-compose -f docker-compose.prod.yml pull
    docker-compose -f docker-compose.prod.yml up -d
    ```

### To Rollback
1.  Find the specific image tag you want (e.g., `sha-a1b2c3d` or `v1.0.0`) from GitHub Packages.
2.  Edit `docker-compose.prod.yml` on EC2:
    ```yaml
    image: ghcr.io/nvbinhsoft/tech-journal-backend:sha-a1b2c3d
    ```
3.  Run `docker-compose -f docker-compose.prod.yml up -d`.

---

## Troubleshooting

### "Manifest not found" or "Permission denied"
- Ensure your GitHub Repository is **Public**.
- If Private: You must log in to GHCR on EC2:
  1. Generate a GitHub PAT (read:packages).
  2. Run `echo $PAT | docker login ghcr.io -u YOUR_USERNAME --password-stdin`

### "Pull access denied"
- Check `GITHUB_REPOSITORY_OWNER` in `.env.production`.
- Check if image exists in GitHub Packages.
