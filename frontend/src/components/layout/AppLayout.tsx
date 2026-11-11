import { Mic2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useLanguage, type AppLanguage } from '../../i18n/LanguageContext';

export function AppLayout() {
  const { uiLanguage, setUiLanguage, copy } = useLanguage();
  return (
    <div className="app-frame">
      <header className="app-header">
        <NavLink className="logo" to="/" aria-label={copy.home}>
          <span className="logo-icon"><Mic2 size={18} /></span><span className="logo-wordmark">talk-alone</span>
        </NavLink>
        <div className="header-tools">
          <span className="session-duration">NO ACCOUNT · NO UPLOAD</span>
          <label className="language-select">
            <span>{copy.interfaceLanguage}</span>
            <select value={uiLanguage} onChange={(event) => setUiLanguage(event.target.value as AppLanguage)}>
              <option value="ja">日本語</option><option value="en">English</option>
            </select>
          </label>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
