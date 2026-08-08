import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { Equation } from '@/components/tutorial/Equation';

const F = (name: string) => `/figures/${name}.svg`;

export function T106AContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',     value: 'VC003' },
        { label: 'References',  value: 'Stadtmüller (2001); Wissink (2003); Ranjan et al. (2017)' },
        { label: 'Solver mode', value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics',     value: '2-D incompressible RANS, γ–Re_θt Transition SST' },
        { label: 'Reynolds number', value: 'Re_C = 51 831 (chord-based)' },
        { label: 'Special',     value: 'Translational periodic boundary conditions' },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem Description</h2>
        <p className="mb-4">
          The T106A low-pressure turbine cascade benchmarks two capabilities at once: the
          γ–Re<sub>θt</sub> transitional SST model on a passage with laminar separation and
          transition on the suction side, and the translational periodic boundary conditions needed
          to model a single blade passage as a representative slice of the full cascade.
        </p>
        <p className="mb-4">
          The flow physics of interest is a long suction-side separation bubble extending from{' '}
          <em>x</em>/<em>C</em> ≈ 0.76 to the trailing edge — a feature that disappears in
          low-resolution simulations and is faithfully recovered only at adequate grid resolution
          (Ranjan et al. 2017). Reference data are taken from the experiments of Stadtmüller (2001)
          and the DNS of Wissink (2003).
        </p>
      </section>

      <section id="geometry" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure label="Figure 1"
          src={F('t106a')}
          alt="T106A turbine cascade computational domain"
          caption="T106A turbine cascade computational domain (not to scale). The pitchwise direction is closed by a translational periodic interface, so a single blade passage represents the full cascade."
          width="narrow"
        />
      </section>

      <section id="setup" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">3. Setup</h2>
        <SetupTable label="Table 1"
          caption="T106A turbine cascade — complete case setup."
          groups={[
            {
              heading: 'Geometry and mesh',
              rows: [
                { label: 'Chord length C', value: '0.2 m' },
                { label: 'Mesh',           value: '50 688 nodes / 24 892 elements' },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: 'Density ρ',           value: '1.185 kg/m³' },
                { label: 'Dynamic viscosity μ',  value: '1.831 × 10⁻⁵ Pa·s' },
                { label: 'Inlet flow angle',     value: 'α = 45.5°' },
                { label: 'Inlet velocity',       value: '(u_in, v_in) = (2.806, 2.856) m/s, |U_in| = 4.004 m/s' },
                { label: 'Reynolds number',      value: 'Re_C = ρ U_in C / μ = 51 831' },
                { label: 'Free-stream turb.',    value: 'Tu = 0.5%' },
                { label: 'Turbulent length scale', value: 'ℓ_t = 10⁻³ m' },
                { label: 'Inlet k',              value: '6.012 × 10⁻⁴ m²/s²' },
                { label: 'Inlet ω',              value: '44.77 s⁻¹' },
              ],
            },
            {
              heading: 'Boundary conditions',
              rows: [
                { label: 'Pitchwise interfaces', value: 'Translational periodic (Gauss–Lobatto quadrature, search tol. 10⁻³)' },
                { label: 'Blade surface',        value: 'No-slip wall' },
                { label: 'Outlet',               value: 'Zero-gauge static pressure' },
              ],
            },
            {
              heading: 'Numerics',
              rows: [
                { label: 'Algorithm',               value: 'SIMPLE (steady-state)' },
                { label: 'Advection (momentum)',    value: 'High-resolution Barth–Jespersen' },
                { label: 'Advection (turbulence)',  value: 'First-order upwind' },
                { label: 'Under-relaxation',        value: 'λᵛ = 0.5, λᵖ = 0.1' },
              ],
            },
            {
              heading: 'Linear solvers',
              rows: [
                { label: 'Momentum',            value: 'PETSc / FGMRES' },
                { label: 'Pressure correction', value: 'HYPRE / BoomerAMG' },
              ],
            },
            {
              heading: 'Convergence',
              rows: [
                { label: 'RMS residual target', value: '10⁻⁸' },
                { label: 'Maximum outer iters', value: '2 000' },
              ],
            },
          ]}
        />
      </section>

      <section id="results" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">4. Results</h2>
        <p className="mb-4">The pressure coefficient on the blade surface is defined as</p>
        <Equation
          math={String.raw`C_p = \frac{p - p_{\mathrm{out}}}{P_{t,\mathrm{in}} - p_{\mathrm{out}}}`}
          label="1"
        />
        <p className="mb-6 text-sm text-[var(--text-dim)]">
          where <em>p</em><sub>out</sub> is the mean static pressure downstream of the trailing
          edge and <em>P</em><sub>t,in</sub> is the inlet total pressure.
        </p>

        <TutorialSubfigureRow label="Figure 2"
          left={{  src: F('leading_edge'),  alt: 'Leading edge streamlines',  subcaption: 'Leading edge: no separation bubble.' }}
          right={{ src: F('trailing_t106'), alt: 'Trailing edge streamlines', subcaption: 'Trailing edge: long separation bubble, 0.76 ≤ x/C ≤ 1.0.' }}
          caption="Mean-flow streamlines on the T106A suction side at Re_C = 51 831. The absence of a leading-edge bubble at this resolution is consistent with the high-fidelity DNS of Ranjan et al. (2017)."
        />

        <TutorialFigure label="Figure 3"
          src={F('Cp_t106')}
          alt="Blade surface pressure coefficient vs normalised axial chord"
          caption="Blade surface pressure coefficient C_p vs. normalised axial chord x/C_ax, compared against the experiment of Stadtmüller (2001) and the DNS of Wissink (2003). The plateau on the suction side near the trailing edge is the signature of the laminar separation bubble."
          width="normal"
        />

        <TutorialSubfigureRow label="Figure 4"
          left={{  src: F('velocity_t106a'),  alt: 'Velocity magnitude contour', subcaption: 'Velocity magnitude.' }}
          right={{ src: F('pressure_t106a'), alt: 'Static pressure contour',     subcaption: 'Static pressure coefficient.' }}
          caption="T106A cascade contours at Re_C = 51 800, Tu = 0.5%."
        />

        <Takeaway>
          <p>
            The pressure-side <em>C</em><sub>p</sub> matches the Stadtmüller experiment closely; on
            the suction side, the long plateau between <em>x</em>/<em>C</em> ≈ 0.76 and 1.0 marks
            the laminar separation bubble and aligns with both the experiment and the DNS of Wissink
            (2003). Importantly, the absence of a leading-edge bubble in our solution mirrors the
            result of the highest-resolution DNS of Ranjan et al. (2017), who showed that the
            leading-edge bubble seen in coarser computations is a grid artefact. The translational
            periodic interface enforces pitchwise consistency exactly without iteration lag.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The blade-surface <em>C</em><sub>p</sub> distribution shall match the experiment of
            Stadtmüller (2001) in graphical agreement, and the suction-side separation bubble shall
            extend over 0.76 ≲ <em>x</em>/<em>C</em> ≤ 1.0, consistent with the DNS benchmark of
            Ranjan et al. (2017).
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
