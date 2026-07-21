import { useCallback } from 'react';
import { clientApi } from '..';
import { useApiAction } from './useApiAction';

export function useCategoriesApi() {
  const state = useApiAction();
  const listCategories = useCallback(() => state.execute(clientApi.categories.list), [state.execute]);
  return { ...state, listCategories };
}
