import { useState } from 'react';

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
 * so the framing matches the manual exactly and stays fully responsive.
 * Without a trim it renders the full image unchanged.
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

/** Single figure with numbered caption */
export function TutorialFigure({ src, alt, caption, width = 'normal', trim, trimBase }: FigureProps) {
  const [enlarged, setEnlarged] = useState(false);
  const maxW = { narrow: 'max-w-md', normal: 'max-w-2xl', wide: 'max-w-3xl', full: 'max-w-full' }[width];

  return (
    <>
      <figure className={`my-8 ${maxW} mx-auto`}>
        <button
          className="w-full block rounded-lg overflow-hidden border border-[var(--hairline)] bg-white cursor-zoom-in hover:border-[var(--cold)] transition-colors"
          onClick={() => setEnlarged(true)}
          aria-label={`Enlarge: ${alt}`}
        >
          <CroppedImage src={src} alt={alt} trim={trim} trimBase={trimBase} />
        </button>
        <figcaption className="mt-2 text-sm text-[var(--text-dim)] text-center leading-relaxed px-2">
          {caption}
        </figcaption>
      </figure>

      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setEnlarged(false)}
        >
          <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-lg" />
          <button
            className="absolute top-4 right-4 text-white text-2xl leading-none"
            onClick={() => setEnlarged(false)}
            aria-label="Close"
          >✕</button>
        </div>
      )}
    </>
  );
}

/** Two subfigures side by side, sharing a single caption */
export function TutorialSubfigureRow({ left, right, caption }: {
  left: SubfigureProps;
  right: SubfigureProps;
  caption: React.ReactNode;
}) {
  const [enlarged, setEnlarged] = useState<string | null>(null);

  return (
    <>
      <figure className="my-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[left, right].map((sub, i) => (
            <div key={i}>
              <button
                className="w-full block rounded-lg overflow-hidden border border-[var(--hairline)] bg-white cursor-zoom-in hover:border-[var(--cold)] transition-colors"
                onClick={() => setEnlarged(sub.src)}
                aria-label={`Enlarge: ${sub.alt}`}
              >
                <CroppedImage src={sub.src} alt={sub.alt} trim={sub.trim} trimBase={sub.trimBase} />
              </button>
              <p className="mt-1 text-xs text-[var(--text-dim)] text-center italic">{sub.subcaption}</p>
            </div>
          ))}
        </div>
        <figcaption className="mt-3 text-sm text-[var(--text-dim)] text-center leading-relaxed px-2">
          {caption}
        </figcaption>
      </figure>

      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setEnlarged(null)}
        >
          <img src={enlarged} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
          <button className="absolute top-4 right-4 text-white text-2xl leading-none" onClick={() => setEnlarged(null)} aria-label="Close">✕</button>
        </div>
      )}
    </>
  );
}

/** Stacked subfigures (one per row), sharing a single caption */
export function TutorialSubfigureStack({ items, caption }: {
  items: SubfigureProps[];
  caption: React.ReactNode;
}) {
  const [enlarged, setEnlarged] = useState<string | null>(null);

  return (
    <>
      <figure className="my-8">
        <div className="flex flex-col gap-4">
          {items.map((sub, i) => (
            <div key={i}>
              <button
                className="w-full block rounded-lg overflow-hidden border border-[var(--hairline)] bg-white cursor-zoom-in hover:border-[var(--cold)] transition-colors"
                onClick={() => setEnlarged(sub.src)}
                aria-label={`Enlarge: ${sub.alt}`}
              >
                <CroppedImage src={sub.src} alt={sub.alt} trim={sub.trim} trimBase={sub.trimBase} />
              </button>
              <p className="mt-1 text-xs text-[var(--text-dim)] text-center italic">{sub.subcaption}</p>
            </div>
          ))}
        </div>
        <figcaption className="mt-3 text-sm text-[var(--text-dim)] text-center leading-relaxed px-2">
          {caption}
        </figcaption>
      </figure>

      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setEnlarged(null)}
        >
          <img src={enlarged} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
          <button className="absolute top-4 right-4 text-white text-2xl leading-none" onClick={() => setEnlarged(null)} aria-label="Close">✕</button>
        </div>
      )}
    </>
  );
}
