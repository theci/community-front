import { apiClient } from '../api';
import type { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ userId: number; email: string; username: string }> => {
    const response = await apiClient.post('/users/register', data);
    return response.data;
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
