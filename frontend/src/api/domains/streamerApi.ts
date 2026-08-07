import { apiClient } from '../apiClient';
import type { StreamerComment } from '../types';

export const streamerApi = {
  createComment: (recentComments: string[]) => apiClient<StreamerComment>('/streamer/comments', {
    method: 'POST',
    body: JSON.stringify({ recentComments: recentComments.slice(-10) }),
  }),
};
