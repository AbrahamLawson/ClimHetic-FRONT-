import axios from "axios";
import API_CONFIG from "../config/api"; 

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,       
  headers: {
    ...API_CONFIG.DEFAULT_HEADERS,
    'ngrok-skip-browser-warning': 'true'
  },  
  timeout: API_CONFIG.TIMEOUT || 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
