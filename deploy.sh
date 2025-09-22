#!/bin/bash

echo "🚀 Deploying ClimHetic..."

# Stop containers on port 8080
docker stop $(docker ps -q --filter "publish=8080") 2>/dev/null || true
docker rm $(docker ps -aq --filter "publish=8080") 2>/dev/null || true

# Setup project directory
PROJECT_DIR="/home/abraham/climhetic-front"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Update code
if [ -d ".git" ]; then
    git fetch origin main
    git reset --hard origin/main
    git clean -fd
else
    git init
    git remote add origin https://github.com/AbrahamLawson/ClimHetic-FRONT-.git
    git fetch origin main
    git checkout -b main origin/main
fi

# Deploy
docker system prune -f || true
docker-compose -f deployment/docker-compose.yml up --build -d
sleep 15
docker-compose -f deployment/docker-compose.yml ps

echo "✅ Deployment complete!"
echo "🌐 App: http://09.hetic.arcplex.dev"
