import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function PlateHoleContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC014' },
        { label: 'Reference',    value: 'Kirsch (Timoshenko & Goodier, 1951)' },
        { label: 'Solver mode',  value: 'Steady-state' },
        { label: 'Physics',      value: '2-D linear elasticity, plane stress' },
        { label: 'Stress concentration', value: 'Analytical K_t = 3 at the hole boundary' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          This case validates the structural solid-mechanics solver in isolation. A square plate loaded uniaxially
          in tension contains a small central circular hole; the classical Kirsch analytical solution gives a stress
          concentration factor K<sub>t</sub> = 3 at the hole boundary. By double symmetry, only a quarter of the
          plate is modelled.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/hole.svg"
          alt="Plate with hole geometry"
          caption="Plate with a circular hole: quarter-plate model, L = 4 m side length and hole radius R = 0.5 m. Uniform far-field tensile traction on the right face; symmetry on the left and bottom faces."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="Plate with hole — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Quarter-plate side L', value: '4 m' },
              { label: 'Hole radius R',        value: '0.5 m' },
              { label: 'Mesh',                 value: '2 142 nodes / 1 000 elements' },
            ]},
            { heading: 'Material (structural steel, plane stress)', rows: [
              { label: 'Density ρ_s',          value: '7854 kg/m³' },
              { label: "Young's modulus E",     value: '2×10¹¹ Pa' },
              { label: "Poisson's ratio ν",     value: '0.3' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Right face',            value: 'Uniform traction σ∞ = 10 000 N/m²' },
              { label: 'Hole boundary',         value: 'Zero traction' },
              { label: 'Top edge',              value: 'Free (zero traction)' },
              { label: 'Left face',             value: 'Symmetry (u_x = 0)' },
              { label: 'Bottom face',           value: 'Symmetry (u_y = 0)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time mode',             value: 'Steady-state' },
              { label: 'Maximum outer iters',   value: '500' },
              { label: 'RMS target',            value: '10⁻⁸' },
            ]},
          ]}
        />
      </section>

      <section id="analytical">
        <h2>4. Analytical Reference</h2>
        <p>
          For an infinite plate under uniaxial far-field stress σ<sub>∞</sub>, the Kirsch solution gives the
          stress component along the symmetry plane x = 0 as:
        </p>
        <Equation math="\sigma_{xx}(y) = \sigma_\infty \left( 1 + \frac{R^2}{2y^2} + \frac{3R^4}{2y^4} \right), \quad y \geq R" />
        <p>
          At the hole boundary y = R the stress is 3σ<sub>∞</sub>, giving K<sub>t</sub> = 3. The finite plate
          (L/R = 8) causes a small upward shift relative to the infinite-plate solution.
        </p>
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <TutorialSubfigureStack
          items={[
            { src: '/figures/sigma%20xx.png', alt: 'σ_xx contour', subcaption: 'Contour of σ_xx over the quarter-plate domain, showing the stress concentration localised at the hole boundary.' },
            { src: '/figures/stress.svg',      alt: 'σ_xx profile',  subcaption: 'σ_xx along the left symmetry plane x = 0 vs. the Kirsch infinite-plate solution.' },
          ]}
          caption="Plate with a circular hole: stress contour and profile along the symmetry plane."
        />
      </section>

      <Takeaway>
        The numerical solution recovers the analytical stress concentration factor K<sub>t</sub> = σ<sub>xx,max</sub>/σ<sub>∞</sub> = 3
        at the hole boundary, with the small deviation from the Kirsch profile away from the hole attributable to
        the finite-plate geometry. The agreement validates both the discrete linear-elasticity operator and the
        zero-traction boundary condition on a curved surface.
      </Takeaway>

      <AcceptanceCriterion>
        The peak σ<sub>xx</sub> along the symmetry plane shall reproduce the analytical stress concentration
        factor K<sub>t</sub> = 3 to within finite-plate Saint-Venant accuracy, and the σ<sub>xx</sub>(y) profile
        shall track the Kirsch solution away from the hole boundary in graphical agreement.
      </AcceptanceCriterion>
    </>
  );
}
