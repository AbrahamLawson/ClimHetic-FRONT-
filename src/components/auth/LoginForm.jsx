import { useState } from 'react';
import Form from '../form/Form';
import { loginWithEmail } from '../../services/auth';

export default function LoginForm({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const loginFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'votre@email.com',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      label: 'Mot de passe',
      placeholder: 'Votre mot de passe',
      required: true
    }
  ];

  const handleLogin = async (data) => {
    setLoading(true);
    const { user, error } = await loginWithEmail(data.email, data.password);
    
    if (error) {
      onError?.(error);
    } else {
      onSuccess?.(user);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Connexion ClimHetic</h2>
      
      <Form 
        fields={loginFields}
        onSubmit={handleLogin}
        submitLabel={loading ? "Connexion..." : "Se connecter"}
      />
    </div>
  );
}
