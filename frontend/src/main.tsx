import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import { TemporaryResultProvider } from './features/result/context/TemporaryResultContext';
import { LanguageProvider } from './i18n/LanguageContext';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter><LanguageProvider><TemporaryResultProvider><App /></TemporaryResultProvider></LanguageProvider></HashRouter>
  </StrictMode>,
);
