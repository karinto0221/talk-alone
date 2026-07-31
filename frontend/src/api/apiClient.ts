export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

export async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    const headers = new Headers(options?.headers);
    if (!(options?.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      credentials: 'same-origin',
      headers,
    });
  } catch {
    throw new ApiError(0, 'サーバーに接続できません。');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new ApiError(response.status, message ?? '処理に失敗しました。');
  }
  return response.json() as Promise<T>;
}
