# Slatewave

One palette. Every tool.

The Slatewave site — a unified hub for the Slatewave theme family across
VSCode, Oh My Posh, Obsidian, and more. Built with Astro.

## Develop

```sh
pnpm install
pnpm dev
```

Visit `http://localhost:4321`.

## Build

```sh
pnpm build
pnpm preview
```

## Layout

- `src/content/themes/` — one MDX file per theme (authoritative metadata)
- `src/content.config.ts` — content collection schemas
- `src/pages/themes/[slug].astro` — per-theme dynamic route
- `src/components/` — layout, theme, and UI components
- `src/styles/tokens.css` — design tokens (mirror of the Slatewave palette)

## Adding a theme

1. Create `src/content/themes/<slug>.mdx` following the schema in
   `src/content.config.ts`
2. Run `pnpm dev` — the new theme appears on `/themes/` and at
   `/themes/<slug>/` automatically
