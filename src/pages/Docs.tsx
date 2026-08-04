import { useDocumentTitle } from '@/hooks/use-document-title';
import { SEO } from '@/components/SEO';
import { CodeBlock } from '@/components/CodeBlock';
import { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, X } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/* ── Callout component ────────────────────────────────────────────── */
type CalloutType = 'note' | 'tip' | 'warning' | 'danger';
const CALLOUT_CFG: Record<CalloutType, { color: string; bg: string; label: string; icon: string }> = {
  note:    { color: 'var(--cold)',   bg: 'rgba(59,130,246,0.08)',  label: 'Note',      icon: 'ℹ' },
  tip:     { color: 'var(--signal)', bg: 'rgba(34,211,166,0.08)',  label: 'Tip',       icon: '💡' },
  warning: { color: 'var(--warm)',   bg: 'rgba(234,179,8,0.08)',   label: 'Warning',   icon: '⚠' },
  danger:  { color: 'var(--hot)',    bg: 'rgba(249,115,22,0.08)',  label: 'Important', icon: '!' },
};

function Callout({ type, children }: { type: CalloutType; children: React.ReactNode }) {
  const cfg = CALLOUT_CFG[type];
  return (
    <div
      className="my-6 pl-4 py-4 pr-4 rounded-r-md"
      style={{ borderLeft: `3px solid ${cfg.color}`, background: cfg.bg }}
    >
      <p className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: cfg.color }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{cfg.icon}</span>
        {cfg.label}
      </p>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Heading with anchor link ────────────────────────────────────── */
function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-3xl font-display font-semibold scroll-mt-24 mb-6" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--hairline)' }}>
      <a href={`#${id}`} className="anchor-link">#</a>
      {children}
    </h2>
  );
}
function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-xl font-medium scroll-mt-24 mt-8 mb-4" style={{ color: 'var(--text)' }}>
      <a href={`#${id}`} className="anchor-link">#</a>
      {children}
    </h3>
  );
}

