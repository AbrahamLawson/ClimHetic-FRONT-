// Auth configuration
export { auth, db, analytics } from './config/firebase';

// Auth services
export * from './services/authService';
export * from './services/userService';

// Auth contexts
export { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth components
export { default as LoginForm } from './components/LoginForm';
export { default as ProtectedRoute } from './components/ProtectedRoute';
