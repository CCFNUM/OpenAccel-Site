import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { SpotlightCard } from '@/components/SpotlightCard';
import { FluidCanvas } from '@/components/FluidCanvas';
import { FluidSim } from '@/components/FluidSim';
import { FlipCard } from '@/components/FlipCard';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useEffect, useState } from 'react';
import { getRepoStats, getContributors } from '@/lib/github';
import { ArrowRight, BookOpen, Code2, Heart, Zap, Layers, Beaker, Waves, Activity, Cpu, Disc, Terminal } from 'lucide-react';

const CAPABILITIES = [
  { icon: Activity, title: 'Single-phase flow',          desc: 'Incompressible & low-Mach flows',        link: '/tutorials/cavity',           accent: 'var(--cold)' },
  { icon: Waves,    title: 'Multiphase VOF',              desc: 'FCT/cMULES interface compression',       link: '/tutorials/damBreak',          accent: 'var(--flux)' },
  { icon: Layers,   title: 'Fluid–structure interaction', desc: 'Partitioned ALE approach',               link: '/tutorials/perpendicularFlap', accent: 'var(--hot)' },
  { icon: Zap,      title: 'Conjugate heat transfer',     desc: 'Coupled fluid-solid diffusion',          link: '/tutorials/slab',              accent: 'var(--warm)' },
  { icon: Beaker,   title: 'RANS turbulence',             desc: 'k-ε, k-ω SST, Transition SST',          link: '/tutorials/pitzDaily',         accent: 'var(--violet)' },
  { icon: Disc,     title: 'Solid mechanics',             desc: 'Linear elasticity & stress analysis',    link: '/tutorials/plateHole',         accent: 'var(--signal)' },
  { icon: Terminal, title: 'Multi-domain / non-conformal',desc: 'Interpolation across interfaces',        link: '/tutorials/rotatingCylinder',           accent: 'var(--cold)' },
  { icon: Cpu,      title: 'Compressible flow',           desc: 'Pressure-based solver formulations',     link: '/tutorials/circularArc',       accent: 'var(--violet)' },
];

