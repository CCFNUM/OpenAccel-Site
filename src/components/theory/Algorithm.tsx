import { useEffect, useRef, type ReactNode } from 'react';
import katex from 'katex';

/**
 * Algorithm — numbered pseudocode block matching the manual's `algorithm`
 * environment (Algorithm N. Caption, numbered lines, bold keywords, KaTeX math).
 * Each line: { text, indent } where text may contain $...$ math and **bold**.
 * Numbering is automatic (1..N).
 */
interface AlgLine { text: string; indent?: number; }
interface AlgorithmProps { number: string; caption: ReactNode; lines: AlgLine[]; }

function renderLine(host: HTMLElement, text: string) {
  host.innerHTML = '';
  // split on $...$ math and **bold** markers
  const tokens = text.split(/(\$[^$]*\$|\*\*[^*]+\*\*)/g);
  for (const tok of tokens) {
    if (tok.startsWith('$') && tok.endsWith('$') && tok.length > 1) {
      const s = document.createElement('span');
      katex.render(tok.slice(1, -1), s, { throwOnError: false, displayMode: false });
      host.appendChild(s);
    } else if (tok.startsWith('**') && tok.endsWith('**') && tok.length > 3) {
      const b = document.createElement('strong');
      b.textContent = tok.slice(2, -2);
      host.appendChild(b);
    } else if (tok) {
      host.appendChild(document.createTextNode(tok));
    }
  }
}

export function Algorithm({ number, caption, lines }: AlgorithmProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>('[data-line]').forEach((el) => {
      renderLine(el, el.getAttribute('data-line') || '');
    });
  }, [lines]);

  return (
    <figure className="my-6" ref={ref}>
      <div
        style={{
          border: '1px solid var(--hairline)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--surface)',
        }}
      >
        {/* caption header with rule */}
        <div
          className="px-4 py-2 text-[14px]"
          style={{ borderBottom: '1.5px solid var(--text)', color: 'var(--text)' }}
        >
          <strong>Algorithm {number}</strong>{' '}
          <span>{caption}</span>
        </div>
        {/* numbered lines */}
        <div className="px-4 py-3" style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.9, color: 'var(--text)' }}>
          {lines.map((ln, i) => (
            <div key={i} className="flex" style={{ gap: 12 }}>
              <span
                className="text-right select-none shrink-0"
                style={{ width: 22, color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}
              >{i + 1}</span>
              <span style={{ paddingLeft: (ln.indent || 0) * 22 }} data-line={ln.text} />
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
