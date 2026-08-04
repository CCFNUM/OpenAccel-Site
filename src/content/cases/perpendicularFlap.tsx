import { TutorialFigure } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function PerpendicularFlapContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC009' },
        { label: 'Reference',    value: 'preCICE tutorial suite (2022)' },
        { label: 'Solver mode',  value: 'Transient, segregated; partitioned FSI with Aitken' },
        { label: 'Physics',      value: '2-D incompressible Navier–Stokes + linear elasticity' },
        { label: 'Coupling',     value: 'Aitken Δ² relaxation' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          The perpendicular flap is a single-phase FSI benchmark from the preCICE tutorial suite: a thin elastic
          flap mounted perpendicular to a uniform inflow deflects under the hydrodynamic load, and the dynamic
          interaction generates an unsteady wake. This case isolates the FSI coupling without VoF. Reference
          data are the tip-displacement histories produced by several open-source toolchains coupled through
          preCICE.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/flap_schematic.png"
          alt="Perpendicular flap schematic"
          caption="Perpendicular flap: a thin elastic flap of height 1 m and thickness 0.1 m on the lower wall of a L × H = 6 × 4 m channel."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="Perpendicular flap — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Channel size',       value: 'L × H = 6 × 4 m' },
              { label: 'Flap',               value: '1 m height, 0.1 m thickness, centred on lower wall' },
              { label: 'Mesh',               value: '7 414 nodes / 3 510 elements' },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: 'Density ρ_f',        value: '1.0 kg/m³' },
              { label: 'Kin. viscosity ν_f', value: '1.0 m²/s' },
            ]},
            { heading: 'Solid properties (linear elastic)', rows: [
              { label: 'Density ρ_s',        value: '3000 kg/m³' },
              { label: "Young's modulus E",   value: '4.0×10⁶ kg/(m·s²)' },
              { label: "Poisson's ratio ν_s", value: '0.3' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',              value: 'Uniform horizontal U∞ = 10 m/s' },
              { label: 'Outlet',             value: 'Outflow' },
              { label: 'Top, bottom, flap',  value: 'No-slip walls' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: 'Δt, end time',       value: '0.01 s, 5 s' },
              { label: 'Advection',          value: 'First-order upwind' },
              { label: 'Under-relaxation',   value: 'λᵛ = 0.7, λᵖ = 0.3' },
              { label: 'Mesh stiffness',     value: 'Inverse-volume (exponent 2), 3 smoothing iters/step' },
            ]},
            { heading: 'FSI coupling', rows: [
              { label: 'Interface type',     value: 'General-connection, search tol. 5×10⁻³' },
              { label: 'Acceleration',       value: 'Aitken, ω₀ = 0.5, ω ∈ [0.1, 1.0]' },
              { label: 'Sub-iterations',     value: '10 (flow) / 30 (solid) per outer loop' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: '10⁻⁶ / up to 50 per step' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <TutorialFigure
          src="/figures/displacement-flap.png"
          alt="Flap tip displacement"
          caption="Time history of horizontal tip displacement δ_x^tip(t) of the perpendicular flap, compared against the preCICE reference toolchain combinations."
        />
        <TutorialFigure
          src="/figures/velocity.png"
          alt="Velocity magnitude around flap"
          caption="Velocity magnitude around the perpendicular flap at t = 2 s. The flow accelerates around the flap tip and forms a recirculation zone in the wake."
        />
      </section>

      <Takeaway>
        The OpenAccel tip-displacement trace falls within the scatter band of the preCICE reference toolchain
        combinations, with closest agreement against the OpenFOAM–Nutils result. The total-Lagrangian
        linear-elastic solid formulation, coupled with incompressible Navier–Stokes through the partitioned
        interface and accelerated by Aitken Δ², reproduces both the oscillation period and the steady-state
        deflection.
      </Takeaway>

      <AcceptanceCriterion>
        The horizontal tip-displacement history δ_x^tip(t) shall fall within the scatter band of the preCICE
        reference combinations over 0 ≤ t ≤ 5 s.
      </AcceptanceCriterion>
    </>
  );
}
