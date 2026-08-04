/**
 * Tutorials.tsx — Restructured Tutorials page.
 *
 * Layout:
 *   1. Hero band
 *   2. Getting Started callout (links to /get-started)
 *   3. Pipeline row: Geometry · Mesh · Setup · Solution · Post-Processing (static; href slots ready)
 *   4. Search + filter bar (search input, physics chips, difficulty chips) — synced to URL
 *   5. Tutorial groups, each with a card grid driven by tutorial.group field
 */
import { useMemo, useEffect, useRef } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
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
import { ArrowRight, Clock, ChevronRight, Search, X, FileText } from 'lucide-react';

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

type PhysicsTag = string;
type DifficultyTag = 'beginner' | 'intermediate' | 'advanced';
type DimTag = '2D' | '3D';

// ── Difficulty badge ─────────────────────────────────────────────────────────
const DIFF_COLOR: Record<string, string> = {
  beginner:     'var(--signal)',
  intermediate: 'var(--warm)',
  advanced:     'var(--hot)',
};

const ALL_DIFFICULTIES: DifficultyTag[] = ['beginner', 'intermediate', 'advanced'];

// ── Physics filter chips ─────────────────────────────────────────────────────
const ALL_PHYSICS = [...new Set(tutorials.flatMap(t => t.physics))].sort() as PhysicsTag[];

// ── Dim filter chips ─────────────────────────────────────────────────────────
const ALL_DIMS: DimTag[] = ['2D', '3D'];

// ── URL helpers ──────────────────────────────────────────────────────────────
function parseSearch(search: string) {
  const p = new URLSearchParams(search);
  return {
    q:       p.get('q') ?? '',
    physics: p.get('physics') ?? 'all',
    diff:    p.get('diff') ?? 'all',
    dim:     p.get('dim') ?? 'all',
  };
}

