import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function FlangeContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC016' },
        { label: 'Reference',    value: 'Demonstration / textbook conduction' },
        { label: 'Solver mode',  value: 'Transient, single-domain solid heat transfer' },
        { label: 'Physics',      value: '3-D thermal-energy equation in a solid (no flow)' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          The flange case is the simplest possible exercise of the thermal-energy equation in OpenAccel: a solid
          part with no flow, no buoyancy, and no coupling to a fluid domain — just transient diffusion of heat
          under prescribed Dirichlet conditions on two of its four patches. This is the "hello world" of any
          heat-transfer solver, and a useful entry point to the multi-domain CHT cases. It confirms that the
          solid-side thermal-energy assembly is correct in isolation before being coupled to a fluid.
        </p>
        <p>
          The geometry is a flange composed of mixed hexahedral and prismatic elements, which exercises the
          CVFEM machinery's uniform handling of mixed-element topologies on a single domain.
        </p>
      </section>

      <section id="setup">
        <h2>2. Setup</h2>
        <SetupTable
          caption="Flange thermal diffusion — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',             value: 'Solid flange, mixed hex + prism elements' },
              { label: 'Mesh blocks',        value: 'solid-hex, solid-pri' },
            ]},
            { heading: 'Material (synthetic)', rows: [
              { label: 'Density ρ',          value: '1 kg/m³' },
              { label: 'Specific heat c_p',  value: '1 J/(kg·K)' },
              { label: 'Thermal conductivity λ', value: '4×10⁻⁵ W/(m·K)' },
              { label: 'Thermal diffusivity α', value: 'λ/(ρ c_p) = 4×10⁻⁵ m²/s' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'patch1',             value: 'Adiabatic wall (zero heat flux)' },
              { label: 'patch2',             value: 'Fixed temperature T = 273 K' },
              { label: 'patch3',             value: 'Adiabatic wall (zero heat flux)' },
              { label: 'patch4',             value: 'Fixed temperature T = 573 K' },
            ]},
            { heading: 'Initialisation', rows: [
              { label: 'Initial temperature', value: 'T₀ = 273 K (uniform)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Analysis type',      value: 'Transient' },
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: 'Time step / total time', value: 'Δt = 5×10⁻³ s, t_end = 3 s' },
              { label: 'Outer iterations',   value: '1–5 per step' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS residual target', value: '10⁻⁶' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>3. Results</h2>
        <TutorialSubfigureRow
          left={{ src: '/figures/temp_contour_flange_0.1.svg', alt: 'Early transient temperature', subcaption: 'Temperature field at an early time (transient).' }}
          right={{ src: '/figures/temp_contour_flange_3.svg',  alt: 'Steady-state temperature',    subcaption: 'Steady-state temperature field at t = 3 s.' }}
          caption="Temperature evolution in the flange. The thermal field smoothly bridges the two prescribed-temperature patches; adiabatic boundaries are silent (zero normal flux) at convergence."
        />
      </section>

      <Takeaway>
        With a thermal diffusivity of α = 4×10⁻⁵ m²/s and a 3 s simulation window, the diffusion length scale
        √(αt) is on the order of 1.1×10⁻² m — so the field has not yet reached full steady state by t = 3 s,
        genuinely testing the transient term as well as the steady operator. The case also serves as a smoke
        test that the mixed hex–prism mesh assembly correctly sums contributions across element types in the
        dual control volumes.
      </Takeaway>

      <AcceptanceCriterion>
        The temperature field shall remain bounded between T<sub>cold</sub> = 273 K and T<sub>hot</sub> = 573 K
        throughout the transient (maximum-principle compliance), the adiabatic patches shall carry no normal
        heat flux at convergence, and the RMS residual shall fall below 10⁻⁶ within the five-iteration outer
        cap on each timestep.
      </AcceptanceCriterion>
    </>
  );
}
