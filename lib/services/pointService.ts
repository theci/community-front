import { apiClient } from '../api';
import type { PointInfo, PointTransaction, PointRanking } from '../types';

export const pointService = {
  getMyPoints: async (): Promise<PointInfo> => {
    const response = await apiClient.get<PointInfo>('/points/me');
    return response.data;
  },

  getMyTransactions: async (page = 0, size = 20): Promise<PointTransaction[]> => {
    const response = await apiClient.get<PointTransaction[]>('/points/me/transactions', {
      params: { page, size },
    });
    return response.data;
  },

  getRanking: async (limit = 100): Promise<PointRanking[]> => {
    const response = await apiClient.get<PointRanking[]>(`/points/ranking?limit=${limit}`);
    return response.data;
  },

  usePoints: async (amount: number, reason: string): Promise<void> => {
    await apiClient.post('/points/me/use', { amount, reason });
  },
};
