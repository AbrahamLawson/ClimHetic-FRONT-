# 🚀 Dossier de Déploiement ClimHetic

Ce dossier contient les fichiers Docker nécessaires pour le déploiement automatique via GitHub Actions.

## 📦 Contenu du dossier

### **🐳 Docker**
- `Dockerfile` - Instructions pour créer l'image Docker (simple et commenté)
- `docker-compose.yml` - Configuration pour lancer l'application
- `.dockerignore` - Fichiers à exclure du build Docker

### **⚙️ Configuration**
- `nginx.conf` - Configuration du serveur web nginx
- `.env.production` - Variables d'environnement pour la production

### **📚 Documentation**
- `GITHUB-ACTIONS.md` - Guide pour le déploiement automatique
- `README.md` - Ce fichier

## 🤖 Déploiement automatique

Le déploiement se fait automatiquement via **GitHub Actions** :

```bash
# 1. Modifier ton code
# 2. Pousser sur GitHub
git add .
git commit -m "Mes changements"
git push

# 3. L'application se déploie automatiquement ! ✨
```

## 🌐 Résultat

Ton application sera accessible sur : **http://09.hetic.arcplex.dev**

## 📝 Notes importantes

- **Déploiement 100% automatique** via GitHub Actions
- **Docker** pour la conteneurisation
- **Nginx** pour servir l'application
- Configuration pour le **groupe 9** (serveur admin-hetic.arcplex.tech:2326)

## 🆘 Aide

Consulte le `GITHUB-ACTIONS.md` pour des instructions détaillées sur le déploiement automatique.
