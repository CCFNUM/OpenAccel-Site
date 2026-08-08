import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function FlexibleBottomCavityContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC024' },
        { label: 'References',   value: 'Tuković et al. (2018); solids4foam tutorial' },
        { label: 'Solver mode',  value: 'Transient, segregated; partitioned FSI with Aitken Δ² relaxation' },
        { label: 'Physics',      value: '2-D incompressible laminar flow + ALE + linear elasticity' },
        { label: 'Re',           value: '100' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          This benchmark exercises FSI in the weak-coupling regime. A laminar channel flow at Re = 100 passes
          over a square cavity whose floor is closed by a thick elastic plate clamped at both ends. The cavity
          pressure distribution — driven by the shear-layer separation at the upstream cavity lip and the
          recirculation inside — deflects the plate downward; the deflection is small but well-defined and
          reaches a steady value after a transient.
        </p>
        <p>
          Because the fluid-to-solid density ratio is ρ<sub>f</sub>/ρ<sub>s</sub> = 10⁻³, added-mass effects
          are negligible and the case stresses the mesh-motion, transfer, and structural-coupling components
          of the FSI loop. The validation targets are the steady-state horizontal and vertical displacement
          at the plate midpoint A = (4, −1.4) and the integrated vertical force on the FSI interface.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure label="Figure 1"
          src="/figures/flexible_bottom_cavity.svg"
          alt="Channel-cavity geometry"
          caption="Channel–cavity geometry: a 14 × 1 m channel feeds a 4 × 1 m square cavity whose floor is a clamped elastic plate of thickness 0.4 m. The FSI interface is the cavity floor at y = −1. The plate midpoint A = (4, −1.4) is the probe location for displacement metrics."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Channel flow over flexible cavity floor — complete case setup"
          groups={[
            { heading: 'Geometry', rows: [
              { label: 'Channel',                value: '14 × 1 m (length × height)' },
              { label: 'Cavity',                 value: '4 × 1 m, x ∈ [2, 6], y ∈ [−1, 0]' },
              { label: 'Plate (solid)',           value: '4 × 0.4 m, x ∈ [2, 6], y ∈ [−1.4, −1]' },
              { label: 'Probe point A',          value: '(4, −1.4) — plate midpoint, lower surface' },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: 'Density ρ_f',            value: '1 kg/m³' },
              { label: 'Kinematic viscosity ν',   value: '0.01 m²/s' },
              { label: 'Reynolds number',        value: 'Re = Ū H/ν = 100' },
            ]},
            { heading: 'Solid properties (total-Lagrangian linear elastic)', rows: [
              { label: 'Density ρ_s',            value: '1000 kg/m³' },
              { label: 'Young\'s modulus E',      value: '500 Pa' },
              { label: 'Poisson\'s ratio ν_s',   value: '0.4' },
              { label: 'Rayleigh damping α',      value: '0.1 s⁻¹ (mass-proportional)' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',                  value: 'Parabolic u_x = 6y(1−y), cosine ramp t ∈ [0, 10] s' },
              { label: 'Outlet',                 value: 'Static pressure p = 0' },
              { label: 'Plate ends',             value: 'Fixed displacement (clamped)' },
              { label: 'FSI interface',          value: 'Cavity floor y = −1, x ∈ [2, 6]' },
            ]},
            { heading: 'FSI coupling', rows: [
              { label: 'Acceleration scheme',    value: 'Aitken Δ², ω₀ = 0.2, ω ∈ [0.1, 0.8]' },
              { label: 'Outer FSI iterations',   value: 'Up to 20 per step, target 10⁻⁷ (RMS)' },
              { label: 'Inner sub-iterations',   value: '20 flow, 5 solid displacement' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',       value: 'First-order backward Euler' },
              { label: 'Time step / end time',   value: 'Δt = 0.25 s, t_end = 400 s' },
              { label: 'Advection',              value: 'High-resolution' },
              { label: 'Mesh',                   value: 'Fluid: 13 320 cells; Solid: 492 cells (82 × 6)' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>

        <TutorialSubfigureRow label="Figure 2"
          left={{ src: '/figures/u_x_cavity_flex.svg', alt: 'Horizontal displacement (undamped)', subcaption: 'Horizontal displacement u_x(A, t)' }}
          right={{ src: '/figures/u_y_cavity_flex.svg', alt: 'Vertical displacement (undamped)', subcaption: 'Vertical displacement u_y(A, t)' }}
          caption="Plate midpoint displacement without structural damping. The under-damped oscillation decays through fluid viscous dissipation and numerical damping from the first-order scheme."
        />
        <TutorialSubfigureRow label="Figure 3"
          left={{ src: '/figures/u_x_cavity_flex_damped.svg', alt: 'Horizontal displacement (damped)', subcaption: 'Horizontal displacement u_x(A, t), damped run' }}
          right={{ src: '/figures/u_y_cavity_flex_damped.svg', alt: 'Vertical displacement (damped)', subcaption: 'Vertical displacement u_y(A, t), damped run' }}
          caption="Plate midpoint displacement with mass-proportional Rayleigh damping (α = 0.1 s⁻¹). The persistent oscillation is eliminated and the plate reaches its asymptotic deflection monotonically."
        />

        <div className="my-6 overflow-x-auto rounded-lg border border-[var(--hairline)]">
          <table className="w-full text-sm border-collapse">
            <caption className="text-left text-xs font-mono text-[var(--text-dim)] px-4 py-2 border-b border-[var(--hairline)] bg-[var(--surface-2)] caption-top">
              Steady-state metrics at point A = (4, −1.4) and integrated vertical FSI force.
            </caption>
            <thead>
              <tr className="bg-[var(--surface-2)]">
                {['Quantity', 'OpenAccel (undamped)', 'OpenAccel (damped)', 'Reference'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-mono text-[var(--cold)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['u_x,A [mm]  (s4f coarse)', '−0.00016', '−0.00015', '−0.00018'],
                ['u_y,A [mm]  (Tuković et al.)', '−0.253', '−0.251', '−0.250'],
                ['F_y [N/m]  (s4f coarse)', '−5.129', '−5.030', '−5.176'],
              ].map(([q, u, d, r], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-stripe)]'}>
                  <td className="px-4 py-2 text-[var(--text-dim)] font-medium">{q}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{u}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs font-semibold text-[var(--signal)]">{d}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--text-dim)] -mt-4 mb-6 px-1">
          u_y,A reference from the fine-mesh Tuković et al. study; u_x,A and F_y from the solids4foam coarse-mesh tutorial.
        </p>

        <TutorialSubfigureRow label="Figure 4"
          left={{ src: '/figures/cavity_flex_contour_openaccel.svg', alt: 'OpenAccel steady-state field', subcaption: 'OpenAccel' }}
          right={{ src: '/figures/cavity_flex_contour_s4f.png', alt: 'solids4foam reference field', subcaption: 'solids4foam' }}
          caption="Steady-state fields: fluid domain coloured by velocity magnitude, elastic plate coloured by von Mises stress. The channel boundary layers, cavity recirculation, and bending-stress distribution in the deformed plate are all visible."
        />
      </section>

      <Takeaway>
        The plate settles to a small downward deflection set by the quasi-uniform pressure deficit in the cavity
        recirculation. Without structural damping, the approach is under-damped; activating mass-proportional
        Rayleigh damping (α = 0.1 s⁻¹) eliminates the oscillation and allows the steady-state value to be read
        directly — that value is unchanged, as mass-proportional damping affects only the transient. The damped
        vertical displacement u<sub>y,A</sub> = −0.251 mm matches the mesh-converged Tuković et al. reference
        of −0.250 mm to 0.4%, and the integrated interface force F<sub>y</sub> agrees with the solids4foam
        coarse-mesh reference to 0.9%. The higher von Mises stress at the clamped edges in the OpenAccel field
        (compared to the s4f counterpart) reflects the finer mesh resolving the bending-stress concentration
        more accurately.
      </Takeaway>

      <AcceptanceCriterion>
        The steady-state vertical displacement u<sub>y,A</sub> shall match the Tuković et al. reference within
        ±5%; the integrated vertical force F<sub>y</sub> shall match the solids4foam coarse tutorial within
        ±5%; the cavity flow shall display a single dominant recirculation and the plate a symmetric bending
        shape.
      </AcceptanceCriterion>
    </>
  );
}
