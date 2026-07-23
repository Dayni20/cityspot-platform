import { apiClient } from "../../../services/apiClient";

export const reviewService = {
  create: (activityId, data) => apiClient.post(`/activities/${activityId}/reviews`, data),
  listByActivity: (activityId) => apiClient.get(`/activities/${activityId}/reviews`),
  listOwner: () => apiClient.get("/reviews/owner"),
  ownerUnreadCount: () => apiClient.get("/reviews/owner/unread-count"),
  markOwnerAsRead: () => apiClient.patch("/reviews/owner/read", {})
};
