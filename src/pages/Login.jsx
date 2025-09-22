import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../auth';

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSuccess = (user) => {
    setError('');
    navigate('/dashboard');
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <main className="auth-page" aria-labelledby="auth-form" tabIndex={-1}>
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>

      <div id="main-content" tabIndex={-1}>
      <div className="auth-container" aria-label="Formulaire d'authentification">
      <section className="auth-section">
        {error && (
          <div role="alert" aria-live="polite" className="error-message">
            {error}
          </div>
        )}
        
        <LoginForm onSuccess={handleSuccess} onError={handleError} aria-label="Formulaire de connexion"/>
      </section>
      </div>
      </div>
    </main>
  );
}
