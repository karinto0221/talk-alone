import { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import type { PracticeResult } from '../../../domain/practice';
import type { RecordingResult } from '../../practice/hook/useAudioRecorder';
import type { PracticeOptions } from '../../practice/type';

export type TemporaryResult = { practiceResult: PracticeResult; recording: RecordingResult | null };

type ContextValue = {
  result: TemporaryResult | null;
  setResult: (result: TemporaryResult) => void;
  clearResult: () => void;
  requestSpeechRetry: (options: PracticeOptions) => void;
  consumeSpeechRetry: () => PracticeOptions | null;
};

const TemporaryResultContext = createContext<ContextValue | null>(null);

export function TemporaryResultProvider({ children }: PropsWithChildren) {
  const [result, setResultState] = useState<TemporaryResult | null>(null);
  const speechRetry = useRef<PracticeOptions | null>(null);
  const setResult = useCallback((value: TemporaryResult) => setResultState(value), []);
  const clearResult = useCallback(() => setResultState(null), []);
  const requestSpeechRetry = useCallback((options: PracticeOptions) => { speechRetry.current = options; }, []);
  const consumeSpeechRetry = useCallback(() => {
    const options = speechRetry.current;
    speechRetry.current = null;
    return options;
  }, []);
  const value = useMemo(() => ({ result, setResult, clearResult, requestSpeechRetry, consumeSpeechRetry }), [clearResult, consumeSpeechRetry, requestSpeechRetry, result, setResult]);
  return <TemporaryResultContext.Provider value={value}>{children}</TemporaryResultContext.Provider>;
}

export function useTemporaryResult() {
  const value = useContext(TemporaryResultContext);
  if (!value) throw new Error('TemporaryResultProvider is missing.');
  return value;
}
