import { Link } from 'wouter';
import type { ReactNode, MouseEvent, CSSProperties } from 'react';
/**
 * SpotlightCard — restrained cursor-follow spotlight for feature cards.
 * A soft radial glow in the card's own physics-accent token tracks the cursor;
 * on hover the card lifts a few px, the accent border brightens, and a thin
 * accent line wipes across the bottom. Dependency-free (no motion library),
 * token-driven (no hardcoded colours), theme-aware, disabled under
 * prefers-reduced-motion. Render mode: `external` href -> new-tab <a>;
 * internal `href` -> wouter <Link>; neither -> plain container.
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
html[data-reduce-motion="true"] .spotlight-card{transition:border-color .2s ease;}
html[data-reduce-motion="true"] .spotlight-card:hover{transform:none;}
html[data-reduce-motion="true"] .spotlight-card__glow{display:none;}
html[data-reduce-motion="true"] .spotlight-card__wipe{transition:none;}

/* Opt-in: magnetic 3D tilt (Physics Capabilities grid) */
.spotlight-card--tilt{
  transform-style:preserve-3d;
  transition:transform .18s ease, border-color .25s ease, background-color .25s ease, opacity .3s ease;
}
.spotlight-card--tilt:hover{
  transform:perspective(900px) rotateX(var(--tiltX,0deg)) rotateY(var(--tiltY,0deg)) translateZ(6px);
}
/* Opt-in: focus-dim siblings (dull, not dark) */
.spotlight-card--dim{
  opacity:.5;
  transform:scale(.97);
}
@media (prefers-reduced-motion: reduce){
  .spotlight-card--tilt:hover{transform:none;}
}
html[data-reduce-motion="true"] .spotlight-card--tilt:hover{transform:none;}
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
  /** Route (internal wouter) or URL (with `external`) — makes the whole card a link. */
  href?: string;
  /** When true with `href`, opens in a new tab via a plain anchor. */
  external?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Opt-in: magnetic 3D tilt toward the cursor (Physics Capabilities grid). */
  tilt?: boolean;
  /** Opt-in: when true, this card recedes (dulls) while a sibling is hovered. */
  dimmed?: boolean;
  /** Fires on hover enter/leave so a parent grid can track the active card. */
  onHoverChange?: (hovering: boolean) => void;
}
export function SpotlightCard({ accent, href, external, className = '', style, children, tilt = false, dimmed = false, onHoverChange }: SpotlightCardProps) {
  const TILT_MAX = 6; // degrees
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    if (tilt) {
      el.style.setProperty('--tiltX', `${(0.5 - py) * 2 * TILT_MAX}deg`);
      el.style.setProperty('--tiltY', `${(px - 0.5) * 2 * TILT_MAX}deg`);
    }
  };
  const onEnter = () => onHoverChange?.(true);
  const onLeave = (e: MouseEvent<HTMLElement>) => {
    onHoverChange?.(false);
    if (tilt) {
      e.currentTarget.style.setProperty('--tiltX', '0deg');
      e.currentTarget.style.setProperty('--tiltY', '0deg');
    }
  };
  const mergedStyle = { '--card-accent': accent, ...(style || {}) } as CSSProperties;
  const cls = `spotlight-card ${tilt ? 'spotlight-card--tilt ' : ''}${dimmed ? 'spotlight-card--dim ' : ''}${className}`;
  const inner = (
    <>
      <span aria-hidden="true" className="spotlight-card__glow" />
      {children}
      <span aria-hidden="true" className="spotlight-card__wipe" />
    </>
  );
  if (external && href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} style={mergedStyle} onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls} style={mergedStyle} onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={cls} style={mergedStyle} onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {inner}
    </div>
  );
}
