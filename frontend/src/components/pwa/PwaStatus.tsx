import { RefreshCw, WifiOff, X } from 'lucide-react';
import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useLanguage } from '../../i18n/LanguageContext';

export function PwaStatus() {
  const { copy } = useLanguage();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true });

  useEffect(() => {
    if (!offlineReady) return;
    const timer = window.setTimeout(() => setOfflineReady(false), 6_000);
    return () => window.clearTimeout(timer);
  }, [offlineReady, setOfflineReady]);

  if (!offlineReady && !needRefresh) return null;

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <aside className="pwa-status" role="status" aria-live="polite">
      <div className="pwa-status-icon">{needRefresh ? <RefreshCw size={17} /> : <WifiOff size={17} />}</div>
      <div>
        <strong>{needRefresh ? copy.updateAvailable : copy.offlineReady}</strong>
        <span>{needRefresh ? copy.updateAvailableBody : copy.offlineReadyBody}</span>
      </div>
      {needRefresh && (
        <button className="pwa-update-button" type="button" onClick={() => void updateServiceWorker(true)}>
          {copy.updateNow}
        </button>
      )}
      <button className="pwa-close-button" type="button" onClick={close} aria-label={copy.closeNotice}>
        <X size={15} />
      </button>
    </aside>
  );
}
