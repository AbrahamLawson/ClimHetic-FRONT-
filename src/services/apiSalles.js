import axios from 'axios';
import API_CONFIG from '../config/api';

// Client API centralisé
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout: API_CONFIG.TIMEOUT,
});

// Intercepteur pour gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API Salles:', error);
    return Promise.reject(error);
  }
);

// ADMIN SALLES
export const AdminSalleAPI = {
  async list({ limit = 50, offset = 0 } = {}) {
    try {
      const response = await apiClient.get(`/admin/salles/?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des salles: ${error.message}`);
    }
  },

  async get(id) {
    try {
      const response = await apiClient.get(`/admin/salles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la salle: ${error.message}`);
    }
  },

  async create(payload) {
    try {
      const response = await apiClient.post('/admin/salles/', payload);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Erreur lors de la création de la salle: ${error.message}`);
    }
  },

  async patch(id, payload) {
    try {
      const response = await apiClient.patch(`/admin/salles/${id}`, payload);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Erreur lors de la mise à jour de la salle: ${error.message}`);
    }
  },

  async remove(id, { hard = false } = {}) {
    try {
      const response = await apiClient.delete(`/admin/salles/${id}?hard=${hard ? "true" : "false"}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Erreur lors de la suppression de la salle: ${error.message}`);
    }
  },
};
