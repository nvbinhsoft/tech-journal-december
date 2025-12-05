#!/bin/bash
# ============================================
# AWS EC2 Setup Script for Tech Journal
# ============================================
# Run this script on a fresh Ubuntu 22.04 EC2 instance
# Usage: chmod +x aws-setup.sh && sudo ./aws-setup.sh
# ============================================

set -e

echo "=========================================="
echo "🚀 Tech Journal - AWS EC2 Setup"
echo "=========================================="

# Update system
echo "📦 Updating system packages..."
apt-get update && apt-get upgrade -y

# Install required packages
echo "📦 Installing required packages..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    unzip

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Enable Docker to start on boot
systemctl enable docker
systemctl start docker

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /opt/tech-journal
chown ubuntu:ubuntu /opt/tech-journal

# Configure firewall (UFW)
echo "🔥 Configuring firewall..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable

# Setup log rotation for Docker
echo "📋 Configuring log rotation..."
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# Restart Docker to apply log settings
systemctl restart docker

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Log out and log back in (for docker group to take effect)"
echo "2. Clone your repositories to /opt/tech-journal/"
echo "3. Copy .env.production.example to .env.production"
echo "4. Run: docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "Docker version:"
docker --version
echo ""
echo "Docker Compose version:"
docker-compose --version
echo ""
