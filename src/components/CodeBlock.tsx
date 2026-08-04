import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

/** Strip leading `$ ` prompt from shell command lines so it isn't copied. */
function stripShellPrompts(code: string): string {
  return code
    .split('\n')
    .map(line => line.replace(/^\$ /, ''))
    .join('\n');
}

const SHELL_LANGS = new Set(['bash', 'sh', 'shell', 'zsh']);

export function CodeBlock({ code, lang }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const text = lang && SHELL_LANGS.has(lang) ? stripShellPrompts(code) : code;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-md border border-[var(--hairline)] overflow-hidden my-4 w-full min-w-0">
      {/* Header bar — never overlaps code */}
      <div
        className="flex items-center justify-between px-3 border-b border-[var(--hairline)] bg-[var(--surface-2)]"
        style={{ height: 36 }}
      >
        <span
          className="font-mono uppercase tracking-[0.08em] text-[var(--text-dim)]"
          style={{ fontSize: 11 }}
        >
          {lang ?? 'code'}
        </span>

        <button
          onClick={copy}
          aria-label="Copy code"
          className="flex items-center justify-center rounded transition-colors"
          style={{
            width: 28,
            height: 28,
            color: copied ? 'var(--signal)' : 'var(--text-dim)',
          }}
          onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = 'var(--cold)'; }}
          onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)'; }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      {/* Code body — has its own horizontal scroll, nothing overlaid */}
      <div className="overflow-x-auto bg-[var(--surface-2)]">
        <pre className="p-4 text-sm font-mono leading-relaxed text-[var(--text)] whitespace-pre min-w-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
