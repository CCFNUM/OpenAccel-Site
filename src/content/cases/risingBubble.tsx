import { TutorialFigure } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function RisingBubbleContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC020' },
        { label: 'Reference',    value: 'Hysing et al. (2009), Int. J. Numer. Methods Fluids 60(11):1259–1288' },
        { label: 'Solver mode',  value: 'Transient, incompressible, laminar, two-phase' },
        { label: 'Physics',      value: 'Volume-of-fluid interface capturing; CSF surface tension; buoyancy' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          This case validates OpenAccel's VoF multiphase capability on the canonical Hysing two-dimensional
          rising-bubble benchmark (Test Case 1 of the FeatFlow CFD Benchmarking Project). It exercises the
          interface-capturing scheme, curvature reconstruction underlying the CSF surface-tension model, and
          buoyancy coupling.
        </p>
        <p>
          A circular bubble of radius r₀ = 0.25 filled with a lighter fluid rises through a heavier ambient liquid.
          The relevant dimensionless groups are the Reynolds number:
        </p>
        <Equation math="\mathrm{Re} = \frac{\rho_1 \sqrt{g D}\, D}{\mu_1} = \frac{1000 \cdot \sqrt{0.98 \cdot 0.5} \cdot 0.5}{10} = 35" />
        <p>and the Eötvös (Bond) number:</p>
        <Equation math="\mathit{Eo} = \frac{\rho_1\, g\, D^{2}}{\sigma} = \frac{1000 \cdot 0.98 \cdot 0.25}{24.5} = 10" />
        <p>
          The density ratio is ρ₁/ρ₂ = 10 and viscosity ratio μ₁/μ₂ = 10, placing the problem in the regime where
          the bubble retains a recognisably ellipsoidal shape (Hysing Test Case 1). The evolution is tracked over
          t ∈ [0, 3].
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/rising_bubble.svg"
          alt="Rising bubble geometry"
          caption="Geometry and boundary conditions for the rising-bubble benchmark (Hysing Test Case 1). Domain [0,1] × [0,2]; no-slip top and bottom, free-slip lateral walls."
        />
      </section>

      <section id="setup">
        <h2>3. Numerical Setup</h2>
        <SetupTable
          caption="Rising bubble (Hysing Test Case 1) — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',              value: '[0, 1] × [0, 2] rectangle' },
              { label: 'Initial bubble',      value: 'Circle, radius r₀ = 0.25, centre (x₀, y₀) = (0.5, 0.5)' },
              { label: 'Mesh',               value: '100 × 200 Cartesian cells (20 000 total)' },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: 'Ambient liquid (φ₁)', value: 'ρ₁ = 1000, μ₁ = 10' },
              { label: 'Bubble (φ₂)',         value: 'ρ₂ = 100, μ₂ = 1' },
              { label: 'Density ratio',       value: 'ρ₁/ρ₂ = 10' },
              { label: 'Viscosity ratio',     value: 'μ₁/μ₂ = 10' },
              { label: 'Surface tension σ',   value: '24.5' },
              { label: 'Reynolds number',     value: 'Re = 35' },
              { label: 'Eötvös number',       value: 'Eo = 10' },
            ]},
            { heading: 'Body forces', rows: [
              { label: 'Gravity',             value: 'g = (0, −0.98)' },
              { label: 'Buoyancy ref. density', value: 'ρ_ref = ρ₁ = 1000' },
            ]},
            { heading: 'Boundary and initial conditions', rows: [
              { label: 'Top / bottom',        value: 'No-slip walls' },
              { label: 'Left / right',        value: 'Free-slip (symmetry)' },
              { label: 'Initial α₂ (bubble)', value: 'Smoothed Heaviside, ε = h/2 = 5×10⁻³' },
            ]},
            { heading: 'Multiphase model', rows: [
              { label: 'Surface tension model', value: 'CSF, smoothed-α curvature' },
              { label: 'VoF advection',       value: 'Flux-corrected transport (FCT)' },
              { label: 'Interface compression level', value: '2' },
              { label: 'Body-force redistribution', value: 'Enabled' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Transient scheme',    value: 'First-order backward Euler (BDF1)' },
              { label: 'Timestep',           value: 'Δt = 10⁻³ (fixed)' },
              { label: 'Total time',         value: 't = 3.0' },
              { label: 'RMS target',         value: '10⁻⁷' },
            ]},
          ]}
        />
      </section>

      <section id="benchmark">
        <h2>4. Benchmark Quantities</h2>
        <p>
          The reference quantities defined by Hysing et al. are three integrals over the bubble region.
          The <strong>centre of mass</strong> vertical coordinate y<sub>c</sub>(t), the
          <strong> rise velocity</strong> U<sub>c,y</sub>(t), and the <strong>degree of circularity</strong>:
        </p>
        <Equation math="\slashed{c}(t) = \frac{P_a}{P_b} = \frac{\pi d_a}{P_b}" />
        <p>
          A perfect circle gives c = 1; deformation lowers c monotonically. The relevant target is the
          minimum value min<sub>t</sub> c(t).
        </p>

        <div className="my-6 overflow-x-auto rounded-lg border border-[var(--hairline)]">
          <table className="w-full text-sm border-collapse">
            <caption className="text-left text-xs font-mono text-[var(--text-dim)] px-4 py-2 border-b border-[var(--hairline)] bg-[var(--surface-2)] caption-top">
              Hysing Test Case 1 benchmark quantities. Centre-of-mass height and minimum circularity at t = 3; rise velocity is the peak value over t ∈ [0, 3].
            </caption>
            <thead>
              <tr className="bg-[var(--surface-2)]">
                {['Quantity', 'OpenAccel', 'Reference (TP2D)'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-mono text-[var(--cold)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Centre-of-mass height y_c(t=3)',    '1.083',  '1.081'],
                ['Peak rise velocity max_t |U_c,y|',  '0.2413', '0.2417'],
                ['Minimum circularity min_t c̊',       '0.8971', '0.9013'],
              ].map(([q, oa, ref], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-stripe)]'}>
                  <td className="px-4 py-2 text-[var(--text-dim)] font-medium">{q}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs font-semibold text-[var(--signal)]">{oa}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <TutorialFigure
          src="/figures/bubble_yc.svg"
          alt="Centre-of-mass trajectory"
          caption="Centre-of-mass trajectory y_c(t) over the benchmark window t ∈ [0, 3] for the Hysing Test 1 configuration."
        />
        <TutorialFigure
          src="/figures/bubble_rise_velocity.svg"
          alt="Bubble rise velocity"
          caption="Bubble rise velocity U_c,y(t) over the benchmark window. The signal shows initial acceleration, a single peak near t ≈ 1.9 m/s, and a slow decay."
        />
        <TutorialFigure
          src="/figures/bubble_shape.svg"
          alt="Final bubble shape"
          caption="Bubble shape at the final benchmark time t = 3 for the Hysing Test 1 configuration, compared against the reference contours. The bubble has settled into a smooth ellipsoidal shape with a slight depression at the lower pole."
        />
      </section>

      <Takeaway>
        OpenAccel reproduces all three Hysing benchmark quantities in close agreement with the TP2D reference.
        The final centre-of-mass height y<sub>c</sub>(t=3) ≈ 1.083 lies within 0.14% of the reference value
        of 1.081, the peak rise velocity 0.2413 is indistinguishable from the TP2D curve to graphical accuracy,
        and the minimum circularity 0.8971 deviates from 0.9013 by only 0.45%. The smooth ellipsoidal terminal
        shape confirms that the combination of volume-fraction smoothing and consistent CSF body-force
        redistribution suppresses parasitic interface currents.
      </Takeaway>

      <AcceptanceCriterion>
        The three Hysing Test Case 1 benchmark quantities — y<sub>c</sub>(t=3), max<sub>t</sub>|U<sub>c,y</sub>|,
        and min<sub>t</sub>c̊ — shall agree with the TP2D reference values (1.081, 0.2417, 0.9013) to within 1%,
        and the bubble shape at t = 3 shall match the TP2D reference contour to graphical accuracy.
      </AcceptanceCriterion>
    </>
  );
}
