<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
<<<<<<< Updated upstream
# ClimHetic-FRONT-
=======
# React + ClimHetic Frontend

Application frontend pour ClimHetic - Système de gestion climatique intelligent avec authentification Firebase.

## Technologies utilisées

- **React** - Framework JavaScript
- **Vite** - Outil de build rapide
- **React Router** - Navigation
- **Firebase** - Authentification et backend
- **Lucide React** - Icônes
- **Axios** - Requêtes HTTP
- **Recharts** - Graphiques

## Installation

```bash
npm install
```

## Configuration Firebase

1. Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activez l'authentification avec Email/Password et Google
3. Copiez votre configuration Firebase
4. Remplacez les valeurs dans `src/config/firebase-config.js` :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDZ9X6zQ8XqZzQ8XqZzQ8XqZzQ8XqZzQ8Xq",
  authDomain: "climhetic-frontend.firebaseapp.com",
  projectId: "climhetic-frontend",
  storageBucket: "climhetic-frontend.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:123456789"
};
```

## Développement

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Fonctionnalités d'authentification

- ✅ Connexion avec email/mot de passe
- ✅ Déconnexion
- ✅ Routes protégées
- ✅ Gestion d'état d'authentification
- ✅ Interface utilisateur moderne
- ✅ Utilisateurs créés via console Firebase

## Structure du projet

```
src/
├── components/
│   ├── auth/          # Composants d'authentification
│   ├── form/          # Composants de formulaire
│   └── ...            # Autres composants
├── contexts/          # Contextes React (AuthContext)
├── services/          # Services (auth.js)
├── config/            # Configuration (Firebase)
├── pages/             # Pages de l'application
├── layouts/         ### Sur serveur (production)

#### Méthode automatique (Recommandée)
```bash
# 1. Pousser sur GitHub
git add .
git commit -m "Mes changements"
git push

# 2. L'app se déploie automatiquement ! 
```

#### Méthode manuelle (Alternative)
```bash
# 1. Transférer les fichiers
./upload.sh

# 2. Se connecter au serveur
ssh abraham@admin-hetic.arcplex.tech -p 2326
cd climhetic-front

# 3. Déployer
./deploy.sh
```

## Documentation

- **[GitHub Actions](deployment/GITHUB-ACTIONS.md)** - Déploiement automatique (Recommandé)
- **[Guide Débutant](deployment/GUIDE-DEBUTANT.md)** - Instructions détaillées pour déployer
- **[Dossier Deployment](deployment/)** - Tous les fichiers de déploiement
- **Accès production** : http://09.hetic.arcplex.dev

## Structure du projet

```
ClimHetic-FRONT/
├── src/                    # Code source React
├── public/                 # Assets statiques
├── deployment/             # Fichiers de déploiement
│   ├── Dockerfile         # Configuration Docker
│   ├── docker-compose.yml # Lance l'application
│   ├── deploy.sh          # Script de déploiement
│   ├── upload.sh          # Transfert vers serveur
│   ├── nginx.conf         # Configuration serveur web
│   ├── GITHUB-ACTIONS.md  # Guide déploiement automatique
│   └── GUIDE-DEBUTANT.md  # Guide détaillé
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml         # Déploiement automatique
├── deploy.sh              # Script principal (appelle deployment/)
├── upload.sh              # Script principal (appelle deployment/)
└── README.md              # Ce fichier
```

## Routes

- `/login` - Page de connexion
- `/dashboard` - Tableau de bord (protégé)
- `/salles` - Gestion des salles (protégé)
- `/alertes` - Gestion des alertes (protégé)
- `/ressources` - Ressources (protégé)

## Configuration des utilisateurs

Les utilisateurs doivent être créés manuellement dans la console Firebase :
1. Allez dans Authentication > Users
2. Cliquez sur "Add user"
3. Saisissez l'email et le mot de passe
4. L'utilisateur pourra ensuite se connecter avec ces identifiants
>>>>>>> Stashed changes
>>>>>>> origin/main
# Test
