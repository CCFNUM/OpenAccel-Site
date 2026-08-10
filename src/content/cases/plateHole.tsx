import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// hole.pdf natural page size 274.572×203.465 pt → cm; source trim 0 0.26 0 0.
const HOLE_BASE: [number, number] = [9.69, 7.18];

export function PlateHoleContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC014' },
        { label: 'Reference',    value: 'Kirsch (Timoshenko & Goodier, 1951)' },
        { label: 'Solver mode',  value: 'Steady-state' },
        { label: 'Physics / models', value: '2-D linear elasticity, plane stress' },
        { label: 'Stress concentration', value: <>Analytical <M math="K_t = 3" /> at the hole boundary</> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This case validates the structural solid-mechanics solver in isolation. A square plate
          loaded uniaxially in tension contains a small central circular hole; the hole acts as a
          stress raiser, and the classical Kirsch analytical solution (for an infinite plate) gives a
          stress concentration factor <M math="K_t = 3" /> at the hole boundary. The validation has
          two purposes: it exercises the linear-elastic constitutive law and Hooke's relation under
          plane-stress assumptions, and it confirms that the solver correctly resolves the steep
          stress gradient near the hole, which is the structural analogue of resolving a boundary
          layer.
        </p>
        <p>
          By double symmetry, only a quarter of the plate is modelled, with symmetry boundary
          conditions on two sides. The plane-stress assumption is appropriate because the out-of-plane
          thickness is small relative to the in-plane dimensions.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src={`${import.meta.env.BASE_URL}figures/hole.svg`}
          alt="Plate with hole geometry"
          caption={<>Plate with a circular hole: quarter-plate model, <M math="L = 4~\mathrm{m}" /> side
            length and hole radius <M math="R = 0.5~\mathrm{m}" />. Uniform far-field tensile traction
            on the right face; symmetry on the left and bottom faces; zero traction on the hole and
            the free upper edge.</>}
          trim={[0, 0.26, 0, 0]}
          trimBase={HOLE_BASE}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Plate with hole — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: <>Quarter-plate side <M math="L" /></>, value: <M math="4~\mathrm{m}" /> },
              { label: <>Hole radius <M math="R" /></>,        value: <M math="0.5~\mathrm{m}" /> },
              { label: 'Mesh',                 value: <><M math="2\,142" /> nodes / <M math="1\,000" /> elements</> },
            ]},
            { heading: 'Material (structural steel, plane stress)', rows: [
              { label: <>Density <M math="\rho_s" /></>,          value: <M math="7854~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Young's modulus <M math="E" /></>,     value: <M math="2 \times 10^{11}~\mathrm{Pa}" /> },
              { label: <>Poisson's ratio <M math="\nu" /></>,     value: <M math="0.3" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Right face',            value: <>Uniform traction <M math="\sigma_\infty = 10\,000~\mathrm{N/m^2}" /></> },
              { label: 'Hole boundary',         value: 'Zero traction' },
              { label: 'Top edge',              value: 'Free (zero traction)' },
              { label: 'Left face',             value: <>Symmetry (<M math="u_x = 0" />)</> },
              { label: 'Bottom face',           value: <>Symmetry (<M math="u_y = 0" />)</> },
              { label: 'Front, back',           value: 'Empty (2-D plane stress)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time mode',             value: 'Steady-state' },
              { label: 'Maximum outer iters',   value: <M math="500" /> },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Displacement system',   value: <>PETSc / FGMRES + block-Jacobi (rel. tol. <M math="10^{-1}" />)</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target',            value: <M math="10^{-8}" /> },
            ]},
          ]}
        />
      </section>

      <section id="analytical">
        <h2>4. Analytical reference</h2>
        <p>
          For an infinite plate under uniaxial far-field stress <M math="\sigma_\infty" />, the Kirsch
          solution gives the stress component along the symmetry plane <M math="x = 0" /> as
        </p>
        <Equation math="\sigma_{xx}(y) = \sigma_\infty \left( 1 + \frac{R^2}{2y^2} + \frac{3R^4}{2y^4} \right), \qquad y \geq R" label="1" />
        <p>
          At the hole boundary <M math="y = R" /> the stress is <M math="3\sigma_\infty" />, giving the
          stress concentration factor <M math="K_t = 3" />. Because the present plate is finite with a
          side-to-radius ratio of <M math="L/R = 8" />, a small upward shift in stress relative to the
          infinite-plate solution is expected by Saint-Venant's principle.
        </p>
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <TutorialSubfigureStack label="Figure 2"
          items={[
            { src: '/figures/sigma%20xx.png', alt: 'σ_xx contour', subcaption: <>Contour of <M math="\sigma_{xx}" /> over the quarter-plate domain, showing the stress concentration localised at the hole boundary.</> },
            { src: '/figures/stress.svg',      alt: 'σ_xx profile',  subcaption: <><M math="\sigma_{xx}" /> along the left symmetry plane <M math="x = 0" /> vs. the Kirsch infinite-plate solution (Equation 1).</> },
          ]}
          caption="Plate with a circular hole: stress contour and profile along the symmetry plane."
        />
      </section>

      <Takeaway>
        The numerical solution recovers the analytical stress concentration factor{' '}
        <M math="K_t = \sigma_{xx,\max}/\sigma_\infty = 3" /> at the hole boundary, with the small
        deviation from the Kirsch profile away from the hole attributable to the finite-plate
        geometry. The agreement validates both the discrete linear-elasticity operator and the
        zero-traction boundary condition on a curved surface. This case forms the solid-only baseline
        against which the FSI cases (the flexible dam-break and the perpendicular flap) should be
        read.
      </Takeaway>

      <AcceptanceCriterion>
        The peak <M math="\sigma_{xx}" /> along the symmetry plane shall reproduce the analytical
        stress concentration factor <M math="K_t = 3" /> to within finite-plate Saint-Venant accuracy,
        and the <M math="\sigma_{xx}(y)" /> profile shall track Equation (1) away from the hole
        boundary in graphical agreement.
      </AcceptanceCriterion>
    </>
  );
}
