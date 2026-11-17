import { Download, Share2, Video } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { ChallengeVideoResult as ChallengeVideoRecording } from '../hook/useChallengeVideoRecorder';
import { challengeVideoExtension } from '../util/challenge-video';

type Props = { recording: ChallengeVideoRecording | null };

const createFileName = (mimeType: string) => `talk-alone-challenge-${new Date().toISOString().slice(0, 10)}.${challengeVideoExtension(mimeType)}`;

export function ChallengeVideoResult({ recording }: Props) {
  const { copy } = useLanguage();
  const [shareError, setShareError] = useState('');
  const videoUrl = useMemo(() => recording ? URL.createObjectURL(recording.blob) : '', [recording]);
  const file = useMemo(() => recording ? new File(
    [recording.blob],
    createFileName(recording.mimeType),
    { type: recording.mimeType },
  ) : null, [recording]);
  const canShareFile = Boolean(file && navigator.canShare?.({ files: [file] }));

  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  if (!recording || !file) {
    return (
      <section className="challenge-video-result unavailable">
        <div className="result-panel-heading"><Video size={16} /><span>{copy.challengeVideo}</span></div>
        <p>{copy.challengeVideoUnavailable}</p>
      </section>
    );
  }

  const download = () => {
    const anchor = document.createElement('a');
    anchor.href = videoUrl;
    anchor.download = file.name;
    anchor.click();
  };

  const share = async () => {
    setShareError('');
    try {
      await navigator.share({
        files: [file],
        title: copy.challengeShareTitle,
        text: copy.challengeShareText,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareError(copy.challengeShareError);
    }
  };

  return (
    <section className="challenge-video-result">
      <div className="result-panel-heading"><Video size={16} /><span>{copy.challengeVideo}</span></div>
      <video className="challenge-video-player" controls playsInline src={videoUrl}>
        {copy.videoUnsupported}
      </video>
      <p className="data-note">{copy.temporaryChallengeVideo}</p>
      {shareError && <p className="challenge-share-error" role="alert">{shareError}</p>}
      <div className="challenge-video-actions">
        <Button variant="secondary" onClick={download} icon={<Download size={16} />}>{copy.saveChallengeVideo}</Button>
        {canShareFile && <Button onClick={() => void share()} icon={<Share2 size={16} />}>{copy.shareChallengeVideo}</Button>}
      </div>
    </section>
  );
}
