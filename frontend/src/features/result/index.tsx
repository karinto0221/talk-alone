import { ArrowLeft, CheckCircle2, Download, FileText, PlayCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { formatTime } from '../practice/util/time';
import { useTemporaryResult } from './context/TemporaryResultContext';
import { recordingExtension, saveRecording } from './service/recording-file.service';

export function ResultFeature() {
  const { result, clearResult } = useTemporaryResult();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [saveError, setSaveError] = useState('');
  const recording = result?.recording ?? null;
  const practiceResult = result?.practiceResult ?? null;
  const audioUrl = useMemo(() => recording ? URL.createObjectURL(recording.blob) : '', [recording]);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  if (!practiceResult) {
    return (
      <main className="page result-page centered-result">
        <div className="missing-result">
          <FileText size={28} />
          <h1>結果データがありません</h1>
          <p>録音とリザルトは一時データのため、アプリを閉じた後や再読み込み後には表示できません。</p>
          <Link className="text-link" to="/"><ArrowLeft size={15} />練習画面へ戻る</Link>
        </div>
      </main>
    );
  }

  const fileName = `talk-alone-${practiceResult.completedAt.slice(0, 10)}.${recordingExtension(recording?.mimeType ?? '')}`;

  const handleSave = async () => {
    if (!recording || saveState === 'saving') return;
    setSaveState('saving');
    setSaveError('');
    try {
      const saved = await saveRecording(recording, fileName);
      setSaveState(saved ? 'saved' : 'idle');
    } catch {
      setSaveState('idle');
      setSaveError('録音ファイルを保存できませんでした。保存先を変えて再度お試しください。');
    }
  };

  return (
    <main className="page result-page compact-result-page">
      {saveError && <div className="error-banner" role="alert">{saveError}</div>}
      <div className="result-heading">
        <div>
          <p className="section-label">SESSION RESULT</p>
          <h1>スピーチ結果</h1>
        </div>
        <Link className="text-link" to="/" onClick={clearResult}><ArrowLeft size={15} />次のスピーチへ</Link>
      </div>

      <section className="result-summary">
        <div className="result-topic">
          <span>{practiceResult.mode === 'word' ? 'WORD' : 'TOPIC'} · {practiceResult.categoryName}</span>
          <h2>{practiceResult.topic}</h2>
        </div>
        <div className="result-time"><span>TIME</span><strong>{formatTime(practiceResult.durationSeconds)}</strong></div>
      </section>

      <section className="result-card recording-card standalone-recording-card">
        <div className="result-card-heading"><PlayCircle size={18} /><div><span>RECORDING</span><h2>録音</h2></div></div>
        {recording ? (
          <>
            <audio className="audio-player" controls preload="metadata" src={audioUrl}>音声を再生できません。</audio>
            <Button
              variant="secondary"
              onClick={() => void handleSave()}
              disabled={saveState === 'saving'}
              icon={saveState === 'saved' ? <CheckCircle2 size={16} /> : <Download size={16} />}
            >
              {saveState === 'saving' ? '保存中' : saveState === 'saved' ? '保存しました' : '録音ファイルを保存'}
            </Button>
            <p className="data-note">録音はこの画面だけの一時データです。必要な場合は、画面を離れる前にファイルとして保存してください。</p>
          </>
        ) : (
          <div className="recording-empty"><p>録音データはありません。</p><span>マイクを使用できない場合も、スピーチ練習はそのまま利用できます。</span></div>
        )}
      </section>
    </main>
  );
}
