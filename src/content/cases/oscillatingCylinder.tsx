import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function OscillatingCylinderContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC022' },
        { label: 'Reference',    value: 'Dütsch, Durst, Becker & Lienhart (1998), J. Fluid Mech. 360:249–271' },
        { label: 'Solver mode',  value: 'Transient, incompressible, laminar' },
        { label: 'Physics',      value: 'Laminar NS; prescribed ALE boundary motion; displacement-diffusion mesh deformation' },
        { label: 'Re / KC',      value: 'Re = 100, KC = 5, β = 20' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          This case validates OpenAccel's mesh-deformation capability on the canonical problem of a circular
          cylinder oscillating harmonically along its diameter in an otherwise quiescent fluid. Unlike the rotating
          cylinder (VC019), where the moving sub-domain is displaced rigidly across a sliding interface, the
          present case deforms a single body-fitted mesh: the cylinder wall is driven sinusoidally and the
          interior nodes are relaxed by the displacement-diffusion solver while the outer boundary is held fixed.
          It verifies that the deforming-mesh formulation satisfies the geometric conservation law and recovers
          the correct unsteady hydrodynamic loading, quantified through the Morison drag and inertia coefficients
          reported by Dütsch et al. (1998) from their spectral-element reference solution and laser-Doppler
          measurements.
        </p>
        <p>The cylinder translates harmonically according to:</p>
        <Equation math="x_c(t) = -A\sin(2\pi f t)" />
        <p>The two governing dimensionless groups are:</p>
        <Equation math="\mathrm{Re} = \frac{U_{\max} D}{\nu} = 100, \qquad \mathit{KC} = \frac{U_{\max}}{fD} = 5" />
        <p>
          where U<sub>max</sub> = 2πfA is the peak cylinder velocity. From these, A = 7.958×10⁻³ m (= 0.796D),
          U<sub>max</sub> = 1.010×10⁻² m/s, and f = 0.2020 Hz (T = 4.9505 s). The Stokes parameter β = Re/KC = 20.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialSubfigureStack label="Figure 1"
          items={[
            { src: '/figures/oscillating_cylinder.svg', alt: 'Geometry and BCs', subcaption: 'Schematic of the circular far-field domain, boundary conditions, and prescribed cylinder motion.' },
            { src: '/figures/mesh_osc_cylinder.svg', alt: 'Near-wall mesh close-up', subcaption: 'Close-up of the body-fitted O-grid at the cylinder surface (first cell height 10⁻³D).' },
          ]}
          caption="Geometry and computational mesh for the in-line oscillating-cylinder case."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="In-line oscillating cylinder — complete case setup"
          groups={[
            { heading: 'Geometry and mesh (Dütsch Set B1)', rows: [
              { label: 'Cylinder diameter D',    value: '0.01 m' },
              { label: 'Circumferential cells',  value: '192' },
              { label: 'Radial cells',           value: '128' },
              { label: 'Total cells',            value: '24 576 (QUAD4)' },
              { label: 'Outer-boundary radius',  value: '60D = 0.6 m' },
              { label: 'First cell height',      value: '10⁻³D' },
            ]},
            { heading: 'Fluid properties (water)', rows: [
              { label: 'Density ρ',              value: '998.2 kg/m³' },
              { label: 'Dynamic viscosity μ',    value: '1.00818×10⁻³ Pa·s' },
              { label: 'Kinematic viscosity ν',  value: '1.01×10⁻⁶ m²/s' },
            ]},
            { heading: 'Cylinder motion', rows: [
              { label: 'Amplitude A',            value: '7.958×10⁻³ m (= 0.796D)' },
              { label: 'Frequency f',            value: '0.2020 Hz' },
              { label: 'Period T',               value: '4.9505 s' },
              { label: 'Peak velocity U_max',    value: '1.010×10⁻² m/s' },
              { label: 'Reynolds number',        value: '100' },
              { label: 'Keulegan–Carpenter KC',  value: '5' },
              { label: 'Stokes parameter β',     value: '20' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Cylinder',               value: 'No-slip, periodic_displacement value [−7.958×10⁻³, 0, 0], f = 0.2020' },
              { label: 'Far field',              value: 'Fixed wall (pins mesh-deformation field)' },
              { label: 'Initial condition',      value: 'u = 0, p = 0' },
            ]},
            { heading: 'Mesh deformation', rows: [
              { label: 'Model',                  value: 'Displacement diffusion, relative to initial mesh' },
              { label: 'Stiffness',              value: 'Blended distance and small volumes' },
              { label: 'Distance / volume exp.', value: '0.5 / 2.0' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Transient scheme',       value: 'Second-order backward Euler (BDF2)' },
              { label: 'Advection',              value: 'High-resolution' },
              { label: 'Timestep Δt',            value: '6.876×10⁻³ s (= T/720)' },
              { label: 'Total time',             value: '49.505 s (10 periods)' },
              { label: 'Under-relaxation',       value: 'λᵛ = 0.6, λᵖ = 0.4' },
              { label: 'Outer iterations',       value: '1–20 per timestep' },
              { label: 'RMS target',             value: '10⁻⁶' },
            ]},
          ]}
        />
      </section>

      <section id="benchmark">
        <h2>4. Benchmark Quantities</h2>
        <p>The in-line force is represented through the Morison equation:</p>
        <Equation math="F_x(t) = -\tfrac{1}{2}\rho D\,c_d\,\dot{x}_c|\dot{x}_c| - \tfrac{\pi}{4}\rho D^2 c_i\,\ddot{x}_c" />
        <p>The mass (added-mass) coefficient is c<sub>m</sub> = c<sub>i</sub> + 1. The coefficients are extracted from the fundamental Fourier components over the last period:</p>
        <Equation math="c_d = \frac{3\pi\,a_1}{4\rho D\,U_{\max}^2}, \qquad c_i = -\frac{2\,b_1}{\pi^2 f\rho D^2 U_{\max}}, \qquad c_m = c_i + 1" />

        <DataTable
          label="Table 2"
          caption="Morison coefficients at Re = 100, KC = 5, compared with Dütsch et al. (1998)."
          headers={['Coefficient', 'OpenAccel', 'Ref. (Dütsch)', 'Diff. (%)']}
          rows={[
            ['c_d', <span className="font-semibold" style={{ color: 'var(--signal)' }}>2.11</span>, '2.10', '+0.5%'],
            ['c_i', <span className="font-semibold" style={{ color: 'var(--signal)' }}>1.50</span>, '1.45', '+3.4%'],
            ['c_m', <span className="font-semibold" style={{ color: 'var(--signal)' }}>2.50</span>, '2.45', '+2.0%'],
          ]}
        />
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <TutorialFigure label="Figure 2"
          src="/figures/F_x_cycle.svg"
          alt="In-line force over 10 periods"
          caption="In-line hydrodynamic force per unit length F₁(t) over ten oscillation periods. The start-up transient decays within the first cycle; the remaining cycles are periodic to plotting accuracy."
        />
        <TutorialFigure label="Figure 3"
          src="/figures/inline_force_osc_cylinder.svg"
          alt="In-line force history — one period"
          caption="In-line force over the last highlighted period. OpenAccel (solid) tracks the Dütsch reference (dashed) closely, including the twin peaks near flow reversal. The Morison reconstruction (dotted) captures only the fundamental harmonic."
        />
        <TutorialFigure label="Figure 4"
          src="/figures/velocity_osc_cylinder.svg"
          alt="Phase-averaged velocity profiles"
          caption="Phase-averaged velocity profiles at two cross-stream stations. (a) Streamwise component u. (b) Cross-stream component v. OpenAccel overlays the reference numerical solution and the laser-Doppler measurements of Dütsch et al. (1998)."
        />

        <p className="mt-6 mb-2 text-sm text-[var(--text-dim)]">
          Out-of-plane vorticity isolines at three oscillation phases — OpenAccel (left) vs. Dütsch et al. reference (right):
        </p>
        {([
          ['96',  'vorticity_96_cylinder',  'osc_cylinder_96'],
          ['192', 'vorticity_192_cylinder', 'osc_cylinder_192'],
          ['288', 'vorticity_288_cylinder', 'osc_cylinder_288'],
        ] as [string, string, string][]).map(([phase, oa, ref]) => (
          <div key={phase} className="my-6 overflow-x-auto rounded-lg border border-[var(--hairline)] p-4">
            <p className="text-xs font-mono text-[var(--text-dim)] mb-3">φ = {phase}°</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <img src={`/figures/${oa}.png`} alt={`OpenAccel vorticity φ=${phase}°`} className="w-full rounded" />
                <p className="mt-1 text-xs text-[var(--text-dim)] text-center italic">OpenAccel</p>
              </div>
              <div className="flex-1">
                <img src={`/figures/${ref}.png`} alt={`Reference vorticity φ=${phase}°`} className="w-full rounded" />
                <p className="mt-1 text-xs text-[var(--text-dim)] text-center italic">Dütsch et al. (1998)</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Takeaway>
        OpenAccel reproduces the unsteady hydrodynamic loading of an in-line oscillating cylinder in close
        agreement with the Dütsch et al. (1998) reference across every reported metric. The Morison drag
        coefficient is recovered to within 0.5% and the inertia coefficient to within 3.4% of the
        spectral-element values — both comfortably inside the scatter between the reference numerical and
        laser-Doppler results. The point-wise velocity profiles fall on top of both the reference numerical
        and experimental data through the boundary layer and near-wake shear layer, and the vorticity-isoline
        topology is preserved across all three reported phases. These results establish that the
        displacement-diffusion mesh-deformation formulation conserves the flow structure through prescribed
        wall motion.
      </Takeaway>

      <AcceptanceCriterion>
        The Morison drag and inertia coefficients shall agree with the Dütsch et al. (1998) reference to within
        5%; the in-line force history, cross-stream velocity profiles, and near-wake vorticity isolines shall
        reproduce the reference fields to graphical accuracy.
      </AcceptanceCriterion>
    </>
  );
}
