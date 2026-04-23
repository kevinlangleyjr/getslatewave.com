# Slatewave Porting Candidates

Research compiled 2026-04-22. Ranked by category, with effort estimates
and recommended priority for porting the Slatewave palette.

Slatewave is a Tailwind-slate foundation with a teal signature
(`#5eead4`) and sky, rose, purple, and amber accents. See
[palette spec](/docs/palette-spec/) for the canonical definition.

---

## Shipped

| Target | Category | Status | Repo |
|---|---|---|---|
| **VSCode** (canonical source) | Editor | Beta | [vscode-slatewave](https://github.com/kevinlangleyjr/vscode-slatewave) |
| **Oh My Posh** | Terminal | Beta | [slatewave-omp](https://github.com/kevinlangleyjr/slatewave-omp) |
| **Obsidian** | Notes | Beta | [obsidian-slatewave](https://github.com/kevinlangleyjr/obsidian-slatewave) |
| **Ghostty** | Terminal | Beta | [ghostty-slatewave](https://github.com/kevinlangleyjr/ghostty-slatewave) |
| **iTerm2** | Terminal | Beta | [iterm2-slatewave](https://github.com/kevinlangleyjr/iterm2-slatewave) |
| **Logseq** | Notes | Beta | [logseq-slatewave](https://github.com/kevinlangleyjr/logseq-slatewave) |
| **Sublime Text** | Editor | Beta | [sublime-text-slatewave](https://github.com/kevinlangleyjr/sublime-text-slatewave) |
| **Alacritty** | Terminal | Beta | [alacritty-slatewave](https://github.com/kevinlangleyjr/alacritty-slatewave) |
| **Slack** | Productivity | Beta | [slack-slatewave](https://github.com/kevinlangleyjr/slack-slatewave) |
| **JetBrains IDEs** | Editor | Beta | [jetbrains-slatewave](https://github.com/kevinlangleyjr/jetbrains-slatewave) |
| **Raycast** | Productivity | Beta | [raycast-slatewave](https://github.com/kevinlangleyjr/raycast-slatewave) |
| **Alfred** | Productivity | Beta | [alfred-slatewave](https://github.com/kevinlangleyjr/alfred-slatewave) |

Candidates below are marked **✅ Shipped** inline when the original
research entry now corresponds to a live theme.

---

## Terminals / Shells

### 1. Ghostty — ✅ Shipped

- **Mechanism**: Plain-text config file at `~/.config/ghostty/themes/` with key-value `palette`, `background`, `foreground`, `selection-*`, `cursor-color` entries. [docs](https://ghostty.org/docs/config/reference#theme)
- **Effort**: Low — 16 ANSI colors + ~6 UI slots. Maps directly from VSCode palette.
- **Blockers**: None. Ghostty ships a curated theme list — submitting upstream is a viable distribution path.
- **Priority**: Quick-win.

### 2. Alacritty — ✅ Shipped

- **Mechanism**: TOML config (`~/.config/alacritty/alacritty.toml`) with `[colors.primary|cursor|normal|bright|selection]` blocks. [docs](https://alacritty.org/config-alacritty.html)
- **Effort**: Low — same 16+UI slot model as Ghostty.
- **Blockers**: None.
- **Priority**: Quick-win.

### 3. WezTerm — quick-win

- **Mechanism**: Lua config, or a TOML `.toml` dropped in `colors/` with `ansi`, `brights`, `background`, `foreground`, tab bar colors. [docs](https://wezfurlong.org/wezterm/config/appearance.html#defining-your-own-colors)
- **Effort**: Low. Tab bar adds ~6 extra slots but straightforward.
- **Blockers**: None. Upstream accepts theme contributions to `wezterm/termwiz`.
- **Priority**: Quick-win.

### 4. iTerm2 — ✅ Shipped

- **Mechanism**: `.itermcolors` XML plist. GUI importer. [docs](https://iterm2.com/documentation-preferences-profiles-colors.html)
- **Effort**: Low — 16 ANSI + ~10 UI slots (badge, link, cursor guide). Generator scripts exist.
- **Blockers**: macOS-only.
- **Priority**: Quick-win.

### 5. Kitty — quick-win

- **Mechanism**: `.conf` with `color0..15`, `background`, `foreground`, `cursor`, `selection_*`, tab colors. [docs](https://sw.kovidgoyal.net/kitty/conf/#color-scheme)
- **Effort**: Low. Easily published to `kitty-themes` repo.
- **Priority**: Quick-win.

### 6. Windows Terminal — medium

- **Mechanism**: JSON scheme block in `settings.json`. [docs](https://learn.microsoft.com/windows/terminal/customize-settings/color-schemes)
- **Effort**: Low palette work, medium distribution (no central gallery beyond community lists).
- **Priority**: Medium.

### 7. Starship — quick-win

- **Mechanism**: `starship.toml` palette + per-module styles. [docs](https://starship.rs/config/#style-strings)
- **Effort**: Low. Direct port from slatewave-omp segments.
- **Priority**: Quick-win (highest leverage — Starship is broadly popular).

### 8. tmux — medium

- **Mechanism**: `.tmux.conf` with `set -g status-style`, `pane-border-style`, etc. Often distributed as TPM plugins.
- **Effort**: Medium — status bar design is more opinionated than pure color mapping.
- **Priority**: Medium.

### 9. Powerlevel10k — stretch

- **Mechanism**: `.p10k.zsh` with per-segment `*_FOREGROUND`/`*_BACKGROUND` numeric color codes.
- **Effort**: Medium — config is huge; faithful port requires picking a variant (lean/classic) and rebuilding it.
- **Priority**: Stretch.

### 10. Warp — stretch

- **Mechanism**: YAML theme in `~/.warp/themes/`. [docs](https://docs.warp.dev/appearance/custom-themes)
- **Effort**: Low technically.
- **Blockers**: Closed, account-gated product; smaller power-user base than Ghostty/WezTerm.
- **Priority**: Stretch.

## Editors / IDEs

### 1. Zed — quick-win

- **Mechanism**: JSON theme family file in `~/.config/zed/themes/`, published via extensions repo. [docs](https://zed.dev/docs/extensions/themes)
- **Effort**: Low-medium. Highlight scopes overlap heavily with VSCode tokens.
- **Priority**: Quick-win — fastest-growing modern editor with a real theme marketplace.

### 2. Neovim — quick-win

- **Mechanism**: Lua colorscheme using `vim.api.nvim_set_hl`. Treesitter + LSP groups. Distribute via LazyVim/Packer.
- **Effort**: Medium — many highlight groups, plus plugin integrations (Telescope, lualine, gitsigns).
- **Priority**: Quick-win (huge dev audience).

### 3. Sublime Text — ✅ Shipped

- **Mechanism**: `.sublime-color-scheme` JSON. [docs](https://www.sublimetext.com/docs/color_schemes.html)
- **Effort**: Low-medium. Scopes are TextMate-style, adaptable from VSCode tmLanguage grammars.
- **Priority**: Medium.

### 4. JetBrains IDEs — ✅ Shipped

- **Mechanism**: `.icls` XML color scheme + optional `*.theme.json` for UI. Distributed as plugin. [docs](https://plugins.jetbrains.com/docs/intellij/themes-getting-started.html)
- **Effort**: Medium-high — UI theme is separate from editor colors; plugin packaging + JetBrains Marketplace review required.
- **Priority**: Medium (huge audience justifies effort).

### 5. Helix — quick-win (bonus)

- **Mechanism**: TOML theme in `~/.config/helix/themes/`. [docs](https://docs.helix-editor.com/themes.html)
- **Effort**: Low. Small scope list.
- **Priority**: Quick-win add-on.

### 6. Nova — stretch

- **Mechanism**: `.nova-theme` XML. Mac-only, small user base.
- **Priority**: Stretch.

## Notes

### 1. Logseq — ✅ Shipped

- **Mechanism**: Custom CSS via `custom.css` or theme plugin. [docs](https://docs.logseq.com/#/page/custom%20theme)
- **Effort**: Medium — CSS variables exposed, but many components need tuning.
- **Priority**: Quick-win.

### 2. Anytype — stretch

- **Mechanism**: Limited; light/dark only, no custom theme API as of current releases.
- **Priority**: Stretch / skip.

### 3. Notion, Roam — skip

No supported theme mechanism. Roam has community CSS hacks; Notion requires browser userstyles.

## Browsers

### 1. Firefox — quick-win

- **Mechanism**: WebExtension `manifest.json` with `theme` key (colors for toolbar, tab, frame). [docs](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/theme)
- **Effort**: Low. Publish to AMO.
- **Priority**: Quick-win.

### 2. Vivaldi — medium

- **Mechanism**: Built-in theme editor exports JSON; shareable via themes.vivaldi.net.
- **Effort**: Low once palette is chosen; UI is far more surface area than Firefox.
- **Priority**: Medium.

### 3. Arc — skip

Only per-space gradient "themes"; no CSS or structured theme API. Also Arc is sunsetted in favor of Dia.

## Chat

### 1. Slack — ✅ Shipped (under Productivity)

- **Mechanism**: 8-color sidebar string (`#aaa,#bbb,...`) pasted into Preferences > Themes.
- **Effort**: Very low. Share as a README snippet in the repo.
- **Priority**: Quick-win (low-effort bonus).

### 2. Discord (BetterDiscord / Vencord) — medium

- **Mechanism**: CSS theme file loaded by BD/Vencord.
- **Effort**: Medium — CSS variables + many overrides.
- **Blockers**: Violates Discord ToS; user-installed only. Fine for a personal theme, bad for promotion.
- **Priority**: Medium, with caveats.

### 3. Zulip — stretch

- **Mechanism**: Server-side "dark theme" toggle; custom themes require forked CSS. Smaller audience.
- **Priority**: Stretch.

## Productivity

### 1. Raycast — ✅ Shipped

- **Mechanism**: JSON theme file imported via `raycast://themes/...` deep link. [docs](https://manual.raycast.com/themes)
- **Effort**: Very low — ~10 color slots.
- **Priority**: Quick-win.

### 2. GitHub (userstyle) — quick-win

- **Mechanism**: Stylus/Stylish userstyle CSS targeting github.com.
- **Effort**: Medium — many components; maintenance cost as GitHub ships redesigns.
- **Priority**: Quick-win for visibility; medium maintenance.

### 3. Alfred — ✅ Shipped

- **Mechanism**: `.alfredappearance` file (plist). Exported from Alfred Preferences > Appearance.
- **Effort**: Low. Small audience relative to Raycast.
- **Priority**: Medium.

### 4. Linear — skip

No theme API. Light/dark only.

### 5. Things — skip

No theming support.

## Top 5 Recommended Next Targets

_Ghostty and Raycast from the original top 5 have shipped. Remaining
priorities, re-ranked:_

1. **Starship** — Directly parallels the existing OMP port; trivially reuses the palette and reaches a massive shell-prompt audience.
2. **Zed** — Modern, rapidly-adopted editor with a clean JSON theme spec and a real extension marketplace — highest ROI among remaining editors.
3. **Neovim** — Largest dev audience on this list; Lua colorscheme is more work than Starship but pays back via broad visibility and ties nicely to the VSCode port's token scopes.
4. **WezTerm** — Rounds out the terminal trio alongside Ghostty / iTerm2 / Alacritty; straightforward TOML/Lua theme file and upstream contribution path.
5. **Firefox** — Browser chrome is a surface we haven't touched yet; WebExtension theme API is simple enough to ship quickly and publishes through AMO.

### Shipped from the original research

Ghostty, Alacritty, iTerm2, Sublime Text, JetBrains, Logseq, Slack
(under Productivity), Raycast, Alfred — all live.
