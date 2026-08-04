/**
 * Caption — bold numbered label + period, then caption text, matching the
 * manuals' \caption styling (labelfont=bf, labelsep=period). See
 * DESIGN-BRIEF.md §15. Figures/code: place BELOW. Tables: place ABOVE.
 */
interface CaptionProps {
  /** e.g. "Figure 1.1", "Table 4.2", "Listing 2.3" */
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function Caption({ label, children, className }: CaptionProps) {
  return (
    <figcaption className={`text-sm ${className ?? ''}`} style={{ color: 'var(--text-dim)' }}>
      <strong style={{ color: 'var(--text)' }}>{label}.</strong> {children}
    </figcaption>
  );
}
