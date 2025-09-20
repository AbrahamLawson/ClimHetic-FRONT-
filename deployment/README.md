# 🚀 Dossier de Déploiement ClimHetic

Ce dossier contient tous les fichiers nécessaires pour déployer l'application ClimHetic sur un serveur.

## 📦 Contenu du dossier

### **🐳 Docker**
- `Dockerfile` - Instructions pour créer l'image Docker (simple et commenté)
- `docker-compose.yml` - Configuration pour lancer l'application
- `.dockerignore` - Fichiers à exclure du build Docker

### **🚀 Scripts de déploiement**
- `deploy.sh` - Script principal de déploiement (à exécuter sur le serveur)
- `upload.sh` - Script pour transférer les fichiers vers le serveur

### **⚙️ Configuration**
- `nginx.conf` - Configuration du serveur web nginx
- `.env.production` - Variables d'environnement pour la production

### **📚 Documentation**
- `GUIDE-DEBUTANT.md` - Guide détaillé pour débutants
- `README.md` - Ce fichier

## 🎯 Utilisation rapide

### **1. Transférer vers le serveur**
```bash
# Depuis la racine du projet
./deployment/upload.sh
```

### **2. Déployer sur le serveur**
```bash
# Se connecter au serveur
ssh abraham@admin-hetic.arcplex.tech -p 2326
cd climhetic-front

# Lancer le déploiement
./deployment/deploy.sh
```

### **3. Configurer nginx (une seule fois)**
```bash
# Sur le serveur
sudo cp deployment/nginx.conf /etc/nginx/sites-available/climhetic
sudo ln -sf /etc/nginx/sites-available/climhetic /etc/nginx/sites-enabled/climhetic
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## 🌐 Résultat

Ton application sera accessible sur : **http://09.hetic.arcplex.dev**

## 📝 Notes importantes

- Tous les fichiers sont **simplifiés** et **bien commentés**
- Parfait pour les **débutants**
- **Bonnes pratiques** Docker et nginx
- Configuration pour le **groupe 9** (port SSH 2326)

## 🆘 Aide

Consulte le `GUIDE-DEBUTANT.md` pour des instructions détaillées étape par étape.
