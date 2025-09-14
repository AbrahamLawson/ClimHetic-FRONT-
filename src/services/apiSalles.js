const BASE_URL =
  import.meta?.env?.VITE_API_URL || 
  process.env.REACT_APP_API_URL ||   
  "http://127.0.0.1:5000";

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
  return data;
}

// ADMIN SALLES
export const AdminSalleAPI = {
  list:  ({ limit = 50, offset = 0 } = {}) =>
    jsonFetch(`${BASE_URL}/api/admin/salles/?limit=${limit}&offset=${offset}`),

  get:   (id) =>
    jsonFetch(`${BASE_URL}/api/admin/salles/${id}`),

  create: (payload) =>
    jsonFetch(`${BASE_URL}/api/admin/salles/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  patch: (id, payload) =>
    jsonFetch(`${BASE_URL}/api/admin/salles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id, { hard = false } = {}) =>
    jsonFetch(`${BASE_URL}/api/admin/salles/${id}?hard=${hard ? "true" : "false"}`, {
      method: "DELETE",
    }),
};
