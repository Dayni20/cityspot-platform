import { apiClient } from "../../../services/apiClient";

function queryString(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const activityService = {
  listPublic: (filters) => apiClient.get(`/activities${queryString(filters)}`),
  getById: (id) => apiClient.get(`/activities/${id}`),
  listAdmin: () => apiClient.get("/activities/admin"),
  listMine: () => apiClient.get("/activities/mine"),
  create: (data) => apiClient.post("/activities", data),
  update: (id, data) => apiClient.patch(`/activities/${id}`, data),
  updateStatus: (id, status) => apiClient.patch(`/activities/${id}/status`, { status }),
  deactivate: (id) => apiClient.delete(`/activities/${id}`),
  list: () => apiClient.get("/activities/admin")
};
