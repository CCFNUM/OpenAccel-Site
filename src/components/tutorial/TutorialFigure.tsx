import { useState } from 'react';

interface FigureProps {
  src: string;
  alt: string;
  caption: React.ReactNode;
  label?: string;
  /** narrow | normal | wide — controls max-width */
  width?: 'narrow' | 'normal' | 'wide' | 'full';
}

interface SubfigureProps {
  src: string;
  alt: string;
  subcaption: React.ReactNode;
}

/** Single figure with numbered caption */
export function TutorialFigure({ src, alt, caption, width = 'normal' }: FigureProps) {
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
          <img src={src} alt={alt} className="w-full h-auto object-contain" loading="lazy" />
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
                <img src={sub.src} alt={sub.alt} className="w-full h-auto object-contain" loading="lazy" />
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
                <img src={sub.src} alt={sub.alt} className="w-full h-auto object-contain" loading="lazy" />
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
