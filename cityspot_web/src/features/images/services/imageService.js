import { apiClient } from "../../../services/apiClient";

export const imageService = {
  list: (activityId) => apiClient.get(`/activities/${activityId}/images`),
  upload: (activityId, file, isMain = false) => {
    const form = new FormData();
    form.append("image", file);
    form.append("isMain", String(isMain));
    return apiClient.post(`/activities/${activityId}/images`, form);
  },
  setMain: (activityId, imageId) =>
    apiClient.patch(`/activities/${activityId}/images/${imageId}/main`),
  remove: (activityId, imageId) =>
    apiClient.delete(`/activities/${activityId}/images/${imageId}`)
};
