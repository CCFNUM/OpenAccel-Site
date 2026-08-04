/**
 * Theory — landing page for the Theory Manual section (/theory).
 * Mirrors GetStarted.tsx exactly: PDF download card · chapter index grid,
 * grouped by the manual's own \part{} structure (see main.tex).
 */
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import { THEORY_CHAPTERS, THEORY_GROUPS } from '@/pages/theory/TheoryLayout';

// TODO(maintainers): no built PDF exists yet under manuals-source/theory-guide/
// (only Theory_Guide.zip of LaTeX sources + figures). Card below is a visible
// placeholder until a rendered PDF is supplied — swap `PDF_HREF` for the real
// path (e.g. /docs/openaccel-theory-guide.pdf) once it exists.
const PDF_HREF: string | null = null;

export function Theory() {
  useDocumentTitle('Theory Manual');

  return (
    <div>
      <SEO
        title="Theory Manual"
        description="OpenAccel Theory Manual — the mathematical theory and discrete formulations implemented in the solver: governing equations, CVFEM discretisation, and solution algorithms."
        path="/theory"
      />

      {/* Hero */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--cold)' }}>Theory Manual</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">Theory Manual</h1>
          <p className="text-lg text-[var(--text-dim)] max-w-2xl">
            The OpenAccel Theory Guide — Release v1.0. The mathematical theory and discrete
            formulations implemented in the solver, from governing equations to CVFEM
            discretisation and solution algorithms.
          </p>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* PDF download card */}
        <section>
          {PDF_HREF ? (
            <a
              href={PDF_HREF}
              download="OpenAccel-Theory-Guide-v1.0.pdf"
              className="flex items-center gap-5 p-6 rounded-xl border border-[var(--cold)]/40 bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors group"
            >
              <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'color-mix(in srgb, var(--cold) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--cold) 30%, transparent)' }}>
                <FileText size={26} style={{ color: 'var(--cold)' }} />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-display font-semibold text-lg leading-snug group-hover:text-white transition-colors">
                  OpenAccel Theory Guide — Release v1.0
                </p>
                <p className="text-sm text-[var(--text-dim)] mt-1 font-mono">PDF</p>
              </div>
              <ArrowRight size={18} className="shrink-0 text-[var(--cold)] opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          ) : (
            <div
              aria-disabled="true"
              className="flex items-center gap-5 p-6 rounded-xl border border-[var(--hairline)] bg-[var(--surface)] opacity-70 cursor-not-allowed"
            >
              <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'color-mix(in srgb, var(--cold) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--cold) 30%, transparent)' }}>
                <FileText size={26} style={{ color: 'var(--cold)' }} />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-display font-semibold text-lg leading-snug">
                  OpenAccel Theory Guide — Release v1.0
                </p>
                <p className="text-sm text-[var(--text-dim)] mt-1 font-mono">PDF · not yet published</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                style={{ background: 'color-mix(in srgb, var(--warm) 12%, transparent)', color: 'var(--warm)' }}>
                <AlertTriangle size={9} /> pending
              </span>
            </div>
          )}
        </section>

        {/* Chapter index */}
        <section>
          <h2 className="font-display text-2xl font-semibold mb-2">Chapters</h2>
          <p className="text-[var(--text-dim)] mb-8">
            The guide is organised into 19 chapters across five parts, plus an appendix of
            registered-but-rejected options.
          </p>

          <div className="space-y-10">
            {THEORY_GROUPS.map(group => (
              <div key={group.label}>
                <p className="font-mono text-xs uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--text-dim)' }}>
                  {group.label}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.nums.map(n => {
                    const ch = THEORY_CHAPTERS.find(c => c.num === n);
                    if (!ch) return null;
                    return (
                      <Link key={ch.slug} href={`/theory/${ch.slug}`}
                        className="group flex items-start gap-4 p-5 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors">
                        <span className="font-mono text-sm text-[var(--text-dim)] w-6 shrink-0 mt-0.5">{ch.num}</span>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold leading-snug group-hover:text-white transition-colors">{ch.title}</span>
                            {ch.inProgress && (
                              <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded"
                                style={{ background: 'color-mix(in srgb, var(--warm) 12%, transparent)', color: 'var(--warm)' }}>
                                <AlertTriangle size={9} /> in progress
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={14} className="shrink-0 text-[var(--text-dim)] opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
