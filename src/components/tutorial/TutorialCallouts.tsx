import type { ReactNode } from 'react';

/** Blue "Discussion" callout — corresponds to \takeaway in LaTeX */
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-[var(--cold)] bg-[var(--callout-cold-bg)] p-5">
      <p className="text-xs font-mono uppercase tracking-widest text-[var(--cold)] mb-2">Discussion</p>
      <div className="text-sm text-[var(--text)] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

/** Orange "Acceptance Criterion" callout — corresponds to \expected in LaTeX */
export function AcceptanceCriterion({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-[var(--warm)] bg-[var(--callout-warm-bg)] p-5">
      <p className="text-xs font-mono uppercase tracking-widest text-[var(--warm)] mb-2">Acceptance Criterion</p>
      <div className="text-sm text-[var(--text)] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

/** Grey info block for case metadata */
export function CaseInfoBlock({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <div className="my-6 rounded-lg border border-[var(--hairline)] overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-stripe)]'}>
              <td className="px-4 py-2.5 font-semibold text-[var(--text)] w-44 shrink-0">{r.label}</td>
              <td className="px-4 py-2.5 text-[var(--text-dim)] font-mono text-xs">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
