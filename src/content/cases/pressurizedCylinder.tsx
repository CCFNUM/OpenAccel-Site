import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function PressurizedCylinderContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC023' },
        { label: 'References',   value: 'Lamé solution (Timoshenko & Goodier, 1951); solids4foam tutorial' },
        { label: 'Solver mode',  value: 'Steady-state' },
        { label: 'Physics / models', value: '2-D linear elasticity, plane stress' },
        { label: 'Geometry',     value: <>Quarter-symmetric model, <M math="r_i = 7~\mathrm{m}" />, <M math="r_o = 18.625~\mathrm{m}" /></> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This case validates the solid-mechanics solver under axisymmetric internal loading. A
          thick-walled cylindrical pressure vessel is loaded by uniform pressure on its inner surface,
          with the outer surface held traction-free. The Lamé closed-form solution provides the radial
          displacement and both in-plane stress components throughout the wall thickness, so the
          simulation can be probed point-by-point rather than against a peak value alone. The case
          complements the plate-with-a-hole verification (VC014) by exercising the same linear-elastic
          operator under a smooth, distributed traction rather than a concentrated stress raiser, and
          it sharpens the test of the traction boundary-condition handler on a curved surface.
        </p>
        <p>
          By the two-fold symmetry of the geometry and loading, a quarter of the cross-section is
          modelled with symmetry boundary conditions on the cut faces. The plane-stress assumption is
          consistent with the cylinder having a small axial extent and being loaded only on its lateral
          surfaces, with inertial and gravitational effects neglected.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src={`${import.meta.env.BASE_URL}figures/pressurized_cylinder.svg`}
          alt="Pressurised cylinder geometry"
          caption={<>Internally pressurised thick-walled cylinder: quarter-symmetric model with inner
            radius <M math="r_i = 7~\mathrm{m}" /> and outer radius <M math="r_o = 18.625~\mathrm{m}" />.
            Uniform internal pressure <M math="p_i" /> on the inner arc; traction-free outer arc;
            symmetry on the two straight edges.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Pressurised thick-walled cylinder — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: <>Inner radius <M math="r_i" /></>,        value: <M math="7~\mathrm{m}" /> },
              { label: <>Outer radius <M math="r_o" /></>,        value: <M math="18.625~\mathrm{m}" /> },
              { label: 'Mesh',                    value: <><M math="10\,000" /> structured 2-D cells</> },
            ]},
            { heading: 'Material (linear elastic, plane stress)', rows: [
              { label: <>Density <M math="\rho_s" /></>,              value: <><M math="10\,000~\mathrm{kg\,m^{-3}}" /> (dummy; steady state)</> },
              { label: <>Young's modulus <M math="E" /></>,       value: <M math="1 \times 10^{10}~\mathrm{Pa}" /> },
              { label: <>Poisson's ratio <M math="\nu" /></>,       value: <M math="0.3" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inner wall',              value: <>Uniform traction <M math="p_i = 10~\mathrm{MPa}" /> (inward normal)</> },
              { label: 'Outer wall',              value: 'Zero traction' },
              { label: <>Symmetry planes (<M math="x=0" />, <M math="y=0" />)</>, value: <>Symmetry (<M math="u_x = 0" />, <M math="u_y = 0" /> respectively)</> },
              { label: 'Front, back',             value: 'Empty (2-D plane stress)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time mode',               value: 'Steady-state' },
              { label: 'Maximum outer iters',     value: <M math="200" /> },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Displacement system',     value: <>PETSc / FGMRES + block-Jacobi (rel. tol. <M math="10^{-3}" />)</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target',              value: <M math="10^{-15}" /> },
            ]},
          ]}
        />
      </section>

      <section id="analytical">
        <h2>4. Analytical reference</h2>
        <p>
          The Lamé solution for a hollow cylinder of inner radius <M math="r_i" /> and outer radius{' '}
          <M math="r_o" /> under internal pressure <M math="p_i" />, with the outer surface
          traction-free, gives the in-plane stress components and the radial displacement under plane
          stress as
        </p>
        <Equation math="\sigma_r(r) = p_i\, \frac{r_i^{2}}{r_o^{2}-r_i^{2}}\!\left(1 - \frac{r_o^{2}}{r^{2}}\right)" label="1" />
        <Equation math="\sigma_\theta(r) = p_i\, \frac{r_i^{2}}{r_o^{2}-r_i^{2}}\!\left(1 + \frac{r_o^{2}}{r^{2}}\right)" label="2" />
        <Equation math="u_r(r) = \frac{p_i}{E}\, \frac{r_i^{2}}{r_o^{2}-r_i^{2}}\left[(1-\nu)\,r + (1+\nu)\,\frac{r_o^{2}}{r}\right]" label="3" />
        <p>
          At the inner wall, Equation (1) recovers the applied pressure exactly,{' '}
          <M math="\sigma_r(r_i) = -p_i" />; this identity is the natural test of the traction boundary
          condition. The hoop stress concentrates at the inner wall with the ratio{' '}
          <M math="\sigma_\theta(r_i)/p_i = (r_o^2 + r_i^2)/(r_o^2 - r_i^2) \approx 1.33" /> for the
          present geometry, while <M math="\sigma_z = 0" /> throughout under the plane-stress
          assumption.
        </p>
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <TutorialSubfigureStack label="Figure 2"
          items={[
            { src: '/figures/stress_radial_pressurized_tank.svg', alt: 'Radial stress σ_r(r)', subcaption: <>Radial stress <M math="\sigma_r(r)" /> across the wall thickness.</> },
            { src: '/figures/stress_circum_pressurized_tank.svg', alt: 'Circumferential stress σ_θ(r)', subcaption: <>Circumferential stress <M math="\sigma_\theta(r)" /> across the wall thickness.</> },
          ]}
          caption={<>Pressurised thick-walled cylinder: in-plane stress components along a radial cut
            from <M math="r = r_i" /> to <M math="r = r_o" />, compared with the Lamé analytical
            solution (Equations 1 and 2).</>}
        />
        <TutorialFigure label="Figure 3"
          src={`${import.meta.env.BASE_URL}figures/displacement_pressurized_tank.svg`}
          alt="Radial displacement u_r(r)"
          caption={<>Pressurised thick-walled cylinder: radial displacement <M math="u_r(r)" /> across
            the wall thickness, compared with the Lamé analytical solution (Equation 3).</>}
        />
      </section>

      <Takeaway>
        The numerical results follow the Lamé curves closely across the full wall thickness for both
        stress components and for the radial displacement. The radial stress at the inner wall recovers
        the applied pressure to within the convergence tolerance, confirming that the traction boundary
        condition is imposed consistently on a curved surface, and the hoop-stress concentration at the
        inner wall is captured without requiring graded radial cells. The agreement validates the
        discrete linear-elastic operator under a smooth, distributed loading and complements the
        stress-raiser test in the plate-with-a-hole case (VC014).
      </Takeaway>

      <AcceptanceCriterion>
        The radial stress at the inner wall shall satisfy <M math="\sigma_r(r_i) = -p_i" /> to within
        the convergence tolerance, and the <M math="\sigma_r(r)" />, <M math="\sigma_\theta(r)" /> and{' '}
        <M math="u_r(r)" /> profiles shall track Equations (1), (2) and (3) respectively in graphical
        agreement across the wall thickness.
      </AcceptanceCriterion>
    </>
  );
}
