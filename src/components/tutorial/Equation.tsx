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
 * Wide display equations are shrunk to fit using FONT-SIZE (not transform:scale),
 * so the browser reflows the box naturally and nothing is ever clipped or
 * scrolled. Re-measured on window resize.
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
      // Reset to full size before measuring natural width.
      el.style.fontSize = '';
      const inner = (el.querySelector('.katex') as HTMLElement | null) ?? el;
      const natural = inner.getBoundingClientRect().width;
      const available = wrap.clientWidth;
      if (available > 0 && natural > available) {
        // Shrink via font-size: the whole equation (incl. height) reflows to
        // fit. 0.98 safety margin; floor at 0.4 of base so it stays legible.
        const ratio = Math.max((available / natural) * 0.88, 0.4);
        // KaTeX display base font-size is ~1.21em of parent; scale from that.
        el.style.fontSize = `${ratio * 100}%`;
      }
    };

    // Fit now, and again after fonts settle (KaTeX metrics shift on font load).
    fit();
    const t = setTimeout(fit, 150);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit).catch(() => {});
    }
    window.addEventListener('resize', fit);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', fit);
    };
  }, [math, display]);

  if (!display) {
    return <span ref={ref as React.RefObject<HTMLSpanElement>} className="katex-inline" />;
  }

  return (
    <div className="my-6">
      <div className="flex items-center justify-center gap-4">
        <div ref={wrapRef} className="w-full">
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
 * callouts, list items or captions.
 */
export function M({ math }: { math: string }) {
  return <Equation math={math} display={false} />;
}
