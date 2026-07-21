import { ArrowRight, Clock3 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export function SessionReady({ loading, onStart }: { loading: boolean; onStart: () => void }) {
  return (
    <section className="practice-ready">
      <div className="ready-copy">
        <p className="section-label">3 MINUTE SPEECH</p>
        <h1>スピーチ練習</h1>
        <p className="description">ランダムなお題について、3分間話します。途中で話題に困った場合はヒントを表示できます。</p>
        <Button onClick={onStart} disabled={loading} icon={loading ? <LoadingSpinner /> : <ArrowRight size={18} />}>
          {loading ? 'お題を取得中' : 'セッションを開始'}
        </Button>
      </div>
      <div className="timer-preview" aria-hidden="true">
        <div className="preview-meta"><Clock3 size={16} /> SESSION TIMER</div>
        <strong>03:00</strong>
        <div className="preview-track"><span /></div>
        <div className="preview-grid"><span>TOPIC</span><span>RANDOM</span><span>LIMIT</span><span>3 MIN</span></div>
      </div>
    </section>
  );
}
