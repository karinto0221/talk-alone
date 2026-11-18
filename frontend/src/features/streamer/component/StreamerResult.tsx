import { ArrowLeft, CheckCircle2, Mic2, RotateCcw, StopCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useLanguage } from '../../../i18n/LanguageContext';
import { formatTime } from '../../practice/util/time';
import type { StreamerResult as StreamerResultData } from '../hook/useStreamerSession';
import { ResultShareCard } from '../../result/component/ResultShareCard';

type Props = {
  result: StreamerResultData;
  onRetry: () => void;
  onExit: () => void;
};

const millisecondsToTime = (milliseconds: number) => formatTime(Math.round(milliseconds / 1_000));

export function StreamerResult({ result, onRetry, onExit }: Props) {
  const { copy } = useLanguage();
  const completionRate = Math.min(100, Math.round((result.elapsedSeconds / result.targetSeconds) * 100));
  const speakingRate = result.voiceActivity?.measuredMilliseconds
    ? Math.round((result.voiceActivity.speakingMilliseconds / result.voiceActivity.measuredMilliseconds) * 100)
    : 0;

  return (
    <section className="practice-result streamer-result">
      <div className={`result-status-icon ${result.completed ? 'complete' : 'stopped'}`}>
        {result.completed ? <CheckCircle2 size={30} /> : <StopCircle size={30} />}
      </div>
      <p className="section-label">STREAMER PRACTICE RESULT</p>
      <h1>{copy.streamerResult}</h1>
      <span className={`result-badge ${result.completed ? 'complete' : 'stopped'}`}>
        {result.completed ? copy.completed : copy.stoppedEarly}
      </span>

      <div className="practice-result-grid primary-stats">
        <div><span>{copy.elapsedTime}</span><strong>{formatTime(result.elapsedSeconds)}</strong></div>
        <div><span>{copy.completionRate}</span><strong>{completionRate}%</strong></div>
        <div><span>{copy.commentCount}</span><strong>{result.commentCount}</strong></div>
      </div>

      {result.voiceActivity ? (
        <section className="voice-result-panel">
          <div className="result-panel-heading"><Mic2 size={17} /><span>VOICE ACTIVITY</span></div>
          <div className="practice-result-grid voice-stats">
            <div><span>{copy.speakingTime}</span><strong>{millisecondsToTime(result.voiceActivity.speakingMilliseconds)}</strong></div>
            <div><span>{copy.speakingRate}</span><strong>{speakingRate}%</strong></div>
            <div><span>{copy.longestSpeech}</span><strong>{millisecondsToTime(result.voiceActivity.longestSpeechMilliseconds)}</strong></div>
            <div><span>{copy.longestSilence}</span><strong>{millisecondsToTime(result.voiceActivity.longestSilenceMilliseconds)}</strong></div>
            <div><span>{copy.longPauses}</span><strong>{copy.pauseCount(result.voiceActivity.longPauseCount)}</strong></div>
          </div>
        </section>
      ) : (
        <p className="result-unavailable-note"><Mic2 size={17} />{copy.voiceUnavailableResult}</p>
      )}

      <ResultShareCard
        data={{
          eyebrow: 'STREAMER PRACTICE',
          title: copy.streamerResult,
          subtitle: result.completed ? copy.completed : copy.stoppedEarly,
          highlightLabel: copy.elapsedTime,
          highlightValue: formatTime(result.elapsedSeconds),
          stats: [
            { label: copy.completionRate, value: `${completionRate}%` },
            { label: copy.commentCount, value: `${result.commentCount}` },
            { label: copy.speakingRate, value: result.voiceActivity ? `${speakingRate}%` : '—' },
            { label: copy.longestSilence, value: result.voiceActivity ? millisecondsToTime(result.voiceActivity.longestSilenceMilliseconds) : '—' },
          ],
        }}
        fileName={`talk-alone-streamer-${new Date().toISOString().slice(0, 10)}.png`}
        shareText="talk-aloneで配信トークを練習しました。"
      />

      <div className="practice-result-actions">
        <Button variant="secondary" onClick={onRetry} icon={<RotateCcw size={16} />}>{copy.retry}</Button>
        <Button variant="ghost" onClick={onExit} icon={<ArrowLeft size={16} />}>{copy.backToTop}</Button>
      </div>
    </section>
  );
}
