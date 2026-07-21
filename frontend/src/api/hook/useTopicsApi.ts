import { clientApi } from '..';
import { useCallback } from 'react';
import { useApiAction } from './useApiAction';

export function useTopicsApi() {
  const state = useApiAction();
  const getRandomTopic = useCallback(() => state.execute(clientApi.topics.getRandom), [state.execute]);
  const createHint = useCallback((topic: string, categoryId: string) => state.execute(() => clientApi.topics.createHint(topic, categoryId)), [state.execute]);
  return {
    ...state,
    getRandomTopic,
    createHint,
  };
}
