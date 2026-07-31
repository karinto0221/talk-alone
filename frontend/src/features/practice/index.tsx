import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category, TopicMode } from '../../api';
import { useCategoriesApi } from '../../api/hook/useCategoriesApi';
import { ActiveSession } from './component/ActiveSession';
import { SessionReady } from './component/SessionReady';
import { usePracticeSession } from './hook/usePracticeSession';
import { useTemporaryResult } from '../result/context/TemporaryResultContext';
import type { Speech } from '../../api';
import type { RecordingResult } from './hook/useAudioRecorder';

export function PracticeFeature() {
  const navigate = useNavigate();
  const { setResult } = useTemporaryResult();
  const complete = useCallback((speech: Speech, recording: RecordingResult | null) => {
    setResult({ speech, recording });
    navigate(`/result/${speech.id}`);
  }, [navigate, setResult]);
  const session = usePracticeSession(complete);
  const categoriesApi = useCategoriesApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [mode, setMode] = useState<TopicMode>('standard');
  const { state } = session;

  useEffect(() => {
    void categoriesApi.listCategories().then(setCategories).catch(() => undefined);
  }, [categoriesApi.listCategories]);

  const start = () => session.start({ categoryId: categoryId || undefined, mode });

  return (
    <main className="page practice-page">
      {(session.error || categoriesApi.error) && <div className="error-banner" role="alert">{session.error || categoriesApi.error}</div>}
      {session.recordingNotice && <div className="notice-banner" role="status">{session.recordingNotice}</div>}
      {state.phase === 'idle' || state.phase === 'preparing' ? (
        <SessionReady
          loading={state.phase === 'preparing'}
          categoriesLoading={categoriesApi.loading}
          categories={categories}
          categoryId={categoryId}
          mode={mode}
          onCategoryChange={setCategoryId}
          onModeChange={setMode}
          onStart={() => void start()}
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
