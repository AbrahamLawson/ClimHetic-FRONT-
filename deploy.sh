#!/bin/bash

# ==========================================
# SCRIPT DE DÉPLOIEMENT PRINCIPAL
# ==========================================
# Ce script appelle le vrai script dans deployment/

echo "🚀 Lancement du déploiement ClimHetic..."
echo "📁 Utilisation des fichiers dans deployment/"
echo ""

# Vérifier que le dossier deployment existe
if [ ! -d "deployment" ]; then
    echo "❌ Le dossier 'deployment' n'existe pas !"
    echo "   Assure-toi d'être dans la racine du projet."
    exit 1
fi

# Lancer le vrai script de déploiement
./deployment/deploy.sh
