// astro.config.mjs — reference config for the Eco News API landing page.
// Use the serverless adapter if you want the /api/contact route; otherwise
// @astrojs/vercel/static is enough and cheaper.

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // Use 'server' if you need the /api/contact route. Use 'static' otherwise.
  output: 'server',

  adapter: vercel({
    webAnalytics: { enabled: true },
    maxDuration: 10,
  }),

  integrations: [react()],

  site: 'https://econews.economatica.com',

  // i18n via file-based routing. No Astro i18n helper needed.
  // /       -> PT (src/pages/index.astro)
  // /en     -> EN (src/pages/en/index.astro)
  // /es     -> ES (src/pages/es/index.astro)

  build: {
    // Inline small CSS directly; the global sheet stays external.
    inlineStylesheets: 'auto',
  },

  vite: {
    ssr: {
      noExternal: ['@fontsource/*'],
    },
  },
});
