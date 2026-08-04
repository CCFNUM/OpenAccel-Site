import type { ReactNode } from 'react';

interface Row {
  label: string;
  value: ReactNode;
}

interface Group {
  heading: string;
  rows: Row[];
}

interface SetupTableProps {
  caption: string;
  groups: Group[];
}

/**
 * Renders the structured setup table found in every OpenAccel tutorial case.
 * Each group becomes its own <tbody> — valid HTML5, avoids tbody-in-tbody.
 */
export function SetupTable({ caption, groups }: SetupTableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-[var(--hairline)]">
      <table className="w-full text-sm border-collapse">
        <caption className="text-left text-xs font-mono text-[var(--text-dim)] px-4 py-2 border-b border-[var(--hairline)] bg-[var(--surface-2)] caption-top">
          {caption}
        </caption>
        {groups.map((group, gi) => (
          <tbody key={`group-${gi}`}>
            <tr>
              <td
                colSpan={2}
                className="px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-[var(--cold)] bg-[var(--surface-2)] border-t border-[var(--hairline)]"
              >
                {group.heading}
              </td>
            </tr>
            {group.rows.map((row, ri) => (
              <tr
                key={`r-${ri}`}
                className={ri % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-stripe)]'}
              >
                <td className="px-4 py-2 text-[var(--text-dim)] font-medium align-top w-48 shrink-0">
                  {row.label}
                </td>
                <td className="px-4 py-2 text-[var(--text)] font-mono text-xs leading-relaxed">
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
