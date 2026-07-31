import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpeechesApi } from '../../../api/hook/useSpeechesApi';
import { useTopicsApi } from '../../../api/hook/useTopicsApi';
import type { PracticeOptions, PracticeState } from '../type';
import { SESSION_SECONDS } from '../util/time';
import { useAudioRecorder, type RecordingResult } from './useAudioRecorder';
import type { Speech } from '../../../api';

const initialState: PracticeState = { phase: 'idle', topic: null, elapsedSeconds: 0, hint: '', helpCount: 0 };

export function usePracticeSession(onComplete: (speech: Speech, recording: RecordingResult | null) => void) {
  const [state, setState] = useState(initialState);
  const timer = useRef<number>();
  const topicsApi = useTopicsApi();
  const speechesApi = useSpeechesApi();
  const recorder = useAudioRecorder();
  const [recordingNotice, setRecordingNotice] = useState('');
  const stopping = useRef(false);

  const start = useCallback(async (options: PracticeOptions) => {
    setState({ ...initialState, phase: 'preparing' });
    setRecordingNotice('');
    stopping.current = false;
    try {
      const topic = await topicsApi.getRandomTopic(options);
      const recordingStarted = await recorder.start();
      if (!recordingStarted) setRecordingNotice('マイクを利用できないため、録音なしで開始しました。');
      setState({ ...initialState, phase: 'speaking', topic });
    } catch { setState(initialState); }
  }, [recorder.start, topicsApi.getRandomTopic]);

  const stop = useCallback(async () => {
    if (!state.topic || state.phase !== 'speaking' || stopping.current) return;
    stopping.current = true;
    setState((current) => ({ ...current, phase: 'saving' }));
    try {
      const [speech, recording] = await Promise.all([
        speechesApi.createSpeech({
          topic: state.topic.text,
          categoryId: state.topic.categoryId,
          mode: state.topic.mode,
          durationSeconds: Math.min(SESSION_SECONDS, Math.max(1, state.elapsedSeconds)),
          helpCount: state.helpCount,
        }),
        recorder.stop(),
      ]);
      onComplete(speech, recording);
    } catch {
      stopping.current = false;
      setState((current) => ({ ...current, phase: 'speaking' }));
    }
  }, [onComplete, recorder.stop, speechesApi.createSpeech, state]);

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
    recordingStatus: recorder.status,
    recordingNotice,
    start,
    stop,
    requestHint,
  };
}
