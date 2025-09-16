import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
  const { user, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setRoleLoading(false);
        return;
      }

      try {
        const { user: profile, error } = await getUserProfile(user.uid);
        
        if (!error && profile) {
          setUserRole(profile.role);
          
          if (requiredRole && profile.role !== requiredRole) {
            setAccessDenied(true);
          }
        } else {
          console.error('Impossible de récupérer le profil utilisateur:', error);
          setAccessDenied(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
        setAccessDenied(true);
      } finally {
        setRoleLoading(false);
      }
    };

    checkUserRole();
  }, [user, requiredRole]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="text-sm text-gray-500">
            Rôle requis: {requiredRole} | Votre rôle: {userRole || 'Non défini'}
          </p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
