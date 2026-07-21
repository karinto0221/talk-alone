import { categoriesApi } from './domains/categoriesApi';
import { speechesApi } from './domains/speechesApi';
import { topicsApi } from './domains/topicsApi';

export const clientApi = { categories: categoriesApi, topics: topicsApi, speeches: speechesApi };
