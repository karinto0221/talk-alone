import { ArrowLeft, Clock3, RotateCcw, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { ReflexTrainingType } from '../../practice/type';
import { formatTime } from '../../practice/util/time';
import type { ReflexAttempt } from '../hook/useReflexSession';
import type { ChallengeVideoResult as ChallengeVideoRecording } from '../hook/useChallengeVideoRecorder';
import { summarizeReflexAttempts } from '../util/reflex-result';
import { ChallengeVideoResult } from './ChallengeVideoResult';
import { ResultShareCard } from '../../result/component/ResultShareCard';

type Props = {
  trainingType: ReflexTrainingType;
  attempts: readonly ReflexAttempt[];
  challenge?: boolean;
  recording?: ChallengeVideoRecording | null;
  videoProcessing?: boolean;
  onRetry: () => void;
  onExit: () => void;
};

const responseTime = (seconds: number) => `${seconds.toFixed(1)}s`;

export function ReflexResult({ trainingType, attempts, challenge = false, recording = null, videoProcessing = false, onRetry, onExit }: Props) {
  const { copy } = useLanguage();
  const summary = summarizeReflexAttempts(attempts);
  const trainingName = trainingType === 'association' ? copy.associationTitle : copy.combinationComebackTitle;

  return (
    <section className="practice-result reflex-result">
      <div className="result-status-icon complete"><Zap size={29} fill="currentColor" /></div>
      <p className="section-label">QUICK RESPONSE RESULT</p>
      <h1>{copy.reflexResult}</h1>
      <p className="result-mode-name">{trainingName} · {challenge ? copy.reflexChallengeTitle : copy.rounds(attempts.length)}</p>

      <div className="practice-result-grid reflex-stats">
        <div className="featured"><span>{copy.averageResponse}</span><strong>{responseTime(summary.averageSeconds)}</strong></div>
        <div><span>{copy.fastestResponse}</span><strong>{responseTime(summary.fastestSeconds)}</strong></div>
        <div><span>{copy.slowestResponse}</span><strong>{responseTime(summary.slowestSeconds)}</strong></div>
        <div><span>{copy.totalTime}</span><strong>{formatTime(Math.round(summary.totalSeconds))}</strong></div>
      </div>

      <section className="reflex-attempts">
        <div className="result-panel-heading"><Clock3 size={16} /><span>{copy.responseHistory}</span></div>
        <ol>
          {attempts.map((attempt, index) => (
            <li key={`${attempt.prompt}-${index}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{attempt.prompt}</p>
              <strong className={attempt.timedOut ? 'timed-out' : ''}>{attempt.timedOut ? copy.timeUp : responseTime(attempt.responseSeconds)}</strong>
            </li>
          ))}
        </ol>
      </section>

      {challenge && <ChallengeVideoResult recording={recording} processing={videoProcessing} />}

      {!challenge && (
        <ResultShareCard
          data={{
            eyebrow: 'QUICK RESPONSE',
            title: trainingName,
            subtitle: copy.rounds(attempts.length),
            highlightLabel: copy.averageResponse,
            highlightValue: responseTime(summary.averageSeconds),
            stats: [
              { label: copy.fastestResponse, value: responseTime(summary.fastestSeconds) },
              { label: copy.slowestResponse, value: responseTime(summary.slowestSeconds) },
              { label: copy.totalTime, value: formatTime(Math.round(summary.totalSeconds)) },
            ],
          }}
          fileName={`talk-alone-quick-${new Date().toISOString().slice(0, 10)}.png`}
          shareText="talk-aloneで瞬発力トレーニングに挑戦しました。"
        />
      )}

      <div className="practice-result-actions">
        <Button variant="secondary" onClick={onRetry} icon={<RotateCcw size={16} />}>{copy.retry}</Button>
        <Button variant="ghost" onClick={onExit} icon={<ArrowLeft size={16} />}>{copy.backToTop}</Button>
      </div>
    </section>
  );
}
