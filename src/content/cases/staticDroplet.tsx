import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function StaticDropletContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC010' },
        { label: 'References',   value: 'Brackbill et al. (1992); François et al. (2006)' },
        { label: 'Solver mode',  value: 'Transient, segregated' },
        { label: 'Physics',      value: '2-D incompressible VoF + CSF surface tension' },
        { label: 'Reference',    value: 'Young–Laplace, Δp = σ/R = 365 Pa' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          The static droplet is the canonical isolation test for the Continuum Surface Force (CSF) model and the
          curvature-computation pipeline. A circular droplet sits at the centre of a quiescent ambient fluid.
          In the absence of gravity and with matched fluid properties on both sides of the interface, the only
          physical effect is the surface-tension-induced pressure jump given by the Young–Laplace relation:
        </p>
        <Equation math="\Delta p = \sigma\kappa" />
        <p>
          For a 2-D circular droplet κ = 1/R, so Δp<sub>exact</sub> = 73 / 0.2 = 365 Pa. Any non-zero
          residual velocity is the diagnostic for <em>spurious parasitic currents</em> — a known numerical
          artefact of the CSF formulation.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/droplet.png"
          alt="Static droplet geometry"
          caption="Static droplet of radius R = 0.2 m centred in a unit-square domain. Inward arrows mark the direction of the surface-tension force."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="Static droplet — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',             value: 'Unit square' },
              { label: 'Droplet radius R',   value: '0.2 m, centred at (0.5, 0.5)' },
              { label: 'Mesh',               value: '100 × 100 × 1 hexahedra (N_e = 10 000)' },
              { label: 'Initialisation α_water', value: 'Smoothed Heaviside, α = ½{1 − tanh[(r − R)/ε]}, ε = h/2 = 5×10⁻³' },
            ]},
            { heading: 'Fluid properties (matched)', rows: [
              { label: 'Density (both phases)', value: 'ρ = 1000 kg/m³' },
              { label: 'Viscosity (both phases)', value: 'μ = 10⁻³ Pa·s' },
              { label: 'Surface tension',    value: 'σ = 73 N/m' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'All boundaries',     value: 'Symmetry (no gravity)' },
              { label: 'Pressure pin',       value: 'Reference pressure p = 0 at the origin' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: 'End time',           value: '5 s' },
              { label: 'Initial Δt',         value: '10⁻⁴ s, adaptive with Co_max = 0.5' },
              { label: 'VoF smoothing',      value: '6 iterations, Fo = 0.25; body-force redistribution on' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: '10⁻⁷ / up to 15 per step' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <p>
          The pressure-jump accuracy is quantified by three metrics. The relative error is
          E(ΔP) = |ΔP<sub>num</sub> − ΔP<sub>exact</sub>| / ΔP<sub>exact</sub> × 100%.
        </p>

        <div className="my-6 overflow-x-auto rounded-lg border border-[var(--hairline)]">
          <table className="w-full text-sm border-collapse">
            <caption className="text-left text-xs font-mono text-[var(--text-dim)] px-4 py-2 border-b border-[var(--hairline)] bg-[var(--surface-2)] caption-top">
              Static droplet: pressure-jump metrics and maximum spurious velocity. Analytical: Δp_exact = 365 Pa.
            </caption>
            <thead>
              <tr className="bg-[var(--surface-2)]">
                <th className="px-4 py-2 text-left text-xs font-mono text-[var(--cold)]">Metric</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-[var(--cold)]">Analytical (Pa)</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-[var(--cold)]">Numerical (Pa)</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-[var(--cold)]">Error (%)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['ΔP_total',   '365', '333.1', '8.7'],
                ['ΔP_partial', '365', '350.8', '3.8'],
                ['ΔP_max',     '365', '352.0', '3.5'],
                ['‖U‖_max [m/s]', '0', '0.07', '—'],
              ].map(([m, a, n, e], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-stripe)]'}>
                  <td className="px-4 py-2 text-[var(--text-dim)] font-medium">{m}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{a}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{n}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TutorialFigure
          src="/figures/pressure_droplet_distribution.png"
          alt="Pressure centreline distribution"
          caption="Pressure distribution along the horizontal centreline y = 0.5 m, compared against the analytical Young–Laplace solution (Δp_exact = 365 Pa)."
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/pressure_droplet.png', alt: 'Pressure contour', subcaption: 'Pressure contour.' }}
          right={{ src: '/figures/velocity_droplet.png', alt: 'Velocity magnitude', subcaption: 'Velocity magnitude (parasitic currents).' }}
          caption="Static droplet contours. The pressure jump is uniform inside and outside, while the velocity field shows CSF parasitic currents localised at the interface."
        />
      </section>

      <Takeaway>
        OpenAccel reproduces the Young–Laplace pressure jump on a 100 × 100 grid with ΔP<sub>partial</sub> ≈ 351 Pa
        and ΔP<sub>max</sub> ≈ 352 Pa, both within 4% of the analytical value. The smoothed initial volume-fraction
        field, together with consistent CSF body-force redistribution, keeps the parasitic capillary number of
        order O(10⁻⁶) throughout the time window.
      </Takeaway>

      <AcceptanceCriterion>
        ΔP<sub>partial</sub> and ΔP<sub>max</sub> shall agree with the Young–Laplace value of 365 Pa to within
        10%, and the maximum spurious velocity shall remain ‖U‖<sub>max</sub> &lt; 0.1 m/s on the 100 × 100 grid.
      </AcceptanceCriterion>
    </>
  );
}
