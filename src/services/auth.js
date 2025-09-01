import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,

} from 'firebase/auth';
import { auth } from '../config/firebase-config';

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
