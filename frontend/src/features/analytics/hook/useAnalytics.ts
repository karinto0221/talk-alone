import { useCallback, useEffect, useState } from 'react';
import type { Analytics } from '../../../api';
import { useSpeechesApi } from '../../../api/hook/useSpeechesApi';

export function useAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const speechesApi = useSpeechesApi();
  const load = useCallback(async () => {
    try { setData(await speechesApi.getAnalytics()); }
    catch { setData(null); }
  }, [speechesApi.getAnalytics]);
  useEffect(() => { void load(); }, [load]);
  return { data, loading: speechesApi.loading, error: speechesApi.error, reload: load };
}
