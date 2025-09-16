import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSuccess = (user) => {
    setError('');
    onSuccess?.(user);
    onClose?.();
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} tabIndex={-1} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} tabIndex={0} aria-label="Fermer">×</button>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isLogin ? (
          <LoginForm onSuccess={handleSuccess} onError={handleError} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onError={handleError} />
        )}

        <div className="auth-switch">
          {isLogin ? (
            <p>
              Pas encore de compte ?{' '}
              <button 
                type="button"
                tabIndex={0} 
                onClick={() => setIsLogin(false)}
                className="link-button"
              >
                S'inscrire
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <button 
                type="button" 
                onClick={() => setIsLogin(true)}
                className="link-button"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
