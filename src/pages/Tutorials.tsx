/**
 * Tutorials.tsx — Tutorials (V&V) landing page.
 *
 * Layout:
 *   1. Hero band
 *   2. Getting Started callout (links to /get-started)
 *   3. Validation Manual PDF download
 *   4. Search + "Filter by" dropdown (DESIGN-BRIEF §24.6): default shows all
 *      tutorials with no filter blocks visible; the user opens "Filter by" and
 *      picks one or more criteria (Dimension, Physics, Difficulty — multi-select),
 *      revealing only those criteria's blocks. Blocks are themselves multi-select
 *      and keep their per-physics / per-difficulty colours. Physics lays out in a
 *      2×4 grid (no horizontal scrollbar). Block/label font is the site body font.
 *   5. Tutorial groups, each a card grid driven by tutorial.group.
 */
import { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import {
  tutorials,
  type Tutorial,
  TUTORIAL_GROUPS,
  type TutorialGroup,
  displayTime,
} from '@/content/tutorials';
import { physicsColor } from '@/lib/physics-colors';
import { ArrowRight, Clock, ChevronRight, ChevronDown, Search, X, FileText, SlidersHorizontal, Check } from 'lucide-react';

// Human-readable label for a physics tag
function physicsLabel(tag: string): string {
  const LABELS: Record<string, string> = {
    incompressible:    'Incompressible',
    compressible:      'Compressible',
    turbulence:        'Turbulence',
    multiphase:        'Multiphase',
    fsi:               'FSI',
    'heat-transfer':   'Heat Transfer',
    'solid-mechanics': 'Solid Mechanics',
  };
  return LABELS[tag] ?? tag;
}

type DifficultyTag = 'beginner' | 'intermediate' | 'advanced';
type DimTag = '2D' | '3D';
type Criterion = 'dimension' | 'physics' | 'difficulty';

const DIFF_COLOR: Record<string, string> = {
  beginner:     'var(--signal)',
  intermediate: 'var(--warm)',
  advanced:     'var(--hot)',
};

const ALL_DIFFICULTIES: DifficultyTag[] = ['beginner', 'intermediate', 'advanced'];
const ALL_PHYSICS = [...new Set(tutorials.flatMap(t => t.physics))].sort() as string[];
const ALL_DIMS: DimTag[] = ['2D', '3D'];

const CRITERIA: { key: Criterion; label: string }[] = [
  { key: 'dimension',  label: 'Dimension' },
  { key: 'physics',    label: 'Physics' },
  { key: 'difficulty', label: 'Difficulty' },
];

/** Toggle a value in/out of a string[] selection. */
function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
}

