import { ArrowLeft, Shuffle, Sparkles, Video, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { ReflexRoundSetting, ReflexTrainingType } from '../../practice/type';
import { useReflexSession } from '../hook/useReflexSession';
import type { ContentLanguage } from '../../../domain/practice';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ReflexResult } from './ReflexResult';
import {
  isReflexChallenge,
  REFLEX_CHALLENGE_SECONDS,
  resolveReflexRoundCount,
} from '../config/reflex-session';
import { useChallengeVideoRecorder, type ChallengeVideoResult } from '../hook/useChallengeVideoRecorder';

type Props = {
  trainingType: ReflexTrainingType;
  roundSetting: ReflexRoundSetting;
  language: ContentLanguage;
  onRetryChallenge: () => void;
  onExit: () => void;
};

type ChallengeStage = 'preparing' | 'countdown' | 'running' | 'finishing' | 'result';

export function ReflexSession({ trainingType, roundSetting, language, onRetryChallenge, onExit }: Props) {
  const { copy } = useLanguage();
  const challenge = isReflexChallenge(roundSetting);
  const targetRounds = resolveReflexRoundCount(roundSetting);
  const session = useReflexSession(trainingType, language, targetRounds, {
    startImmediately: !challenge,
    timeLimitSeconds: challenge ? REFLEX_CHALLENGE_SECONDS : undefined,
  });
  const isAssociation = trainingType === 'association';
  const trainingTitle = isAssociation ? copy.associationTitle : copy.combinationComebackTitle;
  const [challengeStage, setChallengeStage] = useState<ChallengeStage>(challenge ? 'preparing' : 'running');
  const [countdown, setCountdown] = useState(3);
  const [videoRecording, setVideoRecording] = useState<ChallengeVideoResult | null>(null);
  const videoFrame = useMemo(() => ({
    language,
    title: trainingTitle,
    promptLabel: session.prompt.label,
    prompt: session.prompt.text,
    round: session.round,
    totalRounds: session.targetRounds,
    remainingSeconds: session.remainingSeconds,
  }), [language, session.prompt.label, session.prompt.text, session.remainingSeconds, session.round, session.targetRounds, trainingTitle]);
  const videoRecorder = useChallengeVideoRecorder(videoFrame);
  const {
    canvasRef,
    canvasWidth,
    canvasHeight,
    status: videoStatus,
    hasMicrophoneAudio,
    prepare: prepareVideo,
    skipMicrophone,
    start: startVideo,
    stop: stopVideo,
  } = videoRecorder;

  useEffect(() => {
    if (!challenge) return;
    let cancelled = false;
    let intervalId = 0;

    const prepareChallenge = async () => {
      await prepareVideo();
      if (cancelled) return;
      setChallengeStage('countdown');
      let nextCount = 3;
      setCountdown(nextCount);
      intervalId = window.setInterval(() => {
        nextCount -= 1;
        if (nextCount <= 0) {
          window.clearInterval(intervalId);
          startVideo();
          session.start();
          setChallengeStage('running');
          return;
        }
        setCountdown(nextCount);
      }, 1_000);
    };

    void prepareChallenge();
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [challenge, prepareVideo, session.start, startVideo]);

  useEffect(() => {
    if (!challenge || session.phase !== 'complete' || challengeStage !== 'running') return;
    setChallengeStage('finishing');
    void stopVideo().then((recording) => {
      setVideoRecording(recording);
      setChallengeStage('result');
    });
  }, [challenge, challengeStage, session.phase, stopVideo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.repeat || session.loading || session.phase !== 'running' || challengeStage !== 'running') return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, input, select, textarea, a')) return;
      event.preventDefault();
      session.next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [challengeStage, session.loading, session.next, session.phase]);

  const canvas = challenge ? (
    <canvas
      ref={canvasRef}
      className="challenge-video-canvas"
      width={canvasWidth}
      height={canvasHeight}
      aria-hidden="true"
    />
  ) : null;

  if (session.phase === 'complete' && (!challenge || challengeStage === 'result')) {
    return (
      <>
        {canvas}
        <ReflexResult
          trainingType={trainingType}
          attempts={session.attempts}
          challenge={challenge}
          recording={videoRecording}
          onRetry={challenge ? onRetryChallenge : session.restart}
          onExit={onExit}
        />
      </>
    );
  }

  if (challenge && challengeStage !== 'running') {
    const preparing = challengeStage === 'preparing';
    const finishing = challengeStage === 'finishing' || session.phase === 'complete';
    return (
      <>
        {canvas}
        <section className="reflex-session challenge-transition">
          <div className="challenge-transition-card" aria-live="polite">
            {preparing || finishing ? <LoadingSpinner /> : <Video size={26} />}
            <span>QUICK RESPONSE CHALLENGE</span>
            <h1>{finishing ? copy.finishing : preparing ? copy.challengePreparing : copy.challengeCountdown}</h1>
            {!preparing && !finishing && <strong>{countdown}</strong>}
            <p>{copy.reflexChallengeOption}</p>
          </div>
          {!finishing && (
            <div className="challenge-transition-actions">
              {preparing && <Button variant="secondary" onClick={skipMicrophone}>{copy.continueWithoutMicrophone}</Button>}
              <Button variant="ghost" onClick={onExit} icon={<ArrowLeft size={16} />}>{copy.backToSettingsShort}</Button>
            </div>
          )}
        </section>
      </>
    );
  }

  const timeRemaining = Math.max(0, session.remainingSeconds);
  return (
    <>
      {canvas}
      <section className={`reflex-session ${challenge ? 'challenge-running' : ''}`}>
        {session.error && <div className="error-banner" role="alert">{session.error}</div>}
        {challenge && videoStatus === 'unavailable' && <div className="notice-banner" role="status">{copy.challengeRecordingUnavailable}</div>}

        <header className="reflex-session-head">
          <div>
            <span><Zap size={14} fill="currentColor" /> {challenge ? 'QUICK RESPONSE CHALLENGE' : 'QUICK RESPONSE'}</span>
            <h1>{trainingTitle}</h1>
          </div>
          <div className="reflex-round"><span>ROUND</span><strong>{String(session.round).padStart(2, '0')} / {String(session.targetRounds).padStart(2, '0')}</strong></div>
        </header>

        {challenge && (
          <div className={`challenge-recording-status ${videoStatus === 'unavailable' ? 'recording-off' : ''}`}>
            <span />
            {videoStatus === 'unavailable'
              ? copy.challengeRecordingUnavailable
              : hasMicrophoneAudio
                ? copy.challengeRecording
                : copy.challengeSilentRecording}
          </div>
        )}

        <div className={`reflex-prompt-card ${trainingType}`} aria-live="polite" aria-busy={session.loading}>
          <div className="reflex-prompt-meta">
            {isAssociation ? <Sparkles size={16} /> : <Shuffle size={16} />}
            <span>{session.prompt?.label ?? copy.preparingPrompt}</span>
            {challenge && <strong className={timeRemaining <= 3 ? 'ending' : ''}>{timeRemaining.toFixed(1)}s</strong>}
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
          {challenge && <div className="challenge-countdown-track"><span style={{ width: `${(timeRemaining / REFLEX_CHALLENGE_SECONDS) * 100}%` }} /></div>}
          <p className="reflex-instruction">
            {challenge ? copy.challengeInstruction : isAssociation ? copy.associationInstruction : copy.combinationComebackInstruction}
          </p>
        </div>

        <div className="reflex-controls">
          <Button variant="ghost" onClick={onExit} icon={<ArrowLeft size={16} />}>{copy.backToSettingsShort}</Button>
          <Button
            onClick={() => session.next()}
            disabled={session.loading}
            icon={session.loading ? <LoadingSpinner /> : <Shuffle size={17} />}
          >
            {session.loading ? copy.preparing : session.round === session.targetRounds ? copy.showResult : 'NEXT'}
          </Button>
        </div>
        <p className="reflex-key-hint">ENTER KEY / NEXT</p>
      </section>
    </>
  );
}
