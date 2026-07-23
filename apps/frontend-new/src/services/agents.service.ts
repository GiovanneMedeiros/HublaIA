import api from '@/lib/api';
import { ApiResponse, Agent, PaginatedResult } from '@/types';

export const agentsService = {
  getAgents: async (page = 1, limit = 10) => {
    const response = await api.get<ApiResponse<PaginatedResult<Agent>>>(
      `/agents?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  getAgent: async (id: string) => {
    const response = await api.get<ApiResponse<Agent>>(`/agents/${id}`);
    return response.data.data;
  },

  createAgent: async (data: Partial<Agent>) => {
    const response = await api.post<ApiResponse<Agent>>('/agents', data);
    return response.data.data;
  },

  updateAgent: async (id: string, data: Partial<Agent>) => {
    const response = await api.put<ApiResponse<Agent>>(`/agents/${id}`, data);
    return response.data.data;
  },

  updateAvailability: async (id: string, isAvailable: boolean) => {
    const response = await api.put<ApiResponse<Agent>>(`/agents/${id}/availability`, {
      isAvailable,
    });
    return response.data.data;
  },

  deleteAgent: async (id: string) => {
    await api.delete(`/agents/${id}`);
  },
};
