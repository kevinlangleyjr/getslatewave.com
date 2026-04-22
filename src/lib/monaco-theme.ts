/**
 * Translate the vendored Slatewave TextMate JSON into Monaco's theme format.
 *
 * Monaco wants `{ base, inherit, colors, rules }` where rules map
 * scope-strings to token style objects. Most of this is a direct pass-through
 * of tokenColors from the TextMate theme; we just flatten the scope array
 * and normalize keys to what Monaco expects.
 */

import slatewaveRaw from './slatewave-theme.json' with { type: 'json' };

type RawTokenColor = {
  name?: string;
  scope?: string | string[];
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: string;
  };
};

type RawTheme = {
  name: string;
  type: 'dark' | 'light';
  colors: Record<string, string>;
  tokenColors: RawTokenColor[];
};

const raw = slatewaveRaw as RawTheme;

const VALID_HEX = /^#[0-9a-fA-F]{6,8}$/;

function normalizeColor(value: string | undefined): string | undefined {
  if (!value) return undefined;
  // Monaco only supports hex; alpha-prefixed (#RRGGBBAA) works too.
  return VALID_HEX.test(value) ? value.toUpperCase() : undefined;
}

function toRules(tokenColors: RawTokenColor[]): { token: string; foreground?: string; fontStyle?: string; background?: string }[] {
  const out: { token: string; foreground?: string; fontStyle?: string; background?: string }[] = [];
  for (const entry of tokenColors) {
    if (!entry.scope) continue;
    const scopes = Array.isArray(entry.scope) ? entry.scope : [entry.scope];
    const fg = normalizeColor(entry.settings.foreground);
    const bg = normalizeColor(entry.settings.background);
    const fontStyle = entry.settings.fontStyle;
    for (const scope of scopes) {
      const rule: { token: string; foreground?: string; fontStyle?: string; background?: string } = {
        token: scope,
      };
      if (fg) rule.foreground = fg.slice(1); // Monaco rule fg: no leading `#`
      if (bg) rule.background = bg.slice(1);
      if (fontStyle) rule.fontStyle = fontStyle;
      out.push(rule);
    }
  }
  return out;
}

function toColors(colors: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    const normalized = normalizeColor(value);
    if (normalized) out[key] = normalized;
  }
  return out;
}

export const MONACO_THEME_NAME = 'slatewave';

export const monacoTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  colors: toColors(raw.colors),
  rules: toRules(raw.tokenColors),
};
