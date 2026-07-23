import api from '@/lib/api';
import { ApiResponse, AuthResponse, User } from '@/types';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  signup: async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  },

  exchangeGoogleCode: async (code: string, state: string) => {
    const response = await api.post<ApiResponse<null>>('/auth/google/exchange', {
      code,
      state,
    });
    return response.data;
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};
