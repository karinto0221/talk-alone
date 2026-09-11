import { useCallback, useEffect, useRef, useState } from 'react';
import type { PracticeOptions, PracticeState } from '../type';
import { SESSION_SECONDS } from '../util/time';
import { useAudioRecorder, type RecordingResult } from './useAudioRecorder';
import type { PracticeResult } from '../../../domain/practice';
import { createRandomHint, createRandomTopic } from '../service/practice-content.service';

const initialState: PracticeState = { phase: 'idle', topic: null, elapsedSeconds: 0, hint: '' };

export function usePracticeSession(onComplete: (result: PracticeResult, recording: RecordingResult | null) => void) {
  const [state, setState] = useState(initialState);
  const timer = useRef<number>();
  const recorder = useAudioRecorder();
  const [error, setError] = useState('');
  const [recordingNotice, setRecordingNotice] = useState('');
  const stopping = useRef(false);

  const start = useCallback(async (options: PracticeOptions) => {
    setState({ ...initialState, phase: 'preparing' });
    setError('');
    setRecordingNotice('');
    stopping.current = false;
    try {
      const topic = createRandomTopic(options);
      const recordingStarted = await recorder.start();
      if (!recordingStarted) setRecordingNotice('マイクを利用できないため、録音なしで開始しました。');
      setState({ ...initialState, phase: 'speaking', topic });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'お題を準備できませんでした。');
      setState(initialState);
    }
  }, [recorder.start]);

  const stop = useCallback(async () => {
    if (!state.topic || state.phase !== 'speaking' || stopping.current) return;
    stopping.current = true;
    setState((current) => ({ ...current, phase: 'finishing' }));
    try {
      const recording = await recorder.stop();
      onComplete({
        topic: state.topic.text,
        categoryName: state.topic.categoryName,
        mode: state.topic.mode,
        durationSeconds: Math.min(SESSION_SECONDS, Math.max(1, state.elapsedSeconds)),
        completedAt: new Date().toISOString(),
      }, recording);
    } catch (cause) {
      stopping.current = false;
      setError(cause instanceof Error ? cause.message : '録音を終了できませんでした。');
      setState((current) => ({ ...current, phase: 'speaking' }));
    }
  }, [onComplete, recorder.stop, state]);

  const requestHint = useCallback(() => {
    if (!state.topic || state.phase !== 'speaking') return;
    setState((current) => ({
      ...current,
      hint: createRandomHint(state.topic!.text, state.topic!.categoryId, current.hint),
    }));
  }, [state.topic, state.phase]);

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
    error,
    hintLoading: false,
    recordingStatus: recorder.status,
    recordingNotice,
    start,
    stop,
    requestHint,
  };
}
