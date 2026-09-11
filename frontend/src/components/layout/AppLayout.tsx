import { Mic2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="app-frame">
      <header className="app-header">
        <NavLink className="logo" to="/" aria-label="talk-alone ホーム">
          <span className="logo-icon"><Mic2 size={18} /></span><span className="logo-wordmark">talk-alone</span>
        </NavLink>
        <span className="session-duration">OFFLINE · DESKTOP</span>
      </header>
      <Outlet />
    </div>
  );
}
