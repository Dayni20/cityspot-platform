import { apiClient } from "../../../services/apiClient";

export const profileService = {
  get: () => apiClient.get("/users/profile"),
  update: (data) => apiClient.patch("/users/profile", data),
  updatePassword: (data) => apiClient.patch("/users/password", data),
  deactivate: () => apiClient.delete("/users/profile")
};
