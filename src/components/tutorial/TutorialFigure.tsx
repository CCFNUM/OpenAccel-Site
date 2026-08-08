/** LaTeX \includegraphics trim, in cm, in source order: [left, bottom, right, top]. */
export type Trim = [left: number, bottom: number, right: number, top: number];
/** Natural size of the source figure, in cm: [width, height]. */
export type TrimBase = [widthCm: number, heightCm: number];

interface CropProps {
  /** LaTeX trim=LEFT BOTTOM RIGHT TOP (cm). Omit for no crop (full image). */
  trim?: Trim;
  /** Source figure size in cm (from the PDF page size). Required with `trim`. */
  trimBase?: TrimBase;
}

interface FigureProps extends CropProps {
  src: string;
  alt: string;
  caption: React.ReactNode;
  /** e.g. "Figure 1" — simple per-case numbering (DESIGN-BRIEF §25.4). */
  label?: string;
  /** narrow | normal | wide — controls max-width */
  width?: 'narrow' | 'normal' | 'wide' | 'full';
}

interface SubfigureProps extends CropProps {
  src: string;
  alt: string;
  subcaption: React.ReactNode;
}

/**
 * CroppedImage — reproduces a LaTeX \includegraphics[trim=…, clip] crop on the
 * web (DESIGN-BRIEF §24.4). The trim (cm from each side) is converted to a
 * fraction of the source figure's width/height and the equivalent region is
 * shown via an overflow:hidden viewport with the image scaled up and offset,
 * so the framing matches the manual. Without a trim it renders the full image.
 */
function CroppedImage({ src, alt, trim, trimBase }: { src: string; alt: string } & CropProps) {
  if (!trim || !trimBase) {
    return <img src={src} alt={alt} className="w-full h-auto object-contain" loading="lazy" />;
  }
  const [l, b, r, t] = trim;
  const [W, H] = trimBase;
  const fL = l / W, fR = r / W, fT = t / H, fB = b / H;
  const cropW = Math.max(1e-3, 1 - fL - fR);
  const cropH = Math.max(1e-3, 1 - fT - fB);
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${cropW * W} / ${cropH * H}`,
        overflow: 'hidden',
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          position: 'absolute',
          top: `${-(fT / cropH) * 100}%`,
          left: `${-(fL / cropW) * 100}%`,
          width: `${100 / cropW}%`,
          height: 'auto',
          maxWidth: 'none', // override the global img{max-width:100%} reset
        }}
      />
    </div>
  );
}

/** Bold "Figure N." label + caption text, below the figure (§25.4). */
function FigCaption({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <figcaption className="mt-2 text-sm text-[var(--text-dim)] text-center leading-relaxed px-2">
      {label && <strong style={{ color: 'var(--text)' }}>{label}.</strong>} {children}
    </figcaption>
  );
}

/**
 * Sub-caption for a panel of a multi-panel figure — prefixed with the LaTeX
 * \subcaption letter "(a)", "(b)", "(c)" … (DESIGN-BRIEF §27.3). The main
 * "Figure N." caption sits below via FigCaption.
 */
function SubCaption({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <p className="mt-1 text-xs text-[var(--text-dim)] text-center italic">
      <span className="not-italic font-medium" style={{ color: 'var(--text)' }}>
        ({String.fromCharCode(97 + index)})
      </span>{' '}
      {children}
    </p>
  );
}

/**
 * Single figure. Figures blend into the page — no border, no background panel,
 * no click-to-zoom / lightbox (DESIGN-BRIEF §25.3). Caption below, "Figure N."
 */
export function TutorialFigure({ src, alt, caption, label, width = 'normal', trim, trimBase }: FigureProps) {
  const maxW = { narrow: 'max-w-md', normal: 'max-w-2xl', wide: 'max-w-3xl', full: 'max-w-full' }[width];
  return (
    <figure className={`my-8 ${maxW} mx-auto`}>
      <CroppedImage src={src} alt={alt} trim={trim} trimBase={trimBase} />
      <FigCaption label={label}>{caption}</FigCaption>
    </figure>
  );
}

/** Two subfigures side by side, sharing a single caption. */
export function TutorialSubfigureRow({ left, right, caption, label }: {
  left: SubfigureProps;
  right: SubfigureProps;
  caption: React.ReactNode;
  label?: string;
}) {
  return (
    <figure className="my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[left, right].map((sub, i) => (
          <div key={i}>
            <CroppedImage src={sub.src} alt={sub.alt} trim={sub.trim} trimBase={sub.trimBase} />
            <SubCaption index={i}>{sub.subcaption}</SubCaption>
          </div>
        ))}
      </div>
      <FigCaption label={label}>{caption}</FigCaption>
    </figure>
  );
}

/** Stacked subfigures (one per row), sharing a single caption. */
export function TutorialSubfigureStack({ items, caption, label }: {
  items: SubfigureProps[];
  caption: React.ReactNode;
  label?: string;
}) {
  return (
    <figure className="my-8">
      <div className="flex flex-col gap-4">
        {items.map((sub, i) => (
          <div key={i}>
            <CroppedImage src={sub.src} alt={sub.alt} trim={sub.trim} trimBase={sub.trimBase} />
            <SubCaption index={i}>{sub.subcaption}</SubCaption>
          </div>
        ))}
      </div>
      <FigCaption label={label}>{caption}</FigCaption>
    </figure>
  );
}
