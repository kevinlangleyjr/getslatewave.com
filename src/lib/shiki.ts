/**
 * Singleton Shiki highlighter preloaded with the Slatewave TextMate theme.
 *
 * Used at build time by CodePreview.astro (and anywhere else that needs
 * inline HTML from a code string). MDX code fences are rendered by Astro's
 * built-in Shiki via astro.config.mjs, which also consumes this theme.
 */

import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki';
import slatewaveRaw from './slatewave-theme.json' with { type: 'json' };

export const slatewaveTheme = slatewaveRaw as unknown as Parameters<
  typeof createHighlighter
>[0]['themes'][number];

export const slatewaveThemeName = (slatewaveRaw as { name: string }).name;

const DEFAULT_LANGS: BundledLanguage[] = [
  'typescript',
  'tsx',
  'javascript',
  'jsx',
  'json',
  'jsonc',
  'bash',
  'shell',
  'markdown',
  'mdx',
  'rust',
  'go',
  'python',
  'swift',
  'yaml',
  'toml',
  'css',
  'html',
];

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [slatewaveTheme],
      langs: DEFAULT_LANGS,
    });
  }
  return highlighterPromise;
}
