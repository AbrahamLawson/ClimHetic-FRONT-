# 🌡️ ClimHetic Front-End

Application de monitoring climatique développée avec React et Vite.

## 🚀 Démarrage rapide

### En local (développement)
```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Sur serveur (production)

```bash
# 1. Pousser sur GitHub
git add .
git commit -m "Mes changements"
git push

# 2. L'app se déploie automatiquement ! ✨
```

## 📚 Documentation

- **[GitHub Actions](deployment/GITHUB-ACTIONS.md)** - Déploiement automatique
- **[Dossier Deployment](deployment/)** - Fichiers Docker et configuration
- **Accès production** : http://09.hetic.arcplex.dev

## 📦 Structure du projet

```
ClimHetic-FRONT/
├── src/                    # Code source React
├── public/                 # Assets statiques
├── deployment/             # 🚀 Fichiers de déploiement
│   ├── Dockerfile         # Configuration Docker
│   ├── docker-compose.yml # Lance l'application
│   ├── nginx.conf         # Configuration serveur web
│   ├── .env.production    # Variables de production
│   ├── GITHUB-ACTIONS.md  # Guide déploiement automatique
│   └── README.md          # Documentation du dossier
├── .github/workflows/     # 🤖 GitHub Actions
│   └── deploy.yml         # Déploiement automatique
└── README.md              # Ce fichier
```

## 🛠️ Technologies

- **React 19** - Interface utilisateur
- **Vite 7** - Build tool
- **Firebase** - Authentification et base de données
- **Docker** - Conteneurisation
- **Nginx** - Serveur web
- **GitHub Actions** - Déploiement automatique

## 🔧 Commandes utiles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build pour production
npm run test         # Tests

# Production (automatique via GitHub Actions)
git push             # Déclenche le déploiement automatique
```

## 🎯 Fonctionnalités

- ✅ Dashboard de monitoring
- ✅ Gestion des salles et capteurs
- ✅ Système d'alertes
- ✅ Interface d'administration
- ✅ Authentification sécurisée
- ✅ Déploiement automatique

## 🔄 Workflow de développement

```
1. Modifier le code localement
2. Tester avec `npm run dev`
3. Commit et push sur GitHub
4. GitHub Actions déploie automatiquement
5. L'app est live sur http://09.hetic.arcplex.dev
```

---

*Déploiement 100% automatique avec GitHub Actions* 🤖✨
