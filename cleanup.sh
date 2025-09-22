#!/bin/bash

echo "🧹 Nettoyage du projet ClimHetic..."

# Supprimer les dépendances de test inutilisées
echo "📦 Suppression des dépendances de test..."
npm uninstall @testing-library/jest-dom @testing-library/react vitest jsdom

# Supprimer les fichiers de test
echo "🗂️ Suppression des fichiers de test..."
rm -rf src/tests/
rm -f src/setupTests.js

# Supprimer le hook inutilisé
echo "🪝 Suppression du hook inutilisé..."
rm -rf src/hooks/

# Nettoyer le package.json des scripts de test
echo "📝 Nettoyage du package.json..."
npm pkg delete scripts.test scripts.test:watch scripts.lint

echo "✅ Nettoyage terminé !"
echo ""
echo "📊 Espace libéré :"
echo "- Dépendances de test supprimées"
echo "- Fichiers de test supprimés" 
echo "- Hook inutilisé supprimé"
echo "- Scripts de test retirés"
