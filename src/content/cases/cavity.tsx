import { TutorialFigure, TutorialSubfigureRow, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { Equation } from '@/components/tutorial/Equation';

const F = (name: string) => `/figures/${name}.svg`;

export function CavityContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',       value: 'VC001' },
        { label: 'Reference',     value: 'Ghia et al. (1982)' },
        { label: 'Solver mode',   value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics',       value: '2-D incompressible laminar Navier–Stokes' },
        { label: 'Reynolds number', value: 'Re = 100' },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem Description</h2>
        <p className="mb-4">
          The lid-driven cavity is the classical entry test for any incompressible solver: a closed
          square domain with no inflow or outflow, a single tangentially moving wall, and a flow
          pattern that for Re = 100 consists of a primary central vortex flanked by two weak
          counter-rotating corner eddies. It exercises pressure–velocity coupling on a confined
          domain, where any leak in the Rhie–Chow stencil shows up immediately as a spurious
          pressure-checkerboard mode. Reference data come from the multigrid simulations of Ghia
          et al. (1982), tabulated for the <em>u</em>- and <em>v</em>-velocity profiles along the
          geometric centrelines.
        </p>
      </section>

      <section id="geometry" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src={F('cavity_schematic')}
          alt="Lid-driven cavity schematic"
          caption="Lid-driven cavity: a unit square with a tangentially moving top wall at U₀ = 1 m/s. The remaining three walls are stationary no-slip."
          width="narrow"
        />
      </section>

      <section id="setup" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">3. Setup</h2>
        <SetupTable
          caption="Lid-driven cavity — complete case setup."
          groups={[
            {
              heading: 'Geometry and mesh',
              rows: [
                { label: 'Domain',   value: 'Unit square, L = 1 m' },
                { label: 'Mesh',     value: '100 × 100 hexahedra (Nₑ = 10 000)' },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: 'Density ρ',            value: '1 kg/m³' },
                { label: 'Dynamic viscosity μ',  value: '0.01 Pa·s' },
                { label: 'Reynolds number',      value: 'Re = ρ U₀ L / μ = 100' },
              ],
            },
            {
              heading: 'Boundary conditions',
              rows: [
                { label: 'Top wall',              value: 'Moving no-slip, v = (1, 0, 0) m/s' },
                { label: 'Bottom, left, right',   value: 'Stationary no-slip walls' },
              ],
            },
            {
              heading: 'Numerics',
              rows: [
                { label: 'Algorithm',         value: 'SIMPLE (steady-state)' },
                { label: 'Advection scheme',  value: 'High resolution' },
                { label: 'Under-relaxation',  value: 'λᵛ = 0.9, λᵖ = 0.2' },
                { label: 'Pseudo-time-scale', value: 'Δtₚₛ = 1 s' },
              ],
            },
            {
              heading: 'Linear solvers',
              rows: [
                { label: 'Momentum',            value: 'PETSc / FGMRES + block-Jacobi (rel. tol. 10⁻²)' },
                { label: 'Pressure correction', value: 'Trilinos / GMRES + ILU (rel. tol. 10⁻⁶)' },
              ],
            },
            {
              heading: 'Convergence',
              rows: [
                { label: 'RMS residual target', value: '10⁻⁷' },
                { label: 'Maximum outer iters', value: '1 000' },
              ],
            },
          ]}
        />
      </section>

      <section id="results" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">4. Results</h2>

        <TutorialSubfigureRow
          left={{ src: F('cavity-velocity'),   alt: 'u-velocity contour', subcaption: 'u-velocity contour.' }}
          right={{ src: F('cavity-v-velocity'), alt: 'v-velocity contour', subcaption: 'v-velocity contour.' }}
          caption="Steady-state velocity contours at Re = 100. The primary vortex sits slightly above the geometric centre, consistent with the asymmetric pressure distribution induced by the moving lid."
        />

        <TutorialSubfigureStack
          items={[
            { src: F('cavity-u'), alt: 'u-velocity along vertical centreline',   subcaption: 'u-velocity along the vertical centreline.' },
            { src: F('cavity-v'), alt: 'v-velocity along horizontal centreline', subcaption: 'v-velocity along the horizontal centreline.' },
          ]}
          caption="Normalised centreline velocity profiles at Re = 100 compared with Ghia et al. (1982). The two diagnostic features — the inflection on the u-profile near the bottom wall and the symmetry of the v-profile about x = 0.5 — are both recovered."
        />

        <Takeaway>
          <p>
            OpenAccel reproduces both centreline profiles in close visual agreement with the Ghia
            data, including the location and magnitude of the negative <em>u</em>-velocity
            overshoot near the bottom wall. The slight smoothing of extrema is attributable to the
            first-order upwind advection used here; high-resolution Barth–Jespersen advection
            sharpens the profile further but makes no qualitative difference to the validation
            outcome.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The <em>u</em>- and <em>v</em>-velocity profiles along the geometric centrelines at
            Re = 100 shall match the tabulated data of Ghia et al. (1982) within graphical
            agreement on the 100 × 100 grid.
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
