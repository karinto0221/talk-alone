import { apiClient } from '../apiClient';
import type { Topic } from '../types';

export const topicsApi = {
  getRandom: () => apiClient<Topic>('/topics/random'),
  createHint: (topic: string, categoryId: string) => apiClient<{ question: string }>('/topics/help', {
    method: 'POST', body: JSON.stringify({ topic, categoryId }),
  }),
};
