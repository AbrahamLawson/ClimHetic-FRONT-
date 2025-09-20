#!/bin/bash

# ==========================================
# SCRIPT DE TRANSFERT SIMPLE VERS LE SERVEUR
# ==========================================

echo "📤 Transfert des fichiers vers le serveur..."

# Informations de connexion
SERVER="abraham@admin-hetic.arcplex.tech"
PORT="2326"
REMOTE_PATH="/home/abraham/climhetic-front"

# Transférer seulement les fichiers nécessaires
rsync -avz --progress \
  -e "ssh -p $PORT" \
  --include="*.js" \
  --include="*.jsx" \
  --include="*.json" \
  --include="*.html" \
  --include="*.css" \
  --include="*.md" \
  --include="*.simple*" \
  --include="src/***" \
  --include="public/***" \
  --exclude="node_modules" \
  --exclude=".git" \
  --exclude="dist" \
  --exclude="*.log" \
  ./ $SERVER:$REMOTE_PATH/

echo ""
echo "✅ Transfert terminé !"
echo "🔗 Prochaine étape :"
echo "   ssh $SERVER -p $PORT"
echo "   cd climhetic-front"
echo "   ./deploy-simple.sh"
