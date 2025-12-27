import { apiClient } from '../api';
import type { Notification, NotificationListResponse } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  message?: string;
}

export const notificationService = {
  getNotifications: async (page = 0, size = 20): Promise<NotificationListResponse> => {
    const response = await apiClient.get<ApiResponse<NotificationListResponse>>(
      `/notifications/me?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      '/notifications/me/unread-count'
    );
    return response.data.data.count;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  },

  deleteNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};
