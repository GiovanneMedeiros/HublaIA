import api from '@/lib/api';
import { ApiResponse, Lead, PaginatedResult } from '@/types';

export const leadsService = {
  getLeads: async (page = 1, limit = 10) => {
    const response = await api.get<ApiResponse<PaginatedResult<Lead>>>(
      `/leads?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  getLead: async (id: string) => {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  },

  createLead: async (data: Partial<Lead>) => {
    const response = await api.post<ApiResponse<Lead>>('/leads', data);
    return response.data.data;
  },

  updateLead: async (id: string, data: Partial<Lead>) => {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data.data;
  },

  deleteLead: async (id: string) => {
    await api.delete(`/leads/${id}`);
  },

  qualifyLead: async (id: string, qualificationData: any) => {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}/qualify`, qualificationData);
    return response.data.data;
  },
};