export function Home() {
  useDocumentTitle('Home');
  const [stats, setStats] = useState<any>(null);
  const [contributors, setContributors] = useState<any[]>([]);
  const [hoveredCap, setHoveredCap] = useState<number | null>(null);

  useEffect(() => {
    getRepoStats().then(setStats);
    getContributors().then(c => { if (c) setContributors(c.slice(0, 10)); });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO path="/" />

      {/* 1. Hero — always dark, regardless of page theme (Step 5: keep dark hero on light page).
               data-theme="dark" scopes all CSS tokens inside to dark values. */}
      <section data-theme="dark" className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden border-b border-[var(--hairline)]" style={{ background: 'var(--ink)', color: 'var(--text)' }}>
        <FluidCanvas />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center rounded-full border border-[var(--hairline)] bg-[var(--surface)]/60 backdrop-blur px-3 py-1 text-sm font-mono text-[var(--signal)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--signal)] mr-2 animate-pulse" />
            Website Under Development — v0.2.0
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-[6rem] leading-none tracking-tight text-[var(--text)] mb-6">
            Open<span className="text-gradient">Accel</span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--text)] font-medium max-w-3xl mb-4">
            An open-source, vertex-based CVFEM solver for multiphysics CFD
          </p>

          <p className="text-base md:text-lg text-[var(--text-dim)] max-w-2xl leading-relaxed mb-10">
            Built on Trilinos-STK mesh infrastructure with MPI parallelism, OpenAccel delivers pressure-based segregated solvers
            for incompressible and low-Mach flows. Written in C++20, it handles everything from laminar cavity benchmarks to
            coupled fluid–structure interaction with VOF free surfaces.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-cold-hot rounded-md hover:opacity-90 transition-opacity"
            >
              Get started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/develop"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[var(--text)] bg-[var(--surface-2)]/80 backdrop-blur border border-[var(--hairline)] rounded-md hover:bg-[var(--surface)] hover:text-white transition-colors"
            >
              Contribute
            </Link>
          </div>

          <Link href="/cite" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors underline underline-offset-4 decoration-[var(--hairline)] hover:decoration-[var(--cold)]">
            Cite OpenAccel
          </Link>
        </div>
      </section>

      {/* 2. Supported By (moved below hero) */}
      <section className="py-24 border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-2xl md:text-3xl font-display font-bold text-[var(--text)] tracking-tight mb-12 text-center">Supported By</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-mono text-sm uppercase tracking-[0.1em] font-bold text-[var(--text)] mb-2">Funding</h2>
              <div className="w-full mb-6" style={{ height: 2, background: 'linear-gradient(to right, var(--cold), var(--hot))' }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FlipCard
                  brand="snsf"
                  logo={`${import.meta.env.BASE_URL}figures/snsf_logo.png`}
                  alt="SNSF logo"
                  name="Swiss National Science Foundation"
                  href="https://www.snf.ch/en"
                  meta="Grant no. 215627"
                  detail={'"Immersed Methods for Fluid-Structure-Contact-Interaction Simulations and Complex Geometries"'}
                  blurb="Switzerland's national agency funding basic and applied research across all disciplines."
                />
                <FlipCard
                  brand="pasc"
                  logo={`${import.meta.env.BASE_URL}figures/pasc_logo.jpg`}
                  alt="PASC logo"
                  name="Platform for Advanced Scientific Computing"
                  href="https://pasc-ch.org/index.html"
                  meta="XSES-FSI"
                  detail={'"XSES-FSI: towards eXtreme Scale Semi-Structured discretizations for Fluid-Structure Interaction"'}
                  blurb="A Swiss initiative advancing high-performance computing and computational science."
                />
              </div>
            </div>
            <div>
              <h2 className="font-mono text-sm uppercase tracking-[0.1em] font-bold text-[var(--text)] mb-2">Contributing Institutions</h2>
              <div className="w-full mb-6" style={{ height: 2, background: 'linear-gradient(to right, var(--cold), var(--hot))' }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FlipCard
                  brand="hslu"
                  logo={`${import.meta.env.BASE_URL}figures/hslu_logo.png`}
                  alt="HSLU logo"
                  name="Lucerne University of Applied Sciences and Arts"
                  href="https://www.hslu.ch/en/"
                  meta="Host Institution"
                  blurb="The project's host institution and CFD research base in Lucerne, Switzerland."
                />
                <FlipCard
                  brand="aub"
                  logo={`${import.meta.env.BASE_URL}figures/aub_logo.png`}
                  alt="AUB logo"
                  name="American University of Beirut"
                  href="https://www.aub.edu.lb/"
                  meta="Supporting Institution"
                  blurb="A leading research university in Beirut contributing to OpenAccel's development."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Capability grid */}
      <section className="py-24 border-y border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-display text-3xl mb-4">Physics Capabilities</h2>
            <p className="text-[var(--text-dim)] max-w-2xl">
              A unified framework for complex multiphysics simulations, validated against standard analytical and experimental benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map((cap, i) => (
              <SpotlightCard
                key={cap.title}
                href={cap.link}
                accent={cap.accent}
                tilt
                dimmed={hoveredCap !== null && hoveredCap !== i}
                onHoverChange={(h) => setHoveredCap(h ? i : null)}
                className="group p-6 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-2)]"
              >
                <cap.icon className="w-8 h-8 mb-4 opacity-80 group-hover:opacity-100 transition-opacity" style={{ color: cap.accent }} />
                <h3 className="font-display text-lg mb-2">{cap.title}</h3>
                <p className="text-sm text-[var(--text-dim)]">{cap.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Live repo stats */}
      <section className="py-24 bg-[var(--ink)] relative overflow-hidden">
        <FluidSim className="absolute inset-0 w-full h-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="lg:w-1/3">
              <h2 className="font-display text-3xl mb-4">Open Development</h2>
              <p className="text-[var(--text-dim)] mb-6">OpenAccel is built in the open. Contributions from researchers and engineers are welcome.</p>

              {stats && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-md bg-[var(--surface)] border border-[var(--hairline)]">
                    <div className="text-2xl font-mono mb-1">{stats.stars}</div>
                    <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Stars</div>
                  </div>
                  <div className="p-4 rounded-md bg-[var(--surface)] border border-[var(--hairline)]">
                    <div className="text-2xl font-mono mb-1">{stats.forks}</div>
                    <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Forks</div>
                  </div>
                  <div className="p-4 rounded-md bg-[var(--surface)] border border-[var(--hairline)]">
                    <div className="text-2xl font-mono text-[var(--hot)] mb-1">{stats.openIssues}</div>
                    <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Issues</div>
                  </div>
                  <div className="p-4 rounded-md bg-[var(--surface)] border border-[var(--hairline)]">
                    <div className="text-2xl font-mono text-[var(--cold)] mb-1">{stats.latestRelease}</div>
                    <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Release</div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:w-2/3 w-full">
              <h3 className="font-display text-xl mb-6">Recent Contributors</h3>
              {contributors.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {contributors.map(c => (
                    <a key={c.login} href={c.profileUrl} target="_blank" rel="noreferrer" className="group relative">
                      <img src={c.avatarUrl} alt={c.login}
                        className="w-12 h-12 rounded-full border border-[var(--hairline)] group-hover:border-[var(--cold)] transition-colors"
                        style={{ minWidth: 48, minHeight: 48 }} />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--surface-2)] text-xs px-2 py-1 rounded border border-[var(--hairline)] whitespace-nowrap z-10 pointer-events-none">
                        {c.login}
                      </div>
                    </a>
                  ))}
                  <Link href="/community/contributors" className="w-12 h-12 rounded-full border border-[var(--hairline)] border-dashed flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors bg-[var(--surface)]">+</Link>
                </div>
              ) : (
                <p className="text-sm text-[var(--text-dim)] italic">Loading contributors…</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Three-card row */}
      <section className="py-24 bg-[var(--surface)] border-t border-[var(--hairline)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SpotlightCard accent="var(--cold)" className="p-8 rounded-lg bg-[var(--ink)] flex flex-col">
              <BookOpen className="w-8 h-8 text-[var(--cold)] mb-6" />
              <h3 className="font-display text-2xl mb-4">Use it</h3>
              <p className="text-[var(--text-dim)] mb-8 flex-grow">Run standard CFD benchmarks, evaluate different turbulence models, or couple fluids and solids. The tutorials walk you through everything.</p>
              <Link href="/tutorials" className="text-[var(--cold)] hover:text-white font-medium flex items-center group">
                Browse tutorials <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SpotlightCard>
            <SpotlightCard accent="var(--hot)" className="p-8 rounded-lg bg-[var(--ink)] flex flex-col">
              <Code2 className="w-8 h-8 text-[var(--hot)] mb-6" />
              <h3 className="font-display text-2xl mb-4">Extend it</h3>
              <p className="text-[var(--text-dim)] mb-8 flex-grow">A modular C++20 architecture designed for researchers to implement new physics models without rewriting the solver core.</p>
              <Link href="/develop" className="text-[var(--hot)] hover:text-white font-medium flex items-center group">
                Developer guide <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SpotlightCard>
            <SpotlightCard accent="var(--signal)" className="p-8 rounded-lg bg-[var(--ink)] flex flex-col">
              <Heart className="w-8 h-8 text-[var(--signal)] mb-6" />
              <h3 className="font-display text-2xl mb-4">Fund it</h3>
              <p className="text-[var(--text-dim)] mb-8 flex-grow">Partner with the core team to accelerate feature development, secure dedicated support, or sponsor a PhD thesis.</p>
              <Link href="/support" className="text-[var(--signal)] hover:text-white font-medium flex items-center group">
                Support options <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SpotlightCard>
          </div>
        </div>
      </section>

    </div>
  );
}
