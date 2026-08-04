/**
 * GetStarted — landing page for the User Guide section (/get-started).
 * PDF download card · Quick start commands · Chapter index cards.
 */
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import { CHAPTERS } from '@/pages/get-started/GsLayout';

const CHAPTER_BLOCKS: Record<string, string> = {
  '5':  'mesh',
  '6':  'simulation › physical_analysis',
  '7':  'simulation › physical_analysis › interfaces',
  '8':  'simulation › solver › solver_control',
  '9':  'simulation › material_library',
  '10': 'simulation › solver › output_control',
};

export function GetStarted() {
  useDocumentTitle('Get Started');

  return (
    <div>
      <SEO
        title="Get Started"
        description="OpenAccel User Guide — install, build, configure, and run your first simulation. Covers installation, mesh, physics models, numerics, and worked examples."
        path="/get-started"
      />

      {/* Hero */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--cold)' }}>User Guide</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">Get Started</h1>
          <p className="text-lg text-[var(--text-dim)] max-w-2xl">
            The OpenAccel User Guide — Release v1.0. Everything from installing dependencies to configuring
            boundary conditions and interpreting output.
          </p>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* PDF download card */}
        <section>
          <a
            href="/docs/openaccel-user-guide.pdf"
            download="OpenAccel-User-Guide-v1.0.pdf"
            className="flex items-center gap-5 p-6 rounded-xl border border-[var(--cold)]/40 bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors group"
          >
            <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--cold) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--cold) 30%, transparent)' }}>
              <FileText size={26} style={{ color: 'var(--cold)' }} />
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-display font-semibold text-lg leading-snug group-hover:text-white transition-colors">
                OpenAccel User Guide — Release v1.0
              </p>
              <p className="text-sm text-[var(--text-dim)] mt-1 font-mono">PDF · 1.2 MB · 89 pages</p>
            </div>
            <ArrowRight size={18} className="shrink-0 text-[var(--cold)] opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        </section>

        {/* Quick start */}
        <section>
          <h2 className="font-display text-2xl font-semibold mb-2">Quick Start</h2>
          <p className="text-[var(--text-dim)] mb-6">Three commands to clone, build, and run your first case.</p>

          <div className="space-y-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] mb-2">1 · Clone</p>
              <CodeBlock lang="bash" code={`git clone --recurse-submodules https://github.com/CCFNUM/OpenAccel\ncd OpenAccel`} />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] mb-2">2 · Build</p>
              <CodeBlock lang="bash" code={`spack env activate tools/spack/openaccel-env && spack install\ncmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DPETSC=ON\nninja -C build`} />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] mb-2">3 · Run</p>
              <CodeBlock lang="bash" code={`./build/OpenAccel examples/cavity/cavity.yaml`} />
            </div>
          </div>

          <p className="text-sm text-[var(--text-dim)] mt-4">
            For full details on each step see{' '}
            <Link href="/get-started/installation" className="underline underline-offset-4" style={{ color: 'var(--cold)' }}>Chapter 2 — Installation</Link>
            {' '}and{' '}
            <Link href="/get-started/running" className="underline underline-offset-4" style={{ color: 'var(--cold)' }}>Chapter 3 — Running Cases</Link>.
          </p>
        </section>

        {/* Chapter index */}
        <section>
          <h2 className="font-display text-2xl font-semibold mb-2">Chapters</h2>
          <p className="text-[var(--text-dim)] mb-8">
            The guide is organised into 12 chapters plus a troubleshooting appendix.
            Chapters 5–10 each document one block of the input YAML.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHAPTERS.map(ch => (
              <Link key={ch.slug} href={`/get-started/${ch.slug}`}
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
                  {CHAPTER_BLOCKS[ch.num] && (
                    <code className="text-xs text-[var(--text-dim)] mt-1 block">{CHAPTER_BLOCKS[ch.num]}</code>
                  )}
                </div>
                <ArrowRight size={14} className="shrink-0 text-[var(--text-dim)] opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
