import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { Link } from 'wouter';
import { GsLayout, H2, H3, Callout } from './GsLayout';
import { ArrowRight } from 'lucide-react';

export function Ch12WorkedExample() {
  useDocumentTitle('Worked Example — User Guide');
  return (
    <GsLayout chNum="12" title="Worked Example">
      <SEO title="Worked Example — User Guide" description="End-to-end walkthrough of the lid-driven cavity case: mesh, input file, running, and interpreting results. Cross-linked to VC001." path="/get-started/worked-example" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-10 text-lg">
        This chapter walks through the lid-driven cavity benchmark end-to-end: mesh generation,
        input file configuration, running the solver, and interpreting the results.
        The same case appears as VC001 in the Verification &amp; Validation Manual.
      </p>

      {/* VC001 cross-link card */}
      <Link href="/tutorials/lidDrivenCavity"
        className="group flex items-center gap-4 p-5 rounded-xl border border-[var(--cold)]/40 bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors mb-10">
        <div className="flex-grow min-w-0">
          <p className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--cold)' }}>Related tutorial</p>
          <p className="font-display font-semibold leading-snug group-hover:text-white transition-colors">
            VC001 — Lid-Driven Cavity
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
            Benchmark results, mesh convergence, and comparison with Ghia et al. (1982)
          </p>
        </div>
        <ArrowRight size={16} className="shrink-0 text-[var(--cold)] opacity-70 group-hover:opacity-100 transition-opacity" />
      </Link>

      <H2 id="problem">Problem Description</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The lid-driven cavity is a square domain [0,1] × [0,1] with unit side length. The top wall
        moves at <em>u</em> = 1 m/s; all other walls are stationary. The Reynolds number is
        Re = <em>UL/ν</em> = 100. The benchmark quantities are the velocity profiles along the
        horizontal and vertical centrelines, compared against the reference data of Ghia et al. (1982).
      </p>

      <H2 id="mesh">Mesh</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Generate the mesh with Gmsh. A 64 × 64 structured quad mesh is sufficient for Re = 100:
      </p>
      <CodeBlock lang="bash" code={`gmsh examples/cavity/cavity.geo -2 -o examples/cavity/cavity.msh`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        The <code>.geo</code> script is in the repository at <code>examples/cavity/cavity.geo</code>.
        It defines four boundary parts: <code>top_lid</code>, <code>bottom_wall</code>,
        <code>left_wall</code>, and <code>right_wall</code>.
      </p>

      <H2 id="input-file">Input File</H2>
      <CodeBlock lang="yaml" code={`mesh:
  type: gmsh
  path: examples/cavity/cavity.msh

simulation:
  physical_analysis:
    - domain_id: fluid
      type: incompressible_flow
      fluid_model:
        kinematic_viscosity: 0.01   # Re = UL/nu = 1*1/0.01 = 100
        density: 1.0
      boundary_conditions:
        - type: fixed_velocity
          parts: [top_lid]
          value: [1.0, 0.0, 0.0]
        - type: wall
          parts: [bottom_wall, left_wall, right_wall]
      initialisation:
        velocity: [0.0, 0.0, 0.0]
        pressure: 0.0

  solver:
    solver_control:
      type: steady
      max_outer_iterations: 1000
      convergence_criteria:
        velocity: 1.0e-6
        pressure: 1.0e-6
    output_control:
      output_dir: results/cavity/
      write_interval: 100
      fields: [velocity, pressure]
      surface_monitors:
        - name: p_ref
          parts: [bottom_wall]
          quantity: average_pressure`} />

      <H2 id="run">Running</H2>
      <CodeBlock lang="bash" code={`./build/OpenAccel examples/cavity/cavity.yaml`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        On a single core, the 64 × 64 mesh converges in approximately 200–300 iterations.
        Residuals should reach 10⁻⁶ within a few seconds.
      </p>

      <H2 id="results">Interpreting Results</H2>
      <H3 id="residuals">Residual convergence</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Pressure and velocity residuals should decrease monotonically. A converged run looks like:
      </p>
      <CodeBlock lang="text" code={`Iter  100 | p 2.14e-04 | U 8.32e-05 | cont 4.21e-06 | wall 0.08s
Iter  200 | p 3.17e-06 | U 9.45e-07 | cont 5.88e-08 | wall 0.16s
Converged at iteration 247.`} />

      <H3 id="velocity-profiles">Velocity profiles</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Extract velocity along the centrelines from the Exodus output and compare against the
        Ghia et al. (1982) tabulated data (available in <code>examples/cavity/reference/</code>).
        At Re = 100 on a 64 × 64 mesh, the maximum relative error in the centreline{' '}
        <em>u</em>-velocity should be below 1%.
      </p>
      <Callout type="note">
        The same mesh-convergence study and comparison plots are documented in the VC001 tutorial.{' '}
        <Link href="/tutorials/lidDrivenCavity" style={{ color: 'var(--cold)' }} className="underline underline-offset-4">
          View VC001 →
        </Link>
      </Callout>
    </GsLayout>
  );
}
