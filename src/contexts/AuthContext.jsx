import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange } from '../services/auth';
import { getUserProfile } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          try {
            // Récupérer le profil utilisateur depuis Firestore OBLIGATOIREMENT
            const { user: profile, error } = await getUserProfile(firebaseUser.uid);
            
            if (!error && profile) {
              // Profil existant trouvé avec rôle Firestore
              setUserProfile(profile);
            } else {
              // Pas de profil Firestore = accès refusé
              console.error('Aucun profil Firestore trouvé pour cet utilisateur');
              setUserProfile({
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                role: 'guest' // Rôle par défaut sans accès
              });
            }
          } catch (firestoreError) {
            console.error('Erreur Firestore, accès limité:', firestoreError.message);
            // En cas d'erreur Firestore, rôle guest par défaut
            setUserProfile({
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              role: 'guest'
            });
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        // En cas d'erreur, permettre quand même la connexion avec un profil minimal
        if (firebaseUser) {
          setUser(firebaseUser);
          setUserProfile({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: 'user'
          });
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
