// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

import { slatewaveTheme } from './src/lib/shiki.ts';

export default defineConfig({
  site: "https://getslatewave.com",
  output: "static",
  trailingSlash: "always",
  integrations: [mdx(), sitemap(), react()],
  markdown: {
    shikiConfig: {
      theme: slatewaveTheme,
      wrap: false,
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    optimizeDeps: {
      include: ["monaco-editor"],
    },
  },
});
