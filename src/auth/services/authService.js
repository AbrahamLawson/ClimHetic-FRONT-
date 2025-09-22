import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserProfile } from './userService';

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const createUser = async (email, password, displayName, role = 'user') => {
  try {
    const currentUser = auth.currentUser;
    const currentUserToken = currentUser ? await currentUser.getIdToken() : null;
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    
    if (displayName) {
      await updateProfile(newUser, { displayName });
    }
    
    try {
      await createUserProfile(newUser.uid, {
        email: newUser.email,
        displayName: displayName,
        role: role
      });
    } catch (firestoreError) {
      console.warn('Firestore indisponible, utilisateur créé sans profil Firestore:', firestoreError.message);
    }
    
    await signOut(auth);
    
    if (currentUser && currentUserToken) {
      try {
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
          needsReauth: true
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
      needsReauth: false
    };
  } catch (error) {
    return { user: null, error: error.message, needsReauth: false };
  }
};
