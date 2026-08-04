import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { publications } from '@/content/publications';
import { Copy, Check, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  journal:    'var(--cold)',
  conference: 'var(--violet)',
  thesis:     'var(--flux)',
  preprint:   'var(--warm)',
};
const TYPE_BG: Record<string, string> = {
  journal:    'var(--cold-pill-bg)',
  conference: 'var(--violet-pill-bg)',
  thesis:     'var(--flux-pill-bg)',
  preprint:   'var(--warm-pill-bg)',
};

function typeBadge(type: string) {
  return {
    color: TYPE_COLORS[type] ?? 'var(--text-dim)',
    background: TYPE_BG[type] ?? 'var(--dim-pill-bg)',
  };
}

// [TODO: maintainers — replace {{TITLE}}, {{AUTHOR}}, {{YEAR}} with real citation data]
const CITE_PLACEHOLDER = `@article{openaccel,
  title  = {{{TITLE}}},
  author = {{{AUTHOR}}},
  year   = {{{YEAR}}},
  url    = {https://github.com/CCFNUM/OpenAccel},
  note   = {v0.2.0, BSD 3-Clause}
}`;

export function Publications() {
  useDocumentTitle('Publications');
  const [copiedCite, setCopiedCite] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const copyCitation = () => {
    navigator.clipboard.writeText(CITE_PLACEHOLDER);
    setCopiedCite(true);
    setTimeout(() => setCopiedCite(false), 2000);
  };

  const copyBibtex = (id: string) => {
    const pub = publications.find(p => p.id === id);
    if (!pub) return;
    const bib = `@${pub.type}{${pub.id},\n  title  = {${pub.title}},\n  author = {${pub.authors}},\n  year   = {${pub.year}},\n  note   = {${pub.venue}}\n}`;
    navigator.clipboard.writeText(bib);
  };

  return (
    <div>
      <SEO
        title="Publications"
        description="Papers, theses, and talks on the methods behind OpenAccel and the problems solved with it."
        path="/publications"
      />
      {/* Page hero band */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3 text-[var(--cold)]">Research</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">Publications</h1>
          <p className="text-lg text-[var(--text-dim)]">
            Papers, theses, and talks on the methods behind OpenAccel and the problems solved with it.
          </p>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pinned Citation Box */}
        <div className="mb-16 p-6 border border-[var(--cold)] bg-[var(--cold)]/5 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--cold)]" />
          <h2 className="font-display text-lg font-medium mb-1">How to cite OpenAccel</h2>
          <p className="text-xs font-mono text-[var(--hot)] mb-3">[TODO: maintainers — fill in title, author list, and year]</p>
          <p className="text-sm text-[var(--text-dim)] mb-4">If you use OpenAccel in your research, please cite the project:</p>

          <div className="relative group rounded bg-[var(--ink)] border border-[var(--hairline)] overflow-hidden">
            <div className="flex items-center justify-between px-3 border-b border-[var(--hairline)] bg-[var(--surface-2)]" style={{ height: 36 }}>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-dim)]">bibtex</span>
              <button
                onClick={copyCitation}
                className="flex items-center justify-center rounded transition-colors"
                style={{ width: 28, height: 28, color: copiedCite ? 'var(--signal)' : 'var(--text-dim)' }}
                aria-label="Copy BibTeX"
              >
                {copiedCite ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>{CITE_PLACEHOLDER}</pre>
          </div>
        </div>

        {/* Publication list — flex-based timeline, dot centred on line */}
        <div className="space-y-0">
          {publications.map((pub, idx) => {
            const badge = typeBadge(pub.type);
            const dotColor = TYPE_COLORS[pub.type] ?? 'var(--cold)';
            return (
              <div key={pub.id} className="flex gap-0 md:gap-6">
                {/* Timeline column — visible on md+ */}
                <div className="hidden md:flex flex-col items-center w-6 shrink-0 pt-8">
                  {/* Dot centred on the vertical line */}
                  <div
                    className="w-3 h-3 rounded-full border-2 shrink-0 z-10"
                    style={{ borderColor: dotColor, background: 'var(--ink)' }}
                  />
                  {/* Connecting rule below dot (not after last item) */}
                  {idx < publications.length - 1 && (
                    <div className="flex-1 w-px mt-1" style={{ background: 'var(--hairline)' }} />
                  )}
                </div>

                {/* Card */}
                <div className={`flex-1 p-6 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg transition-colors hover:border-[var(--surface-2)] ${idx < publications.length - 1 ? 'mb-6' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <h3 className={`font-display text-lg font-medium leading-snug flex-1 min-w-0 ${pub.isPlaceholder ? 'text-[var(--text-dim)] italic' : 'text-[var(--text)]'}`}>
                      {pub.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded" style={badge}>
                        {pub.type}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-dim)] bg-[var(--surface-2)] px-2 py-1 rounded border border-[var(--hairline)]">
                        {pub.year}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text)] mb-1 font-serif">{pub.authors}</p>
                  <p className="text-sm text-[var(--text-dim)] italic mb-4">{pub.venue}</p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-4 text-sm font-mono mt-4 pt-4 border-t border-[var(--hairline)]">
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer"
                        className="hover:underline" style={{ color: 'var(--cold)' }}>
                        DOI
                      </a>
                    )}
                    {pub.pdfUrl && (
                      <a href={pub.pdfUrl} target="_blank" rel="noreferrer"
                        className="text-[var(--text-dim)] hover:text-white transition-colors flex items-center gap-1">
                        <FileText size={13} /> PDF
                      </a>
                    )}
                    <button
                      onClick={() => copyBibtex(pub.id)}
                      className="text-[var(--text-dim)] hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      <Copy size={13} className="opacity-70 group-hover:opacity-100" /> BibTeX
                    </button>

                    <button
                      onClick={() => setExpandedId(expandedId === pub.id ? null : pub.id)}
                      className="ml-auto flex items-center text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                    >
                      {expandedId === pub.id
                        ? <><ChevronUp size={13} className="mr-1" />Hide Abstract</>
                        : <><ChevronDown size={13} className="mr-1" />Abstract</>}
                    </button>
                  </div>

                  {expandedId === pub.id && (
                    <div className="mt-4 p-4 bg-[var(--ink)] border border-[var(--hairline)] rounded text-sm text-[var(--text-dim)] font-serif leading-relaxed">
                      {pub.abstract}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
