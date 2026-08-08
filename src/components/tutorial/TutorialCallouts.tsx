import { Fragment, type ReactNode } from 'react';

/** Blue "Discussion" callout — corresponds to \takeaway in LaTeX */
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-[var(--cold)] bg-[var(--callout-cold-bg)] p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--cold)] mb-2">Discussion</p>
      <div className="text-sm text-[var(--text)] leading-relaxed space-y-2">{children}</div>
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
 * Case-information box (the "Case ID / Reference / Solver mode …" panel that
 * opens each case). DESIGN-BRIEF §24.2: AUB-maroon (#7A003C) border + faint
 * maroon-tint fill, both themes; labels bold, values in the body font, with
 * input-file paths in mono (<code>) and math in KaTeX — all supplied by the
 * caller as ReactNode values. No zebra striping.
 */
export function CaseInfoBlock({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <div
      className="my-6 rounded p-5"
      style={{ border: '1px solid var(--caseinfo-border)', background: 'var(--caseinfo-bg)' }}
    >
      <dl className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-5 gap-y-2.5 text-sm">
        {rows.map((r, i) => (
          <Fragment key={i}>
            <dt className="font-semibold text-[var(--text)]">{r.label}</dt>
            <dd className="text-[var(--text-dim)] leading-relaxed">{r.value}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}
