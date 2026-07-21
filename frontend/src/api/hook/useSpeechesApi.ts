import { clientApi } from '..';
import { useCallback } from 'react';
import type { CreateSpeechRequest } from '../types';
import { useApiAction } from './useApiAction';

export function useSpeechesApi() {
  const state = useApiAction();
  const createSpeech = useCallback((payload: CreateSpeechRequest) => state.execute(() => clientApi.speeches.create(payload)), [state.execute]);
  const getAnalytics = useCallback(() => state.execute(clientApi.speeches.getAnalytics), [state.execute]);
  return {
    ...state,
    createSpeech,
    getAnalytics,
  };
}
