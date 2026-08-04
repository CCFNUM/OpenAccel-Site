import { Caption } from './Caption';

/**
 * YamlTree — annotated input-file skeleton, mirrors the manual's \begin{yamltree}.
 * Indented lines with faint vertical guide rules; bold keys, dim italic comments,
 * dimmed "..." continuation. Boxed and captioned. Counts as a Figure (the
 * manual's \begin{yamltree} wraps \begin{figure}), caption BELOW.
 */
export interface YamlLine {
  indent: number;
  /** Bold key text, e.g. "mesh:" */
  key?: string;
  /** Plain trailing text on the line, e.g. "file_path: mesh.e" */
  text?: string;
  /** Comment text (rendered as "# ..." in dim italic) */
  comment?: string;
  /** Renders a dimmed "..." continuation marker instead of key/text/comment */
  dots?: boolean;
  /** Renders "-" in its own indent-width slot before key/text (the manual's \ydash) */
  dash?: boolean;
}

interface YamlTreeProps {
  /** e.g. "Figure 1.1" */
  label: string;
  caption: string;
  lines: YamlLine[];
}

export function YamlTree({ label, caption, lines }: YamlTreeProps) {
  return (
    <figure className="my-6">
      <div
        className="rounded-md border overflow-x-auto"
        style={{ borderColor: 'var(--code-border)', background: 'var(--listing-bg)' }}
      >
        <div className="p-4 font-mono text-sm leading-relaxed min-w-max">
          {lines.map((line, i) => (
            <div key={i} className="flex items-baseline whitespace-pre">
              {Array.from({ length: line.indent }).map((_, j) => (
                <span
                  key={j}
                  aria-hidden
                  className="inline-block self-stretch"
                  style={{ width: '1.5em', borderLeft: '1px solid var(--yaml-guide)' }}
                />
              ))}
              {line.dash && (
                <span aria-hidden className="inline-block" style={{ width: '1.5em', color: 'var(--text)' }}>-</span>
              )}
              {line.dots ? (
                <span style={{ color: 'var(--text-dim)', opacity: 0.7 }}>. . .</span>
              ) : (
                <>
                  {line.key && <span style={{ color: 'var(--text)', fontWeight: 500 }}>{line.key}</span>}
                  {line.text && (
                    <span style={{ color: 'var(--text)' }}>{line.key ? ' ' : ''}{line.text}</span>
                  )}
                  {line.comment && (
                    <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      {line.key || line.text ? '  ' : ''}# {line.comment}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <Caption label={label} className="mt-2">{caption}</Caption>
    </figure>
  );
}
