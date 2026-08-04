import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

const F = (name: string) => `/figures/${name}.png`;

export function PitzDailyContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',         value: 'VC002' },
        { label: 'References',      value: 'Pitz & Daily (1983); Ruck & Makiola (1993)' },
        { label: 'Solver mode',     value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics',         value: '2-D incompressible RANS; k–ω SST and standard k–ε' },
        { label: 'Reynolds number', value: 'Reₕ = 25 400 (step-height-based)' },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem Description</h2>
        <p className="mb-4">
          The Pitz–Daily geometry is the workhorse benchmark for separated and reattaching turbulent
          shear flows, and a stringent test of a two-equation RANS closure's behaviour under an
          adverse pressure gradient. A uniform inlet flow expands suddenly over a backward step,
          separating from the corner and reattaching some distance downstream.
        </p>
        <p className="mb-4">
          Two quantities matter for validation: the streamwise reattachment length{' '}
          <em>x</em><sub>r</sub>/<em>h</em> on the lower wall and the recovery of the velocity
          profile downstream of reattachment. Reference data are taken from the experimental
          measurements of Ruck &amp; Makiola (1993) for a 90° backward-facing step at expansion
          ratio ER = 2.0, at Re<sub>h</sub> = 15 000 and 33 000, bracketing the present
          Re<sub>h</sub> = 25 400.
        </p>
        <p>
          To corroborate the prediction and isolate any closure-specific bias, the case is run with
          two turbulence models — k–ω SST and standard k–ε — on identical mesh and numerics.
        </p>
      </section>

      <section id="geometry" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src={F('pitzdaily')}
          alt="Pitz–Daily backward-facing step geometry"
          caption="Pitz–Daily backward-facing step. Flow enters uniformly through the inlet at u = 10 m/s, expands over a step of height h = 0.0254 m into a channel of height H = 0.0508 m and length L = 0.29 m, and exits through a symmetrically converging nozzle."
          width="wide"
        />
      </section>

      <section id="setup" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">3. Setup</h2>
        <SetupTable
          caption="Pitz–Daily backward-facing step — complete case setup."
          groups={[
            {
              heading: 'Geometry and mesh',
              rows: [
                { label: 'Step height h',    value: '0.0254 m' },
                { label: 'Channel height H', value: '0.0508 m' },
                { label: 'Total length L',   value: '0.29 m' },
                { label: 'Mesh',             value: '6 468 nodes / 3 093 elements' },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: 'Density ρ',           value: '1 kg/m³' },
                { label: 'Dynamic viscosity μ',  value: '10⁻⁵ Pa·s' },
              ],
            },
            {
              heading: 'Turbulence closures',
              rows: [
                { label: 'Model 1', value: 'k–ω SST' },
                { label: 'Model 2', value: 'Standard k–ε (scalable wall functions)' },
              ],
            },
            {
              heading: 'Boundary conditions',
              rows: [
                { label: 'Inlet (SST)',    value: 'U₀ = 10 m/s; k = 0.375 m²/s²; ω = 440.15 s⁻¹' },
                { label: 'Inlet (k–ε)',   value: 'U₀ = 10 m/s; k = 0.375 m²/s²; ε = 21.2 m²/s³' },
                { label: 'Outlet',        value: 'Zero-gauge static pressure' },
                { label: 'Top, bottom',   value: 'No-slip walls' },
                { label: 'Front, back',   value: 'Symmetry' },
              ],
            },
            {
              heading: 'Numerics',
              rows: [
                { label: 'Algorithm',               value: 'SIMPLE (steady-state)' },
                { label: 'Advection (momentum)',    value: 'High-resolution Barth–Jespersen' },
                { label: 'Advection (turbulence)',  value: 'First-order upwind' },
                { label: 'Under-relaxation',        value: 'λᵛ = 0.5, λᵖ = 0.3' },
              ],
            },
            {
              heading: 'Linear solvers',
              rows: [
                { label: 'Momentum, turbulence',  value: 'PETSc / FGMRES + block-Jacobi (rel. tol. 10⁻¹)' },
                { label: 'Pressure correction',   value: 'HYPRE / GMRES + BoomerAMG (HMIS coarsening, θ = 0.25, L1-Gauss–Seidel)' },
              ],
            },
            {
              heading: 'Convergence',
              rows: [
                { label: 'RMS residual target', value: '10⁻⁸' },
                { label: 'Maximum outer iters', value: '2 500' },
              ],
            },
          ]}
        />
      </section>

      <section id="results" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">4. Results</h2>
        <p className="mb-6">
          The transient development of the recirculation pocket is summarised below: at iteration 300
          the vortex is still forming behind the step corner, while by iteration 1 000 the
          steady-state recirculation has stretched to its final reattachment location. The streamwise
          velocity profiles show the negative-velocity envelope inside the recirculation pocket and
          the gradual recovery toward a fully attached boundary layer.
        </p>
        <p className="mb-6">
          The standard k–ε closure, run on the same mesh and with otherwise identical settings,
          produces velocity profiles that are essentially indistinguishable from the SST result on
          the scale of the experimental scatter, and both closures predict a reattachment length
          inside the experimental band of Ruck &amp; Makiola (1993).
        </p>

        <TutorialFigure
          src={F('velocity_profile_pitzdaily')}
          alt="Normalised streamwise velocity profiles at several axial stations"
          caption="Normalised streamwise velocity profiles u/u_in at several axial stations downstream of the step, compared with the experimental data of Ruck & Makiola (1993)."
          width="wide"
        />

        <TutorialSubfigureStack
          items={[
            { src: F('uvelocity1'), alt: 'u-velocity at iteration 300',  subcaption: 'Iteration 300 — the recirculation vortex is still developing.' },
            { src: F('uvelocity2'), alt: 'u-velocity at iteration 1000', subcaption: 'Iteration 1 000 — steady state. The vortex has reached its final reattachment location.' },
          ]}
          caption="Streamwise velocity contours at Reₕ = 25 400 during the iterative development toward steady state."
        />

        <Takeaway>
          <p>
            The predicted reattachment length sits in the experimental band of{' '}
            <em>x</em><sub>r</sub>/<em>h</em> ≈ 8–9 reported by Ruck &amp; Makiola (1993), and the
            velocity profiles track both datasets well across the Reynolds-independent turbulent
            plateau. This is a known sweet spot for k–ω SST: the BSL blending function reduces to
            k–ω near the wall (avoiding the wall-treatment sensitivity of standard k–ε at low{' '}
            <em>y</em><sup>+</sup>) while behaving as k–ε in the free shear, where it correctly
            captures the spreading rate of the recirculating mixing layer. That the standard k–ε
            run with scalable wall functions reproduces essentially the same solution is consistent
            with this picture: downstream recovery in this geometry is dominated by free-shear
            mixing, where the two closures are formally equivalent.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The streamwise reattachment length on the lower wall shall fall within{' '}
            <em>x</em><sub>r</sub>/<em>h</em> ∈ [8, 9], and the velocity profiles at the reported
            axial stations shall match the experimental data of Ruck &amp; Makiola (1993) in
            graphical agreement.
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
