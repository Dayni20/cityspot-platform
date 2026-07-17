import { apiClient } from "../../../services/apiClient";

export const categoryService = {
  list: () => apiClient.get("/categories"),
  create: (data) => apiClient.post("/categories", data),
  update: (id, data) => apiClient.patch(`/categories/${id}`, data),
  remove: (id) => apiClient.delete(`/categories/${id}`)
};
