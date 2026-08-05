import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import katex from 'katex';

const MAROON = '#7A003C';
const MAROON_BG_LIGHT = 'rgba(122,0,60,0.07)';

type Kind = 'start' | 'end' | 'process' | 'decision';
interface Step { id: string; kind: Kind; title: string; subtitle?: string; }
interface Loop { from: string; to: string; label?: string; exitLabel?: string; }
interface FlowChartProps { steps: Step[]; loop?: Loop; label?: string; caption?: ReactNode; }

function renderInto(host: HTMLElement, text: string) {
  host.innerHTML = '';
  for (const part of text.split(/(\$[^$]*\$)/g)) {
    if (part.startsWith('$') && part.endsWith('$') && part.length > 1) {
      const s = document.createElement('span');
      katex.render(part.slice(1, -1), s, { throwOnError: false, displayMode: false });
      host.appendChild(s);
    } else if (part) host.appendChild(document.createTextNode(part));
  }
}

function Arrow() {
  return (
    <div className="flex justify-center" style={{ height: 26 }}>
      <svg width="16" height="26" style={{ overflow: 'visible' }}>
        <line x1="8" y1="0" x2="8" y2="20" stroke="var(--text-dim)" strokeWidth="1.75" />
        <path d="M3 15 L8 22 L13 15" fill="none" stroke="var(--text-dim)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function FlowChart({ steps, loop, label, caption }: FlowChartProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const boxRef = useRef<HTMLDivElement>(null);
  const [loopPath, setLoopPath] = useState<string>('');
  const [loopLabelPos, setLoopLabelPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    rootRef.current?.querySelectorAll<HTMLElement>('[data-tex]').forEach((el) => {
      renderInto(el, el.getAttribute('data-tex') || '');
    });
  }, [steps, loopLabelPos]);

  useLayoutEffect(() => {
    if (!loop || !boxRef.current) return;
    const compute = () => {
      const from = nodeRefs.current[loop.from];
      const to = nodeRefs.current[loop.to];
      const box = boxRef.current;
      if (!from || !to || !box) return;
      const b = box.getBoundingClientRect();
      const f = from.getBoundingClientRect();
      const t = to.getBoundingClientRect();
      const fromY = f.top + f.height / 2 - b.top;
      const fromX = f.right - b.left;
      const toY = t.top + t.height / 2 - b.top;
      const toX = t.right - b.left;
      const railX = Math.max(fromX, toX) + 46;
      setLoopPath(`M ${fromX} ${fromY} H ${railX} V ${toY} H ${toX}`);
      setLoopLabelPos({ x: railX + 6, y: (fromY + toY) / 2 });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(boxRef.current);
    window.addEventListener('resize', compute);
    return () => { ro.disconnect(); window.removeEventListener('resize', compute); };
  }, [loop, steps]);

  return (
    <figure className="my-8" ref={rootRef}>
      <div className="relative mx-auto" ref={boxRef} style={{ width: 'fit-content', paddingRight: loop ? 100 : 0 }}>
        {loop && (
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <marker id="fcaM" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M2 2 L10 6 L2 10" fill="none" stroke={MAROON} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            {loopPath && <path d={loopPath} fill="none" stroke={MAROON} strokeWidth="1.75" markerEnd="url(#fcaM)" />}
          </svg>
        )}
        {loop && loopLabelPos && (
          <div className="absolute text-[11px] italic pointer-events-none" data-tex={loop.label}
            style={{ left: loopLabelPos.x, top: loopLabelPos.y, transform: 'translateY(-50%)', color: MAROON, whiteSpace: 'nowrap' }} />
        )}

        <div className="flex flex-col items-center">
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            const showExit = loop && s.id === loop.from;
            return (
              <div key={s.id} className="flex flex-col items-center">
                <div ref={(el) => { nodeRefs.current[s.id] = el; }}>
                  <Node step={s} />
                </div>
                {!last && (
                  <div className="relative">
                    <Arrow />
                    {showExit && loop?.exitLabel && (
                      <span className="absolute text-[11px] italic" style={{ left: 14, top: 4, color: 'var(--text-dim)' }}>{loop.exitLabel}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {(label || caption) && (
        <figcaption className="mt-4 text-sm text-center" style={{ color: 'var(--text-dim)' }}>
          {label && <span className="font-semibold" style={{ color: 'var(--text)' }}>{label}. </span>}{caption}
        </figcaption>
      )}
    </figure>
  );
}

function Node({ step }: { step: Step }) {
  if (step.kind === 'decision') {
    const W = 240, H = 108;
    return (
      <div className="my-1 relative flex items-center justify-center" style={{ width: W, height: H }}>
        <svg width={W} height={H} className="absolute inset-0" style={{ overflow: 'visible' }}>
          <polygon points={`${W/2},2 ${W-2},${H/2} ${W/2},${H-2} 2,${H/2}`}
            fill={MAROON_BG_LIGHT} stroke={MAROON} strokeWidth="1.75" />
        </svg>
        <div className="relative text-center px-2" style={{ maxWidth: W - 70 }}>
          <div className="text-[13px] font-medium" style={{ color: MAROON }} data-tex={step.title} />
          {step.subtitle && <div className="text-[10px] mt-0.5 leading-tight" style={{ color: MAROON, opacity: 0.85 }} data-tex={step.subtitle} />}
        </div>
      </div>
    );
  }
  const isEnd = step.kind === 'start' || step.kind === 'end';
  return (
    <div className="text-center" style={{
      width: 300, padding: '10px 20px',
      borderRadius: isEnd ? 999 : 8,
      background: isEnd ? 'var(--key-bg)' : 'var(--callout-cold-bg)',
      border: `1.5px solid ${isEnd ? 'var(--key-frame)' : 'var(--cold)'}`,
    }}>
      <div className="text-[14px] font-semibold" style={{ color: isEnd ? 'var(--key-body-fg)' : 'var(--cold)' }} data-tex={step.title} />
      {step.subtitle && <div className="text-[12px] mt-0.5" style={{ color: isEnd ? 'var(--key-body-fg)' : 'var(--text-dim)', opacity: isEnd ? 0.85 : 1 }} data-tex={step.subtitle} />}
    </div>
  );
}
