import { MicOff, Square } from 'lucide-react';
import type { Topic } from '../../../domain/practice';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { PracticePhase } from '../type';
import { formatTime } from '../util/time';
import type { RecordingStatus } from '../hook/useAudioRecorder';
import { useLanguage } from '../../../i18n/LanguageContext';

type Props = {
  phase: PracticePhase; topic: Topic; remaining: number; progress: number;
  recordingStatus: RecordingStatus; onStop: () => void;
};

export function ActiveSession({ phase, topic, remaining, progress, recordingStatus, onStop }: Props) {
  const { copy } = useLanguage();
  return (
    <section className="session-workspace">
      <div className="session-indicators">
        <div className="session-status"><span className="status-live" />{copy.running}</div>
        {recordingStatus === 'recording'
          ? <div className="recording-status"><span />{copy.recording}</div>
          : <div className="recording-status recording-off"><MicOff size={12} />{copy.noRecording}</div>}
      </div>
      <div className="session-timer"><span>REMAINING</span><strong>{formatTime(remaining)}</strong></div>
      <div className="session-progress"><span style={{ width: `${progress}%` }} /></div>
      <article className="topic-panel">
        <div className="topic-meta"><span>TOPIC</span><b>{topic.categoryName}</b></div>
        <h1>{topic.text}</h1>
      </article>
      <div className="session-controls">
        <Button variant="ghost" onClick={onStop} disabled={phase === 'finishing'} icon={phase === 'finishing' ? <LoadingSpinner /> : <Square size={15} fill="currentColor" />}>{phase === 'finishing' ? copy.finishing : copy.stop}</Button>
      </div>
    </section>
  );
}
