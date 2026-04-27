# Slatewave Porting Candidates

Research compiled 2026-04-22, last updated 2026-04-27. Ranked by
category, with effort estimates and recommended priority for porting
the Slatewave palette.

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
| **Zed** | Editor | Beta | [zed-slatewave](https://github.com/kevinlangleyjr/zed-slatewave) |
| **Neovim** | Editor | Beta | [neovim-slatewave](https://github.com/kevinlangleyjr/neovim-slatewave) |
| **Helix** | Editor | Beta | [helix-slatewave](https://github.com/kevinlangleyjr/helix-slatewave) |
| **WezTerm** | Terminal | Beta | [wezterm-slatewave](https://github.com/kevinlangleyjr/wezterm-slatewave) |
| **Starship** | Terminal | Beta | [starship-slatewave](https://github.com/kevinlangleyjr/starship-slatewave) |
| **tmux** | Terminal | Beta | [tmux-slatewave](https://github.com/kevinlangleyjr/tmux-slatewave) |
| **Windows Terminal** | Terminal | Beta | [windows-terminal-slatewave](https://github.com/kevinlangleyjr/windows-terminal-slatewave) |
| **MarkEdit** | Notes | Beta | [markedit-slatewave](https://github.com/kevinlangleyjr/markedit-slatewave) |
| **LSD** | CLI | Beta | [lsd-slatewave](https://github.com/kevinlangleyjr/lsd-slatewave) |

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

### 3. WezTerm — ✅ Shipped

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

### 6. Windows Terminal — ✅ Shipped

- **Mechanism**: JSON scheme block in `settings.json`. [docs](https://learn.microsoft.com/windows/terminal/customize-settings/color-schemes)
- **Effort**: Low palette work, medium distribution (no central gallery beyond community lists).
- **Priority**: Medium.

### 7. Starship — ✅ Shipped

- **Mechanism**: `starship.toml` palette + per-module styles. [docs](https://starship.rs/config/#style-strings)
- **Effort**: Low. Direct port from slatewave-omp segments.
- **Priority**: Quick-win (highest leverage — Starship is broadly popular).

### 8. tmux — ✅ Shipped

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

### 1. Zed — ✅ Shipped

- **Mechanism**: JSON theme family file in `~/.config/zed/themes/`, published via extensions repo. [docs](https://zed.dev/docs/extensions/themes)
- **Effort**: Low-medium. Highlight scopes overlap heavily with VSCode tokens.
- **Priority**: Quick-win — fastest-growing modern editor with a real theme marketplace.

### 2. Neovim — ✅ Shipped

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

### 5. Helix — ✅ Shipped

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

### 2. MarkEdit — ✅ Shipped

- **Mechanism**: JS bundle dropped in MarkEdit's scripts folder; ships a CodeMirror theme + a small set of UI overrides.
- **Effort**: Low-medium. Surface area is just the editor pane and inline markdown.
- **Priority**: Quick-win bonus — small audience but the install path was already understood from the VSCode/Sublime ports.

### 3. Anytype — stretch

- **Mechanism**: Limited; light/dark only, no custom theme API as of current releases.
- **Priority**: Stretch / skip.

### 4. Notion, Roam — skip

No supported theme mechanism. Roam has community CSS hacks; Notion requires browser userstyles.

## CLI tools

### 1. LSD — ✅ Shipped

- **Mechanism**: YAML `colors.yaml` mapping file types, permissions, sizes, dates, git status, and user/group to ANSI or hex colors. [docs](https://github.com/lsd-rs/lsd#config-file-content)
- **Effort**: Low. The full palette is already well-defined; LSD just needs explicit mappings per column.
- **Priority**: Bonus — small audience but ports cleanly and the file lives under `~/.config/lsd/` next to the rest of the dotfiles you'd already update.

### 2. eza / exa — quick-win

- **Mechanism**: `EZA_COLORS` / `LS_COLORS`-style env var. No central theme registry; users wire it themselves.
- **Effort**: Low. Same color slots as LSD; can be derived from the LSD port.
- **Priority**: Quick-win bonus when next refreshing the LSD port.

### 3. bat — quick-win

- **Mechanism**: Sublime `.tmTheme` file in `~/.config/bat/themes/`, registered via `bat cache --build`. [docs](https://github.com/sharkdp/bat#adding-new-themes)
- **Effort**: Low. The Sublime Text port is already a tmTheme — minor reshape required.
- **Priority**: Quick-win bonus alongside any future Sublime touch-up.

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

_Four of the previous five (Starship, Zed, Neovim, WezTerm) have
shipped. Firefox is the only carry-over. Re-ranked among unshipped:_

1. **Firefox** — Browser chrome is the largest unthemed surface left. WebExtension `theme` API is simple (toolbar/tab/frame colors), AMO publishing is straightforward, and a Firefox theme broadens the family beyond developer tooling.
2. **Kitty** — Last of the major terminal emulators not yet shipped. `.conf` mapping is already done in spirit (matches Alacritty/Ghostty); upstream `kitty-themes` repo accepts contributions, so distribution is a single PR.
3. **Powerlevel10k** — Massive ZSH-prompt audience that Starship and Oh My Posh don't capture. Higher effort than other prompts (per-segment `*_FOREGROUND`/`*_BACKGROUND` numeric codes, segment selection opinionated), but the leverage is real.
4. **bat / eza** — Bonus pair while the rest of the CLI surface is fresh. The Sublime Text port already produces a tmTheme that bat can consume with minor reshape; eza color env vars derive directly from the LSD port. Two ports for one effort.
5. **GitHub userstyle** — Highest visibility per install (Slatewave on a tab everyone has open), but also the highest maintenance cost as GitHub ships UI redesigns. Good "halo" target rather than core surface.

### Shipped from the original research

Ghostty, Alacritty, iTerm2, WezTerm, Windows Terminal, Starship, tmux,
Sublime Text, JetBrains, Zed, Neovim, Helix, Logseq, MarkEdit, Slack
(under Productivity), Raycast, Alfred, plus a bonus LSD port — all live.
