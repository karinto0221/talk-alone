import { useCallback, useEffect, useState } from 'react';
import type { Analytics, AnalyticsMode } from '../../../api';
import { useSpeechesApi } from '../../../api/hook/useSpeechesApi';

export function useAnalytics(mode: AnalyticsMode) {
  const [data, setData] = useState<Analytics | null>(null);
  const speechesApi = useSpeechesApi();
  const load = useCallback(async () => {
    setData(null);
    try { setData(await speechesApi.getAnalytics(mode)); }
    catch { setData(null); }
  }, [mode, speechesApi.getAnalytics]);
  useEffect(() => { void load(); }, [load]);
  return { data, loading: speechesApi.loading, error: speechesApi.error, reload: load };
}
