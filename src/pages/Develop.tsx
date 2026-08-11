import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { DataFlow } from '@/components/DataFlow';
import { ArrowRight, GitPullRequest, Settings, Terminal, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';
import { SpotlightCard } from '@/components/SpotlightCard';

const EXPERTISE_TILES = [
  { label: 'Trilinos / Kokkos',     desc: 'Kokkos threading, GPU back-ends',      accent: 'var(--cold)' },
  { label: 'GPU Porting',            desc: 'CUDA / HIP, performance portability',  accent: 'var(--hot)' },
  { label: 'LES / DES Turbulence',  desc: 'Scale-resolving closure models',        accent: 'var(--violet)' },
  { label: 'Combustion',            desc: 'Reactive flows, species transport',      accent: 'var(--warm)' },
  { label: 'Adjoint / Optimisation',desc: 'Discrete adjoints, sensitivity',        accent: 'var(--flux)' },
  { label: 'Immersed Methods',      desc: 'Embedded boundaries, IBM variants',      accent: 'var(--signal)' },
];

const TECH_STACK = [
  { name: 'C++20',        desc: 'Core language — concepts, ranges, coroutines'  },
  { name: 'MPI',          desc: 'Distributed-memory parallelism (MPICH / OpenMPI)' },
  { name: 'Trilinos-STK', desc: 'Parallel mesh database and I/O (ExodusII)' },
  { name: 'PETSc',        desc: 'Linear and non-linear solver backend' },
  { name: 'HYPRE',        desc: 'AMG preconditioners for pressure systems' },
  { name: 'CMake',        desc: 'Build system (≥ 3.18) with Ninja generator' },
  { name: 'Spack',        desc: 'Package manager for reproducible dependency builds' },
  { name: 'Exodus',       desc: 'Mesh / result file format (via NetCDF)' },
];

const ONGOING_PROJECTS = [
  {
    acronym: 'SNSF',
    funder: 'Swiss National Science Foundation',
    grant: 'Grant no. 215627',
    title: 'Immersed Methods for Fluid-Structure-Contact-Interaction Simulations and Complex Geometries',
    desc: 'Developing IBM variants for complex moving boundaries without body-fitted meshing, enabling FSI with contact and complex geometry without remeshing.',
    accent: 'var(--cold)',
  },
  {
    acronym: 'PASC',
    funder: 'Platform for Advanced Scientific Computing',
    grant: 'XSES-FSI',
    title: 'XSES-FSI: towards eXtreme Scale Semi-Structured discretizations for Fluid-Structure Interaction',
    desc: 'Scaling OpenAccel to extreme-scale HPC systems using semi-structured discretisations optimised for memory hierarchy and Kokkos GPU portability.',
    accent: 'var(--violet)',
  },
];

const WORKFLOW_STEPS = [
  { icon: GitPullRequest, label: 'Fork & Branch', desc: "Create a feature branch (`feat/my-feature` or `fix/issue-123`) from `main`.", color: 'var(--hot)' },
  { icon: Terminal,       label: 'Commit',         desc: 'Follow conventional commits (`feat:`, `fix:`, `docs:`, `test:`). Format with clang-format before pushing.', color: 'var(--hot)' },
  { icon: Settings,       label: 'CI Pipeline',    desc: 'GitHub Actions builds across GCC 11/13 and MPICH/OpenMPI, then runs the full examples regression suite.', color: 'var(--violet)' },
  { icon: CheckCircle2,   label: 'Review & Merge', desc: 'Requires 2 approvals before squash-merge into main.', color: 'var(--signal)' },
];

export function Develop() {
  useDocumentTitle('Develop');

  return (
    <div>
      <SEO
        title="Develop & Contribute"
        description="Contribute to OpenAccel: architecture, built-on tech stack, ongoing funded research, and contribution workflow for the open-source C++20 CVFEM CFD solver."
        path="/develop"
      />
      {/* Page hero band */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3 text-[var(--hot)]">Contribute</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">Develop &amp; Contribute</h1>
          <p className="text-lg text-[var(--text-dim)] max-w-2xl">
            OpenAccel is an early-stage research code where a single contributor can own an entire physics module.
            Written in C++20 with clean abstractions.
          </p>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* 1. Why contribute */}
        <section className="mb-20">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]">Why contribute?</h2>
          <p className="text-[var(--text-dim)] leading-relaxed">
            Unlike massive legacy CFD codes, OpenAccel's codebase is small enough to grasp completely.
            The architecture is documented, the build system uses modern CMake, and the example cases serve as the regression test suite.
            We actively review PRs and welcome architectural discussions.
          </p>
        </section>

        {/* 2. Architecture overview */}
        <section id="architecture" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]">Architecture Overview</h2>

          <h3 className="text-lg font-medium mb-3 text-[var(--text)]">Repository Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { dir: 'src/',           desc: 'Solver source (fields, assembly, linear systems, physics modules)', accent: 'var(--cold)' },
              { dir: 'examples/',      desc: 'The 16 benchmark cases, each with a YAML input and reference data', accent: 'var(--cold)' },
              { dir: 'tools/spack/',   desc: 'Spack environment files for all supported platforms',              accent: 'var(--violet)' },
              { dir: 'cmake/',         desc: 'CMake module files and find-scripts for Trilinos, PETSc, HYPRE',   accent: 'var(--violet)' },
              { dir: 'docs/theory/',   desc: 'LaTeX source for the Theory Guide (auto-built by CI)',             accent: 'var(--warm)' },
              { dir: 'external/',      desc: 'Bundled submodules: Eigen, ExprTk, nanoflann, gplotpp',           accent: 'var(--signal)' },
            ].map(item => (
              <SpotlightCard key={item.dir} external href={`https://github.com/CCFNUM/OpenAccel/tree/main/${item.dir.replace(/\/$/, '')}`} accent={item.accent} className="p-3 bg-[var(--surface)] rounded flex items-start gap-3">
                <FileText className="shrink-0 w-5 h-5 mt-0.5" style={{ color: item.accent }} />
                <div>
                  <div className="font-mono text-sm text-[var(--text)]">{item.dir}</div>
                  <div className="text-xs text-[var(--text-dim)] mt-1">{item.desc}</div>
                </div>
              </SpotlightCard>
            ))}
          </div>

          <h3 className="text-lg font-medium mb-4 text-[var(--text)]">Internal Solver Data Flow</h3>
          <DataFlow />
        </section>

        {/* 3. Built on */}
        <section className="mb-20">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]">Built on Industry Standards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TECH_STACK.map(t => (
              <div key={t.name} className="p-4 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg flex items-start gap-3">
                <code className="text-sm font-mono text-[var(--cold)] shrink-0 mt-0.5">{t.name}</code>
                <p className="text-sm text-[var(--text-dim)]">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Ongoing projects */}
        <section className="mb-20">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]">Ongoing Projects</h2>
          <div className="space-y-6">
            {ONGOING_PROJECTS.map(p => (
              <div key={p.acronym} className="p-6 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg" style={{ borderTopColor: p.accent, borderTopWidth: 2 }}>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="font-display font-semibold text-[var(--text)] text-lg leading-snug">{p.title}</div>
                    <div className="text-xs font-mono mt-1" style={{ color: p.accent }}>{p.funder} · {p.grant}</div>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-dim)] leading-relaxed">{p.desc}</p>
                
              </div>
            ))}
          </div>
        </section>

        {/* 5. Contribution workflow */}
        <section className="mb-20">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]">Contribution Workflow</h2>
          <ol className="relative border-l border-[var(--hairline)] ml-3 space-y-8 mb-10">
            {WORKFLOW_STEPS.map(step => (
              <li key={step.label} className="pl-6">
                <span className="absolute w-3 h-3 bg-[var(--surface)] rounded-full -left-1.5 border top-1.5" style={{ borderColor: step.color }} />
                <h3 className="font-medium flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <step.icon size={16} style={{ color: step.color }} /> {step.label}
                </h3>
                <p className="text-sm text-[var(--text-dim)] mt-1">{step.desc}</p>
              </li>
            ))}
          </ol>

          <div className="border-t border-[var(--hairline)] pt-8">
            <h3 className="text-base font-medium mb-4 text-[var(--text)]">Developer checklist before opening a PR</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--text-dim)] mb-2">Run the regression suite to confirm all validation cases still converge and pass:</p>
                <CodeBlock lang="bash" code={`$ python3 tools/python/regression_tests/quick_test.py`} />
              </div>
              <div>
                <p className="text-sm text-[var(--text-dim)] mb-2">Format all changed C++ source files:</p>
                <CodeBlock lang="bash" code={`$ clang-format -i src/**/*.cpp src/**/*.hpp`} />
              </div>
            </div>
          </div>
        </section>

        {/* 6. Wanted Expertise */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]">Wanted Expertise</h2>
          <p className="text-[var(--text-dim)] mb-8">
            We are actively looking for researchers with experience in the areas below.
            Each can be the foundation of a collaboration, a PhD thesis, or a standalone contribution.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {EXPERTISE_TILES.map(tile => (
              <div key={tile.label} className="p-5 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg" style={{ borderTopColor: tile.accent, borderTopWidth: 2 }}>
                <h3 className="font-medium mb-1" style={{ color: tile.accent }}>{tile.label}</h3>
                <p className="text-sm text-[var(--text-dim)]">{tile.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/community" className="inline-flex items-center px-6 py-3 border border-[var(--hairline)] text-[var(--text)] hover:text-white hover:border-[var(--hot)] rounded transition-all bg-[var(--surface-2)]" style={{ minHeight: 44 }}>
              Join the community discussion
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