function buildSearch(q: string, physics: string, diff: string, dim: string): string {
  const p = new URLSearchParams();
  if (q)                 p.set('q', q);
  if (physics !== 'all') p.set('physics', physics);
  if (diff !== 'all')    p.set('diff', diff);
  if (dim !== 'all')     p.set('dim', dim);
  const s = p.toString();
  return s ? `?${s}` : '';
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
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full font-mono"
              style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)` }}>
              {physicsLabel(tag)}
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full" style={{ color: diffColor, background: `${diffColor}18`, border: `1px solid ${diffColor}30` }}>
          {tut.difficulty}
        </span>
        <span className="text-xs text-[var(--text-dim)] flex items-center gap-1">
          <Clock size={11} />{displayTime(tut.estimatedTime)}
        </span>
      </div>
    </Link>
  );
}

// ── Page component ────────────────────────────────────────────────────────────
export function Tutorials() {
  useDocumentTitle('Tutorials');
  const [location, setLocation] = useLocation();
  const searchStr = useSearch();

  // Parse filter state from URL
  const { q, physics: physicsFilter, diff: diffFilter, dim: dimFilter } = useMemo(
    () => parseSearch(searchStr),
    [searchStr],
  );

  // Push a new URL whenever any filter changes — replace so back-button stays sane
  function updateFilters(
    newQ: string,
    newPhysics: string,
    newDiff: string,
    newDim: string,
  ) {
    const qs = buildSearch(newQ, newPhysics, newDiff, newDim);
    setLocation(`${location.split('?')[0]}${qs}`, { replace: true });
  }

  // Filtered + grouped tutorials
  const grouped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const active = tutorials.filter(t => {
      if (physicsFilter !== 'all' && !t.physics.includes(physicsFilter)) return false;
      if (diffFilter    !== 'all' && t.difficulty !== diffFilter)         return false;
      if (dimFilter     !== 'all' && t.dim !== dimFilter)                 return false;
      if (needle && !(
        t.displayTitle.toLowerCase().includes(needle) ||
        t.description.toLowerCase().includes(needle)  ||
        t.caseId.toLowerCase().includes(needle)       ||
        t.slug.toLowerCase().includes(needle)
      )) return false;
      return true;
    });
    return TUTORIAL_GROUPS.map((group: TutorialGroup) => ({
      group,
      items: active.filter(t => t.group === group),
    })).filter(g => g.items.length > 0);
  }, [q, physicsFilter, diffFilter, dimFilter]);

  const totalVisible = grouped.reduce((n, g) => n + g.items.length, 0);
  const anyFilter = q !== '' || physicsFilter !== 'all' || diffFilter !== 'all' || dimFilter !== 'all';

  function clearAll() {
    updateFilters('', 'all', 'all', 'all');
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

        {/* 4. Search + filter bar */}
        <div className="mb-10 space-y-4">

          {/* Search input */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)] pointer-events-none" />
            <input
              type="search"
              value={q}
              onChange={e => updateFilters(e.target.value, physicsFilter, diffFilter, dimFilter)}
              placeholder="Search tutorials by title or description…"
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-dim)] text-sm focus:outline-none focus:border-[var(--cold)] transition-colors"
            />
            {q && (
              <button
                onClick={() => updateFilters('', physicsFilter, diffFilter, dimFilter)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Physics filter chips */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-dim)] mb-2">Physics</p>
            <div className="overflow-x-auto pb-1 -mx-4 px-4">
              <div className="flex flex-nowrap gap-2 min-w-max">
                <button
                  onClick={() => updateFilters(q, 'all', diffFilter, dimFilter)}
                  className="px-4 py-1.5 rounded-full text-sm font-mono border transition-all"
                  style={{
                    minHeight: 36,
                    background: physicsFilter === 'all' ? 'var(--cold)' : 'var(--surface)',
                    color: physicsFilter === 'all' ? '#fff' : 'var(--text-dim)',
                    borderColor: physicsFilter === 'all' ? 'var(--cold)' : 'var(--hairline)',
                  }}>
                  All ({tutorials.length})
                </button>
                {ALL_PHYSICS.map(tag => {
                  const color = physicsColor(tag);
                  const count = tutorials.filter(t => t.physics.includes(tag)).length;
                  const active = physicsFilter === tag;
                  return (
                    <button key={tag}
                      onClick={() => updateFilters(q, active ? 'all' : tag, diffFilter, dimFilter)}
                      className="px-4 py-1.5 rounded-full text-sm font-mono border transition-all"
                      style={{
                        minHeight: 36,
                        background: active ? color : 'var(--surface)',
                        color: active ? '#fff' : color,
                        borderColor: active ? color : `color-mix(in srgb, ${color} 35%, transparent)`,
                      }}>
                      {physicsLabel(tag)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Difficulty filter chips */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-dim)] mb-2">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilters(q, physicsFilter, 'all', dimFilter)}
                className="px-4 py-1.5 rounded-full text-sm font-mono border transition-all"
                style={{
                  minHeight: 36,
                  background: diffFilter === 'all' ? 'var(--cold)' : 'var(--surface)',
                  color: diffFilter === 'all' ? '#fff' : 'var(--text-dim)',
                  borderColor: diffFilter === 'all' ? 'var(--cold)' : 'var(--hairline)',
                }}>
                All
              </button>
              {ALL_DIFFICULTIES.map(diff => {
                const color = DIFF_COLOR[diff];
                const count = tutorials.filter(t => t.difficulty === diff).length;
                const active = diffFilter === diff;
                return (
                  <button key={diff}
                    onClick={() => updateFilters(q, physicsFilter, active ? 'all' : diff, dimFilter)}
                    className="px-4 py-1.5 rounded-full text-sm font-mono border capitalize transition-all"
                    style={{
                      minHeight: 36,
                      background: active ? color : 'var(--surface)',
                      color: active ? '#fff' : color,
                      borderColor: active ? color : `color-mix(in srgb, ${color} 35%, transparent)`,
                    }}>
                    {diff} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimension filter chips */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-dim)] mb-2">Dimension</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilters(q, physicsFilter, diffFilter, 'all')}
                className="px-4 py-1.5 rounded-full text-sm font-mono border transition-all"
                style={{
                  minHeight: 36,
                  background: dimFilter === 'all' ? 'var(--cold)' : 'var(--surface)',
                  color: dimFilter === 'all' ? '#fff' : 'var(--text-dim)',
                  borderColor: dimFilter === 'all' ? 'var(--cold)' : 'var(--hairline)',
                }}>
                All
              </button>
              {ALL_DIMS.map(dim => {
                const count = tutorials.filter(t => t.dim === dim).length;
                const active = dimFilter === dim;
                return (
                  <button key={dim}
                    onClick={() => updateFilters(q, physicsFilter, diffFilter, active ? 'all' : dim)}
                    className="px-4 py-1.5 rounded-full text-sm font-mono border transition-all"
                    style={{
                      minHeight: 36,
                      background: active ? 'var(--cold)' : 'var(--surface)',
                      color: active ? '#fff' : 'var(--text-dim)',
                      borderColor: active ? 'var(--cold)' : 'var(--hairline)',
                    }}>
                    {dim} ({count})
                  </button>
                );
              })}
            </div>
          </div>

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
