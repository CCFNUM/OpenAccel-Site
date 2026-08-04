/**
 * SourceBox — the manual's srcbox: points from a theory section into the
 * OpenAccel source tree. Slate (--src), quiet by design. See DESIGN-BRIEF.md §2b.
 */
interface SourceBoxProps {
  children: React.ReactNode;
}

export function SourceBox({ children }: SourceBoxProps) {
  return (
    <div
      className="my-6 rounded-lg p-4 text-sm leading-relaxed"
      style={{ border: '1px solid var(--src)', background: 'var(--src-bg)', color: 'var(--src-fg)' }}
    >
      <span className="font-bold" style={{ color: 'var(--src)' }}>Implementation.</span>{' '}
      {children}
    </div>
  );
}
