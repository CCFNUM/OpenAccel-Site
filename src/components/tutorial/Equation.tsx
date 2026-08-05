import { useEffect, useRef } from 'react';
import katex from 'katex';

interface EquationProps {
  math: string;
  /** display (block, centred) or inline */
  display?: boolean;
  label?: string;
}

/**
 * Renders a KaTeX equation.
 * Pass display=true (default) for a numbered block equation.
 * Pass display=false for inline math.
 *
 * Display equations no longer scroll horizontally: if the rendered KaTeX is
 * wider than the available column, it is scaled down in place to fit (rather
 * than clipped or left to overflow into a scrollbar). Re-measured on window
 * resize so it stays correct as the viewport changes.
 */
export function Equation({ math, display = true, label }: EquationProps) {
  const ref = useRef<HTMLSpanElement | HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    katex.render(math, ref.current, {
      displayMode: display,
      throwOnError: false,
      trust: true,
      strict: false,
    });

    if (!display || !wrapRef.current) return;
    const el = ref.current as HTMLDivElement;
    const wrap = wrapRef.current;

    const fit = () => {
      // Reset before measuring so we always compare against natural size.
      el.style.transform = '';
      el.style.transformOrigin = '';
      wrap.style.height = '';
      const available = wrap.clientWidth;
      const natural = el.scrollWidth;
      if (available > 0 && natural > available + 1) {
        // Floor so we never scale up; keep a sane lower bound for legibility.
        const scale = Math.max(available / natural, 0.35);
        el.style.transform = `scale(${scale})`;
        el.style.transformOrigin = 'center top';
        wrap.style.height = `${Math.ceil(el.scrollHeight * scale)}px`;
      }
    };

    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [math, display]);

  if (!display) {
    return <span ref={ref as React.RefObject<HTMLSpanElement>} className="katex-inline" />;
  }

  return (
    <div className="my-6">
      <div className="flex items-center justify-center gap-4">
        <div ref={wrapRef} className="w-full overflow-hidden">
          <div ref={ref as React.RefObject<HTMLDivElement>} className="katex-display-block" />
        </div>
        {label && (
          <span className="text-sm text-[var(--text-dim)] font-mono shrink-0">({label})</span>
        )}
      </div>
    </div>
  );
}

/**
 * M — inline math (DESIGN-BRIEF §22). Use for any variable/expression that is
 * in math mode in the source .tex and appears inline in prose, table cells,
 * callouts, list items or captions — e.g. <M math="\alpha" />, <M math="K_t" />,
 * <M math="\mathbf{v}" />. Never approximate with plain-text/unicode (no "alpha",
 * no "α") — always render through KaTeX so it matches display equations.
 * input.i keywords/values stay in the mono code font (§18); this is only for
 * physical/mathematical symbols.
 */
export function M({ math }: { math: string }) {
  return <Equation math={math} display={false} />;
}
