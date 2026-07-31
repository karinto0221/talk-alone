import { Lightbulb, MicOff, Square } from 'lucide-react';
import type { Topic } from '../../../api';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { PracticePhase } from '../type';
import { formatTime } from '../util/time';
import type { RecordingStatus } from '../hook/useAudioRecorder';

type Props = {
  phase: PracticePhase; topic: Topic; remaining: number; progress: number; hint: string; hintLoading: boolean;
  recordingStatus: RecordingStatus; onHint: () => void; onStop: () => void;
};

export function ActiveSession({ phase, topic, remaining, progress, hint, hintLoading, recordingStatus, onHint, onStop }: Props) {
  return (
    <section className="session-workspace">
      <div className="session-indicators">
        <div className="session-status"><span className="status-live" />進行中</div>
        {recordingStatus === 'recording'
          ? <div className="recording-status"><span />録音中</div>
          : <div className="recording-status recording-off"><MicOff size={12} />録音なし</div>}
      </div>
      <div className="session-timer"><span>REMAINING</span><strong>{formatTime(remaining)}</strong></div>
      <div className="session-progress"><span style={{ width: `${progress}%` }} /></div>
      <article className="topic-panel">
        <div className="topic-meta"><span>{topic.mode === 'word' ? 'WORD' : 'TOPIC'}</span><b>{topic.categoryName}</b></div>
        <h1>{topic.text}</h1>
      </article>
      {hint && <aside className="hint-panel"><Lightbulb size={18} /><div><span>ヒント</span><p>{hint}</p></div></aside>}
      <div className="session-controls">
        <Button variant="secondary" onClick={onHint} disabled={hintLoading || phase === 'saving'} icon={hintLoading ? <LoadingSpinner /> : <Lightbulb size={17} />}>ヒントを表示</Button>
        <Button variant="ghost" onClick={onStop} disabled={phase === 'saving'} icon={phase === 'saving' ? <LoadingSpinner /> : <Square size={15} fill="currentColor" />}>{phase === 'saving' ? '保存中' : '終了'}</Button>
      </div>
    </section>
  );
}
