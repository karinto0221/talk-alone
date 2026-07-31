import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import type { Speech } from '../../../api';
import type { RecordingResult } from '../../practice/hook/useAudioRecorder';

export type TemporaryResult = { speech: Speech; recording: RecordingResult | null };

type ContextValue = {
  result: TemporaryResult | null;
  setResult: (result: TemporaryResult) => void;
  clearResult: () => void;
};

const TemporaryResultContext = createContext<ContextValue | null>(null);

export function TemporaryResultProvider({ children }: PropsWithChildren) {
  const [result, setResultState] = useState<TemporaryResult | null>(null);
  const setResult = useCallback((value: TemporaryResult) => setResultState(value), []);
  const clearResult = useCallback(() => setResultState(null), []);
  const value = useMemo(() => ({ result, setResult, clearResult }), [clearResult, result, setResult]);
  return <TemporaryResultContext.Provider value={value}>{children}</TemporaryResultContext.Provider>;
}

export function useTemporaryResult() {
  const value = useContext(TemporaryResultContext);
  if (!value) throw new Error('TemporaryResultProvider is missing.');
  return value;
}
