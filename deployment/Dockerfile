# ==========================================
# DOCKERFILE SIMPLE POUR CLIMHETIC
# ==========================================
# Ce fichier crée une image Docker pour ton app React

# ÉTAPE 1: Construire l'application
# On utilise Node.js 20 pour construire l'app React
FROM node:20-alpine AS builder

# Créer un dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances (package.json)
COPY package*.json ./

# Installer toutes les dépendances (dev + prod)
RUN npm install

# Copier tout le code source
COPY . .

# Construire l'application pour la production
# Cela crée un dossier 'dist' avec les fichiers optimisés
RUN npm run build

# ÉTAPE 2: Servir l'application avec nginx
# On utilise nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80 (port standard web)
EXPOSE 80

# Démarrer nginx (se lance automatiquement)
