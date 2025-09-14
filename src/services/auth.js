import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile

} from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { createUserProfile } from './userService';

// Connexion avec email/mot de passe
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Déconnexion
export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Observer l'état d'authentification
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Créer un nouvel utilisateur (pour les admins)
export const createUser = async (email, password, displayName, role = 'user') => {
  try {
    // Sauvegarder l'utilisateur actuellement connecté
    const currentUser = auth.currentUser;
    const currentUserToken = currentUser ? await currentUser.getIdToken() : null;
    
    // Créer le nouvel utilisateur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    
    // Mettre à jour le profil avec le nom
    if (displayName) {
      await updateProfile(newUser, { displayName });
    }
    
    // Essayer de créer le profil utilisateur dans Firestore (optionnel)
    try {
      await createUserProfile(newUser.uid, {
        email: newUser.email,
        displayName: displayName,
        role: role
      });
    } catch (firestoreError) {
      console.warn('Firestore indisponible, utilisateur créé sans profil Firestore:', firestoreError.message);
    }
    
    // Déconnecter le nouvel utilisateur et reconnecter l'admin
    await signOut(auth);
    
    // Reconnecter l'admin original
    if (currentUser && currentUserToken) {
      try {
        // Reconnecter l'utilisateur admin avec ses identifiants
        await signInWithEmailAndPassword(auth, currentUser.email, 'temp_password');
      } catch (reconnectError) {
        console.warn('Impossible de reconnecter automatiquement l\'admin:', reconnectError.message);
        return { 
          user: {
            uid: newUser.uid,
            email: newUser.email,
            displayName: displayName,
            role: role
          }, 
          error: null,
          needsReauth: true // L'admin doit se reconnecter manuellement
        };
      }
    }
    
    return { 
      user: {
        uid: newUser.uid,
        email: newUser.email,
        displayName: displayName,
        role: role
      }, 
      error: null,
      needsReauth: false // Pas besoin de reconnexion manuelle
    };
  } catch (error) {
    return { user: null, error: error.message, needsReauth: false };
  }
};
