// Script pour créer le premier utilisateur admin
// À exécuter une seule fois lors de l'initialisation du projet

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase-config.js';
import { createUserProfile } from '../services/userService.js';

export const createFirstAdmin = async (email, password, displayName) => {
  try {
    console.log('Création du premier administrateur...');
    
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Mettre à jour le profil
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Créer le profil admin dans Firestore
    const result = await createUserProfile(user.uid, {
      email: user.email,
      displayName: displayName,
      role: 'admin'
    });
    
    if (result.success) {
      console.log('✅ Premier administrateur créé avec succès!');
      console.log(`Email: ${email}`);
      console.log(`Rôle: admin`);
      return { success: true, user };
    } else {
      console.error('❌ Erreur lors de la création du profil:', result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error.message);
    return { success: false, error: error.message };
  }
};

// Fonction utilitaire pour vérifier si un admin existe déjà
export const checkAdminExists = async () => {
  try {
    const { getAllUsers } = await import('../services/userService.js');
    const { users } = await getAllUsers();
    return users.some(user => user.role === 'admin');
  } catch (error) {
    console.error('Erreur lors de la vérification des admins:', error);
    return false;
  }
};

// Instructions d'utilisation
console.log(`
🔧 INSTRUCTIONS POUR CRÉER LE PREMIER ADMIN:

1. Ouvrez la console du navigateur
2. Importez cette fonction:
   import { createFirstAdmin } from './src/scripts/initAdmin.js';

3. Exécutez:
   createFirstAdmin('admin@climhetic.fr', 'motdepasse123', 'Admin Principal');

4. Une fois créé, vous pourrez vous connecter avec ces identifiants et créer d'autres utilisateurs via l'interface admin.

⚠️  IMPORTANT: Changez le mot de passe après la première connexion!
`);
