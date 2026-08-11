import { Link } from 'wouter';
import type { ReactNode, MouseEvent, CSSProperties } from 'react';

/**
 * SpotlightCard — restrained cursor-follow spotlight for feature cards.
 * A soft radial glow in the card's own physics-accent token tracks the cursor;
 * on hover the card lifts a few ph, the accent border brightens, and a thin
 * accent line wipes across the bottom. Dependency-free (no motion library),
 * token-driven (no hardcoded colours), theme-aware, and fully disabled under
 * prefers-reduced-motion. Pass `href` for a whole-card wouter link, or omit it
 * to render a plain container whose own inner links stay clickable.
 */

const STYLE_ID = 'spotlight-card-styles';
const CSS = `
.spotlight-card{
  position:relative;
  overflow:hidden;
  border:1px solid var(--hairline);
  transform:translateZ(0);
  transition:transform .25s ease, border-color .25s ease, background-color .25s ease;
}
.spotlight-card:hover{
  transform:translateY(-3px);
  border-color:var(--card-accent, var(--hairline));
}
.spotlight-card > :not(.spotlight-card__glow):not(.spotlight-card__wipe){
  position:relative;
  z-index:1;
}
.spotlight-card__glow{
  position:absolute;
  inset:0;
  z-index:0;
  pointer-events:none;
  opacity:0;
  transition:opacity .3s ease;
  background:radial-gradient(300px circle at var(--mx,50%) var(--my,50%),
    color-mix(in srgb, var(--card-accent, var(--cold)) 22%, transparent),
    transparent 60%);
}
.spotlight-card:hover .spotlight-card__glow{opacity:1;}
.spotlight-card__wipe{
  position:absolute;
  left:0;
  bottom:0;
  height:2px;
  width:0;
  z-index:1;
  pointer-events:none;
  background:linear-gradient(to right, var(--card-accent, var(--cold)), transparent);
  transition:width .5s ease;
}
.spotlight-card:hover .spotlight-card__wipe{width:100%;}
@media (prefers-reduced-motion: reduce){
  .spotlight-card{transition:border-color .2s ease;}
  .spotlight-card:hover{transform:none;}
  .spotlight-card__glow{display:none;}
  .spotlight-card__wipe{transition:none;}
}
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

interface SpotlightCardProps {
  /** Physics-accent token, e.g. 'var(--cold)'. Drives glow, border, wipe. */
  accent: string;
  /** Optional wouter route — makes the whole card a link. Omit for a container. */
  href?: string;
  className?: string;
  children: ReactNode;
}

export function SpotlightCard({ accent, href, className = '', children }: SpotlightCardProps) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const style = { '--card-accent': accent } as CSSProperties;
  const cls = `spotlight-card ${className}`;

  const inner = (
    <>
      <span aria-hidden="true" className="spotlight-card__glow" />
      {children}
      <span aria-hidden="true" className="spotlight-card__wipe" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} style={style} onMouseMove={onMove}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={cls} style={style} onMouseMove={onMove}>
      {inner}
    </div>
  );
}
