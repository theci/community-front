'use client';

import { useAuthStore } from '../store';

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, register, logout, clearError } =
    useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
