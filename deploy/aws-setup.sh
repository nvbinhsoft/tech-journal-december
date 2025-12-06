#!/bin/bash
# ============================================
# AWS EC2 Setup Script for Tech Journal
# ============================================
# Supports: Ubuntu 22.04+, Amazon Linux 2023
# Usage: chmod +x aws-setup.sh && sudo ./aws-setup.sh
# ============================================

set -e

echo "=========================================="
echo "🚀 Tech Journal - AWS EC2 Setup"
echo "=========================================="

# Detect OS and Package Manager
if command -v apt-get &> /dev/null; then
    PKG_MANAGER="apt-get"
    echo "📦 Detected Ubuntu/Debian system"
    $PKG_MANAGER update && $PKG_MANAGER upgrade -y
    $PKG_MANAGER install -y curl git unzip
elif command -v dnf &> /dev/null; then
    PKG_MANAGER="dnf"
    echo "📦 Detected Amazon Linux/RHEL system (dnf)"
    $PKG_MANAGER update -y
    $PKG_MANAGER install -y curl git unzip lsof
elif command -v yum &> /dev/null; then
    PKG_MANAGER="yum"
    echo "📦 Detected Amazon Linux/CentOS system (yum)"
    $PKG_MANAGER update -y
    $PKG_MANAGER install -y curl git unzip
else
    echo "❌ Unsupported package manager. Please install Docker manually."
    exit 1
fi

# Detect Current User (fallback to 'ubuntu' or 'ec2-user' if direct detection fails)
if [ -n "$SUDO_USER" ]; then
    TARGET_USER="$SUDO_USER"
else
    TARGET_USER=$(whoami)
fi
echo "👤 Configuring for user: $TARGET_USER"

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "🐳 Docker already installed."
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Add user to docker group
echo "🔑 Adding $TARGET_USER to docker group..."
usermod -aG docker "$TARGET_USER"

# Enable Docker to start on boot
systemctl enable docker
systemctl start docker

# Create application directory
echo "📁 Creating application directory at /opt/tech-journal..."
mkdir -p /opt/tech-journal
chown "$TARGET_USER":"$TARGET_USER" /opt/tech-journal

# Configure firewall (UFW) - Only for Ubuntu/Debian usually
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring firewall (UFW)..."
    ufw allow OpenSSH
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp
    # ufw --force enable  <-- Commented out to prevent locking out SSH if misconfigured. AWS Security Groups handle this safely.
    echo "⚠️  UFW rules added but not enabled. Please enable manually if needed: 'sudo ufw enable'"
else
    echo "ℹ️  UFW not found. Skipping firewall setup. Ensure AWS Security Groups allow ports 80, 443, 3000."
fi

# Setup log rotation for Docker
echo "📋 Configuring log rotation..."
mkdir -p /etc/docker
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
echo "1. Log out and log back in (to refresh docker group permissions)"
echo "2. Go to app directory: cd /opt/tech-journal"
echo "3. Run your deployment commands!"
echo ""
echo "Docker version:"
docker --version
echo ""
