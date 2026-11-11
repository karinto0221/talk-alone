import { ArrowLeft, ArrowRight, MessageCircle, Shuffle, Sparkles, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { ReflexTrainingType } from '../../practice/type';
import { useReflexSession } from '../hook/useReflexSession';
import type { ContentLanguage } from '../../../domain/practice';
import { useLanguage } from '../../../i18n/LanguageContext';

type Props = {
  trainingType: ReflexTrainingType;
  language: ContentLanguage;
  onExit: () => void;
};

export function ReflexSession({ trainingType, language, onExit }: Props) {
  const { copy } = useLanguage();
  const session = useReflexSession(trainingType, language);

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
          <h1>{trainingType === 'comment' ? copy.replyTitle : copy.analogyTitle}</h1>
        </div>
        <div className="reflex-round"><span>ROUND</span><strong>{String(session.round).padStart(2, '0')}</strong></div>
      </header>

      <div className={`reflex-prompt-card ${trainingType}`} aria-live="polite" aria-busy={session.loading}>
        <div className="reflex-prompt-meta">
          {trainingType === 'comment' ? <MessageCircle size={16} /> : <Sparkles size={16} />}
          <span>{session.prompt?.label ?? copy.preparingPrompt}</span>
        </div>
        <div className="reflex-prompt-content">
          {session.loading && !session.prompt ? (
            <div className="reflex-loading"><LoadingSpinner /><span>{copy.preparingFirstPrompt}</span></div>
          ) : !session.prompt ? (
            <p className="reflex-prompt-empty">{copy.promptUnavailable}</p>
          ) : (
            <p>{session.prompt.text}</p>
          )}
        </div>
        <p className="reflex-instruction">
          {trainingType === 'comment'
            ? copy.replyInstruction
            : copy.analogyInstruction}
        </p>
      </div>

      <div className="reflex-controls">
        <Button variant="ghost" onClick={onExit} icon={<ArrowLeft size={16} />}>{copy.backToSettingsShort}</Button>
        <Button
          onClick={() => void session.next()}
          disabled={session.loading}
          icon={session.loading ? <LoadingSpinner /> : trainingType === 'comment' ? <ArrowRight size={17} /> : <Shuffle size={17} />}
        >
          {session.loading ? copy.preparing : 'NEXT'}
        </Button>
      </div>
      <p className="reflex-key-hint">ENTER KEY / NEXT</p>
    </section>
  );
}
