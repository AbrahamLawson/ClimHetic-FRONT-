import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
