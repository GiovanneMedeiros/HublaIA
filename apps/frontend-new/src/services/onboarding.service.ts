import api from '@/lib/api';
import { ApiResponse, OnboardingState, OnboardingStep, PropertyProvider } from '@/types';

export const onboardingService = {
  getState: async () => {
    const response = await api.get<ApiResponse<OnboardingState>>('/onboarding/state');
    return response.data;
  },

  saveStep: async (step: OnboardingStep, payload: Record<string, any>) => {
    const response = await api.put<ApiResponse<OnboardingState>>('/onboarding/step', {
      step,
      payload,
    });
    return response.data;
  },

  complete: async (options?: { provisionDefaults?: boolean; createDefaultPrompt?: boolean }) => {
    const response = await api.post<ApiResponse<OnboardingState>>('/onboarding/complete', {
      ...options,
    });
    return response.data;
  },

  getRealEstateProviders: async () => {
    const response = await api.get<ApiResponse<PropertyProvider[]>>(
      '/onboarding/real-estate/property-providers'
    );
    return response.data;
  },

  requestPropertyProvider: async (providerKey: string) => {
    const response = await api.post<ApiResponse<{ requested: boolean }>>(
      `/onboarding/real-estate/property-providers/${providerKey}/request`,
      {}
    );
    return response.data;
  },
};
