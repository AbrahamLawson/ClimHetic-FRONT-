import axios from 'axios';
import API_CONFIG from '../config/api';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout: API_CONFIG.TIMEOUT,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error);
    return Promise.reject(error);
  }
);

export const capteurService = {  
  async getAllCapteurs() {
    try {
      const response = await apiClient.get('/admin/capteurs');
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des capteurs: ${error.message}`);
    }
  },

  /**
   * Ajouter un nouveau capteur
   * @param {Object} capteurData - Données du capteur (nom, type_capteur, id_salle)
   */
  async ajouterCapteur(capteurData) {
    try {
      const response = await apiClient.post('/admin/capteurs', capteurData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Erreur lors de l'ajout du capteur: ${error.message}`);
    }
  },

  /**
   * Désactiver un capteur
   * @param {number} capteurId - ID du capteur à désactiver
   */
  async desactiverCapteur(capteurId) {
    try {
      const response = await apiClient.put(`/admin/capteurs/${capteurId}/desactiver`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la désactivation du capteur: ${error.message}`);
    }
  },

  /**
   * Réactiver un capteur
   * @param {number} capteurId - ID du capteur à réactiver
   */
  async reactiverCapteur(capteurId) {
    try {
      const response = await apiClient.put(`/admin/capteurs/${capteurId}/reactiver`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la réactivation du capteur: ${error.message}`);
    }
  },

  /**
   * Supprimer définitivement un capteur
   * @param {number} capteurId - ID du capteur à supprimer
   */
  async supprimerCapteur(capteurId) {
    try {
      const response = await apiClient.delete(`/admin/capteurs/${capteurId}?confirmer=true`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du capteur: ${error.message}`);
    }
  },

  /**
   * Changer la salle d'un capteur
   * @param {number} capteurId - ID du capteur à déplacer
   * @param {number} nouvelleSalleId - ID de la nouvelle salle
   */
  async changerSalleCapteur(capteurId, nouvelleSalleId) {
    try {
      const response = await apiClient.put(`/admin/capteurs/${capteurId}/changer-salle`, {
        nouvelle_salle_id: nouvelleSalleId
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Erreur lors du changement de salle: ${error.message}`);
    }
  },

  /**
   * Dissocier un capteur de sa salle
   * @param {number} capteurId - ID du capteur à dissocier
   */
  async dissocierCapteur(capteurId) {
    try {
      const response = await apiClient.put(`/admin/capteurs/${capteurId}/dissocier`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Erreur lors de la dissociation du capteur: ${error.message}`);
    }
  },

  async getSalles() {
    try {
      const response = await apiClient.get('/capteurs/salles');
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des salles: ${error.message}`);
    }
  },

  /**
   * Récupérer les capteurs d'une salle spécifique
   * @param {number} salleId - ID de la salle
   */
  async getCapteursBySalle(salleId) {
    try {
      const response = await apiClient.get(`/capteurs/salles/${salleId}/capteurs`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des capteurs de la salle: ${error.message}`);
    }
  },

  /**
   * Récupérer les moyennes d'une salle
   * @param {number} salleId - ID de la salle
   */
  async getMoyennesBySalle(salleId) {
    try {
      const response = await apiClient.get(`/capteurs/salles/${salleId}/moyennes`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des moyennes de la salle: ${error.message}`);
    }
  },

  /**
   * Récupérer les données de température d'un capteur
   * @param {number} capteurId - ID du capteur
   * @param {number} limit - Nombre de données à récupérer (défaut: 10)
   */
  async getTemperatureByCapteur(capteurId, limit = 10) {
    try {
      const response = await apiClient.get(`/capteurs/${capteurId}/temperature?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des températures du capteur: ${error.message}`);
    }
  },

  /**
   * Récupérer la conformité de toutes les salles
   * @param {number} limit - Nombre de mesures pour calculer la moyenne (défaut: 10)
   */
  async getConformiteSalles(limit = 10) {
    try {
      const response = await apiClient.get(`/capteurs/conformite?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la conformité des salles: ${error.message}`);
    }
  },

  /**
   * Récupérer les moyennes d'une salle spécifique
   * @param {number} salleId - ID de la salle
   * @param {number} limit - Nombre de mesures pour la moyenne (défaut: 10)
   */
  async getMoyennesBySalle(salleId, limit = 10) {
    try {
      const response = await apiClient.get(`/capteurs/salles/${salleId}/moyennes?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des moyennes de la salle: ${error.message}`);
    }

  }
};

export default capteurService;
