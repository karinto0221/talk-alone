import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const publicSiteUrl = (env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['app-icon.png', 'app-icon-192.png'],
        manifest: {
          name: 'TALK-ALONE｜配信・トーク練習',
          short_name: 'TALK-ALONE',
          description: 'スピーチ、瞬発力、配信コメント対応を練習できるWebアプリ',
          lang: 'ja',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#080d18',
          theme_color: '#080d18',
          icons: [
            { src: '/app-icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/app-icon.png', sizes: '512x512', type: 'image/png' },
            { src: '/app-icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallback: 'index.html',
          globPatterns: ['**/*.{html,js,css,png,svg,webmanifest}'],
        },
      }),
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
