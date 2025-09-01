import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

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
    <div className="auth-page">
      <div className="auth-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <LoginForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
}
