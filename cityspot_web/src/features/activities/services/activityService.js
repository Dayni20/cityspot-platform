import { apiClient } from "../../../services/apiClient";

export const activityService = {
  list: () => apiClient.get("/activities/admin"),
  updateStatus: (id, status) => apiClient.patch(`/activities/${id}/status`, { status }),
  deactivate: (id) => apiClient.delete(`/activities/${id}`)
};
