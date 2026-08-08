import type { ReactNode } from 'react';

const thStyle = {
  color: 'var(--table-header-fg)',
  background: 'var(--table-header-bg)',
} as const;

interface DataTableProps {
  /** e.g. "Table 1" — simple per-case numbering (DESIGN-BRIEF §25.4). */
  label?: string;
  /** Caption text, rendered ABOVE the table (never as a row inside it). */
  caption?: ReactNode;
  headers: ReactNode[];
  rows: ReactNode[][];
  /**
   * Row indices (0-based) that get a bold booktabs-style rule drawn ABOVE
   * them — e.g. a "Total" summary row. The table always ends with a bold
   * bottom rule, so a summary row placed last is automatically ruled both
   * above and below (§25.5).
   */
  ruleBefore?: number[];
}

/**
 * DataTable — the shared results/data table for the V&V tutorials
 * (DESIGN-BRIEF §24.1 / §25.5 / §25.7). Slate colour-filled header row with
 * white text, NO zebra striping, body-font cells (callers mark input.i
 * keywords as <code> and variables as KaTeX), a bold booktabs-style bottom
 * rule, and the caption ABOVE as a bold "Table N." label — never a table row.
 */
export function DataTable({ label, caption, headers, rows, ruleBefore = [] }: DataTableProps) {
  const strong = '2px solid var(--text-dim)';
  const thin = '1px solid var(--table-border)';
  return (
    <figure className="my-6">
      {(label || caption) && (
        <figcaption className="text-sm mb-2" style={{ color: 'var(--text-dim)' }}>
          {label && <strong style={{ color: 'var(--text)' }}>{label}.</strong>} {caption}
        </figcaption>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" style={{ borderBottom: strong }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-2 text-left font-semibold" style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, ri) => (
              <tr
                key={ri}
                style={{
                  borderBottom: ri === rows.length - 1 ? undefined : thin,
                  borderTop: ruleBefore.includes(ri) ? strong : undefined,
                }}
              >
                {cells.map((c, ci) => (
                  <td key={ci} className="px-4 py-2 align-top" style={{ color: ci === 0 ? 'var(--text-dim)' : 'var(--text)' }}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
