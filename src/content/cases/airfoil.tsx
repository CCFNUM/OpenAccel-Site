import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { Equation, M } from '@/components/tutorial/Equation';

const F = (name: string) => `/figures/${name}.svg`;

// Letter-landscape plates (792×612 pt → cm).
const LAND: [number, number] = [27.94, 21.59];
// Cp_airfoil.pdf natural page size 772.214×547.81 pt → cm.
const CP_BASE: [number, number] = [27.24, 19.32];

export function AirfoilContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',         value: 'VC004' },
        { label: 'References',      value: 'Nakayama (1985); NASA Turbulence Modelling Resource' },
        { label: 'Solver mode',     value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics / models', value: <>2-D incompressible RANS, <M math="k" />–<M math="\omega" /> SST</> },
        { label: 'Reynolds number', value: <><M math="\mathit{Re}_C = 1.2\times10^6" />, <M math="\mathit{Ma} = 0.088" /></> },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem description</h2>
        <p className="mb-4">
          This case validates the SST <M math="k" />–<M math="\omega" /> model for attached external
          aerodynamic flow. The Nakayama Model-A airfoil with a sharpened trailing edge is placed at
          zero angle of attack at a chord-based Reynolds number of <M math="1.2\times10^6" />.
        </p>
        <p>
          Two complementary quantities are compared with reference data: the surface pressure
          coefficient <M math="C_p" /> against the NASA Turbulence Modelling Resource CFL3D
          benchmark, and the near-wake velocity profiles at several downstream stations against the
          experimental measurements of Nakayama (1985).
        </p>
      </section>

      <section id="geometry" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src={F('airfoil_schematic')}
          alt="Computational domain for the airfoil near-wake validation"
          caption={<>Computational domain for the airfoil near-wake validation. Outer boundaries are
            placed sufficiently far from the airfoil to avoid blockage, with inlet, outlet, and
            lateral symmetry. The inset shows the Nakayama Model-A profile at zero angle of attack
            with chord <M math="C = 1~\mathrm{m}" />.</>}
          width="normal"
        />
      </section>

      <section id="setup" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Nakayama airfoil — complete case setup."
          groups={[
            {
              heading: 'Geometry and conditions',
              rows: [
                { label: <>Chord <M math="C" /></>, value: <M math="1~\mathrm{m}" /> },
                { label: 'Mach number',      value: <M math="\mathit{Ma} = 0.088" /> },
                { label: 'Reynolds number',  value: <M math="\mathit{Re}_C = 1.2\times10^6" /> },
                { label: 'Angle of attack',  value: <M math="\alpha = 0^\circ" /> },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: <>Density <M math="\rho" /></>,           value: <M math="1.0~\mathrm{kg\,m^{-3}}" /> },
                { label: <>Dynamic viscosity <M math="\mu" /></>,  value: <M math="2.546\times10^{-5}~\mathrm{Pa\,s}" /> },
                { label: 'Free-stream velocity', value: <M math="U_\infty = 30.56~\mathrm{m/s}" /> },
                { label: <>Inlet <M math="k" /></>,  value: <M math="1.085\times10^{-3}~\mathrm{m^2\,s^{-2}}" /> },
                { label: <>Inlet <M math="\omega" /></>, value: <M math="4734.87~\mathrm{s^{-1}}" /> },
              ],
            },
            {
              heading: 'Boundary conditions',
              rows: [
                { label: 'Inlet',           value: <>Velocity inlet at <M math="U_\infty" /></> },
                { label: 'Outlet',          value: 'Zero-gauge static pressure' },
                { label: 'Lateral',         value: 'Symmetry' },
                { label: 'Airfoil surface', value: 'No-slip wall' },
              ],
            },
            {
              heading: 'Numerics',
              rows: [
                { label: 'Algorithm',              value: 'SIMPLE (steady-state)' },
                { label: 'Advection (momentum)',   value: 'High-resolution Barth–Jespersen' },
                { label: 'Advection (turbulence)', value: 'First-order upwind' },
                { label: 'Under-relaxation',       value: <><M math="\lambda^v = 0.5" />, <M math="\lambda^p = 0.3" /></> },
                { label: 'Pseudo-time-scale',      value: <M math="\Delta t_{\mathrm{ps}} = 1~\mathrm{s}" /> },
              ],
            },
            {
              heading: 'Convergence',
              rows: [
                { label: 'RMS residual target', value: <M math="10^{-6}" /> },
                { label: 'Maximum outer iters', value: <M math="1500" /> },
              ],
            },
          ]}
        />
      </section>

      <section id="results" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">4. Results</h2>
        <p className="mb-4">The pressure coefficient on the airfoil surface is computed as</p>
        <Equation
          math={String.raw`C_p = \frac{p - p_\infty}{\tfrac{1}{2}\rho U_\infty^2}`}
          label="1"
        />

        <TutorialFigure label="Figure 2"
          src={F('Cp_airfoil')}
          alt="Pressure coefficient on Nakayama Model-A airfoil"
          caption={<>Pressure coefficient <M math="C_p" /> on the Nakayama Model-A airfoil at{' '}
            <M math="\mathit{Re}_C = 1.2\times10^6" />, <M math="\alpha = 0^\circ" />.</>}
          width="normal"
          trim={[0, 1, 0, 1]}
          trimBase={CP_BASE}
        />

        <TutorialFigure label="Figure 3"
          src={F('wake_detail')}
          alt="Near-wake velocity profiles at several downstream stations"
          caption={<>Near-wake velocity profiles <M math="U_x/U_\infty" /> at several downstream
            stations behind the Nakayama Model-A airfoil at <M math="\mathit{Re} = 1.2\times10^6" />,{' '}
            <M math="\alpha = 0^\circ" />. Red solid lines: OpenAccel SST <M math="k" />–<M math="\omega" />{' '}
            simulation. Black dashed lines: FUN3D numerical results. Symbols: experimental data of
            Nakayama (1985).</>}
          width="normal"
        />

        <TutorialSubfigureRow label="Figure 4"
          left={{  src: F('velocity_airfoil'), alt: 'Velocity magnitude contour', subcaption: <>Velocity magnitude <M math="|\mathbf{U}|/U_\infty" />.</>, trim: [4, 1, 4, 1.2], trimBase: LAND }}
          right={{ src: F('pressure_airfoil'), alt: 'Pressure contour',            subcaption: 'Pressure.', trim: [4, 1, 4, 1.2], trimBase: LAND }}
          caption={<>Flow field at <M math="\mathit{Re}_C = 1.2\times10^6" />, <M math="\alpha = 0^\circ" />.
            The pressure distribution is nearly symmetric about the chord, as expected at zero
            incidence.</>}
        />

        <Takeaway>
          <p>
            The <M math="C_p" /> distribution matches the CFL3D reference closely over the full
            chord, and the predicted near-wake velocity defect tracks the experimental data of
            Nakayama (1985). This is the classical sweet spot of <M math="k" />–<M math="\omega" />{' '}
            SST: attached, mild-pressure-gradient external flow. Any deviation would point to either
            inlet-turbulence specification or insufficient streamwise resolution near the trailing
            edge.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The surface <M math="C_p" /> shall match the NASA-TMR CFL3D benchmark in graphical
            agreement, and the near-wake <M math="U/U_\infty" /> profiles shall match the experiments
            of Nakayama (1985) at the reported stations.
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
