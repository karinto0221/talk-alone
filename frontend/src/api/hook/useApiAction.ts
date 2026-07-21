import { useCallback, useState } from 'react';

export function useApiAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(async <T,>(action: () => Promise<T>) => {
    setLoading(true);
    setError('');
    try { return await action(); }
    catch (cause) {
      setError(cause instanceof Error ? cause.message : '処理に失敗しました。');
      throw cause;
    } finally { setLoading(false); }
  }, []);

  return { loading, error, setError, execute };
}
