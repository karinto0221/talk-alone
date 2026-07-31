import { ArrowLeft, BrainCircuit, Check, Download, FileText, Lightbulb, PlayCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { SpeechAnalysis } from '../../api';
import { useSpeechesApi } from '../../api/hook/useSpeechesApi';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatTime } from '../practice/util/time';
import { useTemporaryResult } from './context/TemporaryResultContext';

function downloadExtension(mimeType: string) {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

export function ResultFeature() {
  const { speechId } = useParams();
  const { result } = useTemporaryResult();
  const speechesApi = useSpeechesApi();
  const [analysis, setAnalysis] = useState<SpeechAnalysis | null>(null);
  const currentResult = result?.speech.id === speechId ? result : null;
  const recording = currentResult?.recording ?? null;
  const speech = currentResult?.speech ?? null;
  const audioUrl = useMemo(() => recording ? URL.createObjectURL(recording.blob) : '', [recording]);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  if (!speech) {
    return (
      <main className="page result-page centered-result">
        <div className="missing-result">
          <FileText size={28} />
          <h1>結果データがありません</h1>
          <p>録音とリザルトは一時データのため、再読み込み後には表示できません。</p>
          <Link className="text-link" to="/"><ArrowLeft size={15} />スピーチ画面へ戻る</Link>
        </div>
      </main>
    );
  }

  const runAnalysis = async () => {
    if (!recording) return;
    const value = await speechesApi.analyzeSpeech(speech.id, recording.blob).catch(() => null);
    if (value) setAnalysis(value);
  };

  const fileName = `talk-alone-${speech.completedAt.slice(0, 10)}.${downloadExtension(recording?.mimeType ?? '')}`;

  return (
    <main className="page result-page">
      {speechesApi.error && <div className="error-banner" role="alert">{speechesApi.error}</div>}
      <div className="result-heading">
        <div>
          <p className="section-label">SESSION RESULT</p>
          <h1>スピーチ結果</h1>
        </div>
        <Link className="text-link" to="/"><ArrowLeft size={15} />次のスピーチへ</Link>
      </div>

      <section className="result-summary">
        <div className="result-topic">
          <span>{speech.mode === 'word' ? 'WORD' : 'TOPIC'} · {speech.categoryName}</span>
          <h2>{speech.topic}</h2>
        </div>
        <div className="result-time"><span>TIME</span><strong>{formatTime(speech.durationSeconds)}</strong></div>
      </section>

      <div className="result-grid">
        <section className="result-card recording-card">
          <div className="result-card-heading"><PlayCircle size={18} /><div><span>RECORDING</span><h2>録音</h2></div></div>
          {recording ? (
            <>
              <audio className="audio-player" controls preload="metadata" src={audioUrl}>音声を再生できません。</audio>
              <a className="download-link" href={audioUrl} download={fileName}><Download size={16} />録音をダウンロード</a>
              <p className="data-note">録音はこのブラウザ内の一時データです。保存する場合は画面を閉じる前にダウンロードしてください。</p>
            </>
          ) : (
            <div className="recording-empty"><p>録音データはありません。</p><span>マイクが利用できない場合もスピーチ記録は保存されています。</span></div>
          )}
        </section>

        <section className="result-card analysis-action-card">
          <div className="result-card-heading"><BrainCircuit size={18} /><div><span>AI REVIEW</span><h2>スピーチ分析</h2></div></div>
          <p>録音を文字起こしし、話の内容と構成についてフィードバックします。</p>
          <Button
            onClick={() => void runAnalysis()}
            disabled={!recording || speechesApi.loading}
            icon={speechesApi.loading ? <LoadingSpinner /> : <BrainCircuit size={17} />}
          >
            {speechesApi.loading ? '分析中' : 'AIで分析'}
          </Button>
          {!recording && <small>録音がないため利用できません。</small>}
        </section>
      </div>

      {analysis && (
        <section className="analysis-result" aria-live="polite">
          <div className="analysis-title"><span>AI FEEDBACK</span><h2>分析結果</h2></div>
          <div className="analysis-summary"><span>要約</span><p>{analysis.summary}</p></div>
          <div className="feedback-grid">
            <article><div><Check size={16} /><h3>良かった点</h3></div><ul>{analysis.strengths.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article><div><Lightbulb size={16} /><h3>改善できる点</h3></div><ul>{analysis.improvements.map((item) => <li key={item}>{item}</li>)}</ul></article>
          </div>
          <div className="next-challenge"><span>NEXT</span><p>{analysis.nextChallenge}</p></div>
          <details className="transcript"><summary>文字起こしを表示</summary><p>{analysis.transcript}</p></details>
        </section>
      )}
    </main>
  );
}
