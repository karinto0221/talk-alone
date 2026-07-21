import { ActiveSession } from './component/ActiveSession';
import { SessionReady } from './component/SessionReady';
import { usePracticeSession } from './hook/usePracticeSession';

export function PracticeFeature() {
  const session = usePracticeSession();
  const { state } = session;
  return (
    <main className="page practice-page">
      {session.error && <div className="error-banner" role="alert">{session.error}</div>}
      {state.phase === 'idle' || state.phase === 'preparing' ? (
        <SessionReady loading={state.phase === 'preparing'} onStart={() => void session.start()} />
      ) : state.topic ? (
        <ActiveSession
          phase={state.phase} topic={state.topic} elapsed={state.elapsedSeconds} remaining={session.remainingSeconds}
          progress={session.progress} hint={state.hint} hintLoading={session.hintLoading}
          onHint={() => void session.requestHint()} onStop={() => void session.stop()} onRestart={() => void session.start()}
        />
      ) : null}
    </main>
  );
}
