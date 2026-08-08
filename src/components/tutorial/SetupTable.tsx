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
  caption: string;
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
 * Styling per DESIGN-BRIEF §24.1 / §18: colour-filled (slate) group-header
 * rows with white text, NO zebra striping on body rows, cell text in the body
 * font (Source Serif 4) — callers mark input.i keywords/values as <code> for
 * the mono font, and physical/mathematical symbols render via KaTeX.
 */
export function SetupTable({ caption, groups }: SetupTableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-[var(--hairline)]">
      <table className="w-full text-sm border-collapse">
        <caption className="text-left text-xs text-[var(--text-dim)] px-4 py-2 border-b border-[var(--hairline)] bg-[var(--surface-2)] caption-top">
          {caption}
        </caption>
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
            {group.rows.map((row, ri) => (
              <tr key={`r-${ri}`} style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td className="px-4 py-2 text-[var(--text-dim)] font-medium align-top w-56 shrink-0">
                  {row.label}
                </td>
                <td className="px-4 py-2 text-[var(--text)] leading-relaxed align-top">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
