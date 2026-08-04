import { TutorialFigure } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function ElbowContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC017' },
        { label: 'Reference',    value: 'Demonstration case' },
        { label: 'Solver mode',  value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics',      value: '3-D incompressible laminar Navier–Stokes' },
        { label: 'Special',      value: 'Two inlets, one outlet; wedge-element mesh' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          The elbow case is a steady-state, laminar, two-inlet flow demonstrator that exercises three things at
          once: (i) the multi-inlet boundary-condition layer, (ii) the wedge element type in the CVFEM assembler,
          and (iii) the steady-state SIMPLE algorithm under mass-balanced inflow conditions. Two streams enter the
          elbow at right angles — a horizontal stream and a vertical stream — and mix before exiting through a
          single outlet.
        </p>
        <p>
          This is a feature-demonstrator rather than a benchmark with reference data. Its role in the validation
          suite is to confirm that the solver produces a physically reasonable mixing pattern, conserves mass to
          machine precision at the outlet, and converges cleanly.
        </p>
      </section>

      <section id="setup">
        <h2>2. Setup</h2>
        <SetupTable
          caption="Elbow — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Element type',       value: 'Wedge (unspecified-2-wedge)' },
            ]},
            { heading: 'Fluid properties (air)', rows: [
              { label: 'Density ρ',          value: '1.185 kg/m³' },
              { label: 'Dynamic viscosity μ', value: '1.831×10⁻⁵ Pa·s' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'inlet1',             value: 'Velocity inlet, v = (1, 0, 0) m/s' },
              { label: 'inlet2',             value: 'Velocity inlet, v = (0, 3, 0) m/s' },
              { label: 'outlet',             value: 'Static pressure, relative p = 0' },
              { label: 'wall',               value: 'No-slip wall' },
              { label: 'Reference pressure', value: 'p_ref = 101 325 Pa' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Analysis type',      value: 'Steady state' },
              { label: 'Algorithm',          value: 'SIMPLE' },
              { label: 'Advection scheme',   value: 'First-order upwind' },
              { label: 'Under-relaxation',   value: 'λᵛ = 0.8, λᵖ = 0.2' },
              { label: 'Physical timescale', value: 'Δt_ps = 1 s' },
              { label: 'Outer iterations',   value: '1–250 per run' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS residual target', value: '10⁻⁶' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>3. Results</h2>
        <TutorialFigure
          src="/figures/velocity_elbow.png"
          alt="Velocity magnitude in elbow"
          caption="Velocity magnitude. The stronger vertical inlet (v = 3 m/s) dominates the merged stream after the junction. Mass flow rates: inlet 1 = 35.5 kg/s, inlet 2 = 26.7 kg/s, outlet = 62.2 kg/s — confirming mass conservation."
        />
      </section>

      <Takeaway>
        The merged-stream momentum is the vector sum of the two inlet contributions weighted by mass flux: with
        equal inlet areas, the vertical inlet delivers three times the momentum flux and dominates the
        post-junction direction. The case forces the solver to handle two inflow patches with different prescribed
        velocities simultaneously, and to balance them through a single outlet pressure condition.
      </Takeaway>

      <AcceptanceCriterion>
        At convergence, the integrated mass flux at the outlet shall equal the sum of the integrated mass fluxes
        at the two inlets to within machine precision, and the RMS residual shall fall below 10⁻⁶ within the
        250-iteration outer cap.
      </AcceptanceCriterion>
    </>
  );
}
