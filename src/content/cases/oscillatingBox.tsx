import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function OscillatingBoxContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC018' },
        { label: 'Reference',    value: 'Demonstration of dynamic mesh capability' },
        { label: 'Solver mode',  value: 'Transient, segregated; ALE with prescribed boundary motion' },
        { label: 'Physics',      value: '3-D incompressible laminar Navier–Stokes + displacement-diffusion mesh motion' },
        { label: 'Special',      value: 'Periodic Dirichlet displacement on an interior wall' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          The oscillating-box case isolates the ALE machinery from the rest of the multi-physics stack. A rigid
          square obstacle inside a closed cavity is forced to translate periodically in the vertical direction;
          the surrounding fluid mesh deforms via the displacement-diffusion equation, and the resulting mesh
          velocity feeds into the Navier–Stokes equations through the relative-velocity term and the geometric
          conservation law (GCL).
        </p>
        <p>
          Compared to the FSI cases, here the structural deformation is <em>prescribed</em> rather than computed —
          there is no solid solver in the loop, no partitioned coupling. This isolates only the mesh-motion layer.
          The blended distance-and-volume mesh-stiffness formulation is exercised here.
        </p>
      </section>

      <section id="setup">
        <h2>2. Setup</h2>
        <SetupTable label="Table 1"
          caption="Oscillating box — complete case setup"
          groups={[
            { heading: 'Fluid properties (air)', rows: [
              { label: 'Density ρ',           value: '1.185 kg/m³' },
              { label: 'Dynamic viscosity μ',  value: '1.831×10⁻⁵ Pa·s' },
              { label: 'Reference pressure',   value: 'p_ref = 101 325 Pa' },
            ]},
            { heading: 'Mesh motion', rows: [
              { label: 'Model',                value: 'Displacement-diffusion' },
              { label: 'Stiffness',            value: 'Blended distance-and-small-volumes' },
              { label: 'Distance exponent',    value: '0.5' },
              { label: 'Volume exponent',      value: '2.0' },
              { label: 'Reference configuration', value: 'Initial mesh' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'square',               value: 'Periodic prescribed displacement: f = 1 Hz, D = (0, 0.1, 0) m' },
              { label: 'left, right, bottom, top', value: 'No-slip walls' },
              { label: 'Pressure pin',         value: 'p_rel = 0 at (−0.5, −0.3, 0)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Analysis type',        value: 'Transient' },
              { label: 'Time integration',     value: 'First-order backward Euler' },
              { label: 'Time step / total time', value: 'Δt = 0.1 s, t_end = 1 s' },
              { label: 'Advection scheme',     value: 'First-order upwind' },
              { label: 'Under-relaxation',     value: 'λᵛ = 0.8, λᵖ = 0.2' },
              { label: 'Outer iterations',     value: '1–50 per step' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS residual target',  value: '10⁻⁶' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>3. Results</h2>
        <TutorialFigure label="Figure 1"
          src="/figures/y-disp-box.svg"
          alt="Box vertical displacement"
          caption="Probe-point vertical displacement for the oscillating box. The OpenAccel ALE solution (symbols) is compared against the prescribed sinusoidal motion y(t) = 0.1 sin(2πt) with f = 1 Hz and A = 0.1 m (solid line). The two curves overlap to within 10⁻⁴ m over one full cycle."
        />

        <p className="text-[var(--text-dim)] text-sm mt-6 mb-2">
          Velocity (left) and pressure (right) contours at each timestep during one oscillation cycle:
        </p>

        <div className="my-4 flex gap-4 justify-center">
          <div className="flex flex-col items-center gap-1">
            <img src="/figures/legend_velo_box.svg" alt="Velocity legend" className="max-h-16 object-contain" />
            <span className="text-xs font-mono text-[var(--text-dim)]">Velocity</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <img src="/figures/legend_press_box.svg" alt="Pressure legend" className="max-h-16 object-contain" />
            <span className="text-xs font-mono text-[var(--text-dim)]">Pressure</span>
          </div>
        </div>

        {([
          ['0',   '0'],
          ['0.1', '0.1'],
          ['0.3', '0.3'],
          ['0.4', '0.4'],
          ['0.5', '0.5'],
          ['0.6', '0.6'],
          ['0.8', '0.8'],
          ['0.9', '0.9'],
          ['1',   '1.0'],
        ] as [string, string][]).map(([key, label]) => (
          <TutorialSubfigureRow label="Figure 2"
            key={key}
            left={{  src: `/figures/box_${key}_velocity.png`, alt: `Velocity t=${label}s`, subcaption: `Velocity, t = ${label} s` }}
            right={{ src: `/figures/box_${key}_press.png`,    alt: `Pressure t=${label}s`, subcaption: `Pressure, t = ${label} s` }}
            caption={`t = ${label} s`}
          />
        ))}
      </section>

      <Takeaway>
        With a 1 Hz oscillation and a 1 s simulation window, the box completes one full cycle. The blended
        stiffness keeps the elements adjacent to the oscillating wall well-conditioned — the volume-exponent term
        protects the small near-wall cells, and the distance-exponent term protects the elements near the lateral
        walls from being crushed. The case is also a useful regression test for the GCL implementation: a
        spatially uniform field should remain uniform on the deforming mesh if the GCL source correctly augments
        the transport-equation residual.
      </Takeaway>

      <AcceptanceCriterion>
        The mesh shall complete one full oscillation cycle without element inversion (positive Jacobians throughout);
        the prescribed boundary displacement shall be tracked exactly by the mesh; and the RMS residual shall fall
        below 10⁻⁶ within the 50-iteration outer cap on each timestep.
      </AcceptanceCriterion>
    </>
  );
}
