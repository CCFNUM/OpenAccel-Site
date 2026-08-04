import type { LucideIcon } from 'lucide-react';

/**
 * DocCallout — generic labelled callout box. Colour, icon, label and meaning
 * are all supplied by the caller: each manual defines its own box vocabulary
 * (see CLAUDE.md "How to Read This Guide" pages + per-manual box vocabularies),
 * so nothing here is hardcoded to one manual's labels.
 */
interface DocCalloutProps {
  icon: LucideIcon;
  label: string;
  /** CSS var, e.g. 'var(--warm)' */
  accent: string;
  /** CSS var, e.g. 'var(--callout-warm-bg)' */
  bg: string;
  children: React.ReactNode;
}

export function DocCallout({ icon: Icon, label, accent, bg, children }: DocCalloutProps) {
  return (
    <div className="my-6 rounded-md p-4" style={{ border: `1px solid ${accent}`, background: bg }}>
      <p className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: accent }}>
        <Icon size={14} /> {label}
      </p>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{children}</div>
    </div>
  );
}
