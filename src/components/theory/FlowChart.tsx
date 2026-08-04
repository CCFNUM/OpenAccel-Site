import { Caption } from '@/components/Caption';

/**
 * FlowChart — static, theme-aware "card-step" algorithm diagram.
 * DESIGN-BRIEF.md §23 (Style B). Renders the manual's TikZ fcstart/fcproc/fcdec
 * chains as a vertical stack of cards with directional arrows, and a labelled
 * orange feedback loop for the iterative return edge. Driven entirely by data
 * so every Theory-chapter algorithm renders consistently. STATIC — no
 * interactivity (per §23, that is a later polish pass).
 *
 * Layout: a CSS grid shared by the card column and the loop-rail column, one
 * grid row per step plus one row per connecting arrow (2n-1 rows total). The
 * loop rail spans by grid-row line number, so it aligns exactly with the
 * from/to cards regardless of each card's rendered height (titles/subtitles
 * vary in length) — no percentage/pixel math needed.
 */
export interface FlowStep {
  id: string;
  /** 'start' | 'end' — neutral; 'process' — cold accent; 'decision' — teal/flux accent */
  kind: 'start' | 'end' | 'process' | 'decision';
  title: string;
  subtitle?: string;
}

export interface FlowLoop {
  /** id of the step the feedback arrow leaves from (usually the decision node) */
  from: string;
  /** id of the step the feedback arrow returns to */
  to: string;
  /** label on the returning arrow, e.g. "no, p* := p" */
  label: string;
  /** label on the forward (non-looping) exit edge out of the `from` node, e.g. "yes" */
  exitLabel?: string;
}

interface FlowChartProps {
  label: string;
  caption: React.ReactNode;
  steps: FlowStep[];
  loop?: FlowLoop;
}

const KIND_STYLE: Record<FlowStep['kind'], { border: string; titleColor: string }> = {
  start:    { border: 'var(--hairline)', titleColor: 'var(--text)' },
  end:      { border: 'var(--hairline)', titleColor: 'var(--text)' },
  process:  { border: 'var(--cold)',     titleColor: 'var(--cold)' },
  decision: { border: 'var(--flux)',     titleColor: 'var(--flux)' },
};

function DownArrow() {
  return (
    <div className="flex justify-center py-0.5" aria-hidden>
      <svg width="14" height="18" viewBox="0 0 14 18">
        <line x1="7" y1="0" x2="7" y2="12" stroke="var(--hairline)" strokeWidth="1.5" />
        <polygon points="7,18 2,10 12,10" fill="var(--hairline)" />
      </svg>
    </div>
  );
}

export function FlowChart({ label, caption, steps, loop }: FlowChartProps) {
  // Grid row for step i (1-indexed CSS grid lines): steps sit on odd rows,
  // arrows on even rows, so step i (0-indexed) occupies grid row 2*i + 1.
  const rowOf = (idx: number) => 2 * idx + 1;
  const fromIdx = loop ? steps.findIndex(s => s.id === loop.from) : -1;
  const toIdx = loop ? steps.findIndex(s => s.id === loop.to) : -1;
  const totalRows = 2 * steps.length - 1;

  return (
    <figure className="my-6">
      <div className="rounded-md border overflow-x-auto p-6" style={{ borderColor: 'var(--code-border)', background: 'var(--surface-2)' }}>
        <div
          className="mx-auto"
          style={{
            display: 'grid',
            width: 'fit-content',
            gridTemplateColumns: loop ? '320px 70px' : '320px',
            gridTemplateRows: `repeat(${totalRows}, auto)`,
            columnGap: 24,
          }}
        >
          {steps.map((step, i) => {
            const s = KIND_STYLE[step.kind];
            return (
              <div key={step.id} style={{ gridColumn: 1, gridRow: rowOf(i) }}>
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ border: `1.5px solid ${s.border}`, background: 'var(--surface)', borderRadius: 12 }}
                >
                  <p className="text-sm font-semibold leading-snug" style={{ color: s.titleColor }}>{step.title}</p>
                  {step.subtitle && (
                    <p className="text-xs mt-1 leading-snug" style={{ color: 'var(--text-dim)' }}>{step.subtitle}</p>
                  )}
                </div>
              </div>
            );
          })}

          {steps.slice(0, -1).map((step, i) => (
            <div key={`arrow-${step.id}`} style={{ gridColumn: 1, gridRow: rowOf(i) + 1 }}>
              <DownArrow />
            </div>
          ))}

          {loop && fromIdx >= 0 && toIdx >= 0 && (
            <div
              className="relative"
              style={{ gridColumn: 2, gridRow: `${rowOf(toIdx)} / ${rowOf(fromIdx) + 1}` }}
              aria-hidden
            >
              {/* Vertical rail */}
              <div className="absolute top-0 bottom-0" style={{ left: 8, width: 2, background: 'var(--hot)', borderRadius: 1 }} />
              {/* Arrowhead pointing left into the "to" card */}
              <div className="absolute" style={{ left: -6, top: 0, transform: 'translateY(-50%)' }}>
                <svg width="16" height="12" viewBox="0 0 16 12"><polygon points="16,0 16,12 6,6" fill="var(--hot)" /></svg>
              </div>
              {/* Horizontal tick out of the "from" card, at the bottom of the rail */}
              <div className="absolute" style={{ left: -12, bottom: 0, width: 20, height: 2, background: 'var(--hot)' }} />
              {/* Loop condition label, vertical, alongside the rail */}
              <div
                className="absolute text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{
                  left: 16, top: '50%', transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'left center',
                  color: 'var(--hot)', background: 'var(--hot-pill-bg)', border: '1px solid var(--hot)',
                }}
              >
                {loop.label}
              </div>
            </div>
          )}
        </div>
      </div>
      <Caption label={label} className="mt-2">{caption}</Caption>
    </figure>
  );
}
