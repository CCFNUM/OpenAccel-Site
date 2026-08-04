/**
 * KeyBox — the manual's keybox: a titled "Key result" box for the headline
 * finding/equation of a section. Deep teal (--key), deliberately distinct
 * from --signal/--flux. See DESIGN-BRIEF.md §2a.
 */
interface KeyBoxProps {
  title?: string;
  children: React.ReactNode;
}

export function KeyBox({ title = 'Key result', children }: KeyBoxProps) {
  return (
    <div className="my-6 rounded-lg overflow-hidden" style={{ border: '1px solid var(--key-frame)' }}>
      <div className="px-4 py-2" style={{ background: 'var(--key)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--key-title-fg)' }}>{title}</p>
      </div>
      <div
        className="px-4 py-3 text-sm leading-relaxed"
        style={{ background: 'var(--key-bg)', color: 'var(--key-body-fg)' }}
      >
        {children}
      </div>
    </div>
  );
}
