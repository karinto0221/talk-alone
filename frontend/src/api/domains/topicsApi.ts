import { apiClient } from '../apiClient';
import type { Topic, TopicMode } from '../types';

export const topicsApi = {
  getRandom: (options: { categoryId?: string; mode: TopicMode }) => {
    const params = new URLSearchParams({ mode: options.mode });
    if (options.categoryId) params.set('categoryId', options.categoryId);
    return apiClient<Topic>(`/topics/random?${params.toString()}`);
  },
  createHint: (topic: string, categoryId: string) => apiClient<{ question: string }>('/topics/help', {
    method: 'POST', body: JSON.stringify({ topic, categoryId }),
  }),
};
