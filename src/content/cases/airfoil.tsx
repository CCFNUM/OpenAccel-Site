import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { Equation } from '@/components/tutorial/Equation';

const F = (name: string) => `/figures/${name}.svg`;
const SVG = (name: string) => `/figures/${name}.svg`;

export function AirfoilContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',         value: 'VC004' },
        { label: 'References',      value: 'Nakayama (1985); NASA Turbulence Modelling Resource' },
        { label: 'Solver mode',     value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics',         value: '2-D incompressible RANS, k–ω SST' },
        { label: 'Reynolds number', value: 'Re_C = 1.2 × 10⁶, Ma = 0.088' },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem Description</h2>
        <p className="mb-4">
          This case validates the SST k–ω model for attached external aerodynamic flow. The Nakayama
          Model-A airfoil with a sharpened trailing edge is placed at zero angle of attack at a
          chord-based Reynolds number of 1.2 × 10⁶.
        </p>
        <p>
          Two complementary quantities are compared with reference data: the surface pressure
          coefficient <em>C</em><sub>p</sub> against the NASA Turbulence Modelling Resource CFL3D
          benchmark, and the near-wake velocity profiles at several downstream stations against the
          experimental measurements of Nakayama (1985).
        </p>
      </section>

      <section id="geometry" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure label="Figure 1"
          src={F('airfoil_schematic')}
          alt="Computational domain for the airfoil near-wake validation"
          caption="Computational domain for the airfoil near-wake validation. Outer boundaries are placed sufficiently far from the airfoil to avoid blockage. The inset shows the Nakayama Model-A profile at zero angle of attack with chord C = 1 m."
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
                { label: 'Chord C',          value: '1 m' },
                { label: 'Mach number',      value: 'Ma = 0.088' },
                { label: 'Reynolds number',  value: 'Re_C = 1.2 × 10⁶' },
                { label: 'Angle of attack',  value: 'α = 0°' },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: 'Density ρ',            value: '1.0 kg/m³' },
                { label: 'Dynamic viscosity μ',   value: '2.546 × 10⁻⁵ Pa·s' },
                { label: 'Free-stream velocity',  value: 'U∞ = 30.56 m/s' },
                { label: 'Inlet k',               value: '1.085 × 10⁻³ m²/s²' },
                { label: 'Inlet ω',               value: '4 734.87 s⁻¹' },
              ],
            },
            {
              heading: 'Boundary conditions',
              rows: [
                { label: 'Inlet',           value: 'Velocity inlet at U∞' },
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
                { label: 'Under-relaxation',       value: 'λᵛ = 0.5, λᵖ = 0.3' },
                { label: 'Pseudo-time-scale',      value: 'Δtₚₛ = 1 s' },
              ],
            },
            {
              heading: 'Convergence',
              rows: [
                { label: 'RMS residual target', value: '10⁻⁶' },
                { label: 'Maximum outer iters', value: '1 500' },
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
          caption="Pressure coefficient C_p on the Nakayama Model-A airfoil at Re_C = 1.2 × 10⁶, α = 0°."
          width="normal"
        />

        <TutorialFigure label="Figure 3"
          src={SVG('wake_detail')}
          alt="Near-wake velocity profiles at several downstream stations"
          caption="Near-wake velocity profiles Uₓ/U∞ at several downstream stations behind the Nakayama Model-A airfoil at Re = 1.2 × 10⁶, α = 0°. Red solid lines: OpenAccel SST k–ω simulation. Black dashed lines: FUN3D numerical results. Symbols: experimental data of Nakayama (1985)."
          width="normal"
        />

        <TutorialSubfigureRow label="Figure 4"
          left={{  src: F('velocity_airfoil'), alt: 'Velocity magnitude contour', subcaption: 'Velocity magnitude |U|/U∞.' }}
          right={{ src: F('pressure_airfoil'), alt: 'Pressure contour',            subcaption: 'Pressure.' }}
          caption="Flow field at Re_C = 1.2 × 10⁶, α = 0°. The pressure distribution is nearly symmetric about the chord, as expected at zero incidence."
        />

        <Takeaway>
          <p>
            The <em>C</em><sub>p</sub> distribution matches the CFL3D reference closely over the
            full chord, and the predicted near-wake velocity defect tracks the experimental data of
            Nakayama (1985). This is the classical sweet spot of k–ω SST: attached,
            mild-pressure-gradient external flow. Any deviation would point to either
            inlet-turbulence specification or insufficient streamwise resolution near the trailing
            edge.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The surface <em>C</em><sub>p</sub> shall match the NASA-TMR CFL3D benchmark in graphical
            agreement, and the near-wake <em>U</em>/<em>U</em><sub>∞</sub> profiles shall match the
            experiments of Nakayama (1985) at the reported stations.
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
