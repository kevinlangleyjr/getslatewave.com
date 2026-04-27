import { useCallback, useEffect, useRef, useState } from 'react';
import Editor, { loader, type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { monacoTheme, MONACO_THEME_NAME } from '~/lib/monaco-theme';
import { trackEvent } from '~/lib/analytics';

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs',
  },
});

interface Sample {
  id: string;
  label: string;
  language: string;
  code: string;
}

const SAMPLES: Sample[] = [
  {
    id: 'typescript',
    label: 'TypeScript',
    language: 'typescript',
    code: `// slatewave/palette.ts
export const accent = '#5eead4';

export interface Theme {
  name: string;
  surface: 'editor' | 'terminal' | 'notes';
  accent: string;
}

export function apply<T extends Theme>(theme: T): string {
  const label = \`\${theme.name} on \${theme.surface}\`;
  return label.padEnd(40, '·') + theme.accent;
}

const slatewave: Theme = {
  name: 'Slatewave',
  surface: 'editor',
  accent,
};

console.log(apply(slatewave));
`,
  },
  {
    id: 'rust',
    label: 'Rust',
    language: 'rust',
    code: `// slatewave/palette.rs
use std::fmt;

#[derive(Debug, Clone)]
pub struct Theme {
    pub name: String,
    pub surface: Surface,
    pub accent: &'static str,
}

#[derive(Debug, Clone, Copy)]
pub enum Surface {
    Editor,
    Terminal,
    Notes,
}

impl fmt::Display for Theme {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} on {:?} ({})", self.name, self.surface, self.accent)
    }
}

fn main() {
    let theme = Theme {
        name: String::from("Slatewave"),
        surface: Surface::Editor,
        accent: "#5eead4",
    };
    println!("{theme}");
}
`,
  },
  {
    id: 'python',
    label: 'Python',
    language: 'python',
    code: `# slatewave/palette.py
from dataclasses import dataclass
from enum import Enum

class Surface(Enum):
    EDITOR = "editor"
    TERMINAL = "terminal"
    NOTES = "notes"

@dataclass(frozen=True)
class Theme:
    name: str
    surface: Surface
    accent: str = "#5eead4"

    def describe(self) -> str:
        return f"{self.name} on {self.surface.value} ({self.accent})"

if __name__ == "__main__":
    theme = Theme("Slatewave", Surface.EDITOR)
    print(theme.describe())
`,
  },
  {
    id: 'go',
    label: 'Go',
    language: 'go',
    code: `// slatewave/palette.go
package main

import "fmt"

type Surface string

const (
\tEditor   Surface = "editor"
\tTerminal Surface = "terminal"
\tNotes    Surface = "notes"
)

type Theme struct {
\tName    string
\tSurface Surface
\tAccent  string
}

func (t Theme) Describe() string {
\treturn fmt.Sprintf("%s on %s (%s)", t.Name, t.Surface, t.Accent)
}

func main() {
\ttheme := Theme{Name: "Slatewave", Surface: Editor, Accent: "#5eead4"}
\tfmt.Println(theme.Describe())
}
`,
  },
];

export default function Playground() {
  const [active, setActive] = useState<Sample>(SAMPLES[0]);
  const [code, setCode] = useState<string>(SAMPLES[0].code);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = useCallback((ed, monaco) => {
    editorRef.current = ed;
    monaco.editor.defineTheme(MONACO_THEME_NAME, monacoTheme);
    monaco.editor.setTheme(MONACO_THEME_NAME);
  }, []);

  useEffect(() => {
    setCode(active.code);
  }, [active.id]);

  return (
    <div className="pg-root">
      <div className="pg-toolbar">
        <div className="pg-tabs" role="tablist">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === active.id}
              className={s.id === active.id ? 'pg-tab pg-tab-active' : 'pg-tab'}
              onClick={() => {
                setActive(s);
                trackEvent(`playground_tab_${s.id}`);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="pg-reset"
          onClick={() => {
            setCode(active.code);
            trackEvent('playground_reset', { language: active.id });
          }}
          aria-label="Reset sample code"
        >
          Reset
        </button>
      </div>

      <div className="pg-editor">
        <Editor
          height="100%"
          language={active.language}
          value={code}
          onChange={(v) => setCode(v ?? '')}
          onMount={handleMount}
          loading={<div className="pg-loading">Loading editor…</div>}
          options={{
            fontFamily:
              "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            fontLigatures: true,
            fontSize: 13,
            lineHeight: 1.7,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'all',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            bracketPairColorization: { enabled: true },
            guides: {
              indentation: true,
              bracketPairs: 'active',
            },
            stickyScroll: { enabled: false },
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
