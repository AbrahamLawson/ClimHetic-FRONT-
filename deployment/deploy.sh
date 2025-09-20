#!/bin/bash

# ==========================================
# SCRIPT DE DÉPLOIEMENT SIMPLE POUR CLIMHETIC
# ==========================================

echo "🚀 Déploiement de ClimHetic - Version Simple"
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé !"
    echo "   Installe Docker d'abord : sudo apt install docker.io"
    exit 1
fi

# Arrêter l'ancienne version (si elle existe)
echo "🛑 Arrêt de l'ancienne version..."
docker-compose -f deployment/docker-compose.yml down

# Construire et lancer la nouvelle version
echo "🔨 Construction et lancement de l'application..."
docker-compose -f deployment/docker-compose.yml up --build -d

# Vérifier que ça marche
echo ""
echo "📊 Vérification..."
docker-compose -f deployment/docker-compose.yml ps

echo ""
echo "✅ Déploiement terminé !"
echo "🌐 Ton app est accessible sur :"
echo "   - Local: http://localhost:8080"
echo "   - Serveur: http://09.hetic.arcplex.dev:8080"
echo ""
echo "📝 Commandes utiles :"
echo "   - Voir les logs: docker-compose -f deployment/docker-compose.yml logs -f"
echo "   - Arrêter: docker-compose -f deployment/docker-compose.yml down"
