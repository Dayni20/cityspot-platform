import { apiClient } from "../../../services/apiClient";

export const profileService = {
  get: () => apiClient.get("/users/profile"),
  update: (data) => apiClient.patch("/users/profile", data),
  deactivate: () => apiClient.delete("/users/profile")
};
