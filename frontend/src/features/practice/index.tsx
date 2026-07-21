import { useEffect, useState } from 'react';
import type { Category, TopicMode } from '../../api';
import { useCategoriesApi } from '../../api/hook/useCategoriesApi';
import { ActiveSession } from './component/ActiveSession';
import { SessionReady } from './component/SessionReady';
import { usePracticeSession } from './hook/usePracticeSession';

export function PracticeFeature() {
  const session = usePracticeSession();
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
          phase={state.phase} topic={state.topic} elapsed={state.elapsedSeconds} remaining={session.remainingSeconds}
          progress={session.progress} hint={state.hint} hintLoading={session.hintLoading}
          onHint={() => void session.requestHint()} onStop={() => void session.stop()} onRestart={() => void start()}
        />
      ) : null}
    </main>
  );
}
