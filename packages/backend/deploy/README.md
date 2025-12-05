# Tech Journal - AWS Deployment Guide

Complete guide for deploying Tech Journal MVP to AWS using **EC2 Free Tier + MongoDB Atlas Free Tier**.

**Estimated Monthly Cost: $0** (within AWS Free Tier limits)

---

## Prerequisites

- AWS Account (Free Tier eligible)
- MongoDB Atlas account (free)
- SSH key pair for EC2 access
- Git installed locally

---

## Step 1: Setup MongoDB Atlas (Free Tier)

1. **Create Account**: Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) and sign up

2. **Create Free Cluster**:
   - Click "Build a Cluster"
   - Select **M0 Sandbox (Free Forever)**
   - Choose region closest to your EC2 (e.g., `ap-southeast-1`)
   - Name: `tech-journal-cluster`

3. **Create Database User**:
   - Go to "Database Access"
   - Add New Database User
   - Authentication: Password
   - Username: `tech-journal-user`
   - Password: Generate a secure password (save this!)
   - Database User Privileges: Read and write to any database

4. **Configure Network Access**:
   - Go to "Network Access"
   - Add IP Address
   - For MVP: Allow access from anywhere (`0.0.0.0/0`)
   - *Production: Restrict to EC2 Elastic IP*

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string:
   ```
   mongodb+srv://tech-journal-user:<password>@tech-journal-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `tech-journal` before the `?`

---

## Step 2: Launch EC2 Instance

### Via AWS Console:

1. **Go to EC2 Dashboard** → "Launch Instance"

2. **Configure Instance**:
   | Setting | Value |
   |---------|-------|
   | Name | tech-journal-server |
   | AMI | Ubuntu 22.04 LTS (Free tier eligible) |
   | Instance Type | **t2.micro** (Free tier eligible) |
   | Key Pair | Create new or use existing |
   | Storage | 8 GB gp3 (Free tier: up to 30GB) |

3. **Network Settings** (Security Group):
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere
   - Allow Custom TCP (port 3000) from anywhere

4. **Launch the Instance**

5. **Allocate Elastic IP** (optional but recommended):
   - Go to "Elastic IPs" → "Allocate Elastic IP address"
   - Associate with your instance
   - *Note: Free as long as it's attached to a running instance*

---

## Step 3: Setup EC2 Server

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@<your-ec2-public-ip>

# Download and run setup script
curl -O https://raw.githubusercontent.com/YOUR_REPO/main/deploy/aws-setup.sh
chmod +x aws-setup.sh
sudo ./aws-setup.sh

# Logout and login again for docker group to take effect
exit
ssh -i your-key.pem ubuntu@<your-ec2-public-ip>

# Verify installation
docker --version
docker-compose --version
```

---

## Step 4: Deploy Application

```bash
# Navigate to application directory
cd /opt/tech-journal

# Clone repositories
git clone https://github.com/YOUR_USERNAME/tech-journal-api.git
git clone https://github.com/YOUR_USERNAME/tech-journal.git

# Navigate to API directory
cd tech-journal-api

# Create production environment file
cp .env.production.example .env.production

# Edit the environment file
nano .env.production
```

**Update `.env.production`** with your values:
```env
NODE_ENV=production
PORT=3000
API_PREFIX=v1
MONGODB_URI=mongodb+srv://tech-journal-user:YOUR_PASSWORD@tech-journal-cluster.xxxxx.mongodb.net/tech-journal?retryWrites=true&w=majority
JWT_SECRET=your-64-char-random-string
JWT_EXPIRES_IN=86400
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-admin-password
VITE_API_BASE_URL=http://YOUR_EC2_IP:3000/v1
```

**Generate JWT Secret**:
```bash
openssl rand -base64 64
```

---

## Step 5: Build and Run

```bash
# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## Step 6: Initialize Database

```bash
# Run database seed (first time only)
docker exec tech-journal-api npm run seed
```

---

## Step 7: Verify Deployment

| URL | Expected |
|-----|----------|
| `http://YOUR_EC2_IP` | Frontend loads |
| `http://YOUR_EC2_IP:3000/api-docs` | Swagger docs |
| `http://YOUR_EC2_IP:3000/v1/public/articles` | API response |

---

## Useful Commands

```bash
# View running containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Check disk space
df -h

# Check memory
free -m
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### MongoDB connection failed
- Verify Atlas Network Access includes `0.0.0.0/0` or your EC2 IP
- Check connection string format
- Ensure password has no special characters or URL-encode them

### Out of memory
- t2.micro has only 1GB RAM
- Check with: `free -m`
- Consider upgrading to t3.micro or adding swap

### Port already in use
```bash
# Find what's using the port
sudo lsof -i :80
sudo lsof -i :3000
```

---

## Security Recommendations (Post-MVP)

1. **Restrict MongoDB Atlas access** to EC2 Elastic IP only
2. **Add HTTPS** with Let's Encrypt (see below)
3. **Use environment variables in AWS SSM** Parameter Store
4. **Enable CloudWatch monitoring**

### Adding HTTPS (Optional)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## Cost Summary

| Resource | Free Tier Limit | Usage |
|----------|----------------|-------|
| EC2 t2.micro | 750 hrs/month | 24/7 = 720 hrs ✅ |
| EBS Storage | 30 GB | 8 GB ✅ |
| Data Transfer | 100 GB out/month | MVP << 100 GB ✅ |
| Elastic IP | Free if attached | 1 attached ✅ |
| MongoDB Atlas M0 | 512 MB forever | MVP << 512 MB ✅ |

**Total: $0/month** within Free Tier
