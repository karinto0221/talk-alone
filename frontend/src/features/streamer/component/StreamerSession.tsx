import { MessageCircle, Mic2, Radio, Square, UserRound } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { formatTime } from '../../practice/util/time';
import type { StreamerCommentFrequency } from '../config/comment-frequency';
import { useStreamerSession } from '../hook/useStreamerSession';
import type { ContentLanguage } from '../../../domain/practice';
import { useLanguage } from '../../../i18n/LanguageContext';
import { StreamerResult } from './StreamerResult';
import type { VoiceActivityInput } from '../hook/useVoiceActivityAnalyzer';

type Props = {
  durationMinutes: number;
  commentFrequency: StreamerCommentFrequency;
  language: ContentLanguage;
  microphoneInput: Promise<VoiceActivityInput | null>;
  onRetry: () => void;
  onExit: () => void;
};

export function StreamerSession({ durationMinutes, commentFrequency, language, microphoneInput, onRetry, onExit }: Props) {
  const { copy } = useLanguage();
  const session = useStreamerSession(durationMinutes, commentFrequency, language, microphoneInput);
  const feedEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [session.comments.length]);

  if (session.phase === 'complete' && session.result) return <StreamerResult result={session.result} onRetry={onRetry} onExit={onExit} />;

  const voiceStatusLabel = session.voiceStatus === 'measuring'
    ? copy.voiceMeasuring
    : session.voiceStatus === 'calibrating'
      ? copy.voiceCalibrating
      : session.voiceStatus === 'preparing'
        ? copy.voicePreparing
        : copy.voiceUnavailable;

  return (
    <section className="streamer-workspace">
      <div className="streamer-session-head">
        <div><span className="streamer-live-dot" /><b>LIVE PRACTICE</b></div>
        <div className={`streamer-session-meta ${session.voiceStatus === 'unavailable' ? 'voice-off' : ''}`}>
          <span><Mic2 size={12} />{voiceStatusLabel}</span>
          <span>{session.comments.length} COMMENTS</span>
        </div>
      </div>

      <div className="streamer-layout">
        <article className="comment-console">
          <header><MessageCircle size={17} /><div><span>COMMENT FEED</span><h1>{copy.keepTalking}</h1></div></header>
          <div className="comment-feed" aria-live="polite" aria-label={copy.commentFeed}>
            {session.comments.map((comment) => (
              <div className="streamer-comment" key={comment.id}>
                <span className="comment-avatar" aria-hidden="true"><UserRound size={15} /></span>
                <div>
                  <div className="comment-meta"><strong>{comment.username}</strong><time>{formatTime(comment.receivedAtSeconds)}</time></div>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
            <div ref={feedEnd} />
          </div>
        </article>

        <aside className="streamer-timer-panel">
          <div className="streamer-timer-label"><Radio size={15} /> REMAINING</div>
          <strong>{formatTime(session.remainingSeconds)}</strong>
          <div className="streamer-progress"><span style={{ width: `${session.progress}%` }} /></div>
          <dl>
            <div><dt>SESSION</dt><dd>{durationMinutes} MIN</dd></div>
            <div><dt>FREQUENCY</dt><dd>{copy.frequency[commentFrequency]}</dd></div>
            <div><dt>VOICE</dt><dd>{voiceStatusLabel}</dd></div>
          </dl>
          <Button variant="ghost" onClick={() => session.finish(false)} icon={<Square size={14} fill="currentColor" />}>{copy.stop}</Button>
        </aside>
      </div>
    </section>
  );
}
