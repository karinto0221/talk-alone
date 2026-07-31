import { clientApi } from '..';
import { useCallback } from 'react';
import type { AnalyticsMode, CreateSpeechRequest } from '../types';
import { useApiAction } from './useApiAction';

export function useSpeechesApi() {
  const state = useApiAction();
  const createSpeech = useCallback((payload: CreateSpeechRequest) => state.execute(() => clientApi.speeches.create(payload)), [state.execute]);
  const getAnalytics = useCallback((mode: AnalyticsMode) => state.execute(() => clientApi.speeches.getAnalytics(mode)), [state.execute]);
  const analyzeSpeech = useCallback((speechId: string, audio: Blob) => state.execute(() => clientApi.speeches.analyze(speechId, audio)), [state.execute]);
  return {
    ...state,
    createSpeech,
    getAnalytics,
    analyzeSpeech,
  };
}
