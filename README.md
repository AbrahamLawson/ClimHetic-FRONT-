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

- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture détaillée du projet
- **[src/auth/README.md](src/auth/README.md)** - Module d'authentification Firebase
- **[DEPLOY.md](DEPLOY.md)** - Guide de déploiement complet
- **[deployment/](deployment/)** - Configuration Docker
- **Accès production** : http://09.hetic.arcplex.dev

## 📦 Structure du projet

```
ClimHetic-FRONT/
├── 🔐 src/auth/            # Module d'authentification Firebase
├── 🧩 src/components/      # Composants React réutilisables  
├── 📄 src/pages/          # Pages de l'application
├── 🎨 src/styles/         # Fichiers CSS organisés
├── ⚙️ src/services/       # Services API et logique métier
├── 🌐 src/contexts/       # Contextes React
├── 🚀 deployment/         # Configuration Docker
├── 🤖 .github/workflows/  # CI/CD GitHub Actions
├── 📋 PROJECT_STRUCTURE.md # Documentation détaillée
└── 🧹 cleanup.sh          # Script de nettoyage
```

> 📖 **Voir [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) pour la documentation complète**

## 🛠️ Technologies

- **React 19** - Interface utilisateur
- **Vite 7** - Build tool
- **Firebase** - Authentification et base de données
- **React Router** - Pour la navigation
- **Testing Library** - Pour les tests
- **Docker** - Conteneurisation
- **Nginx** - Serveur web
- **GitHub Actions** - Déploiement automatique
- **OpenWeatherMap API** - Pour les données météo

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

### Repo GitHub 

- https://github.com/AbrahamLawson/ClimHetic-FRONT-.git

*Déploiement 100% automatique avec GitHub Actions* 🤖✨
