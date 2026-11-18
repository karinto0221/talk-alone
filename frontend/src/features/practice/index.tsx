import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveSession } from './component/ActiveSession';
import { SessionReady } from './component/SessionReady';
import { usePracticeSession } from './hook/usePracticeSession';
import { useTemporaryResult } from '../result/context/TemporaryResultContext';
import type { PracticeResult } from '../../domain/practice';
import type { RecordingResult } from './hook/useAudioRecorder';
import type { PracticeMode, ReflexRoundSetting, ReflexTrainingType } from './type';
import { StreamerSession } from '../streamer';
import type { StreamerCommentFrequency } from '../streamer/config/comment-frequency';
import { ReflexSession } from '../reflex';
import { listCategories } from './service/practice-content.service';
import { useLanguage } from '../../i18n/LanguageContext';
import { requestVoiceActivityInput, type VoiceActivityInput } from '../streamer/hook/useVoiceActivityAnalyzer';

const clampDuration = (value: number) => Math.min(60, Math.max(1, Number.isFinite(value) ? Math.round(value) : 1));
type StreamerRun = { id: string; durationMinutes: number; microphoneInput: Promise<VoiceActivityInput | null> };

const createStreamerRun = (durationMinutes: number): StreamerRun => ({
  id: `${Date.now()}-${Math.random()}`,
  durationMinutes,
  microphoneInput: requestVoiceActivityInput(),
});

export function PracticeFeature() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { clearResult, consumeSpeechRetry, setResult } = useTemporaryResult();
  const complete = useCallback((practiceResult: PracticeResult, recording: RecordingResult | null) => {
    setResult({ practiceResult, recording });
    navigate('/result');
  }, [navigate, setResult]);
  const session = usePracticeSession(complete);
  const categories = listCategories(language);
  const [categoryId, setCategoryId] = useState('');
  const [mode, setMode] = useState<PracticeMode>('speech');
  const [reflexTrainingType, setReflexTrainingType] = useState<ReflexTrainingType>('association');
  const [reflexRoundSetting, setReflexRoundSetting] = useState<ReflexRoundSetting>(5);
  const [speechDurationMinutes, setSpeechDurationMinutes] = useState('3');
  const [streamerDurationMinutes, setStreamerDurationMinutes] = useState('10');
  const [streamerCommentFrequency, setStreamerCommentFrequency] = useState<StreamerCommentFrequency>('normal');
  const [streamerRun, setStreamerRun] = useState<StreamerRun | null>(null);
  const [reflexActive, setReflexActive] = useState(false);
  const [reflexRunId, setReflexRunId] = useState('');
  const { state } = session;

  useEffect(() => clearResult(), [clearResult]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const retryOptions = consumeSpeechRetry();
      if (!retryOptions) return;
      setMode('speech');
      setCategoryId(retryOptions.categoryId ?? '');
      setSpeechDurationMinutes(String(retryOptions.durationSeconds / 60));
      void session.start(retryOptions);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [consumeSpeechRetry, session.start]);

  const start = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (mode === 'streamer') {
      const resolvedDuration = clampDuration(Number(streamerDurationMinutes));
      setStreamerDurationMinutes(String(resolvedDuration));
      setStreamerRun(createStreamerRun(resolvedDuration));
      return;
    }
    if (mode === 'reflex') {
      setReflexRunId(`${Date.now()}-${Math.random()}`);
      setReflexActive(true);
      return;
    }
    const resolvedDuration = clampDuration(Number(speechDurationMinutes));
    setSpeechDurationMinutes(String(resolvedDuration));
    void session.start({ categoryId: categoryId || undefined, language, durationSeconds: resolvedDuration * 60 });
  };

  if (streamerRun) {
    return <main className="page practice-page streamer-page"><StreamerSession key={streamerRun.id} durationMinutes={streamerRun.durationMinutes} commentFrequency={streamerCommentFrequency} language={language} microphoneInput={streamerRun.microphoneInput} onRetry={() => setStreamerRun(createStreamerRun(streamerRun.durationMinutes))} onExit={() => { setStreamerRun(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} /></main>;
  }

  if (reflexActive) {
    return <main className="page practice-page reflex-page"><ReflexSession key={reflexRunId} trainingType={reflexTrainingType} roundSetting={reflexRoundSetting} language={language} onRetryChallenge={() => setReflexRunId(`${Date.now()}-${Math.random()}`)} onExit={() => { setReflexActive(false); window.scrollTo({ top: 0, behavior: 'instant' }); }} /></main>;
  }

  return (
    <main className="page practice-page">
      {session.error && <div className="error-banner" role="alert">{session.error}</div>}
      {session.recordingNotice && <div className="notice-banner" role="status">{session.recordingNotice}</div>}
      {state.phase === 'idle' || state.phase === 'preparing' ? (
        <SessionReady
          loading={state.phase === 'preparing'}
          categories={categories}
          categoryId={categoryId}
          mode={mode}
          reflexTrainingType={reflexTrainingType}
          reflexRoundSetting={reflexRoundSetting}
          speechDurationMinutes={speechDurationMinutes}
          streamerDurationMinutes={streamerDurationMinutes}
          streamerCommentFrequency={streamerCommentFrequency}
          onCategoryChange={setCategoryId}
          onModeChange={setMode}
          onReflexTrainingTypeChange={setReflexTrainingType}
          onReflexRoundSettingChange={setReflexRoundSetting}
          onSpeechDurationChange={setSpeechDurationMinutes}
          onStreamerDurationChange={setStreamerDurationMinutes}
          onStreamerCommentFrequencyChange={setStreamerCommentFrequency}
          onStart={start}
        />
      ) : state.topic ? (
        <ActiveSession
          phase={state.phase} topic={state.topic} remaining={session.remainingSeconds}
          progress={session.progress}
          recordingStatus={session.recordingStatus}
          onStop={() => void session.stop()}
        />
      ) : null}
    </main>
  );
}
