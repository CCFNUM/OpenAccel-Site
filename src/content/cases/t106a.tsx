import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { Equation, M } from '@/components/tutorial/Equation';

const F = (name: string) => `/figures/${name}.svg`;

// Letter-landscape plates (792×612 pt → cm).
const LAND: [number, number] = [27.94, 21.59];
// Cp_t106.pdf natural page size 648.595×547.796 pt → cm.
const CP_BASE: [number, number] = [22.88, 19.32];

export function T106AContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',     value: 'VC003' },
        { label: 'References',  value: 'Stadtmüller (2001); Wissink (2003); Ranjan et al. (2017)' },
        { label: 'Solver mode', value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics / models', value: <>2-D incompressible RANS, <M math="\gamma" />–<M math="\mathit{Re}_{\theta t}" /> Transition SST</> },
        { label: 'Reynolds number', value: <><M math="\mathit{Re}_C = 51\,831" /> (chord-based)</> },
        { label: 'Special',     value: 'Translational periodic boundary conditions' },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem description</h2>
        <p className="mb-4">
          The T106A low-pressure turbine cascade benchmarks two capabilities at once: the{' '}
          <M math="\gamma" />–<M math="\mathit{Re}_{\theta t}" /> transitional SST model on a passage
          with laminar separation and transition on the suction side, and the translational periodic
          boundary conditions needed to model a single blade passage as a representative slice of the
          full cascade.
        </p>
        <p className="mb-4">
          The flow physics of interest is a long suction-side separation bubble extending from{' '}
          <M math="x/C \approx 0.76" /> to the trailing edge — a feature that disappears in
          low-resolution simulations and is faithfully recovered only at adequate grid resolution
          (Ranjan et al. 2017). Reference data are taken from the experiments of Stadtmüller (2001)
          and the DNS of Wissink (2003).
        </p>
      </section>

      <section id="geometry" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry and boundary conditions</h2>
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
                { label: <>Chord length <M math="C" /></>, value: <M math="0.2~\mathrm{m}" /> },
                { label: 'Mesh',           value: <><M math="50\,688" /> nodes / <M math="24\,892" /> elements</> },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: <>Density <M math="\rho" /></>,           value: <M math="1.185~\mathrm{kg\,m^{-3}}" /> },
                { label: <>Dynamic viscosity <M math="\mu" /></>,  value: <M math="1.831\times10^{-5}~\mathrm{Pa\,s}" /> },
                { label: 'Inlet flow angle',     value: <M math="\alpha = 45.5^\circ" /> },
                { label: 'Inlet velocity vector', value: <M math="(u_{in}, v_{in}) = (2.806,\,2.856)~\mathrm{m/s}" /> },
                { label: 'Inlet velocity magnitude', value: <M math="U_{in} = 4.004~\mathrm{m/s}" /> },
                { label: 'Reynolds number',      value: <M math="\mathit{Re}_C = \rho U_{in} C / \mu = 51\,831" /> },
                { label: 'Free-stream turbulence', value: <M math="Tu = 0.5\%" /> },
                { label: 'Turbulent length scale', value: <M math="\ell_t = 10^{-3}~\mathrm{m}" /> },
                { label: <>Inlet <M math="k" /></>, value: <M math="6.012\times10^{-4}~\mathrm{m^2\,s^{-2}}" /> },
                { label: <>Inlet <M math="\omega" /></>, value: <M math="44.77~\mathrm{s^{-1}}" /> },
              ],
            },
            {
              heading: 'Boundary conditions',
              rows: [
                { label: 'Pitchwise interfaces', value: <>Translational periodic (Gauss–Lobatto quadrature, search tol. <M math="10^{-3}" />)</> },
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
                { label: 'Under-relaxation',        value: <><M math="\lambda^v = 0.5" />, <M math="\lambda^p = 0.1" /></> },
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
                { label: 'RMS residual target', value: <M math="10^{-8}" /> },
                { label: 'Maximum outer iters', value: '2000' },
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
          where <M math="p_{\mathrm{out}}" /> is the mean static pressure downstream of the trailing
          edge and <M math="P_{t,\mathrm{in}}" /> is the inlet total pressure.
        </p>

        <TutorialSubfigureRow label="Figure 2"
          left={{  src: F('leading_edge'),  alt: 'Leading edge streamlines',  subcaption: 'Leading edge: no separation bubble.', trim: [0.5, 0, 0.5, 0.5], trimBase: LAND }}
          right={{ src: F('trailing_t106'), alt: 'Trailing edge streamlines', subcaption: <>Trailing edge: long separation bubble, <M math="0.76 \le x/C \le 1.0" />.</>, trim: [0.5, 0, 0.5, 0.5], trimBase: LAND }}
          caption={<>Mean-flow streamlines on the T106A suction side at <M math="\mathit{Re}_C = 51\,831" />.
            The absence of a leading-edge bubble at this resolution is consistent with the
            high-fidelity DNS of Ranjan et al. (2017).</>}
        />

        <TutorialFigure label="Figure 3"
          src={F('Cp_t106')}
          alt="Blade surface pressure coefficient vs normalised axial chord"
          caption={<>Blade surface pressure coefficient <M math="C_p" /> vs. normalised axial chord{' '}
            <M math="x/C_{\mathrm{ax}}" />, compared against the experiment of Stadtmüller (2001) and
            the DNS of Wissink (2003). The plateau on the suction side near the trailing edge is the
            signature of the laminar separation bubble.</>}
          width="normal"
          trim={[0, 0.5, 0, 1]}
          trimBase={CP_BASE}
        />

        <TutorialSubfigureRow label="Figure 4"
          left={{  src: F('velocity_t106a'),  alt: 'Velocity magnitude contour', subcaption: 'Velocity magnitude.', trim: [5, 1, 5, 1], trimBase: LAND }}
          right={{ src: F('pressure_t106a'), alt: 'Static pressure contour',     subcaption: 'Static pressure coefficient.', trim: [5, 1, 5, 1], trimBase: LAND }}
          caption={<>T106A cascade contours at <M math="\mathit{Re}_C = 51\,800" />, <M math="Tu = 0.5\%" />.</>}
        />

        <Takeaway>
          <p>
            The pressure-side <M math="C_p" /> matches the Stadtmüller experiment closely; on the
            suction side, the long plateau between <M math="x/C \approx 0.76" /> and <M math="1.0" />{' '}
            marks the laminar separation bubble and aligns with both the experiment and the DNS of
            Wissink (2003). Importantly, the absence of a leading-edge bubble in our solution mirrors
            the result of the highest-resolution DNS of Ranjan et al. (2017), who showed that the
            leading-edge bubble seen in coarser computations is a grid artefact. The translational
            periodic interface enforces pitchwise consistency exactly without iteration lag.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The blade-surface <M math="C_p" /> distribution shall match the experiment of Stadtmüller
            (2001) in graphical agreement, and the suction-side separation bubble shall extend over{' '}
            <M math="0.76 \lesssim x/C \le 1.0" />, consistent with the DNS benchmark of Ranjan et al.
            (2017).
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
