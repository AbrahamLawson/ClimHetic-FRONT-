import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA8kBWBf2HMvnuJK3XXg_umR7cDEGJN1Fc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "climheticback.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "climheticback",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "climheticback.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "775869750255",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:775869750255:web:ad88987b3cdaea70e7741a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G21KVE9YT8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
