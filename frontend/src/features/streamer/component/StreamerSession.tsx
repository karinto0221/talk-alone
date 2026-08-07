import { ArrowLeft, CheckCircle2, MessageCircle, Radio, Square, UserRound } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { formatTime } from '../../practice/util/time';
import { useStreamerSession } from '../hook/useStreamerSession';

type Props = { durationMinutes: number; onExit: () => void };

export function StreamerSession({ durationMinutes, onExit }: Props) {
  const session = useStreamerSession(durationMinutes);
  const feedEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [session.comments.length]);

  if (session.phase === 'complete') {
    return (
      <section className="streamer-complete">
        <CheckCircle2 size={32} />
        <p className="section-label">SESSION COMPLETE</p>
        <h1>{durationMinutes}分間、完走しました</h1>
        <div className="streamer-complete-stats">
          <div><span>TIME</span><strong>{formatTime(durationMinutes * 60)}</strong></div>
          <div><span>COMMENTS</span><strong>{session.comments.length}</strong></div>
        </div>
        <Button onClick={onExit} icon={<ArrowLeft size={17} />}>設定画面へ戻る</Button>
      </section>
    );
  }

  return (
    <section className="streamer-workspace">
      {session.error && <div className="error-banner" role="alert">{session.error}</div>}
      <div className="streamer-session-head">
        <div><span className="streamer-live-dot" /><b>LIVE PRACTICE</b></div>
        <span>{session.comments.length} COMMENTS</span>
      </div>

      <div className="streamer-layout">
        <article className="comment-console">
          <header><MessageCircle size={17} /><div><span>COMMENT FEED</span><h1>コメントを拾って話し続ける</h1></div></header>
          <div className="comment-feed" aria-live="polite" aria-label="配信コメント">
            {session.comments.map((comment) => (
              <div className="streamer-comment" key={comment.id}>
                <span className="comment-avatar" aria-hidden="true"><UserRound size={15} /></span>
                <div>
                  <div className="comment-meta"><strong>{comment.username}</strong><time>{formatTime(comment.receivedAtSeconds)}</time></div>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
            {(session.comments.length === 0 || session.commentLoading) && (
              <div className="comment-waiting"><LoadingSpinner /><span>{session.comments.length === 0 ? '最初のコメントを待っています' : '新しいコメントが入力されています'}</span></div>
            )}
            <div ref={feedEnd} />
          </div>
        </article>

        <aside className="streamer-timer-panel">
          <div className="streamer-timer-label"><Radio size={15} /> REMAINING</div>
          <strong>{formatTime(session.remainingSeconds)}</strong>
          <div className="streamer-progress"><span style={{ width: `${session.progress}%` }} /></div>
          <dl>
            <div><dt>SESSION</dt><dd>{durationMinutes} MIN</dd></div>
            <div><dt>COMMENTS</dt><dd>RANDOM</dd></div>
            <div><dt>RECORDING</dt><dd>OFF</dd></div>
          </dl>
          <Button variant="ghost" onClick={onExit} icon={<Square size={14} fill="currentColor" />}>終了</Button>
        </aside>
      </div>
    </section>
  );
}
