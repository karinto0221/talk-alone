import { Lightbulb, RotateCcw, Square } from 'lucide-react';
import type { Topic } from '../../../api';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { PracticePhase } from '../type';
import { formatTime } from '../util/time';

type Props = {
  phase: PracticePhase; topic: Topic; elapsed: number; remaining: number; progress: number; hint: string; hintLoading: boolean;
  onHint: () => void; onStop: () => void; onRestart: () => void;
};

export function ActiveSession({ phase, topic, elapsed, remaining, progress, hint, hintLoading, onHint, onStop, onRestart }: Props) {
  const complete = phase === 'complete';
  return (
    <section className="session-workspace">
      <div className="session-status"><span className={complete ? 'status-complete' : 'status-live'} />{complete ? '保存完了' : '進行中'}</div>
      <div className="session-timer"><span>REMAINING</span><strong>{formatTime(remaining)}</strong></div>
      <div className="session-progress"><span style={{ width: `${progress}%` }} /></div>
      <article className="topic-panel">
        <div className="topic-meta"><span>TOPIC</span><b>{topic.categoryName}</b></div>
        <h1>{topic.text}</h1>
      </article>
      {hint && <aside className="hint-panel"><Lightbulb size={18} /><div><span>ヒント</span><p>{hint}</p></div></aside>}
      {complete ? (
        <div className="complete-actions"><div><span>記録</span><strong>{formatTime(elapsed)}</strong></div><Button onClick={onRestart} icon={<RotateCcw size={17} />}>次のセッション</Button></div>
      ) : (
        <div className="session-controls">
          <Button variant="secondary" onClick={onHint} disabled={hintLoading || phase === 'saving'} icon={hintLoading ? <LoadingSpinner /> : <Lightbulb size={17} />}>ヒントを表示</Button>
          <Button variant="ghost" onClick={onStop} disabled={phase === 'saving'} icon={phase === 'saving' ? <LoadingSpinner /> : <Square size={15} fill="currentColor" />}>{phase === 'saving' ? '保存中' : '終了'}</Button>
        </div>
      )}
    </section>
  );
}
