import { apiClient } from "../../../services/apiClient";

export const recommendationService = {
  generate: (data) => apiClient.post("/recommendations", data)
};
