import { Mic2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { ENABLED_APP_LANGUAGES, useLanguage, type AppLanguage } from '../../i18n/LanguageContext';

export function AppLayout() {
  const { language, setLanguage, copy } = useLanguage();
  return (
    <div className="app-frame">
      <header className="app-header">
        <NavLink className="logo" to="/" aria-label={copy.home}>
          <span className="logo-icon"><Mic2 size={18} /></span><span className="logo-wordmark">talk-alone</span>
        </NavLink>
        <div className="header-tools">
          <span className="session-duration">NO ACCOUNT · NO UPLOAD</span>
          {ENABLED_APP_LANGUAGES.length > 1 && (
            <label className="language-select">
              <span>{copy.languageLabel}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value as AppLanguage)}>
                {ENABLED_APP_LANGUAGES.map((option) => (
                  <option value={option} key={option}>{option === 'ja' ? copy.japanese : copy.english}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
