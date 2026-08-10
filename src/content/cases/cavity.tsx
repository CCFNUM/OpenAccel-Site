import { TutorialFigure, TutorialSubfigureRow, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { M } from '@/components/tutorial/Equation';

const F = (name: string) => `/figures/${name}.svg`;

// Contour plates are letter-landscape (792×612 pt → cm); source LaTeX trim
// for the cavity velocity contours is 3cm 1cm 3cm 1cm (L B R T).
const CAV_BASE: [number, number] = [27.94, 21.59];
const CAV_TRIM: [number, number, number, number] = [3, 1, 3, 1];

export function CavityContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',       value: 'VC001' },
        { label: 'Reference',     value: 'Ghia et al. (1982)' },
        { label: 'Solver mode',   value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics / models', value: '2-D incompressible laminar Navier–Stokes' },
        { label: 'Reynolds number', value: <M math="\mathit{Re} = 100" /> },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem description</h2>
        <p className="mb-4">
          The lid-driven cavity is the classical entry test for any incompressible solver: a closed
          square domain with no inflow or outflow, a single tangentially moving wall, and a flow
          pattern that for <M math="\mathit{Re} = 100" /> consists of a primary central vortex
          flanked by two weak counter-rotating corner eddies. It exercises pressure–velocity
          coupling on a confined domain, where any leak in the Rhie–Chow stencil shows up
          immediately as a spurious pressure-checkerboard mode. Reference data come from the
          multigrid simulations of Ghia et al. (1982), which are tabulated for the{' '}
          <M math="u" />- and <M math="v" />-velocity profiles along the geometric centrelines.
        </p>
      </section>

      <section id="geometry" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry and boundary conditions</h2>
        <TutorialFigure
          src={F('cavity_schematic')}
          alt="Lid-driven cavity schematic"
          label="Figure 1"
          caption={<>Lid-driven cavity: a unit square with a tangentially moving top wall at <M math="U_0 = 1~\mathrm{m/s}" />. The remaining three walls are stationary no-slip.</>}
          width="narrow"
        />
      </section>

      <section id="setup" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">3. Setup</h2>
        <SetupTable
          label="Table 1"
          caption="Lid-driven cavity — complete case setup."
          groups={[
            {
              heading: 'Geometry and mesh',
              rows: [
                { label: 'Domain', value: <>Unit square, <M math="L = 1~\mathrm{m}" /></> },
                { label: 'Mesh',   value: <><M math="100\times100" /> hexahedra (<M math="N_e = 10\,000" />)</> },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: <>Density <M math="\rho" /></>,            value: <M math="1~\mathrm{kg\,m^{-3}}" /> },
                { label: <>Dynamic viscosity <M math="\mu" /></>,   value: <M math="0.01~\mathrm{Pa\,s}" /> },
                { label: 'Reynolds number',       value: <M math="\mathit{Re} = \rho U_0 L / \mu = 100" /> },
              ],
            },
            {
              heading: 'Boundary conditions',
              rows: [
                { label: 'Top wall',            value: <>Moving no-slip, <M math="\mathbf{v} = (1, 0, 0)~\mathrm{m/s}" /></> },
                { label: 'Bottom, left, right', value: 'Stationary no-slip walls' },
              ],
            },
            {
              heading: 'Numerics',
              rows: [
                { label: 'Algorithm',         value: 'SIMPLE (steady-state)' },
                { label: 'Advection scheme',  value: 'High resolution' },
                { label: 'Under-relaxation',  value: <><M math="\lambda^v = 0.9" />, <M math="\lambda^p = 0.2" /></> },
                { label: 'Pseudo-time-scale', value: <M math="\Delta t_{\mathrm{ps}} = 1~\mathrm{s}" /> },
              ],
            },
            {
              heading: 'Linear solvers',
              rows: [
                { label: 'Momentum',            value: <>PETSc / FGMRES + block-Jacobi (rel. tol. <M math="10^{-2}" />)</> },
                { label: 'Pressure correction', value: <>Trilinos / GMRES + ILU (rel. tol. <M math="10^{-6}" />)</> },
              ],
            },
            {
              heading: 'Convergence',
              rows: [
                { label: 'RMS residual target', value: <M math="10^{-7}" /> },
                { label: 'Maximum outer iters', value: <M math="1000" /> },
              ],
            },
          ]}
        />
      </section>

      <section id="results" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">4. Results</h2>

        <TutorialSubfigureRow label="Figure 2"
          left={{ src: F('cavity-velocity'),   alt: 'u-velocity contour', subcaption: <><M math="u" />-velocity contour.</>, trim: CAV_TRIM, trimBase: CAV_BASE }}
          right={{ src: F('cavity-v-velocity'), alt: 'v-velocity contour', subcaption: <><M math="v" />-velocity contour.</>, trim: CAV_TRIM, trimBase: CAV_BASE }}
          caption={<>Steady-state velocity contours at <M math="\mathit{Re} = 100" />. The primary vortex sits slightly above the geometric centre, consistent with the asymmetric pressure distribution induced by the moving lid.</>}
        />

        <TutorialSubfigureStack label="Figure 3"
          items={[
            { src: F('cavity-u'), alt: 'u-velocity along vertical centreline',   subcaption: <><M math="u" />-velocity along the vertical centreline.</> },
            { src: F('cavity-v'), alt: 'v-velocity along horizontal centreline', subcaption: <><M math="v" />-velocity along the horizontal centreline.</> },
          ]}
          caption={<>Normalised centreline velocity profiles at <M math="\mathit{Re} = 100" /> compared with Ghia et al. (1982). The two diagnostic features — the inflection on the <M math="u" />-profile near the bottom wall and the symmetry of the <M math="v" />-profile about <M math="x = 0.5" /> — are both recovered.</>}
        />

        <Takeaway>
          <p>
            OpenAccel reproduces both centreline profiles in close visual agreement with the Ghia
            data, including the location and magnitude of the negative <M math="u" />-velocity
            overshoot near the bottom wall. The slight smoothing of extrema is attributable to the
            first-order upwind advection used here; high-resolution Barth–Jespersen advection
            sharpens the profile further but makes no qualitative difference to the validation
            outcome.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The <M math="u" />- and <M math="v" />-velocity profiles along the geometric centrelines
            at <M math="\mathit{Re} = 100" /> shall match the tabulated data of Ghia et al. (1982)
            within graphical agreement on the <M math="100\times100" /> grid.
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