const SIDEBAR_SECTIONS = [
  {
    label: 'Getting Started',
    items: [
      { href: '#installation', label: 'Installation' },
      { href: '#dependencies', label: 'Dependencies' },
      { href: '#build', label: 'Clone & Build' },
      { href: '#run', label: 'Run a Simulation' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { href: '#input-file', label: 'Input File (YAML)' },
      { href: '#theory-guide', label: 'Theory Guide' },
      { href: '#faq', label: 'FAQ & Troubleshooting' },
    ],
  },
];

const TOC_LINKS = [
  { href: '#installation',   label: 'Installation' },
  { href: '#dependencies',   label: 'Dependencies' },
  { href: '#build',          label: 'Clone & Build' },
  { href: '#run',            label: 'Run a Simulation' },
  { href: '#input-file',     label: 'Input File Reference' },
  { href: '#theory-guide',   label: 'Theory Guide' },
  { href: '#faq',            label: 'FAQ & Troubleshooting' },
];

export function Docs() {
  useDocumentTitle('Documentation');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const mathElements = document.querySelectorAll('.math-inline, .math-display');
    mathElements.forEach(el => {
      const tex = el.getAttribute('data-tex');
      if (tex) {
        katex.render(tex, el as HTMLElement, {
          displayMode: el.classList.contains('math-display'),
          throwOnError: false,
        });
      }
    });
  }, []);

  // Close sidebar on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const SidebarNav = () => (
    <nav className="space-y-6">
      {SIDEBAR_SECTIONS.map(section => (
        <div key={section.label}>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-dim)] mb-3">
            {section.label}
          </h4>
          <ul className="space-y-1">
            {section.items.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="block px-3 py-1.5 text-sm rounded transition-colors text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div>
      <SEO
        title="Documentation"
        description="OpenAccel documentation: installation, dependency setup with Spack, CMake build, input file reference (YAML), theory guide, and FAQ for the open-source multiphysics CVFEM CFD solver."
        path="/docs"
      />
      {/* Page hero band */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--cold)' }}>Documentation</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2">Documentation</h1>
          <div className="gradient-rule w-full mt-4" />
        </div>
      </div>

      {/* Mobile: sticky Contents button */}
      <div className="xl:hidden sticky top-16 z-30 px-4 py-2 bg-[var(--ink)] border-b border-[var(--hairline)] flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded border border-[var(--hairline)] bg-[var(--surface)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--cold)] transition-colors"
          style={{ minHeight: 44 }}
        >
          <BookOpen size={14} /> Contents
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex">
          <div className="w-72 max-w-[85vw] bg-[var(--surface)] border-r border-[var(--hairline)] p-6 overflow-y-auto flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-semibold text-sm">Contents</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[var(--text-dim)] hover:text-white"
                style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>
            <SidebarNav />
          </div>
          <div className="flex-1 bg-black/50 cursor-pointer" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col xl:flex-row gap-12">
        {/* Left Sidebar (desktop) */}
        <aside className="xl:w-56 shrink-0 hidden xl:block">
          <div className="sticky top-24">
            <SidebarNav />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile collapsible TOC pinned under page title */}
          <div className="xl:hidden mb-8 rounded-md border border-[var(--hairline)] overflow-hidden">
            <button
              onClick={() => setTocOpen(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface)] text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
              style={{ minHeight: 44 }}
            >
              <span className="font-mono text-xs uppercase tracking-wider">On this page</span>
              {tocOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {tocOpen && (
              <div className="px-4 pb-4 border-t border-[var(--hairline)] bg-[var(--surface)] space-y-2 pt-3">
                {TOC_LINKS.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setTocOpen(false)} className="block text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Prose */}
          <div
            className="docs-content"
            style={{ fontSize: 17, lineHeight: 1.7, maxWidth: '72ch', color: 'var(--text)' }}
          >
            <p className="mb-12" style={{ fontSize: 18, color: 'var(--text-dim)' }}>
              OpenAccel is a high-performance C++20 code built from source with CMake and Spack.
              This guide covers installing dependencies, building the code, configuring an input file, and running your first simulation.
            </p>

            {/* ── Getting Started ── */}
            <section id="installation" className="scroll-mt-24 mb-16">
              <H2 id="installation">Getting Started</H2>

              <H3 id="dependencies">Dependencies</H3>
              <ul className="list-disc pl-5 space-y-2 mb-6" style={{ color: 'var(--text-dim)' }}>
                <li><strong style={{ color: 'var(--text)' }}>Compiler:</strong> GCC ≥ 11</li>
                <li><strong style={{ color: 'var(--text)' }}>Build System:</strong> CMake ≥ 3.18, Ninja</li>
                <li><strong style={{ color: 'var(--text)' }}>Parallelism:</strong> MPI (MPICH or OpenMPI)</li>
                <li><strong style={{ color: 'var(--text)' }}>Package Manager:</strong> Spack (recommended for Trilinos setup)</li>
                <li><strong style={{ color: 'var(--text)' }}>Optional:</strong> PETSc ≥ 3.18, HYPRE ≥ 3.0</li>
              </ul>

              <Callout type="warning">
                <strong>Trilinos &amp; PnetCDF:</strong> Trilinos must be built with STK and the Exodus interface enabled. If PnetCDF is present
                in the Spack environment, ensure it is built with a compatible MPI. Mismatched MPI libraries cause silent link failures.
              </Callout>

              <Callout type="warning">
                <strong>64-bit mesh indices:</strong> For meshes with more than ~2 × 10⁹ cells, configure Trilinos with
                <code>-DTRILINOS_ENABLE_64BIT_GLOBAL_IDS=ON</code>. This is off by default and cannot be toggled after build.
              </Callout>

              <H3 id="build">Clone &amp; Build</H3>
              <p style={{ color: 'var(--text-dim)' }}>The repository uses submodules for external dependencies (Eigen, nanoflann, etc.). Clone recursively:</p>
              <CodeBlock lang="bash" code={`$ git clone --recurse-submodules https://github.com/CCFNUM/OpenAccel\n$ cd OpenAccel`} />

              <p style={{ color: 'var(--text-dim)' }}>Activate the Spack environment. This installs Trilinos, STK, and other heavy dependencies:</p>
              <CodeBlock lang="bash" code={`$ spack env activate tools/spack/openaccel-env\n$ spack install`} />

              <p style={{ color: 'var(--text-dim)' }}>Configure and build with CMake:</p>
              <CodeBlock lang="bash" code={`$ cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DPETSC=ON\n$ ninja -C build`} />

              <Callout type="tip">
                For faster iteration during development, build with <code>-DCMAKE_BUILD_TYPE=Debug -DSANITIZE=ON</code> to enable address and undefined-behaviour sanitizers.
              </Callout>

              <H3 id="run">Run a Simulation</H3>
              <p style={{ color: 'var(--text-dim)' }}>Run a serial cavity benchmark:</p>
              <CodeBlock lang="bash" code={`$ ./build/OpenAccel examples/cavity/cavity.yaml`} />

              <p style={{ color: 'var(--text-dim)' }}>For parallel runs, OpenAccel uses Zoltan2 for mesh partitioning:</p>
              <CodeBlock lang="bash" code={`$ mpirun -np 4 ./build/OpenAccel examples/cavity/cavity.yaml --decompose rcb`} />
              <p className="text-sm mt-2" style={{ color: 'var(--text-dim)' }}>
                Decomposition options: <code>rcb</code>, <code>rib</code>, <code>hsfc</code>, <code>rcb_ignore_z</code>.
              </p>
            </section>

            {/* ── Input File ── */}
            <section id="input-file" className="scroll-mt-24 mb-16">
              <H2 id="input-file">Input File Reference</H2>
              <p style={{ color: 'var(--text-dim)' }}>
                OpenAccel uses YAML for configuration. The top-level structure defines the mesh, time-stepping, physics models, and boundary conditions.
              </p>

              <CodeBlock lang="yaml" code={`mesh:
  type: exodus
  path: mesh/cavity.exo

time:
  type: steady
  max_iterations: 1000

physics:
  type: incompressible
  fluid:
    kinematic_viscosity: 0.01

boundary_conditions:
  - type: wall
    parts: [bottom_wall, left_wall, right_wall]
  - type: fixed_velocity
    parts: [top_lid]
    value: [1.0, 0.0, 0.0]

solver:
  pressure:
    backend: hypre
    tolerance: 1e-6
  velocity:
    backend: petsc
    tolerance: 1e-6`} />

              <Callout type="note">
                File paths in YAML are resolved relative to the directory containing the YAML file, not the working directory.
                Always use relative paths for portability across systems.
              </Callout>
            </section>

            {/* ── Theory Guide ── */}
            <section id="theory-guide" className="scroll-mt-24 mb-16">
              <H2 id="theory-guide">Theory Guide</H2>
              <div className="p-8 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--cold)]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                  The complete Theory Guide PDF is built by GitHub Actions on every commit and shipped with each release.
                  It covers governing equations, finite volume discretisation, turbulence models, VOF with FCT/cMULES interface compression, ALE formulation, and conjugate heat transfer.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <a href="https://github.com/CCFNUM/OpenAccel/releases/latest" className="px-4 py-2 bg-[var(--surface-2)] border border-[var(--hairline)] rounded text-sm hover:bg-[var(--surface)] hover:text-white transition-colors inline-block">
                    Download with v0.2.0 release
                  </a>
                  <a href="https://github.com/CCFNUM/OpenAccel/actions" className="px-4 py-2 border border-[var(--hairline)] rounded text-sm hover:text-[var(--text)] transition-colors inline-block" style={{ color: 'var(--text-dim)' }}>
                    View on GitHub Actions
                  </a>
                </div>

                <p className="text-sm font-serif italic mb-3" style={{ color: 'var(--text-dim)' }}>Incompressible Navier-Stokes (from the guide):</p>
                <div
                  className="math-display p-4 bg-[var(--ink)] border border-[var(--hairline)] rounded overflow-x-auto text-center"
                  data-tex="\frac{\partial \mathbf{u}}{\partial t} + \nabla \cdot (\mathbf{u} \otimes \mathbf{u}) = -\frac{1}{\rho}\nabla p + \nu \nabla^2 \mathbf{u} + \mathbf{g}"
                />
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="scroll-mt-24 mb-16">
              <H2 id="faq">FAQ &amp; Troubleshooting</H2>
              <div className="space-y-6">
                {[
                  {
                    q: 'CMake cannot find Trilinos',
                    a: 'Ensure the Spack environment is active, or set TRILINOS_DIR to point to your Trilinos installation prefix.'
                  },
                  {
                    q: 'Build fails with MPI errors',
                    a: 'Ensure MPICH or OpenMPI is in your PATH. If CMake detects a different MPI than the one used by Trilinos, the build will fail.'
                  },
                  {
                    q: 'Spack install takes too long',
                    a: 'Spack builds everything from source. Configure Spack to use binary mirrors (buildcaches) for standard packages like GCC, OpenMPI, and CMake to speed this up significantly.'
                  },
                  {
                    q: 'Segfault on decomposition',
                    a: 'Check that Zoltan2 was built with the correct MPI implementation and that the number of ranks divides the mesh cleanly for your chosen decomposition method.'
                  },
                ].map(({ q, a }) => (
                  <div key={q}>
                    <h4 className="font-semibold text-lg mb-1" style={{ color: 'var(--text)' }}>{q}</h4>
                    <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right TOC (desktop only ≥ 2xl) */}
        <div className="hidden 2xl:block w-48 shrink-0">
          <div className="sticky top-24 text-sm" style={{ color: 'var(--text-dim)' }}>
            <p className="font-mono text-xs uppercase tracking-wider mb-4 pb-2 border-b border-[var(--hairline)]">On this page</p>
            <ul className="space-y-2 border-l border-[var(--hairline)] pl-4">
              {TOC_LINKS.map(l => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-[var(--cold)] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
