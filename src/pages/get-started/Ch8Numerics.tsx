import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, H3, Callout, TodoBlock } from './GsLayout';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function Eq({ tex, display = false }: { tex: string; display?: boolean }) {
  let html = '';
  try { html = katex.renderToString(tex, { displayMode: display, throwOnError: false }); }
  catch { html = `<code>${tex}</code>`; }
  return display
    ? <div className="overflow-x-auto my-6 p-4 bg-[var(--ink)] border border-[var(--hairline)] rounded" dangerouslySetInnerHTML={{ __html: html }} />
    : <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Ch8Numerics() {
  useDocumentTitle('Numerics & Solver Control — User Guide');
  return (
    <GsLayout chNum="8" title="Numerics & Solver Control">
      <SEO title="Numerics & Solver Control — User Guide" description="Configuring solver_control: time stepping, pseudo-time stepping, linear solvers, preconditioners, and convergence." path="/get-started/numerics" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-6 text-lg">
        The <code>solver_control</code> block governs time integration, pseudo-time stepping for
        steady problems, linear solver selection, and convergence criteria.
      </p>

      <H2 id="location">Location in input file</H2>
      <CodeBlock lang="yaml" code={`simulation:
  solver:
    solver_control:   # ← this chapter
      type: steady
      max_outer_iterations: 500
      . . .\n`} />

      <H2 id="time-stepping">Time Stepping</H2>
      <div className="overflow-x-auto mt-2 mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              <th className="text-left py-2 pr-6 font-mono font-medium" style={{ color: 'var(--text)' }}>type</th>
              <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['steady',   'Pseudo-transient continuation to a steady state. No physical time; iterations advance a pseudo-timescale.'],
              ['transient','Physical time integration. Requires dt or adaptive time stepping.'],
            ].map(([t, d]) => (
              <tr key={t} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td className="py-2 pr-6 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{t}</td>
                <td className="py-2 align-top" style={{ color: 'var(--text-dim)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="pseudo-timescale">Pseudo-Timescale (Eq. 8.1)</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-2">
        For steady runs, OpenAccel advances using a local pseudo-timescale <Eq tex="\tau_p" />:
      </p>
      <Eq display tex={
        String.raw`\tau_p = \text{CFL} \cdot \frac{h}{\|\mathbf{u}\| + c}`
      } />
      <p style={{ color: 'var(--text-dim)' }}>
        where <Eq tex="h" /> is the local element size, <Eq tex="\|\mathbf{u}\|" /> is the local
        velocity magnitude, and <Eq tex="c" /> is the speed of sound (set to a reference value for
        incompressible flows to prevent division by zero). The CFL number is set via{' '}
        <code>solver_control.cfl</code>.
      </p>
      <Callout type="tip">
        Start with <code>cfl: 5</code> for laminar cases and <code>cfl: 2</code> for turbulent cases.
        If the residual diverges in the first few iterations, reduce the CFL. A ramping schedule
        (start low, increase over iterations) often helps for difficult cases.
      </Callout>

      <H3 id="damping">Damping</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        A damping coefficient <Eq tex="\beta \in [0,1]" /> controls how aggressively the pseudo-timescale
        is locally reduced in high-gradient regions. <Eq tex="\beta = 0" /> gives no damping (uniform CFL);
        <Eq tex="\beta = 1" /> gives maximum local adaptation.
      </p>
      <TodoBlock label="The damping diagram (Figure 8.4 in the User Guide) — showing β vs. local pseudo-timescale reduction for several gradient magnitudes — will be reproduced here as an SVG." />

      <H2 id="transient">Transient Settings</H2>
      <CodeBlock lang="yaml" code={`solver_control:
  type: transient
  dt: 0.001           # fixed time step (s); or omit for adaptive
  t_end: 10.0         # end time (s)
  max_outer_iterations: 20   # inner iterations per time step
  adaptive_dt:
    enabled: true
    cfl_target: 1.0
    dt_min: 1.0e-6
    dt_max: 0.01`} />
      <TodoBlock label="Full option table for transient solver_control — dt, t_end, time_scheme (BDF1/BDF2), adaptive_dt, and inner-loop convergence — will be added here from Chapter 8." />

      <H2 id="linear-solvers">Linear Solvers</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Linear solver settings are nested under <code>solver_control.linear_solver</code>:
      </p>
      <CodeBlock lang="yaml" code={`solver_control:
  linear_solver:
    pressure:
      backend: hypre     # or: petsc, trilinos
      tolerance: 1.0e-8
      max_iterations: 500
    velocity:
      backend: petsc
      tolerance: 1.0e-6
      max_iterations: 200`} />
      <TodoBlock label="Option tables for linear_solver backends (trilinos/petsc/hypre), preconditioner settings (AMG level, smoother, coarsening strategy), and per-field overrides will be added here from Chapter 8." />

      <H2 id="convergence">Convergence Criteria</H2>
      <TodoBlock label="Option tables for convergence_criteria — per-field absolute and relative tolerance, residual normalisation, and monitor output — will be added here from Chapter 8." />
    </GsLayout>
  );
}
