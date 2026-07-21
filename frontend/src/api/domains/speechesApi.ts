import { apiClient } from '../apiClient';
import type { Analytics, AnalyticsMode, CreateSpeechRequest, Speech } from '../types';

export const speechesApi = {
  create: (payload: CreateSpeechRequest) => apiClient<Speech>('/speeches', { method: 'POST', body: JSON.stringify(payload) }),
  getAnalytics: (mode: AnalyticsMode) => apiClient<Analytics>(`/speeches/analytics?mode=${mode}`),
};
