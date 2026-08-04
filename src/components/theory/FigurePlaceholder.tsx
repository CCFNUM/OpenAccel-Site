import { ImageOff } from 'lucide-react';
import { Caption } from '@/components/Caption';

/**
 * FigurePlaceholder — labelled placeholder for a manual figure whose source
 * image has not been supplied yet. Keeps the correct caption/number in place
 * (per DESIGN-BRIEF §15) without inventing an image. Swap for a real
 * <img>/TutorialFigure once the PNG is provided — do not invent content here.
 */
interface FigurePlaceholderProps {
  label: string;
  caption: React.ReactNode;
  /** Short description of what the missing figure shows, e.g. "mesh dual-cell schematic" */
  description: string;
}

export function FigurePlaceholder({ label, caption, description }: FigurePlaceholderProps) {
  return (
    <figure className="my-6">
      <div
        className="rounded-md border border-dashed flex flex-col items-center justify-center gap-2 py-14 px-6 text-center"
        style={{ borderColor: 'var(--hairline)', background: 'var(--surface-2)' }}
      >
        <ImageOff size={28} style={{ color: 'var(--text-dim)' }} />
        <p className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--warm)' }}>
          Figure not yet supplied
        </p>
        <p className="text-sm max-w-md" style={{ color: 'var(--text-dim)' }}>{description}</p>
      </div>
      <Caption label={label} className="mt-2">{caption}</Caption>
    </figure>
  );
}
