# 🔐 Authentication Module

Module d'authentification Firebase pour ClimHetic, organisé de manière modulaire et réutilisable.

## 📁 Structure

```
src/auth/
├── config/
│   └── firebase.js          # Configuration Firebase
├── services/
│   ├── authService.js       # Services d'authentification
│   └── userService.js       # Gestion des profils utilisateurs
├── contexts/
│   └── AuthContext.jsx      # Contexte React pour l'auth
├── components/
│   ├── LoginForm.jsx        # Formulaire de connexion
│   └── ProtectedRoute.jsx   # Protection des routes
├── index.js                 # Point d'entrée du module
└── README.md               # Cette documentation
```

## 🚀 Utilisation

### Import du module complet
```javascript
import { 
  AuthProvider, 
  useAuth, 
  LoginForm, 
  ProtectedRoute,
  loginWithEmail,
  logout 
} from '../auth';
```

### Configuration dans main.jsx
```javascript
import { AuthProvider } from './auth';

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### Protection des routes
```javascript
import { ProtectedRoute } from '../auth';

// Route protégée simple
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Route protégée avec rôle requis
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### Utilisation du contexte
```javascript
import { useAuth } from '../auth';

function MyComponent() {
  const { user, userProfile, isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  if (!isAuthenticated) return <div>Non connecté</div>;
  
  return <div>Bonjour {userProfile.displayName}</div>;
}
```

## 🔧 Services disponibles

### AuthService
- `loginWithEmail(email, password)` - Connexion
- `logout()` - Déconnexion  
- `createUser(email, password, displayName, role)` - Création d'utilisateur
- `onAuthStateChange(callback)` - Observer l'état d'auth

### UserService
- `createUserProfile(uid, userData)` - Créer un profil
- `getUserProfile(uid)` - Récupérer un profil
- `updateUserRole(uid, role)` - Mettre à jour le rôle
- `isUserAdmin(uid)` - Vérifier si admin
- `getAllUsers()` - Lister tous les utilisateurs

## 🛡️ Sécurité

- Rôles stockés dans Firestore (collection `users`)
- Vérification des permissions côté client ET serveur
- Pas de vérification basée sur l'email (sécurisé)
- Gestion des erreurs et états de chargement

## 🔑 Variables d'environnement

Créez un fichier `.env` avec vos clés Firebase :

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```
