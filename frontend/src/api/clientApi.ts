import { categoriesApi } from './domains/categoriesApi';
import { speechesApi } from './domains/speechesApi';
import { topicsApi } from './domains/topicsApi';
import { streamerApi } from './domains/streamerApi';

export const clientApi = { categories: categoriesApi, topics: topicsApi, speeches: speechesApi, streamer: streamerApi };
