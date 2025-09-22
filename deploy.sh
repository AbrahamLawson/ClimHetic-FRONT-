#!/bin/bash

# ==========================================
# SCRIPT DE DÉPLOIEMENT MANUEL CLIMHETIC
# ==========================================
# Utilisez ce script directement sur votre serveur

echo "🚀 Déploiement ClimHetic - Version Simple"

# Arrêter tous les conteneurs sur le port 8080
echo "🛑 Arrêt des conteneurs existants..."
docker stop $(docker ps -q --filter "publish=8080") 2>/dev/null || true
docker rm $(docker ps -aq --filter "publish=8080") 2>/dev/null || true

# Aller dans le répertoire du projet
PROJECT_DIR="/home/abraham/climhetic-front"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Mettre à jour le code
echo "📥 Mise à jour du code..."
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

# Nettoyer Docker
echo "🧹 Nettoyage Docker..."
docker system prune -f || true

# Lancer l'application
echo "🔨 Lancement de l'application..."
docker-compose -f deployment/docker-compose.yml up --build -d

# Attendre et vérifier
echo "⏳ Attente du démarrage (15s)..."
sleep 15

echo "📊 État des conteneurs:"
docker-compose -f deployment/docker-compose.yml ps

echo ""
echo "✅ Déploiement terminé !"
echo "🌐 Application accessible sur : http://09.hetic.arcplex.dev"
echo ""
echo "📋 Commandes utiles :"
echo "  - Voir les logs : docker-compose -f deployment/docker-compose.yml logs"
echo "  - Arrêter l'app : docker-compose -f deployment/docker-compose.yml down"
echo "  - Redémarrer : docker-compose -f deployment/docker-compose.yml restart"
