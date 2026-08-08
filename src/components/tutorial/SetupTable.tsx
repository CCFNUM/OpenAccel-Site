import type { ReactNode } from 'react';

interface Row {
  label: ReactNode;
  value: ReactNode;
}

interface Group {
  heading: ReactNode;
  rows: Row[];
}

interface SetupTableProps {
  /** e.g. "Table 1" — simple per-case numbering (DESIGN-BRIEF §25.4). */
  label?: string;
  caption: ReactNode;
  groups: Group[];
}

const groupHeaderStyle = {
  color: 'var(--table-header-fg)',
  background: 'var(--table-header-bg)',
} as const;

/**
 * Renders the structured setup table found in every OpenAccel tutorial case.
 * Each group becomes its own <tbody> — valid HTML5, avoids tbody-in-tbody.
 *
 * Styling per DESIGN-BRIEF §24.1 / §25: colour-filled (slate) group-header
 * rows with white text, NO zebra, cell text in the body font (Source Serif 4;
 * callers mark input.i keywords as <code> and variables as KaTeX). The caption
 * sits ABOVE the table as a bold "Table N." label — never a row inside the
 * table (§25.4) — and the table ends with a bold booktabs-style bottom rule
 * with no empty leading/trailing rows (§25.5).
 */
export function SetupTable({ label, caption, groups }: SetupTableProps) {
  return (
    <figure className="my-6">
      <figcaption className="text-sm mb-2" style={{ color: 'var(--text-dim)' }}>
        {label && <strong style={{ color: 'var(--text)' }}>{label}.</strong>} {caption}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" style={{ borderBottom: '2px solid var(--text-dim)' }}>
          {groups.map((group, gi) => (
            <tbody key={`group-${gi}`}>
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
                  style={groupHeaderStyle}
                >
                  {group.heading}
                </td>
              </tr>
              {group.rows.map((row, ri) => {
                const lastRow = gi === groups.length - 1 && ri === group.rows.length - 1;
                return (
                  <tr key={`r-${ri}`} style={{ borderBottom: lastRow ? undefined : '1px solid var(--table-border)' }}>
                    <td className="px-4 py-2 text-[var(--text-dim)] font-medium align-top w-56 shrink-0">
                      {row.label}
                    </td>
                    <td className="px-4 py-2 text-[var(--text)] leading-relaxed align-top">
                      {row.value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </figure>
  );
}
