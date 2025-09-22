import apiClient from "./apiClient";

const base = "/admin/salles"; // ta BASE_URL inclut déjà /api

const adminSalleService = {
  async list() {
    const { data } = await apiClient.get(`${base}/`);       // <-- slash final
    return data;
  },
  async create(payload) {
    const { data } = await apiClient.post(`${base}/`, payload); // <-- slash final
    return data;
  },
  async getById(id) {
    const { data } = await apiClient.get(`${base}/${id}`);
    return data;
  },
  async update(id, payload) {
    const { data } = await apiClient.put(`${base}/${id}`, payload);
    return data;
  },
  async patch(id, payload) {
    const { data } = await apiClient.patch(`${base}/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await apiClient.delete(`${base}/${id}`);
    return data;
  },
};

export default adminSalleService;
