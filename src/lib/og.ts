/**
 * Build-time OG image generator.
 *
 * Renders a 1200x630 PNG via satori → resvg. One shared template with
 * three variants: default (site), theme (per-theme page), and page
 * (docs, colors, changelog).
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

const FONT_ROOT = join(process.cwd(), 'src', 'lib', 'fonts');

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 400 | 600 | 700; style: 'normal' }[]> | null = null;

function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      (
        [
          ['inter-latin-400-normal.woff', 400],
          ['inter-latin-600-normal.woff', 600],
          ['inter-latin-700-normal.woff', 700],
        ] as const
      ).map(async ([file, weight]) => ({
        name: 'Inter',
        data: await readFile(join(FONT_ROOT, file)),
        weight: weight as 400 | 600 | 700,
        style: 'normal' as const,
      })),
    );
  }
  return fontsPromise;
}

interface BaseInput {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
}

export interface OgInput extends BaseInput {
  footer?: string;
}

const PALETTE = {
  bg: '#0f172a',
  bgRaised: '#1e293b',
  fgDefault: '#e2e8f0',
  fgMuted: '#cbd5e1',
  fgSubtle: '#94a3b8',
  accent: '#5eead4',
  sky: '#38bdf8',
  purple: '#b388ff',
};

function template({ eyebrow, title, description, accent = PALETTE.accent, footer = 'slatewave.dev' }: OgInput): string {
  return `
    <div style="
      width: 1200px;
      height: 630px;
      background: ${PALETTE.bg};
      color: ${PALETTE.fgDefault};
      font-family: Inter;
      display: flex;
      flex-direction: column;
      position: relative;
      padding: 72px;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        top: -180px;
        left: -180px;
        width: 640px;
        height: 640px;
        background: radial-gradient(closest-side, ${accent}55, transparent);
        display: flex;
      "></div>
      <div style="
        position: absolute;
        bottom: -220px;
        right: -180px;
        width: 640px;
        height: 640px;
        background: radial-gradient(closest-side, ${PALETTE.purple}33, transparent);
        display: flex;
      "></div>

      <div style="display: flex; align-items: center; gap: 16px; color: ${PALETTE.fgSubtle}; font-size: 24px; font-weight: 600; letter-spacing: 6px;">
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, ${accent}, ${PALETTE.sky});
          display: flex;
        "></div>
        <div style="display: flex;">SLATEWAVE</div>
      </div>

      <div style="margin-top: 64px; display: flex; flex-direction: column; gap: 32px; max-width: 960px;">
        <div style="
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 5px;
          color: ${accent};
          text-transform: uppercase;
          display: flex;
        ">${escapeText(eyebrow)}</div>
        <div style="
          font-size: 86px;
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -2.5px;
          color: ${PALETTE.fgDefault};
          display: flex;
        ">${escapeText(title)}</div>
        <div style="
          font-size: 32px;
          font-weight: 400;
          line-height: 1.35;
          color: ${PALETTE.fgMuted};
          display: flex;
          max-width: 900px;
        ">${escapeText(description)}</div>
      </div>

      <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 24px; color: ${PALETTE.fgSubtle};">
        <div style="display: flex;">${escapeText(footer)}</div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: ${accent}; display: flex;"></div>
          <div style="display: flex;">One palette. Every tool.</div>
        </div>
      </div>
    </div>
  `;
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function renderOgPng(input: OgInput): Promise<Buffer> {
  const fonts = await loadFonts();
  const markup = html(template(input));
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts,
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return Buffer.from(png);
}
