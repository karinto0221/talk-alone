import { ArrowLeft, CheckCircle2, Download, FileText, PlayCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { formatTime } from '../practice/util/time';
import { useTemporaryResult } from './context/TemporaryResultContext';
import { recordingExtension, saveRecording } from './service/recording-file.service';
import { useLanguage } from '../../i18n/LanguageContext';

export function ResultFeature() {
  const { copy } = useLanguage();
  const { result, clearResult } = useTemporaryResult();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [saveError, setSaveError] = useState('');
  const recording = result?.recording ?? null;
  const practiceResult = result?.practiceResult ?? null;
  const audioUrl = useMemo(() => recording ? URL.createObjectURL(recording.blob) : '', [recording]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  if (!practiceResult) {
    return (
      <main className="page result-page centered-result">
        <div className="missing-result">
          <FileText size={28} />
          <h1>{copy.noResult}</h1>
          <p>{copy.noResultBody}</p>
          <Link className="text-link" to="/"><ArrowLeft size={15} />{copy.backToPractice}</Link>
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
      setSaveError(copy.saveError);
    }
  };

  return (
    <main className="page result-page compact-result-page">
      {saveError && <div className="error-banner" role="alert">{saveError}</div>}
      <div className="result-heading">
        <div>
          <p className="section-label">SESSION RESULT</p>
          <h1>{copy.speechResult}</h1>
        </div>
        <Link className="text-link" to="/" onClick={clearResult}><ArrowLeft size={15} />{copy.nextSpeech}</Link>
      </div>

      <section className="result-summary">
        <div className="result-topic">
          <span>{practiceResult.mode === 'word' ? 'WORD' : 'TOPIC'} · {practiceResult.categoryName}</span>
          <h2>{practiceResult.topic}</h2>
        </div>
        <div className="result-time"><span>TIME</span><strong>{formatTime(practiceResult.durationSeconds)}</strong></div>
      </section>

      <section className="result-card recording-card standalone-recording-card">
        <div className="result-card-heading"><PlayCircle size={18} /><div><span>RECORDING</span><h2>{copy.recordingTitle}</h2></div></div>
        {recording ? (
          <>
            <audio className="audio-player" controls preload="metadata" src={audioUrl}>{copy.audioUnsupported}</audio>
            <Button
              variant="secondary"
              onClick={() => void handleSave()}
              disabled={saveState === 'saving'}
              icon={saveState === 'saved' ? <CheckCircle2 size={16} /> : <Download size={16} />}
            >
              {saveState === 'saving' ? copy.saving : saveState === 'saved' ? copy.saved : copy.saveRecording}
            </Button>
            <p className="data-note">{copy.temporaryRecording}</p>
          </>
        ) : (
          <div className="recording-empty"><p>{copy.noRecordingData}</p><span>{copy.noRecordingBody}</span></div>
        )}
      </section>
    </main>
  );
}
