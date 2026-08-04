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
 */
export function Equation({ math, display = true, label }: EquationProps) {
  const ref = useRef<HTMLSpanElement | HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    katex.render(math, ref.current, {
      displayMode: display,
      throwOnError: false,
      trust: true,
      strict: false,
    });
  }, [math, display]);

  if (!display) {
    return <span ref={ref as React.RefObject<HTMLSpanElement>} className="katex-inline" />;
  }

  return (
    <div className="my-6 overflow-x-auto">
      <div className="flex items-center justify-center gap-4">
        <div ref={ref as React.RefObject<HTMLDivElement>} className="katex-display-block" />
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
