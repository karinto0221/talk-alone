import { ExternalLink, Youtube } from 'lucide-react';
import { CREATOR_PROFILE } from '../../config/creator';

export function CreatorLinks() {
  const hasProfile = Boolean(CREATOR_PROFILE.displayName || CREATOR_PROFILE.xUrl || CREATOR_PROFILE.youtubeUrl);
  if (!hasProfile) return null;

  return (
    <footer className="creator-links">
      <span>CREATED BY</span>
      {CREATOR_PROFILE.displayName && <strong>{CREATOR_PROFILE.displayName}</strong>}
      <nav aria-label="制作者リンク">
        {CREATOR_PROFILE.xUrl && <a href={CREATOR_PROFILE.xUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} />X</a>}
        {CREATOR_PROFILE.youtubeUrl && <a href={CREATOR_PROFILE.youtubeUrl} target="_blank" rel="noreferrer"><Youtube size={15} />YouTube</a>}
      </nav>
    </footer>
  );
}
