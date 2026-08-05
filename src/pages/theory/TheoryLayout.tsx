/**
 * TheoryLayout — shared shell for all Theory Manual chapter sub-pages.
 * Mirrors get-started/GsLayout.tsx exactly (hero, sidebar, mobile drawer),
 * but the sidebar is grouped by the manual's own \part{} structure (see
 * manuals-source/theory-guide/main.tex) rather than the User Guide's groups.
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { BookOpen, X, ArrowLeft, AlertTriangle } from 'lucide-react';

export interface TheoryChapterMeta {
  num: string;       // '' (front matter), '1' – '19', or 'A'
  slug: string;      // URL segment after /theory/
  title: string;
  inProgress?: boolean;
}

export const THEORY_CHAPTERS: TheoryChapterMeta[] = [
  { num: '',   slug: 'how-to-read',        title: 'How to Read This Guide' },
  { num: '1',  slug: 'overview',           title: 'Overview' },
  { num: '2',  slug: 'preliminaries',      title: 'Mathematical Preliminaries' },
  { num: '3',  slug: 'flow',               title: 'Flow and Transport Equations' },
  { num: '4',  slug: 'turbulence',         title: 'Turbulence Modelling' },
  { num: '5',  slug: 'heat',               title: 'Heat Transfer and Compressible Flow' },
  { num: '6',  slug: 'buoyancy-pressure',  title: 'Buoyancy and Pressure Treatment' },
  { num: '7',  slug: 'moving-domains',     title: 'Moving and Deforming Domains' },
  { num: '8',  slug: 'free-surface',       title: 'Free-Surface Flows' },
  { num: '9',  slug: 'solid',              title: 'Solid Mechanics' },
  { num: '10', slug: 'rigidbody-fsi',      title: 'Rigid-Body Dynamics and Fluid–Structure Interaction' },
  { num: '11', slug: 'cvfem',              title: 'CVFEM Discretisation' },
  { num: '12', slug: 'temporal',           title: 'Temporal Discretisation' },
  { num: '13', slug: 'boundary-conditions',title: 'Boundary Conditions' },
  { num: '14', slug: 'interfaces',         title: 'Interfaces' },
  { num: '15', slug: 'pv-coupling',        title: 'Velocity–Pressure Coupling' },
  { num: '16', slug: 'linear-solvers',     title: 'Linear Solvers and Preconditioning' },
  { num: '17', slug: 'implementation',     title: 'Implementation and Data Structures' },
  { num: '18', slug: 'postprocessing',     title: 'Post-Processing Quantities' },
  { num: '19', slug: 'mesh-quality',       title: 'Mesh Quality and Element Correction' },
  { num: 'A',  slug: 'rejected-approaches',title: 'Registered-but-Rejected Options' },
];

/** Groups follow the manual's own \part{} structure (main.tex) exactly. */
export const THEORY_GROUPS = [
  { label: 'Start here',                          nums: [''] },
  { label: 'Part I — Foundations',                nums: ['1', '2'] },
  { label: 'Part II — Governing Equations and Physical Models', nums: ['3', '4', '5', '6', '7', '8', '9', '10'] },
  { label: 'Part III — Numerical Discretisation', nums: ['11', '12', '13', '14'] },
  { label: 'Part IV — Solution Algorithms',       nums: ['15', '16'] },
  { label: 'Part V — Implementation and Practical Aspects', nums: ['17', '18', '19'] },
  { label: 'Appendix',                            nums: ['A'] },
];

interface Props {
  chNum: string;
  title: string;
  inProgress?: boolean;
  children: React.ReactNode;
}

export function TheoryLayout({ chNum, title, inProgress, children }: Props) {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const chapterByNum = Object.fromEntries(THEORY_CHAPTERS.map(c => [c.num, c]));

  const Nav = () => (
    <nav className="space-y-5">
      <Link href="/theory"
        className="flex items-center gap-1.5 text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors mb-4">
        <ArrowLeft size={13} /> Theory Manual overview
      </Link>
      {THEORY_GROUPS.map(g => (
        <div key={g.label}>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)] mb-2">{g.label}</p>
          <ul className="space-y-0.5">
            {g.nums.map(n => {
              const ch = chapterByNum[n];
              if (!ch) return null;
              const isActive = location === `/theory/${ch.slug}`;
              return (
                <li key={n}>
                  <Link href={`/theory/${ch.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors ${
                      isActive
                        ? 'bg-[var(--cold)]/15 text-[var(--cold)] font-medium'
                        : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                    }`}>
                    <span className="font-mono text-[10px] w-5 shrink-0 text-[var(--text-dim)]">{n}</span>
                    <span className="leading-snug">{ch.title}</span>
                    {ch.inProgress && <AlertTriangle size={11} className="shrink-0 text-[var(--warm)] ml-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const chapNum = chNum === 'A' ? 'Appendix' : chNum === '' ? '' : `Chapter ${chNum}`;

  return (
    <div>
      {/* Hero */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--cold)' }}>
            {chapNum ? `Theory Manual — ${chapNum}` : 'Theory Manual'}
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-bold mb-1">
            {title}{inProgress && <span className="text-[var(--warm)] font-normal"> (incomplete)</span>}
          </h1>
          {inProgress && (
            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 text-xs font-mono rounded-full"
              style={{ background: 'color-mix(in srgb, var(--warm) 12%, transparent)', color: 'var(--warm)', border: '1px solid color-mix(in srgb, var(--warm) 30%, transparent)' }}>
              <AlertTriangle size={11} /> IN PROGRESS
            </span>
          )}
          <div className="gradient-rule w-full mt-4" />
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="xl:hidden sticky top-16 z-30 px-4 py-2 bg-[var(--ink)] border-b border-[var(--hairline)]">
        <button onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded border border-[var(--hairline)] bg-[var(--surface)] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
          style={{ minHeight: 44 }}>
          <BookOpen size={14} /> Chapters
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex">
          <div className="w-72 max-w-[85vw] bg-[var(--surface)] border-r border-[var(--hairline)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-semibold text-sm">Theory Manual</span>
              <button onClick={() => setDrawerOpen(false)}
                style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                className="text-[var(--text-dim)] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <Nav />
          </div>
          <div className="flex-1 bg-black/50 cursor-pointer" onClick={() => setDrawerOpen(false)} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-12">
        {/* Left sidebar (desktop) */}
        <aside className="xl:w-64 shrink-0 hidden xl:block">
          <div className="sticky top-24"><Nav /></div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 docs-content" style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text)', maxWidth: '84ch' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
