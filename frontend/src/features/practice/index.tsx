import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveSession } from './component/ActiveSession';
import { SessionReady } from './component/SessionReady';
import { usePracticeSession } from './hook/usePracticeSession';
import { useTemporaryResult } from '../result/context/TemporaryResultContext';
import type { PracticeResult } from '../../domain/practice';
import type { RecordingResult } from './hook/useAudioRecorder';
import type { PracticeMode, ReflexTrainingType } from './type';
import { StreamerSession } from '../streamer';
import type { StreamerCommentFrequency } from '../streamer/config/comment-frequency';
import { ReflexSession } from '../reflex';
import { listCategories } from './service/practice-content.service';

const clampDuration = (value: number) => Math.min(60, Math.max(1, Number.isFinite(value) ? Math.round(value) : 1));

export function PracticeFeature() {
  const navigate = useNavigate();
  const { clearResult, setResult } = useTemporaryResult();
  const complete = useCallback((practiceResult: PracticeResult, recording: RecordingResult | null) => {
    setResult({ practiceResult, recording });
    navigate('/result');
  }, [navigate, setResult]);
  const session = usePracticeSession(complete);
  const categories = listCategories();
  const [categoryId, setCategoryId] = useState('');
  const [mode, setMode] = useState<PracticeMode>('standard');
  const [reflexTrainingType, setReflexTrainingType] = useState<ReflexTrainingType>('comment');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [streamerCommentFrequency, setStreamerCommentFrequency] = useState<StreamerCommentFrequency>('normal');
  const [streamerActive, setStreamerActive] = useState(false);
  const [reflexActive, setReflexActive] = useState(false);
  const { state } = session;

  useEffect(() => clearResult(), [clearResult]);

  const start = () => {
    if (mode === 'streamer') {
      setDurationMinutes((current) => clampDuration(current));
      setStreamerActive(true);
      return;
    }
    if (mode === 'reflex') {
      setReflexActive(true);
      return;
    }
    void session.start({ categoryId: categoryId || undefined, mode });
  };

  if (streamerActive) {
    return <main className="page practice-page streamer-page"><StreamerSession durationMinutes={durationMinutes} commentFrequency={streamerCommentFrequency} onExit={() => setStreamerActive(false)} /></main>;
  }

  if (reflexActive) {
    return <main className="page practice-page reflex-page"><ReflexSession trainingType={reflexTrainingType} onExit={() => setReflexActive(false)} /></main>;
  }

  return (
    <main className="page practice-page">
      {session.error && <div className="error-banner" role="alert">{session.error}</div>}
      {session.recordingNotice && <div className="notice-banner" role="status">{session.recordingNotice}</div>}
      {state.phase === 'idle' || state.phase === 'preparing' ? (
        <SessionReady
          loading={state.phase === 'preparing'}
          categories={categories}
          categoryId={categoryId}
          mode={mode}
          reflexTrainingType={reflexTrainingType}
          durationMinutes={durationMinutes}
          streamerCommentFrequency={streamerCommentFrequency}
          onCategoryChange={setCategoryId}
          onModeChange={setMode}
          onReflexTrainingTypeChange={setReflexTrainingType}
          onDurationChange={(value) => setDurationMinutes(clampDuration(value))}
          onStreamerCommentFrequencyChange={setStreamerCommentFrequency}
          onStart={start}
        />
      ) : state.topic ? (
        <ActiveSession
          phase={state.phase} topic={state.topic} remaining={session.remainingSeconds}
          progress={session.progress} hint={state.hint} hintLoading={session.hintLoading}
          recordingStatus={session.recordingStatus}
          onHint={() => void session.requestHint()} onStop={() => void session.stop()}
        />
      ) : null}
    </main>
  );
}
