import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function RotatingCylinderContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC019' },
        { label: 'Reference',    value: 'Mittal & Kumar (2003), J. Fluid Mech. 476:303–334' },
        { label: 'Solver mode',  value: 'Transient, incompressible, laminar' },
        { label: 'Physics',      value: '2-D incompressible laminar NS; rigid-body domain rotation; non-conformal sliding interface (AMI)' },
        { label: 'Special',      value: 'Sliding-mesh coupling between a rotating sub-domain and a stationary far field' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          This case validates OpenAccel's sliding-mesh capability on the canonical problem of two-dimensional
          incompressible flow past a rotating circular cylinder. It exercises a rotating, non-conformal arbitrary
          mesh interface (AMI) that couples a spinning annular sub-domain to a stationary far field. The Reynolds
          number is held fixed at:
        </p>
        <Equation math="\mathrm{Re} = \frac{\rho U_\infty D}{\mu} = \frac{1 \cdot 1 \cdot 1}{0.005} = 200" />
        <p>
          The strength of the rotation is characterised by the non-dimensional rotation rate:
        </p>
        <Equation math="\alpha = \frac{\omega\, r}{U_\infty} = \frac{\omega D}{2 U_\infty}" />
        <p>
          Three rotation rates are considered — α = 1 (unsteady, vortex shedding), α = 3 (steady, shedding
          suppressed), and α = 4.5 (unsteady II, second shedding window) — spanning the distinct flow regimes
          reported by Mittal &amp; Kumar.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialSubfigureStack
          items={[
            { src: '/figures/rotating_cylinder.svg', alt: 'Domain layout and boundary conditions', subcaption: 'Computational domain and boundary conditions (not to scale). The rotating sub-domain (rotor) and stationary far field (stator) are joined by a non-conformal sliding interface (AMI) at r = 1.5.' },
            { src: '/figures/mesh_cylinder.svg',     alt: 'Near-field mesh detail', subcaption: 'Close-up view of the mesh near the cylinder, showing the rotor O-grid and the sliding interface with the stator.' },
          ]}
          caption="Rotating-cylinder validation case."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="Rotating cylinder (α = 1) — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Cylinder diameter D', value: '1.0' },
              { label: 'AMI radius R_i',      value: '1.5 (1.5D)' },
              { label: 'Far-field extent',    value: '±50D in x and y' },
              { label: 'Mesh (rotor / stator)', value: '8 000 / 13 200 cells; total 21 200' },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: 'Density ρ',           value: '1.0' },
              { label: 'Dynamic viscosity μ',  value: '0.005' },
              { label: 'Reynolds number',      value: 'Re = ρ U∞ D / μ = 200' },
            ]},
            { heading: 'Rotation and frame', rows: [
              { label: 'Non-dim. rotation rate', value: 'α = 1.0 (representative)' },
              { label: 'Cylinder angular velocity', value: 'ω = 2α = 2.0 rad/s' },
              { label: 'Mesh motion (rotor)',  value: 'domain_motion: rotating, axis [0,0,1], origin [0,0,0]' },
              { label: 'Cylinder wall frame',  value: 'frame_type: rotating (no-slip in rotating frame)' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',               value: 'Uniform velocity u = (1, 0, 0)' },
              { label: 'Outlet',              value: 'Static pressure p = 0' },
              { label: 'Top / bottom',        value: 'Symmetry' },
              { label: 'Sliding interface',   value: 'general_connection, fluid_fluid, AMI at r=1.5, Gauss–Lobatto quadrature' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Transient scheme',    value: 'Second-order backward Euler (BDF2)' },
              { label: 'Advection',           value: 'High-resolution' },
              { label: 'Timestep',            value: 'Δt = 0.002 (convective units)' },
              { label: 'Total time',          value: 't* = 15 × T_rev = 50 (15 revolutions)' },
            ]},
          ]}
        />
      </section>

      <section id="force">
        <h2>4. Force Coefficients</h2>
        <p>With ρ = 1, U∞ = 1, D = 1, and spanwise thickness L<sub>z</sub> = 0.1:</p>
        <Equation math="C_D = \frac{F_x}{\tfrac{1}{2}\rho U_\infty^2 D L_z} = 20\,F_x, \qquad C_L = 20\,F_y" />

        <div className="my-6 overflow-x-auto rounded-lg border border-[var(--hairline)]">
          <table className="w-full text-sm border-collapse">
            <caption className="text-left text-xs font-mono text-[var(--text-dim)] px-4 py-2 border-b border-[var(--hairline)] bg-[var(--surface-2)] caption-top">
              Mean force coefficients at Re = 200. Reference values from Mittal &amp; Kumar (2003).
            </caption>
            <thead>
              <tr className="bg-[var(--surface-2)]">
                {['α', 'C_D,avg (M&K)', 'C_L,avg (M&K)', 'St (M&K)'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-mono text-[var(--cold)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['1.0', '1.05',   '−2.65',  '0.192'],
                ['3.0', '0.04',   '−10.33', '—'],
                ['4.5', '−0.36',  '−22.35', '0.025'],
              ].map(([a, cd, cl, st], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-stripe)]'}>
                  <td className="px-4 py-2 text-[var(--text-dim)] font-medium font-mono">{a}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{cd}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{cl}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{st}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[var(--text-dim)] italic">
          OpenAccel results are being computed. The table currently shows Mittal &amp; Kumar reference values only.
        </p>
      </section>

      <Takeaway>
        This case exercises a genuinely non-conformal sliding-mesh interface whose interpolation weights are
        recomputed at every timestep as the rotor turns. The three rotation rates span the regimes of periodic
        vortex shedding (α = 1), shedding suppression by the Magnus effect (α = 3), and re-emergence of
        one-sided low-frequency shedding (α = 4.5). Note the timestep restriction: the non-conformal interface
        imposes a Courant-type limit, so the timestep must be reduced in proportion to ω for higher rotation rates.
      </Takeaway>

      <AcceptanceCriterion>
        The time-averaged drag and lift coefficients at α = 1, 3, and 4.5 agree with Mittal &amp; Kumar (2003)
        to within typical benchmark scatter, and the solver correctly reproduces the qualitative regime sequence:
        shedding at α = 1, a steady deflected wake at α = 3, and the re-emergence of one-sided shedding at
        α = 4.5.
      </AcceptanceCriterion>
    </>
  );
}
