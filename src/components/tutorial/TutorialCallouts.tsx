import { Fragment, type ReactNode } from 'react';
import { Info } from 'lucide-react';

/** Blue "Discussion" callout — corresponds to \takeaway in LaTeX. */
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-[var(--cold)] bg-[var(--callout-cold-bg)] p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--cold)] mb-2">Discussion</p>
      <div className="text-sm text-[var(--text)] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

/**
 * Note callout — the User Guide's neutral GREY note style (DESIGN-BRIEF §3 /
 * §25.6). Distinct from the blue Discussion box: use it for modelling
 * assumptions, caveats and asides, NOT as a second Discussion.
 */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg p-5" style={{ border: '1px solid var(--text-dim)', background: 'var(--dim-pill-bg)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>
        <Info size={13} /> Note
      </p>
      <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-dim)' }}>{children}</div>
    </div>
  );
}

/**
 * Acceptance-criteria box — corresponds to \expected in LaTeX. Uses the Theory
 * Manual's TEAL key-result colour (DESIGN-BRIEF §24.3): teal border + faint
 * teal fill, both themes. Distinct from the maroon case-info box.
 */
export function AcceptanceCriterion({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg p-5" style={{ border: '1px solid var(--key-frame)', background: 'var(--key-bg)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--key)' }}>
        Acceptance criterion
      </p>
      <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--key-body-fg)' }}>{children}</div>
    </div>
  );
}

/**
 * Case-information box (the panel that opens each case). AUB-maroon border +
 * faint maroon-tint fill, both themes (DESIGN-BRIEF §24.2); COMPACT dense
 * label/value layout matching the V&V manual (§25.1). Bold labels, body-font
 * values (input-file paths as <code>, math as KaTeX — supplied by the caller).
 * Any "Input file" row is dropped globally (§25.2).
 */
export function CaseInfoBlock({ rows }: { rows: { label: ReactNode; value: ReactNode }[] }) {
  const visible = rows.filter(r => r.label !== 'Input file' && r.label !== 'Input File');
  return (
    <div
      className="my-6 rounded px-4 py-3"
      style={{ border: '1px solid var(--caseinfo-border)', background: 'var(--caseinfo-bg)' }}
    >
      <dl className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-4 gap-y-1 text-sm leading-snug">
        {visible.map((r, i) => (
          <Fragment key={i}>
            <dt className="font-semibold text-[var(--text)]">{r.label}</dt>
            <dd className="text-[var(--text-dim)]">{r.value}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}
