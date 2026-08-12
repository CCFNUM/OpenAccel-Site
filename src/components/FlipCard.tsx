import type { ReactNode } from 'react';

/**
 * FlipCard — hover/focus flip for funder & institution cards.
 *
 * Implemented as a CROSSFADE + rotate between two absolutely-stacked faces
 * (NOT a true 3D backface flip): the front rotates/fades out while the back
 * rotates/fades in. This avoids `transform-style: preserve-3d` and
 * `backface-visibility`, which get flattened when an ancestor clips overflow
 * (as the homepage sections do) — the failure mode where the front bleeds
 * through mirror-reversed. This version cannot bleed through.
 *
 * Front + back are filled with a light tint of the card's brand colour; the
 * border carries the full brand colour with a soft glow that intensifies on
 * hover. Token-driven per brand (no hardcoded hex), keyboard-focusable,
 * reduced-motion safe (instant swap, back stays reachable), AA in both themes.
 */

const STYLE_ID = 'flip-card-styles';
const CSS = `
.flip-card{ position: relative; outline: none; perspective: 1200px; }
.flip-card__face{
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  border: 1.5px solid var(--fc-brand, var(--hairline));
  background: var(--fc-fill, var(--surface));
  box-shadow: 0 6px 16px rgba(0,0,0,0.28),
              0 0 0 1px color-mix(in srgb, var(--fc-brand, var(--hairline)) 40%, transparent),
              0 0 16px color-mix(in srgb, var(--fc-brand, var(--hairline)) 24%, transparent);
  transition: opacity .45s ease, transform .5s cubic-bezier(0.34, 1.1, 0.4, 1), box-shadow .45s ease;
  backface-visibility: visible;
}
/* Front visible by default; back hidden and pre-rotated */
.flip-card__front{ opacity: 1; transform: rotateY(0deg); z-index: 2; }
.flip-card__back{  opacity: 0; transform: rotateY(-90deg); z-index: 1; pointer-events: none; }
/* On flip: front rotates/fades away, back rotates/fades in */
.flip-card:hover .flip-card__front,
.flip-card:focus .flip-card__front,
.flip-card:focus-within .flip-card__front{ opacity: 0; transform: rotateY(90deg); z-index: 1; pointer-events: none; }
.flip-card:hover .flip-card__back,
.flip-card:focus .flip-card__back,
.flip-card:focus-within .flip-card__back{ opacity: 1; transform: rotateY(0deg); z-index: 2; pointer-events: auto; }
/* Glow lifts on hover */
.flip-card:hover .flip-card__face,
.flip-card:focus .flip-card__face,
.flip-card:focus-within .flip-card__face{
  box-shadow: 0 18px 40px rgba(0,0,0,0.45),
              0 0 0 1px color-mix(in srgb, var(--fc-brand, var(--hairline)) 60%, transparent),
              0 0 30px color-mix(in srgb, var(--fc-brand, var(--hairline)) 50%, transparent);
}
@media (prefers-reduced-motion: reduce){
  .flip-card__face{ transition: opacity .01s linear; transform: none !important; }
  .flip-card__back{ opacity: 0; }
  .flip-card:hover .flip-card__front,
  .flip-card:focus .flip-card__front,
  .flip-card:focus-within .flip-card__front{ opacity: 0; }
  .flip-card:hover .flip-card__back,
  .flip-card:focus .flip-card__back,
  .flip-card:focus-within .flip-card__back{ opacity: 1; }
}
html[data-reduce-motion="true"] .flip-card__face{ transition: opacity .01s linear; transform: none !important; }
html[data-reduce-motion="true"] .flip-card__back{ opacity: 0; }
html[data-reduce-motion="true"] .flip-card:hover .flip-card__front,
html[data-reduce-motion="true"] .flip-card:focus .flip-card__front,
html[data-reduce-motion="true"] .flip-card:focus-within .flip-card__front{ opacity: 0; }
html[data-reduce-motion="true"] .flip-card:hover .flip-card__back,
html[data-reduce-motion="true"] .flip-card:focus .flip-card__back,
html[data-reduce-motion="true"] .flip-card:focus-within .flip-card__back{ opacity: 1; }
`;

function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}
ensureStyles();

type Brand = 'aub' | 'hslu' | 'pasc' | 'snsf';
const BRAND: Record<Brand, { color: string; fill: string }> = {
  aub:  { color: 'var(--brand-aub)',  fill: 'var(--brand-aub-fill)'  },
  hslu: { color: 'var(--brand-hslu)', fill: 'var(--brand-hslu-fill)' },
  pasc: { color: 'var(--brand-pasc)', fill: 'var(--brand-pasc-fill)' },
  snsf: { color: 'var(--cold)',       fill: 'var(--brand-snsf-fill)' },
};

export interface FlipCardProps {
  brand: Brand;
  logo: string;
  alt: string;
  name: string;
  href: string;
  meta?: ReactNode;
  detail?: ReactNode;
  blurb: ReactNode;
}

export function FlipCard({ brand, logo, alt, name, href, meta, detail, blurb }: FlipCardProps) {
  const b = BRAND[brand];
  const vars = { '--fc-brand': b.color, '--fc-fill': b.fill } as React.CSSProperties;
  return (
    <div className="flip-card group h-[288px] w-full" tabIndex={0} aria-label={name} style={vars}>
      {/* Front */}
      <div className="flip-card__face flip-card__front p-6 flex flex-col items-start gap-4">
        <div className="rounded-lg bg-white border border-[var(--hairline)] shrink-0 p-2 inline-flex">
          <img src={logo} alt={alt} className="h-14 w-auto object-contain" />
        </div>
        <div className="font-display font-semibold text-[var(--text)] leading-snug">{name}</div>
        <div className="mt-auto text-[10px] font-mono uppercase tracking-[0.14em]" style={{ color: b.color }}>Hover to flip</div>
      </div>
      {/* Back */}
      <div className="flip-card__face flip-card__back p-6 flex flex-col gap-2.5 overflow-hidden">
        {meta && <div className="text-xs font-mono font-semibold" style={{ color: b.color }}>{meta}</div>}
        {detail && <div className="text-[13px] text-[var(--text-dim)] leading-relaxed italic">{detail}</div>}
        <p className="text-[13px] text-[var(--text-dim)] leading-relaxed">{blurb}</p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity underline underline-offset-4"
          style={{ color: b.color, textDecorationColor: b.color }}
        >
          {name} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
