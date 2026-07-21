import { Activity, Mic2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="app-frame">
      <header className="app-header">
        <NavLink className="logo" to="/" aria-label="talk-alone ホーム">
          <span className="logo-icon"><Mic2 size={18} /></span><span className="logo-wordmark">talk-alone</span>
        </NavLink>
        <nav className="main-nav" aria-label="メインナビゲーション">
          <NavLink to="/" end><Mic2 size={16} /> スピーチ</NavLink>
          <NavLink to="/analytics"><Activity size={16} /> 分析</NavLink>
        </nav>
        <span className="session-duration">SESSION · 03:00</span>
      </header>
      <Outlet />
    </div>
  );
}
