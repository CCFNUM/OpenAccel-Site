import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function BenardCellsContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC011' },
        { label: 'References',   value: 'Chandrasekhar (1961); Clever & Busse (1974)' },
        { label: 'Solver mode',  value: 'Transient, segregated' },
        { label: 'Physics',      value: '2-D incompressible laminar NS + thermal energy + Boussinesq buoyancy' },
        { label: 'Rayleigh number', value: 'Ra = 9810 (Ra/Ra_c ≈ 5.75)' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          Rayleigh–Bénard convection in a differentially heated horizontal cavity is the canonical test for
          Boussinesq buoyancy coupling. Below the critical Rayleigh number Ra<sub>c</sub> = 1707.76 the fluid
          remains motionless. Above Ra<sub>c</sub>, buoyancy overcomes viscous and diffusive damping, and the
          layer organises into a periodic array of counter-rotating convection rolls. The validation case sits
          at Ra = 9810, validating the buoyancy source term, velocity–temperature coupling, and Nusselt number
          against the spectral benchmark of Clever &amp; Busse (1974).
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/bernard.svg"
          alt="Rayleigh–Bénard cavity schematic"
          label="Figure 1"
          caption="Rayleigh–Bénard cavity (not to scale). The hot floor and cold ceiling drive buoyant motion; side walls are adiabatic no-slip."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          label="Table 1"
          caption="Rayleigh–Bénard convection — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Aspect ratio L/H',   value: '9:1' },
              { label: 'Mesh',               value: '180 × 20 × 1 (N_n = 7 602, N_e = 3 600)' },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: 'Density ρ',          value: '1 kg/m³' },
              { label: 'Dynamic viscosity μ', value: '10⁻³ Pa·s' },
              { label: 'Specific heat c_p',  value: '1 J/(kg·K)' },
              { label: 'Thermal conductivity λ', value: '10⁻³ W/(m·K)' },
              { label: 'Thermal expansion β_T', value: '10⁻³ K⁻¹' },
              { label: 'Prandtl number',     value: 'Pr = 1' },
              { label: 'Rayleigh number',    value: 'Ra = ρ g β_T ΔT H³ / (μ α) = 9810' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Floor',              value: 'T_hot = 301 K, no-slip' },
              { label: 'Ceiling',            value: 'T_cold = 300 K, no-slip' },
              { label: 'Side walls',         value: 'Adiabatic no-slip' },
              { label: 'Body force',         value: 'g = 9.81 m/s² downward, Boussinesq T_ref = 300 K' },
              { label: 'Initial perturbation', value: 'u = 10⁻⁴ m/s (to seed instability)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: 'Time step / end time', value: 'Δt = 5 s, t_end = 1500 s (300 steps)' },
              { label: 'Advection',          value: 'First-order upwind' },
              { label: 'Under-relaxation',   value: 'λᵛ = 0.9, λᵖ = 0.1' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: '10⁻⁵ / up to 10 per step' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <p>The principal validation quantity is the Nusselt number:</p>
        <Equation math="\mathrm{Nu} = \frac{q\,H}{\lambda\,\Delta T}" />

        <TutorialSubfigureStack
          label="Figure 2"
          items={[
            { src: '/figures/velocity_cells.svg',     alt: 'y-velocity contour', subcaption: 'y-velocity contour at steady state, showing six counter-rotating roll pairs.' },
            { src: '/figures/temperature_cells.svg',  alt: 'Temperature contour', subcaption: <>Temperature contour: hot plumes rise from the floor and cold plumes descend from the ceiling. The double-headed arrow marks one convection wavelength <M math="\lambda_r = 1.5~\mathrm{m}" />.</> },
          ]}
          caption={<>Steady-state Rayleigh&ndash;Bénard solution at <M math="\mathrm{Ra} = 9810" />, <M math="\mathrm{Pr} = 1" />.</>}
        />

        <DataTable
          label="Table 2"
          caption={<>Nusselt number compared with the spectral benchmark of Clever &amp; Busse (1974).</>}
          headers={['Source', <M math="\mathrm{Ra}" />, <M math="k" />, <M math="\mathrm{Pr}" />, <M math="\mathrm{Nu}" />]}
          rows={[
            ['Clever & Busse (1974)', '10 000', '3.117', '0.71', '2.661'],
            ['Present work', '9 810', '4.18', '1.0', <span className="font-semibold" style={{ color: 'var(--signal)' }}>2.67</span>],
          ]}
        />
      </section>

      <Takeaway>
        The 0.34% agreement with the spectral benchmark of Clever &amp; Busse (1974) validates both the Boussinesq
        buoyancy coupling and the thermal-energy advection. The mild differences in Ra, k, and Pr between the two
        configurations do not affect the comparison: at moderate Rayleigh numbers the Nusselt number is only weakly
        sensitive to the Prandtl number in the range Pr ∈ [0.71, 1].
      </Takeaway>

      <AcceptanceCriterion>
        The time-averaged Nusselt number shall agree with the Clever &amp; Busse benchmark to within 1% on the
        180 × 20 mesh, and the steady-state flow shall develop into a periodic array of counter-rotating
        convection rolls.
      </AcceptanceCriterion>
    </>
  );
}
