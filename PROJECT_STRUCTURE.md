# 📁 Structure du Projet ClimHetic

## 🏗️ Architecture Générale

```
ClimHetic-FRONT-/
├── 🔐 src/auth/                 # Module d'authentification Firebase
├── 🧩 src/components/           # Composants React réutilisables
├── 📄 src/pages/               # Pages de l'application
├── 🎨 src/styles/              # Fichiers CSS
├── ⚙️ src/services/            # Services API et logique métier
├── 🌐 src/contexts/            # Contextes React
├── 🚀 deployment/              # Configuration Docker
└── 🔧 .github/workflows/       # CI/CD GitHub Actions
```

## 📂 Détail des Dossiers

### 🔐 `src/auth/` - Module d'Authentification
```
auth/
├── config/firebase.js          # Configuration Firebase
├── services/
│   ├── authService.js          # Connexion/déconnexion
│   └── userService.js          # Gestion des profils
├── contexts/AuthContext.jsx    # Contexte d'authentification
├── components/
│   ├── LoginForm.jsx           # Formulaire de connexion
│   └── ProtectedRoute.jsx      # Protection des routes
├── index.js                    # Point d'entrée du module
└── README.md                   # Documentation auth
```

### 🧩 `src/components/` - Composants
```
components/
├── alerts/                     # Composants d'alertes
│   ├── AlertItem.jsx
│   ├── AlertList.jsx
│   └── AlertModal.jsx
├── form/                       # Composants de formulaire
│   ├── Form.jsx
│   └── FormModal.jsx
├── weather/                    # Composants météo
│   ├── WeatherCard.jsx
│   ├── WeatherControls.jsx
│   └── WeatherDisplay.jsx
├── Card.jsx                    # Carte générique
├── Filter.jsx                  # Filtre de données
├── Gauge.jsx                   # Jauge (speedometer)
├── Graphique.jsx               # Graphiques (recharts)
├── Navbar.jsx                  # Barre de navigation
├── Sidebar.jsx                 # Menu latéral
├── StatCard.jsx                # Carte de statistiques
├── Status.jsx                  # Indicateur de statut
└── Tableau.jsx                 # Tableau de données
```

### 📄 `src/pages/` - Pages
```
pages/
├── Dashboard.jsx               # Tableau de bord principal
├── Salles.jsx                  # Gestion des salles
├── SalleDetail.jsx             # Détail d'une salle
├── Ressources.jsx              # Page des ressources
├── Alertes.jsx                 # Gestion des alertes
├── Capteurs.jsx                # Gestion des capteurs (admin)
├── Parametres.jsx              # Paramètres (admin)
├── Admin.jsx                   # Panel d'administration
├── Login.jsx                   # Page de connexion
└── NotFound.jsx                # Page 404
```

### ⚙️ `src/services/` - Services
```
services/
├── alertService.js             # API des alertes
├── capteurService.js           # API des capteurs
├── AdminSalle.js               # API admin des salles
└── apiClient.js                # Client HTTP (axios)
```

### 🌐 `src/contexts/` - Contextes
```
contexts/
├── PreferencesContext.jsx      # Préférences utilisateur
└── WeatherContext.jsx          # Données météo
```

### 🎨 `src/styles/` - Styles CSS
```
styles/
├── global.css                  # Styles globaux
├── auth.css                    # Styles d'authentification
├── alert.css                   # Styles des alertes
├── card.css                    # Styles des cartes
├── form.css                    # Styles des formulaires
├── gauge.css                   # Styles des jauges
├── weather.css                 # Styles météo
└── ...                         # Autres styles spécifiques
```

### 🚀 `deployment/` - Configuration Docker
```
deployment/
├── docker-compose.yml          # Orchestration des conteneurs
├── Dockerfile                  # Image de l'application
├── nginx.conf                  # Configuration Nginx
├── .env.production             # Variables d'environnement
└── README.md                   # Documentation déploiement
```

## 🔧 Fichiers de Configuration

### 📦 Gestion des Dépendances
- `package.json` - Dépendances et scripts npm
- `vite.config.js` - Configuration Vite

### 🚀 CI/CD
- `.github/workflows/deploy.yml` - Déploiement automatique

### 🧹 Utilitaires
- `cleanup.sh` - Script de nettoyage du projet
- `deploy.sh` - Script de déploiement manuel

## 🎯 Bonnes Pratiques Appliquées

### 📁 Organisation Modulaire
- **Auth centralisé** : Tout l'authentification dans `src/auth/`
- **Composants groupés** : Par fonctionnalité (alerts, form, weather)
- **Services séparés** : Logique métier isolée
- **Styles organisés** : Un fichier CSS par composant/fonctionnalité

### 🔄 Imports Simplifiés
```javascript
// Import depuis le module auth
import { useAuth, LoginForm, ProtectedRoute } from '../auth';

// Import depuis l'index principal
import { Dashboard, Sidebar, StatCard } from '../src';
```

### 🛡️ Sécurité
- Rôles stockés dans Firestore
- Routes protégées par rôle
- Variables d'environnement pour les clés

### 🎨 Accessibilité
- Composants accessibles (ARIA)
- Navigation au clavier
- Contrastes respectés

## 📊 Métriques du Projet

- **Composants** : ~30 composants React
- **Pages** : 10 pages principales
- **Services** : 4 services API
- **Styles** : 15 fichiers CSS organisés
- **Tests** : Supprimés (non utilisés)
- **Dépendances** : Optimisées et nettoyées
