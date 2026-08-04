/**
 * GsLayout — shared shell for all Get Started chapter sub-pages.
 * Renders the chapter sidebar, mobile drawer, breadcrumb, and content area.
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { BookOpen, X, ArrowLeft, AlertTriangle } from 'lucide-react';

export interface ChapterMeta {
  num: string;       // '1' – '12' or 'A'
  slug: string;      // URL segment after /get-started/
  title: string;
  inProgress?: boolean;
}

export const CHAPTERS: ChapterMeta[] = [
  { num: '1',  slug: 'introduction',      title: 'Introduction' },
  { num: '2',  slug: 'installation',      title: 'Installation' },
  { num: '3',  slug: 'running',           title: 'Running Cases' },
  { num: '4',  slug: 'input-file',        title: 'Input File Reference' },
  { num: '5',  slug: 'mesh',              title: 'Mesh' },
  { num: '6',  slug: 'physical-analysis', title: 'Physical Analysis' },
  { num: '7',  slug: 'interfaces',        title: 'Interfaces' },
  { num: '8',  slug: 'numerics',          title: 'Numerics & Solver Control' },
  { num: '9',  slug: 'materials',         title: 'Materials' },
  { num: '10', slug: 'output',            title: 'Output, Monitors & Restart' },
  { num: '11', slug: 'suite',             title: 'The OpenAccel Suite', inProgress: true },
  { num: '12', slug: 'worked-example',    title: 'Worked Example' },
  { num: 'A',  slug: 'troubleshooting',   title: 'Troubleshooting' },
];

const GROUPS = [
  { label: 'Introduction', nums: ['1'] },
  { label: 'Setup',        nums: ['2', '3'] },
  { label: 'Input File',   nums: ['4', '5', '6', '7', '8', '9', '10'] },
  { label: 'Examples',     nums: ['11', '12'] },
  { label: 'Reference',    nums: ['A'] },
];

interface Props {
  /** Chapter num string, e.g. '2' or 'A' */
  chNum: string;
  title: string;
  /** Optional "(incomplete)" suffix flag */
  inProgress?: boolean;
  children: React.ReactNode;
}

export function GsLayout({ chNum, title, inProgress, children }: Props) {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const chapterByNum = Object.fromEntries(CHAPTERS.map(c => [c.num, c]));

  const Nav = () => (
    <nav className="space-y-5">
      <Link href="/get-started"
        className="flex items-center gap-1.5 text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors mb-4">
        <ArrowLeft size={13} /> User Guide overview
      </Link>
      {GROUPS.map(g => (
        <div key={g.label}>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)] mb-2">{g.label}</p>
          <ul className="space-y-0.5">
            {g.nums.map(n => {
              const ch = chapterByNum[n];
              if (!ch) return null;
              const isActive = location === `/get-started/${ch.slug}`;
              return (
                <li key={n}>
                  <Link href={`/get-started/${ch.slug}`}
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

  const chapNum = chNum === 'A' ? 'Appendix A' : `Chapter ${chNum}`;

  return (
    <div>
      {/* Hero */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--cold)' }}>
            User Guide — {chapNum}
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
              <span className="font-display font-semibold text-sm">User Guide</span>
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
        <aside className="xl:w-56 shrink-0 hidden xl:block">
          <div className="sticky top-24"><Nav /></div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 docs-content" style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text)', maxWidth: '72ch' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Shared doc helpers ─────────────────────────────────────────────────── */

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-display font-semibold scroll-mt-24 mb-5 mt-10"
      style={{ paddingBottom: '.4rem', borderBottom: '1px solid var(--hairline)' }}>
      <a href={`#${id}`} className="anchor-link">#</a>{children}
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-lg font-medium scroll-mt-24 mt-8 mb-3" style={{ color: 'var(--text)' }}>
      <a href={`#${id}`} className="anchor-link">#</a>{children}
    </h3>
  );
}

type CType = 'note' | 'tip' | 'warning' | 'danger';
const CCFG: Record<CType, { color: string; bg: string; label: string; icon: string }> = {
  note:    { color: 'var(--cold)',   bg: 'var(--callout-cold-bg)',   label: 'Note',      icon: 'ℹ' },
  tip:     { color: 'var(--signal)', bg: 'var(--callout-signal-bg)', label: 'Tip',       icon: '💡' },
  warning: { color: 'var(--warm)',   bg: 'var(--callout-warm-bg)',   label: 'Warning',   icon: '⚠' },
  danger:  { color: 'var(--hot)',    bg: 'var(--callout-hot-bg)',    label: 'Important', icon: '!' },
};
export function Callout({ type, children }: { type: CType; children: React.ReactNode }) {
  const c = CCFG[type];
  return (
    <div className="my-6 pl-4 py-4 pr-4 rounded-r-md" style={{ borderLeft: `3px solid ${c.color}`, background: c.bg }}>
      <p className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: c.color }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{c.icon}</span> {c.label}
      </p>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{children}</div>
    </div>
  );
}

export function TodoBlock({ label }: { label: string }) {
  return (
    <div className="p-5 my-6 border border-dashed border-[var(--hairline)] rounded-lg bg-[var(--surface)] text-sm"
      style={{ color: 'var(--text-dim)' }}>
      <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--warm)' }}>[TODO: maintainers]</p>
      <p>{label}</p>
    </div>
  );
}

export function ContributeButton({ href = 'https://github.com/CCFNUM/OpenAccel/discussions' }: { href?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded border text-sm font-mono mt-4"
      style={{ borderColor: 'var(--warm)', color: 'var(--warm)', background: 'color-mix(in srgb, var(--warm) 8%, transparent)' }}>
      <AlertTriangle size={14} /> Contribute to this chapter
    </a>
  );
}
