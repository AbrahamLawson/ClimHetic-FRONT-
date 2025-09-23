// Configuration de l'API
export const API_CONFIG = {
  // URL de base de l'API back-end
  BASE_URL: import.meta.env.VITE_API_URL || 'https://nonlosable-mouthy-adolph.ngrok-free.dev/api',
  
  // Timeout par défaut pour les requêtes
  TIMEOUT: 10000, // 10 secondes
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;

