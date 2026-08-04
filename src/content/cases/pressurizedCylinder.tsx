import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function PressurizedCylinderContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC023' },
        { label: 'References',   value: 'Lamé solution (Timoshenko & Goodier, 1951); solids4foam tutorial' },
        { label: 'Solver mode',  value: 'Steady-state' },
        { label: 'Physics',      value: '2-D linear elasticity, plane stress' },
        { label: 'Geometry',     value: 'Quarter-symmetric model, r_i = 7 m, r_o = 18.625 m' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          This case validates the solid-mechanics solver under axisymmetric internal loading. A thick-walled
          cylindrical pressure vessel is loaded by uniform pressure on its inner surface, with the outer
          surface held traction-free. The Lamé closed-form solution provides the radial displacement and both
          in-plane stress components throughout the wall thickness, allowing the simulation to be probed
          point-by-point rather than against a peak value alone.
        </p>
        <p>
          The case complements the plate-with-a-hole verification (VC014) by exercising the same
          linear-elastic operator under a smooth, distributed traction rather than a concentrated stress raiser,
          and it sharpens the test of the traction boundary-condition handler on a curved surface. By the
          two-fold symmetry of the geometry and loading, only a quarter of the cross-section is modelled.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/pressurized_cylinder.png"
          alt="Pressurised cylinder geometry"
          caption="Internally pressurised thick-walled cylinder: quarter-symmetric model with inner radius r_i = 7 m and outer radius r_o = 18.625 m. Uniform internal pressure p_i on the inner arc; traction-free outer arc; symmetry on the two straight edges."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="Pressurised thick-walled cylinder — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Inner radius r_i',        value: '7 m' },
              { label: 'Outer radius r_o',        value: '18.625 m' },
              { label: 'Mesh',                    value: '10 000 structured 2-D cells' },
            ]},
            { heading: 'Material (linear elastic, plane stress)', rows: [
              { label: 'Young\'s modulus E',       value: '1×10¹⁰ Pa' },
              { label: 'Poisson\'s ratio ν',       value: '0.3' },
              { label: 'Density ρ_s',              value: '10 000 kg/m³ (dummy; steady-state)' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inner wall',              value: 'Uniform traction p_i = 10 MPa (inward normal)' },
              { label: 'Outer wall',              value: 'Zero traction' },
              { label: 'Symmetry planes',         value: 'u_x = 0 (x = 0), u_y = 0 (y = 0)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time mode',               value: 'Steady-state' },
              { label: 'Maximum outer iters',     value: '200' },
              { label: 'RMS target',              value: '10⁻¹⁵' },
            ]},
          ]}
        />
      </section>

      <section id="analytical">
        <h2>4. Analytical Reference (Lamé Solution)</h2>
        <p>
          For a hollow cylinder of inner radius r<sub>i</sub> and outer radius r<sub>o</sub> under internal
          pressure p<sub>i</sub>, with the outer surface traction-free, the Lamé solution gives:
        </p>
        <Equation math="\sigma_r(r) = p_i\,\frac{r_i^2}{r_o^2 - r_i^2}\!\left(1 - \frac{r_o^2}{r^2}\right)" />
        <Equation math="\sigma_\theta(r) = p_i\,\frac{r_i^2}{r_o^2 - r_i^2}\!\left(1 + \frac{r_o^2}{r^2}\right)" />
        <Equation math="u_r(r) = \frac{p_i}{E}\,\frac{r_i^2}{r_o^2 - r_i^2}\!\left[(1-\nu)r + (1+\nu)\frac{r_o^2}{r}\right]" />
        <p>
          At the inner wall, σ<sub>r</sub>(r<sub>i</sub>) = −p<sub>i</sub> exactly — this is the natural check
          of the traction boundary condition. The hoop stress concentration is
          σ<sub>θ</sub>(r<sub>i</sub>)/p<sub>i</sub> = (r<sub>o</sub>² + r<sub>i</sub>²)/(r<sub>o</sub>² − r<sub>i</sub>²) ≈ 1.33
          for this geometry.
        </p>
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <TutorialSubfigureStack
          items={[
            { src: '/figures/stress_radial_pressurized_tank.png', alt: 'Radial stress σ_r(r)', subcaption: 'Radial stress σ_r(r) across the wall thickness.' },
            { src: '/figures/stress_circum_pressurized_tank.png', alt: 'Circumferential stress σ_θ(r)', subcaption: 'Circumferential stress σ_θ(r) across the wall thickness.' },
          ]}
          caption="In-plane stress components along a radial cut from r = r_i to r = r_o, compared with the Lamé analytical solution."
        />
        <TutorialFigure
          src="/figures/displacement_pressurized_tank.png"
          alt="Radial displacement u_r(r)"
          caption="Radial displacement u_r(r) across the wall thickness, compared with the Lamé analytical solution."
        />
      </section>

      <Takeaway>
        The numerical results follow the Lamé curves closely across the full wall thickness for both stress
        components and for the radial displacement. The radial stress at the inner wall recovers the applied
        pressure to within the convergence tolerance, confirming that the traction boundary condition is imposed
        consistently on a curved surface. The hoop-stress concentration at the inner wall is captured without
        requiring graded radial cells. Together with the plate-with-a-hole case (VC014), this validates the
        discrete linear-elastic operator under both concentrated and distributed loading.
      </Takeaway>

      <AcceptanceCriterion>
        The radial stress at the inner wall shall satisfy σ<sub>r</sub>(r<sub>i</sub>) = −p<sub>i</sub> to
        within the convergence tolerance, and the σ<sub>r</sub>(r), σ<sub>θ</sub>(r), and u<sub>r</sub>(r)
        profiles shall track the Lamé solution in graphical agreement across the wall thickness.
      </AcceptanceCriterion>
    </>
  );
}
