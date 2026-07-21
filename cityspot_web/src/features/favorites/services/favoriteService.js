import { apiClient } from "../../../services/apiClient";

export const favoriteService = {
  list: () => apiClient.get("/favorites"),
  add: (activityId) => apiClient.post(`/favorites/${activityId}`),
  remove: (activityId) => apiClient.delete(`/favorites/${activityId}`)
};
