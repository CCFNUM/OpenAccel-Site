import { AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { DocCallout } from '@/components/DocCallout';
import { Caption } from '@/components/Caption';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2 } from '../get-started/GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;

export function Ch16LinearSolvers() {
  useDocumentTitle('Linear Solvers and Preconditioning — Theory Manual');
  return (
    <TheoryLayout chNum="16" title="Linear Solvers and Preconditioning">
      <SEO
        title="Linear Solvers and Preconditioning — Theory Manual"
        description="The three interchangeable Krylov solver backends, pressure scaling, and solve ordering."
        path="/theory/linear-solvers"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        Each discrete equation of <a href="/theory/cvfem">Chapter 11</a> is a sparse linear system
        solved by an external Krylov backend. OpenAccel provides three interchangeable,
        build-time-gated backends; the choice is transparent to the physics.
      </p>

      <figure className="my-4">
        <Caption label="Table 16.1" className="mb-2">
          Linear-solver backends. Each is compiled in only when its library is found at configure
          time.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Backend</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Krylov solvers</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Preconditioning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Trilinos / Belos', 'CG, BiCGStab, TFQMR, LSQR, GMRES (default)', 'Ifpack2: ILUT, RILUK, relaxation (Jacobi), Chebyshev'],
                ['HYPRE', 'GMRES (default), FlexGMRES, BiCGStab, BoomerAMG, MGR', 'BoomerAMG, MGR (each usable as solver or preconditioner)'],
                ['PETSc', 'Krylov suite (when built)', 'PETSc preconditioners'],
              ].map(([backend, krylov, precond]) => (
                <tr key={backend} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{backend}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{krylov}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{precond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <p style={{ color: 'var(--text-dim)' }}>
        Symmetric positive-definite systems (pressure correction, displacement diffusion) favour
        CG with an algebraic-multigrid preconditioner; the non-symmetric momentum and scalar
        systems use BiCGStab or GMRES. When BoomerAMG is used as a <em>preconditioner</em> it is
        forced to a single V-cycle (<code>MaxIter</code>=1, <code>Tol</code>=0) &mdash; standard
        AMG-as-preconditioner practice &mdash; whereas as a standalone solver it iterates to
        tolerance.
      </p>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        The Trilinos option mapping is <em>silently forgiving</em>: any unrecognised{' '}
        <code>belos_solver</code> string &mdash; including typos &mdash; falls back to GMRES with
        no warning, and any unrecognised <code>preconditioner</code> string falls back to
        relaxation (Jacobi). A misspelt <code>&quot;bcgs&quot;</code> therefore runs GMRES without
        telling you. HYPRE behaves oppositely: an unrecognised{' '}
        <code>options &gt; solver &gt; type</code> throws a run-time error. Check spelling against
        the tables above when convergence behaviour seems inconsistent with the requested method.
      </DocCallout>

      <H2 id="scaling-ordering" num="16.1">Scaling and Solve Ordering</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        To condition the pressure-correction solve, a pressure scale with a dynamic-pressure floor
        is maintained:
      </p>
      <KeyBox title="Pressure scale">
        <Equation math="p_{scale} = \max\bigl(p_{max}-p_{min},\ \tfrac12\,\rho_{scale}\,U_{scale}^{2}\bigr)," />
        so the linear-solver tolerances remain meaningful even when the pressure field is nearly
        uniform.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        The segregated cycle constructs and solves the momentum predictor before the
        pressure-correction equation (standard SIMPLE-family ordering), followed by the auxiliary
        equations (energy, turbulence, phasic). Per-equation relaxation factors are read from{' '}
        <code>convergence_controls &gt; relaxation_parameters</code> (<code>relax_mass</code>{' '}
        <M math="\le1" />, <code>velocity_relaxation_factor</code>,{' '}
        <code>pressure_relaxation_factor</code>, <code>turbulence_relaxation_factor</code>,{' '}
        <code>energy_relaxation_factor</code>, <code>solid_displacement_relaxation_factor</code>,{' '}
        <code>wall_scale_relaxation_factor</code>).
      </p>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        There is <em>no</em> Jacobian-free Newton&ndash;Krylov (JFNK) path anywhere in the solver,
        for any physics: the nonlinear solid mechanics of <a href="/theory/solid">Chapter 9</a> is
        solved by Picard preconditioning, and the Krylov methods above act only on the linearised
        systems.
      </DocCallout>
    </TheoryLayout>
  );
}
