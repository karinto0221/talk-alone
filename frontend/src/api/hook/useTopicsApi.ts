import { clientApi } from '..';
import { useCallback } from 'react';
import { useApiAction } from './useApiAction';
import type { TopicMode } from '../types';

export function useTopicsApi() {
  const state = useApiAction();
  const getRandomTopic = useCallback(
    (options: { categoryId?: string; mode: TopicMode }) => state.execute(() => clientApi.topics.getRandom(options)),
    [state.execute],
  );
  const createHint = useCallback((topic: string, categoryId: string) => state.execute(() => clientApi.topics.createHint(topic, categoryId)), [state.execute]);
  return {
    ...state,
    getRandomTopic,
    createHint,
  };
}
