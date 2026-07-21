import { apiClient } from '../apiClient';
import type { Analytics, CreateSpeechRequest, Speech } from '../types';

export const speechesApi = {
  create: (payload: CreateSpeechRequest) => apiClient<Speech>('/speeches', { method: 'POST', body: JSON.stringify(payload) }),
  getAnalytics: () => apiClient<Analytics>('/speeches/analytics'),
};
