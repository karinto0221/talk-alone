import { useCallback } from 'react';
import { clientApi } from '..';
import { useApiAction } from './useApiAction';

export function useStreamerApi() {
  const state = useApiAction();
  const createComment = useCallback(
    (recentComments: string[]) => state.execute(() => clientApi.streamer.createComment(recentComments)),
    [state.execute],
  );
  return { ...state, createComment };
}
