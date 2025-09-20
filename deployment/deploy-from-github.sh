#!/bin/bash

# ==========================================
# DÉPLOIEMENT DEPUIS GITHUB - VERSION SIMPLE
# ==========================================
# Ce script récupère le code depuis GitHub et le déploie

echo "🚀 Déploiement ClimHetic depuis GitHub..."

# Configuration - REMPLACE TON_USERNAME par ton vrai nom d'utilisateur GitHub
REPO_URL="https://github.com/TON_USERNAME/ClimHetic-FRONT.git"
PROJECT_DIR="/home/abraham/climhetic-front"
BRANCH="main"

echo "⚠️  IMPORTANT: Assure-toi de remplacer TON_USERNAME dans ce script !"
echo "   Édite ce fichier et remplace par ton vrai nom d'utilisateur GitHub"
echo ""

# Vérifier que Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé !"
    echo "   Installe Git : sudo apt install git"
    exit 1
fi

# Si le projet existe déjà, faire un pull
if [ -d "$PROJECT_DIR/.git" ]; then
    echo "📥 Mise à jour du code depuis GitHub..."
    cd $PROJECT_DIR
    git pull origin $BRANCH
else
    echo "📥 Clonage du projet depuis GitHub..."
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

echo "🔨 Déploiement de l'application..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé !"
    echo "   Installe Docker : sudo apt install docker.io docker-compose"
    exit 1
fi

# Arrêter l'ancienne version
docker-compose -f deployment/docker-compose.yml down 2>/dev/null || true

# Construire et lancer la nouvelle version
docker-compose -f deployment/docker-compose.yml up --build -d

echo ""
echo "✅ Déploiement terminé !"
echo "🌐 Application accessible sur : http://09.hetic.arcplex.dev"
echo ""
echo "📝 Pour les prochaines mises à jour, lance simplement :"
echo "   ./deployment/deploy-from-github.sh"