// ── Tutorial card ─────────────────────────────────────────────────────────────
function TutorialCard({ tut }: { tut: Tutorial }) {
  const diffColor = DIFF_COLOR[tut.difficulty] ?? 'var(--text-dim)';
  return (
    <Link href={`/tutorials/${tut.slug}`}
      className="group flex flex-col p-5 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-display font-semibold leading-snug text-[var(--text)] group-hover:text-white transition-colors">
          {tut.displayTitle}
        </h4>
        <ChevronRight size={16} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 text-[var(--cold)]" />
      </div>

      <code className="text-[11px] font-mono text-[var(--text-dim)] mb-3">{tut.slug}</code>

      <p className="text-sm text-[var(--text-dim)] leading-relaxed flex-grow">{tut.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5 items-center">
        {tut.physics.map(tag => {
          const color = physicsColor(tag);
          return (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)` }}>
              {physicsLabel(tag)}
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] px-2 py-0.5 rounded-full capitalize" style={{ color: diffColor, background: `${diffColor}18`, border: `1px solid ${diffColor}30` }}>
          {tut.difficulty}
        </span>
        <span className="text-xs text-[var(--text-dim)] flex items-center gap-1">
          <Clock size={11} />{displayTime(tut.estimatedTime)}
        </span>
      </div>
    </Link>
  );
}

// ── Filter block (pill) ───────────────────────────────────────────────────────
function FilterBlock({ label, count, color, active, onClick }: {
  label: string; count: number; color: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-sm border transition-all text-center capitalize"
      style={{
        minHeight: 36,
        background: active ? color : 'var(--surface)',
        color: active ? '#fff' : color,
        borderColor: active ? color : `color-mix(in srgb, ${color} 35%, transparent)`,
      }}>
      {label} ({count})
    </button>
  );
}

// ── Page component ────────────────────────────────────────────────────────────
export function Tutorials() {
  useDocumentTitle('Tutorials');

  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [shown, setShown] = useState<Record<Criterion, boolean>>({ dimension: false, physics: false, difficulty: false });
  const [selDim, setSelDim] = useState<string[]>([]);
  const [selPhysics, setSelPhysics] = useState<string[]>([]);
  const [selDiff, setSelDiff] = useState<string[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close the "Filter by" menu on outside-click / Escape.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  // Toggle whether a criterion's blocks are shown; clear its selection when hidden.
  function toggleCriterion(key: Criterion) {
    setShown(s => {
      const next = { ...s, [key]: !s[key] };
      if (s[key]) {
        if (key === 'dimension') setSelDim([]);
        if (key === 'physics') setSelPhysics([]);
        if (key === 'difficulty') setSelDiff([]);
      }
      return next;
    });
  }

  const grouped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const active = tutorials.filter(t => {
      if (selDim.length && !selDim.includes(t.dim)) return false;
      if (selPhysics.length && !t.physics.some(p => selPhysics.includes(p))) return false;
      if (selDiff.length && !selDiff.includes(t.difficulty)) return false;
      if (needle && !(
        t.displayTitle.toLowerCase().includes(needle) ||
        t.description.toLowerCase().includes(needle) ||
        t.caseId.toLowerCase().includes(needle) ||
        t.slug.toLowerCase().includes(needle)
      )) return false;
      return true;
    });
    return TUTORIAL_GROUPS.map((group: TutorialGroup) => ({
      group,
      items: active.filter(t => t.group === group),
    })).filter(g => g.items.length > 0);
  }, [q, selDim, selPhysics, selDiff]);

  const totalVisible = grouped.reduce((n, g) => n + g.items.length, 0);
  const anyFilter = q !== '' || selDim.length > 0 || selPhysics.length > 0 || selDiff.length > 0;
  const anyCriterion = shown.dimension || shown.physics || shown.difficulty;

  function clearAll() {
    setQ(''); setSelDim([]); setSelPhysics([]); setSelDiff([]);
    setShown({ dimension: false, physics: false, difficulty: false });
  }

  return (
    <div>
      <SEO
        title="Tutorials"
        description="Step-by-step OpenAccel tutorials for incompressible flow, turbulence, multiphase VOF, FSI, conjugate heat transfer, solid mechanics, and compressible flow."
        path="/tutorials"
      />

      {/* 1. Hero band */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3 text-[var(--cold)]">Tutorials</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2">Tutorials</h1>
          <p className="text-[var(--text-dim)] mt-2 max-w-2xl text-lg">
            Verified benchmark cases covering the full range of OpenAccel physics modules.
            Each case ships with mesh files, an input YAML, and reference data.
          </p>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* 2. Getting Started callout */}
        <div className="mb-10 p-5 rounded-xl border border-[var(--cold)]/30 bg-[var(--cold)]/8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-grow">
            <h3 className="font-semibold text-[var(--text)] mb-1">New to OpenAccel?</h3>
            <p className="text-sm text-[var(--text-dim)]">
              Make sure you can build the solver and run a basic case before attempting any tutorial.
            </p>
          </div>
          <Link href="/get-started"
            className="inline-flex items-center shrink-0 px-4 py-2.5 bg-[var(--cold)] text-white rounded text-sm font-medium hover:opacity-90 transition-opacity gap-2"
            style={{ minHeight: 44 }}>
            Get Started <ArrowRight size={15} />
          </Link>
        </div>

        {/* 3. Validation Manual PDF download */}
        <a
          href="/docs/openaccel-validation-manual.pdf"
          download="OpenAccel-Validation-Manual-v1.0.pdf"
          className="flex items-center gap-5 p-6 mb-10 rounded-xl border border-[var(--cold)]/40 bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors group"
        >
          <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'color-mix(in srgb, var(--cold) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--cold) 30%, transparent)' }}>
            <FileText size={26} style={{ color: 'var(--cold)' }} />
          </div>
          <div className="flex-grow min-w-0">
            <p className="font-display font-semibold text-lg leading-snug group-hover:text-white transition-colors">
              OpenAccel Validation Manual — Release v1.0
            </p>
            <p className="text-sm text-[var(--text-dim)] mt-1 font-mono">PDF · 45 MB · 166 pages</p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-[var(--cold)] opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* 4. Search + Filter-by dropdown */}
        <div className="mb-10 space-y-4">

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-grow">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)] pointer-events-none" />
              <input
                type="search"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search tutorials by title or description…"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-dim)] text-sm focus:outline-none focus:border-[var(--cold)] transition-colors"
              />
              {q && (
                <button
                  onClick={() => setQ('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter-by dropdown */}
            <div className="relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-expanded={menuOpen}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors"
                style={{
                  minHeight: 44,
                  borderColor: anyCriterion ? 'var(--cold)' : 'var(--hairline)',
                  background: 'var(--surface)',
                  color: anyCriterion ? 'var(--cold)' : 'var(--text-dim)',
                }}>
                <SlidersHorizontal size={15} /> Filter by
                <ChevronDown size={14} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-30 mt-2 w-56 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] shadow-lg p-1.5">
                  {CRITERIA.map(c => (
                    <button
                      key={c.key}
                      onClick={() => toggleCriterion(c.key)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-left text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <span
                        className="w-4 h-4 rounded flex items-center justify-center shrink-0 border"
                        style={{
                          borderColor: shown[c.key] ? 'var(--cold)' : 'var(--hairline)',
                          background: shown[c.key] ? 'var(--cold)' : 'transparent',
                        }}>
                        {shown[c.key] && <Check size={11} className="text-white" />}
                      </span>
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Revealed criterion blocks */}
          {shown.dimension && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-dim)] mb-2">Dimension</p>
              <div className="flex flex-wrap gap-2">
                {ALL_DIMS.map(dim => (
                  <FilterBlock
                    key={dim}
                    label={dim}
                    count={tutorials.filter(t => t.dim === dim).length}
                    color="var(--cold)"
                    active={selDim.includes(dim)}
                    onClick={() => setSelDim(s => toggle(s, dim))}
                  />
                ))}
              </div>
            </div>
          )}

          {shown.physics && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-dim)] mb-2">Physics</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ALL_PHYSICS.map(tag => (
                  <FilterBlock
                    key={tag}
                    label={physicsLabel(tag)}
                    count={tutorials.filter(t => t.physics.includes(tag)).length}
                    color={physicsColor(tag)}
                    active={selPhysics.includes(tag)}
                    onClick={() => setSelPhysics(s => toggle(s, tag))}
                  />
                ))}
              </div>
            </div>
          )}

          {shown.difficulty && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-dim)] mb-2">Difficulty</p>
              <div className="flex flex-wrap gap-2">
                {ALL_DIFFICULTIES.map(diff => (
                  <FilterBlock
                    key={diff}
                    label={diff}
                    count={tutorials.filter(t => t.difficulty === diff).length}
                    color={DIFF_COLOR[diff]}
                    active={selDiff.includes(diff)}
                    onClick={() => setSelDiff(s => toggle(s, diff))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active filter summary + clear all */}
          {anyFilter && (
            <div className="flex items-center justify-between text-sm text-[var(--text-dim)]">
              <span>
                Showing <span className="text-[var(--text)] font-medium">{totalVisible}</span> of {tutorials.length} tutorials
              </span>
              <button
                onClick={clearAll}
                className="text-[var(--cold)] hover:underline underline-offset-4 flex items-center gap-1"
              >
                <X size={12} /> Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* 5. Grouped tutorial cards */}
        {grouped.length === 0 ? (
          <div className="text-center py-20 text-[var(--text-dim)]">
            <p className="text-5xl mb-4">∅</p>
            <p>No tutorials match those filters.</p>
            <button onClick={clearAll} className="mt-4 text-[var(--cold)] underline underline-offset-4 text-sm">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {grouped.map(({ group, items }) => (
              <section key={group}>
                <header className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-semibold">{group}</h2>
                  <span className="text-xs text-[var(--text-dim)] font-mono">{items.length} case{items.length !== 1 ? 's' : ''}</span>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(tut => <TutorialCard key={tut.slug} tut={tut} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
