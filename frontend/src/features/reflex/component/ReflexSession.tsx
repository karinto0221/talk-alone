import { ArrowLeft, ArrowRight, MessageCircle, Shuffle, Sparkles, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { ReflexTrainingType } from '../../practice/type';
import { useReflexSession } from '../hook/useReflexSession';

type Props = {
  trainingType: ReflexTrainingType;
  onExit: () => void;
};

export function ReflexSession({ trainingType, onExit }: Props) {
  const session = useReflexSession(trainingType);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.repeat || session.loading) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, input, select, textarea, a')) return;
      event.preventDefault();
      void session.next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session.loading, session.next]);

  return (
    <section className="reflex-session">
      {session.error && <div className="error-banner" role="alert">{session.error}</div>}

      <header className="reflex-session-head">
        <div>
          <span><Zap size={14} fill="currentColor" /> QUICK RESPONSE</span>
          <h1>{trainingType === 'comment' ? 'コメント返し' : '例えツッコミ'}</h1>
        </div>
        <div className="reflex-round"><span>ROUND</span><strong>{String(session.round).padStart(2, '0')}</strong></div>
      </header>

      <div className={`reflex-prompt-card ${trainingType}`} aria-live="polite" aria-busy={session.loading}>
        <div className="reflex-prompt-meta">
          {trainingType === 'comment' ? <MessageCircle size={16} /> : <Sparkles size={16} />}
          <span>{session.prompt?.label ?? 'お題を準備中'}</span>
        </div>
        <div className="reflex-prompt-content">
          {session.loading && !session.prompt ? (
            <div className="reflex-loading"><LoadingSpinner /><span>最初のお題を準備しています</span></div>
          ) : !session.prompt ? (
            <p className="reflex-prompt-empty">取得できませんでした。NEXTで再試行してください。</p>
          ) : (
            <p>{session.prompt.text}</p>
          )}
        </div>
        <p className="reflex-instruction">
          {trainingType === 'comment'
            ? '配信者として自然な返しを声に出してください。'
            : '思いついた例えやツッコミをすぐに声に出してください。'}
        </p>
      </div>

      <div className="reflex-controls">
        <Button variant="ghost" onClick={onExit} icon={<ArrowLeft size={16} />}>設定へ戻る</Button>
        <Button
          onClick={() => void session.next()}
          disabled={session.loading}
          icon={session.loading ? <LoadingSpinner /> : trainingType === 'comment' ? <ArrowRight size={17} /> : <Shuffle size={17} />}
        >
          {session.loading ? '準備中' : 'NEXT'}
        </Button>
      </div>
      <p className="reflex-key-hint">ENTER KEY / NEXT</p>
    </section>
  );
}
