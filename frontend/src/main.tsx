import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { TemporaryResultProvider } from './features/result/context/TemporaryResultContext';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter><TemporaryResultProvider><App /></TemporaryResultProvider></BrowserRouter>
  </StrictMode>,
);
