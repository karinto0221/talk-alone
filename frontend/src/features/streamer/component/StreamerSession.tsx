import { Activity, ArrowLeft, CheckCircle2, Gauge, MessageCircle, Mic, MicOff, Radio, Square, Trophy, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { formatTime } from '../../practice/util/time';
import { useStreamerSession } from '../hook/useStreamerSession';
import { useStreamerVoiceScore } from '../hook/useStreamerVoiceScore';
import { formatDecimalSeconds, getStreamerRank } from '../util/streamer-score';

type Props = { durationMinutes: number; onExit: () => void };

export function StreamerSession({ durationMinutes, onExit }: Props) {
  const [gameReady, setGameReady] = useState(false);
  const session = useStreamerSession(durationMinutes, gameReady);
  const voice = useStreamerVoiceScore({
    active: session.phase === 'running',
    completedNaturally: session.completedNaturally,
    latestCommentId: session.latestCommentId,
    totalSeconds: session.totalSeconds,
  });
  const feedEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (voice.microphoneStatus !== 'requesting') setGameReady(true);
  }, [voice.microphoneStatus]);

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [session.comments.length]);

  if (session.phase === 'complete') {
    const hasVoiceMeasurement = voice.metrics.talkSeconds > 0 || voice.metrics.longestSilenceSeconds > 0;
    const rank = getStreamerRank(voice.metrics.score, session.elapsedSeconds, hasVoiceMeasurement);
    return (
      <section className="streamer-complete streamer-game-result">
        <CheckCircle2 size={30} />
        <p className="section-label">SESSION COMPLETE</p>
        <h1>{session.completedNaturally ? `${durationMinutes}分間、完走しました` : 'スコアを記録しました'}</h1>
        <div className={`streamer-result-rank rank-${rank.toLowerCase()}`}>
          <span>RANK</span><strong>{rank}</strong>
        </div>
        <div className="streamer-result-score"><span>TOTAL SCORE</span><strong>{voice.metrics.score.toLocaleString()}</strong><small>PTS</small></div>
        <div className="streamer-complete-stats streamer-game-stats">
          <div><span>TIME</span><strong>{formatTime(session.elapsedSeconds)}</strong></div>
          <div><span>COMMENTS</span><strong>{session.comments.length}</strong></div>
          <div><span>TALK RATIO</span><strong>{Math.round(voice.metrics.talkRatio)}%</strong></div>
          <div><span>BEST STREAK</span><strong>{formatTime(Math.round(voice.metrics.longestStreakSeconds))}</strong></div>
          <div><span>LONG SILENCE</span><strong>{voice.metrics.longSilenceCount}</strong></div>
          <div><span>RESPONSE</span><strong>{formatDecimalSeconds(voice.metrics.averageResponseSeconds)}</strong></div>
        </div>
        {voice.microphoneStatus === 'unavailable' && <p className="streamer-result-note">マイクを利用できなかったため、音声スコアは計測されていません。</p>}
        <Button onClick={onExit} icon={<ArrowLeft size={17} />}>設定画面へ戻る</Button>
      </section>
    );
  }

  return (
    <section className="streamer-workspace">
      {session.error && <div className="error-banner" role="alert">{session.error}</div>}
      <div className="streamer-session-head">
        <div><span className="streamer-live-dot" /><b>LIVE PRACTICE</b></div>
        <div className={`streamer-mic-state ${voice.microphoneStatus}`}>
          {voice.microphoneStatus === 'unavailable' ? <MicOff size={13} /> : <Mic size={13} />}
          <span>{voice.microphoneStatus === 'requesting' ? 'MIC SETUP' : voice.microphoneStatus === 'active' ? 'VOICE SCORING' : 'MIC OFF'}</span>
        </div>
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
          <div className="streamer-score-head">
            <div className="streamer-timer-label"><Trophy size={15} /> LIVE SCORE</div>
            <span className={voice.metrics.isSpeaking ? 'voice-status speaking' : 'voice-status'}>{voice.metrics.isSpeaking ? 'ON AIR' : 'STANDBY'}</span>
          </div>
          <div className="streamer-live-score"><strong>{voice.metrics.score.toLocaleString()}</strong><span>PTS</span></div>
          <div className="streamer-combo"><span>COMBO</span><strong>×{voice.metrics.combo.toFixed(2)}</strong></div>
          <div className="streamer-score-event-slot">
            {voice.scoreEvent && (
              <div className={`streamer-score-event ${voice.scoreEvent.tone}`} key={voice.scoreEvent.id}>
                <span>{voice.scoreEvent.label}</span>{voice.scoreEvent.points && <strong>+{voice.scoreEvent.points}</strong>}
              </div>
            )}
          </div>
          <div className="streamer-voice-meter" aria-label={`音声レベル ${voice.metrics.volumeLevel}%`}>
            <span style={{ width: `${voice.metrics.volumeLevel}%` }} />
          </div>
          <div className="streamer-time-row"><span><Radio size={13} /> REMAINING</span><strong>{formatTime(session.remainingSeconds)}</strong></div>
          <div className="streamer-progress"><span style={{ width: `${session.progress}%` }} /></div>
          <div className="streamer-live-metrics">
            <div><Gauge size={13} /><span>TALK RATIO</span><strong>{Math.round(voice.metrics.talkRatio)}%</strong></div>
            <div><Activity size={13} /><span>TALK STREAK</span><strong>{formatTime(Math.round(voice.metrics.currentStreakSeconds))}</strong></div>
            <div><MicOff size={13} /><span>LONG SILENCE</span><strong>{voice.metrics.longSilenceCount}</strong></div>
          </div>
          {voice.microphoneStatus === 'requesting' && <p className="streamer-mic-note">マイクを準備しています。許可すると音声スコアを計測します。</p>}
          {voice.microphoneStatus === 'unavailable' && <p className="streamer-mic-note warning">マイクなしで続行しています。スコアは加算されません。</p>}
          <Button disabled={!gameReady} variant="ghost" onClick={session.finish} icon={<Square size={14} fill="currentColor" />}>終了して結果を見る</Button>
        </aside>
      </div>
    </section>
  );
}
