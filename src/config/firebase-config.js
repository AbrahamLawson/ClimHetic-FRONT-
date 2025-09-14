import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA8kBWBf2HMvnuJK3XXg_umR7cDEGJN1Fc",
  authDomain: "climheticback.firebaseapp.com",
  projectId: "climheticback",
  storageBucket: "climheticback.firebasestorage.app",
  messagingSenderId: "775869750255",
  appId: "1:775869750255:web:ad88987b3cdaea70e7741a",
  measurementId: "G-G21KVE9YT8"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firebase Auth
export const auth = getAuth(app);

// Initialiser Firestore
export const db = getFirestore(app);

// Initialiser Analytics 
export const analytics = getAnalytics(app);

export default app;
