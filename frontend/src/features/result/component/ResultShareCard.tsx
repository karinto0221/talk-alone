import { Download, Image as ImageIcon, Share2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useLanguage } from '../../../i18n/LanguageContext';
import { createResultShareImage, type ResultShareImageData } from '../util/result-share-image';

type Props = {
  data: ResultShareImageData;
  fileName: string;
  shareText: string;
};

export function ResultShareCard({ data, fileName, shareText }: Props) {
  const { copy } = useLanguage();
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const dataKey = JSON.stringify(data);
  const imageUrl = useMemo(() => imageBlob ? URL.createObjectURL(imageBlob) : '', [imageBlob]);
  const file = useMemo(() => imageBlob ? new File([imageBlob], fileName, { type: 'image/png' }) : null, [fileName, imageBlob]);
  const canShareFile = Boolean(file && navigator.canShare?.({ files: [file] }));

  useEffect(() => {
    let active = true;
    setImageBlob(null);
    createResultShareImage(JSON.parse(dataKey) as ResultShareImageData)
      .then((blob) => { if (active) setImageBlob(blob); })
      .catch(() => { if (active) setError(copy.shareResultError); });
    return () => { active = false; };
  }, [copy.shareResultError, dataKey]);

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  const download = () => {
    if (!imageUrl) return;
    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    anchor.download = fileName;
    anchor.click();
  };

  const share = async () => {
    if (!file) return;
    setError('');
    try {
      await navigator.share({ files: [file], title: 'talk-alone', text: shareText });
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === 'AbortError') return;
      setError(copy.shareResultError);
    }
  };

  return (
    <section className="result-share-card">
      <div className="result-panel-heading"><ImageIcon size={16} /><span>{copy.shareResultTitle}</span></div>
      {imageUrl ? <img src={imageUrl} alt={copy.shareResultImageAlt} /> : <div className="result-share-loading">{copy.preparing}</div>}
      <p className="data-note">{copy.shareResultNote}</p>
      {error && <p className="challenge-share-error" role="alert">{error}</p>}
      <div className="result-share-actions">
        <Button variant="secondary" onClick={download} disabled={!imageUrl} icon={<Download size={16} />}>{copy.saveResultImage}</Button>
        {canShareFile && <Button onClick={() => void share()} icon={<Share2 size={16} />}>{copy.shareResultImage}</Button>}
      </div>
    </section>
  );
}
