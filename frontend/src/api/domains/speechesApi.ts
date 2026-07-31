import { apiClient } from '../apiClient';
import type { Analytics, AnalyticsMode, CreateSpeechRequest, Speech, SpeechAnalysis } from '../types';

function audioExtension(mimeType: string) {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

export const speechesApi = {
  create: (payload: CreateSpeechRequest) => apiClient<Speech>('/speeches', { method: 'POST', body: JSON.stringify(payload) }),
  getAnalytics: (mode: AnalyticsMode) => apiClient<Analytics>(`/speeches/analytics?mode=${mode}`),
  analyze: (speechId: string, audio: Blob) => {
    const form = new FormData();
    form.append('audio', audio, `speech.${audioExtension(audio.type)}`);
    return apiClient<SpeechAnalysis>(`/speeches/${speechId}/analysis`, { method: 'POST', body: form });
  },
};
