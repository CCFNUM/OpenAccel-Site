import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Caption } from './Caption';

interface CodeBlockProps {
  code: string;
  lang?: string;
  /** e.g. "Listing 1.1" — only set this when the source .tex actually captions the listing */
  label?: string;
  caption?: string;
}

/** Strip leading `$ ` prompt from shell command lines so it isn't copied. */
function stripShellPrompts(code: string): string {
  return code
    .split('\n')
    .map(line => line.replace(/^\$ /, ''))
    .join('\n');
}

const SHELL_LANGS = new Set(['bash', 'sh', 'shell', 'zsh']);

/** Only actual YAML/input.i listings get the §19 blue treatment — bash and plain-text stay grey. */
function isListing(lang?: string): boolean {
  return lang === 'yaml';
}

export function CodeBlock({ code, lang, label, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const bg = isListing(lang) ? 'var(--listing-bg)' : 'var(--code-bg)';
  const stripBg = isListing(lang) ? 'var(--listing-strip-bg)' : 'var(--code-strip-bg)';

  const copy = () => {
    const text = lang && SHELL_LANGS.has(lang) ? stripShellPrompts(code) : code;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <figure className="my-4 w-full min-w-0">
    <div className="rounded-md border overflow-hidden w-full min-w-0" style={{ borderColor: 'var(--code-border)' }}>
      {/* Header bar — never overlaps code */}
      <div
        className="flex items-center justify-between px-3 border-b"
        style={{ height: 36, borderColor: 'var(--code-border)', background: stripBg }}
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
      <div className="overflow-x-auto" style={{ background: bg }}>
        <pre className="p-4 text-sm font-mono leading-relaxed text-[var(--text)] whitespace-pre min-w-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
    {caption && label && (
      <Caption label={label} className="mt-2">{caption}</Caption>
    )}
    </figure>
  );
}
