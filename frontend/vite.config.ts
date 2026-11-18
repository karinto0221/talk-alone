import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const publicSiteUrl = (env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      {
        name: 'public-site-url',
        transformIndexHtml: (html) => html.replaceAll('%PUBLIC_SITE_URL%', publicSiteUrl),
      },
    ],
    clearScreen: false,
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
    },
  };
});
