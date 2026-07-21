import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpeechesApi } from '../../../api/hook/useSpeechesApi';
import { useTopicsApi } from '../../../api/hook/useTopicsApi';
import type { PracticeOptions, PracticeState } from '../type';
import { SESSION_SECONDS } from '../util/time';

const initialState: PracticeState = { phase: 'idle', topic: null, elapsedSeconds: 0, hint: '', helpCount: 0 };

export function usePracticeSession() {
  const [state, setState] = useState(initialState);
  const timer = useRef<number>();
  const topicsApi = useTopicsApi();
  const speechesApi = useSpeechesApi();

  const start = useCallback(async (options: PracticeOptions) => {
    setState({ ...initialState, phase: 'preparing' });
    try {
      const topic = await topicsApi.getRandomTopic(options);
      setState({ ...initialState, phase: 'speaking', topic });
    } catch { setState(initialState); }
  }, [topicsApi.getRandomTopic]);

  const stop = useCallback(async () => {
    if (!state.topic || state.phase !== 'speaking') return;
    setState((current) => ({ ...current, phase: 'saving' }));
    try {
      await speechesApi.createSpeech({
        topic: state.topic.text,
        categoryId: state.topic.categoryId,
        mode: state.topic.mode,
        durationSeconds: Math.max(1, state.elapsedSeconds),
        helpCount: state.helpCount,
      });
      setState((current) => ({ ...current, phase: 'complete' }));
    } catch { setState((current) => ({ ...current, phase: 'speaking' })); }
  }, [speechesApi.createSpeech, state]);

  const requestHint = useCallback(async () => {
    if (!state.topic || state.phase !== 'speaking') return;
    try {
      const result = await topicsApi.createHint(state.topic.text, state.topic.categoryId);
      setState((current) => ({ ...current, hint: result.question, helpCount: current.helpCount + 1 }));
    } catch { /* error is surfaced by the API hook */ }
  }, [state.topic, state.phase, topicsApi.createHint]);

  useEffect(() => {
    if (state.phase !== 'speaking') return;
    timer.current = window.setInterval(() => setState((current) => ({ ...current, elapsedSeconds: current.elapsedSeconds + 1 })), 1000);
    return () => window.clearInterval(timer.current);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === 'speaking' && state.elapsedSeconds >= SESSION_SECONDS) void stop();
  }, [state.elapsedSeconds, state.phase, stop]);

  return {
    state,
    remainingSeconds: SESSION_SECONDS - state.elapsedSeconds,
    progress: Math.min(100, (state.elapsedSeconds / SESSION_SECONDS) * 100),
    error: topicsApi.error || speechesApi.error,
    hintLoading: topicsApi.loading && state.phase === 'speaking',
    start,
    stop,
    requestHint,
  };
}
