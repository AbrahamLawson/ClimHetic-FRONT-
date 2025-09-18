import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';

// Créer un profil utilisateur dans Firestore
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Récupérer un profil utilisateur
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return { user: userDoc.data(), error: null };
    } else {
      return { user: null, error: 'Utilisateur non trouvé' };
    }
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Mettre à jour le rôle d'un utilisateur
export const updateUserRole = async (uid, role) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { 
      role,
      updatedAt: new Date()
    }, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Vérifier si un utilisateur est admin
export const isUserAdmin = async (uid) => {
  try {
    const { user, error } = await getUserProfile(uid);
    if (error) return false;
    return user?.role === 'admin';
  } catch (error) {
    return false;
  }
};

// Récupérer tous les utilisateurs (pour les admins)
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() });
    });
    
    return { users, error: null };
  } catch (error) {
    return { users: [], error: error.message };
  }
};
