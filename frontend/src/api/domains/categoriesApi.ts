import { apiClient } from '../apiClient';
import type { Category } from '../types';

export const categoriesApi = { list: () => apiClient<Category[]>('/categories') };
