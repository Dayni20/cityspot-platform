import { apiClient } from "../../../services/apiClient";

export const searchHistoryService = {
  list: () => apiClient.get("/search-history"),
  count: () => apiClient.get("/search-history/count"),
  save: (data) => apiClient.post("/search-history", data),
  remove: (id) => apiClient.delete(`/search-history/${id}`),
  clear: () => apiClient.delete("/search-history")
};
