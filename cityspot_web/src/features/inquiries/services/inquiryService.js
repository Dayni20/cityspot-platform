import { apiClient } from "../../../services/apiClient";

export const inquiryService = {
  create: (activityId, data) => apiClient.post(`/activities/${activityId}/inquiries`, data),
  listMine: () => apiClient.get("/inquiries/mine"),
  unreadCount: () => apiClient.get("/inquiries/mine/unread-count"),
  markMineAsRead: () => apiClient.patch("/inquiries/mine/read", {}),
  listOwner: () => apiClient.get("/inquiries/owner"),
  ownerPendingCount: () => apiClient.get("/inquiries/owner/pending-count"),
  answer: (id, data) => apiClient.patch(`/inquiries/${id}/answer`, data)
};
