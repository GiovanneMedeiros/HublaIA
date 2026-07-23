import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const leadService = {
  getLeads: () => api.get('/leads'),
  createLead: (data: any) => api.post('/leads', data),
  getLead: (id: string) => api.get(`/leads/${id}`),
};

export const agentService = {
  getAgents: () => api.get('/agents'),
  createAgent: (data: any) => api.post('/agents', data),
};
