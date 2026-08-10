import { TutorialFigure } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, Note, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// The source denotes the degree of circularity with \slashed{c} (physics pkg,
// unsupported by KaTeX); rendered here as \not c (a c with a diagonal slash).
export function RisingBubbleContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC020' },
        { label: 'Reference',    value: 'Hysing et al. (2009), Int. J. Numer. Methods Fluids 60(11):1259–1288' },
        { label: 'Solver mode',  value: 'Transient, incompressible, laminar, two-phase' },
        { label: 'Physics models', value: 'Volume-of-fluid interface capturing; CSF surface tension; buoyancy' },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This case validates OpenAccel's volume-of-fluid (VoF) multiphase capability on the canonical
          Hysing two-dimensional rising-bubble benchmark (Test Case 1 of the FeatFlow CFD Benchmarking
          Project). It exercises the interface-capturing scheme, the curvature reconstruction
          underlying the continuum surface force (CSF) surface-tension model, and the buoyancy coupling
          between the volume-fraction field and the momentum equation. Unlike the static droplet case
          (VC010), which probes only the pressure jump across a stationary interface, the present
          problem couples interface deformation, surface tension, buoyancy-driven motion, and viscous
          shear into a single time-dependent test with internationally agreed quantitative reference
          data.
        </p>
        <p>
          A circular bubble of radius <M math="r_0 = 0.25" /> filled with a lighter fluid is initially
          at rest in a <M math="1 \times 2" /> rectangular column of a heavier ambient liquid, with the
          bubble centroid at <M math="(x_0, y_0) = (0.5, 0.5)" />. Under the action of gravity{' '}
          <M math="\mathbf{g} = (0, -0.98)" /> the bubble rises through the column, deforming under the
          combined influence of buoyancy, viscous drag, and surface tension. The relevant dimensionless
          groups, defined on the bubble diameter <M math="D = 2r_0 = 0.5" /> and the characteristic
          buoyancy velocity <M math="U_g = \sqrt{g D}" />, are the Reynolds number
        </p>
        <Equation math="\mathit{Re} = \frac{\rho_1 \sqrt{g D}\, D}{\mu_1} = \frac{1000 \cdot \sqrt{0.98 \cdot 0.5} \cdot 0.5}{10} = 35" label="1" />
        <p>and the Eötvös (or Bond) number</p>
        <Equation math="\mathit{Eo} = \frac{\rho_1\, g\, D^{2}}{\sigma} = \frac{1000 \cdot 0.98 \cdot 0.25}{24.5} = 10" label="2" />
        <p>
          where <M math="\rho_1, \mu_1" /> are the density and dynamic viscosity of the ambient liquid,
          and <M math="\sigma" /> is the surface-tension coefficient. Following Hysing et al. (2009),
          the density ratio is <M math="\rho_1/\rho_2 = 10" /> and the viscosity ratio{' '}
          <M math="\mu_1/\mu_2 = 10" />, placing the problem in the regime where the bubble retains a
          recognisably ellipsoidal shape throughout the integration window (Test Case 1 in their
          nomenclature). The evolution is tracked over <M math="t \in [0, 3]" /> in problem units.
        </p>

        <Note>
          <p>
            <strong>Why this benchmark, and why Test Case 1.</strong> Hysing et al. (2009) proposed two
            cases. Test 1 (<M math="\mathit{Eo} = 10" />, modest density and viscosity ratios) yields
            an ellipsoidal bubble whose interface remains topologically simple; the published reference
            solutions from three independent codes (TP2D, FreeLIFE, MooNMD) agree to graphical accuracy
            and provide a stringent quantitative target. Test 2 (<M math="\mathit{Eo} = 125" />,{' '}
            <M math="\rho_1/\rho_2 = 1000" />, <M math="\mu_1/\mu_2 = 100" />) produces skirted shapes
            and topological pinch-off whose reference data show non-negligible inter-code scatter; we
            therefore use Test 1 as the primary validation point.
          </p>
        </Note>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <p>
          The computational domain is the rectangle <M math="\Omega = [0, 1] \times [0, 2]" />,
          illustrated in Figure 1. No-slip walls are imposed on the top and bottom boundaries;
          free-slip (symmetry) is imposed on the lateral walls, so that the column behaves as a slice
          of a wider container. The initial volume fraction field is set from a smoothed Heaviside
          indicator
        </p>
        <Equation math="\alpha_2(\mathbf{x}, 0) = \tfrac{1}{2}\bigl\{1 - \tanh\bigl[(r(\mathbf{x}) - r_0)/\varepsilon\bigr]\bigr\}, \qquad r(\mathbf{x}) = \sqrt{(x - 0.5)^{2} + (y - 0.5)^{2}}" label="3" />
        <p>
          with <M math="\alpha_1 = 1 - \alpha_2" /> and a smoothing half-width{' '}
          <M math="\varepsilon = h/2" /> of half a cell. The pressure level is pinned to{' '}
          <M math="p = 0" /> at the domain origin <M math="(0, 0)" /> so that the discrete pressure
          system is non-singular.
        </p>
        <TutorialFigure label="Figure 1"
          src={`${import.meta.env.BASE_URL}figures/rising_bubble.svg`}
          alt="Rising bubble geometry"
          caption="Geometry and boundary conditions for the rising-bubble benchmark (Hysing Test Case 1)."
        />
      </section>

      <section id="setup">
        <h2>3. Numerical setup</h2>
        <SetupTable label="Table 1"
          caption="Rising bubble (Hysing Test Case 1) — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',              value: <><M math="[0, 1] \times [0, 2]" /> rectangle</> },
              { label: 'Initial bubble',      value: <>Circle, radius <M math="r_0 = 0.25" />, centre <M math="(x_0, y_0) = (0.5, 0.5)" /></> },
              { label: <>Bubble diameter <M math="D" /></>, value: <M math="2 r_0 = 0.5" /> },
              { label: 'Mesh',               value: <><M math="100 \times 200" /> Cartesian cells (<M math="20\,000" /> total)</> },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: <>Ambient liquid (<M math="\phi_1" />)</>, value: <><M math="\rho_1 = 1000" />, <M math="\mu_1 = 10" /></> },
              { label: <>Bubble (<M math="\phi_2" />)</>,         value: <><M math="\rho_2 = 100" />, <M math="\mu_2 = 1" /></> },
              { label: 'Density ratio',       value: <M math="\rho_1 / \rho_2 = 10" /> },
              { label: 'Viscosity ratio',     value: <M math="\mu_1 / \mu_2 = 10" /> },
              { label: <>Surface tension <M math="\sigma" /></>,   value: <M math="24.5" /> },
              { label: 'Reynolds number',     value: <M math="\mathit{Re} = \rho_1 \sqrt{g D}\, D / \mu_1 = 35" /> },
              { label: 'Eötvös number',       value: <M math="\mathit{Eo} = \rho_1 g D^2 / \sigma = 10" /> },
            ]},
            { heading: 'Body forces', rows: [
              { label: 'Gravity',             value: <M math="\mathbf{g} = (0, -0.98)" /> },
              { label: 'Buoyancy reference density', value: <M math="\rho_{\mathrm{ref}} = \rho_1 = 1000" /> },
            ]},
            { heading: 'Boundary and initial conditions', rows: [
              { label: 'Top / bottom',        value: 'No-slip walls' },
              { label: 'Left / right',        value: 'Free-slip (symmetry)' },
              { label: <>Initial <M math="\alpha_2" /> (bubble)</>, value: <>Smoothed Heaviside, <M math="\varepsilon = h/2 = 5 \times 10^{-3}" /></> },
              { label: 'Initial velocity',    value: <M math="\mathbf{u} = (0, 0)" /> },
              { label: 'Initial pressure',    value: <M math="p = 0" /> },
              { label: 'Pressure reference',  value: <>Pinned at <M math="(0, 0)" />, <M math="p = 0" /></> },
            ]},
            { heading: 'Multiphase model', rows: [
              { label: 'Turbulence model',    value: 'Laminar' },
              { label: 'Surface tension model', value: <>Continuum surface force (CSF), smoothed-<M math="\alpha" /> curvature</> },
              { label: 'VoF advection',       value: 'Flux-corrected transport (FCT)' },
              { label: 'Interface compression level', value: <M math="2" /> },
              { label: <><M math="\alpha" />-correction passes</>, value: <M math="2" /> },
              { label: <><M math="\alpha" /> smoothing (curvature)</>, value: <><M math="5" /> iterations, Fourier number <M math="0.25" /></> },
              { label: 'Curvature smoothing passes', value: <M math="6" /> },
              { label: 'Body-force redistribution', value: 'Enabled (consistent CSF pressure–surface-tension balance)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',           value: 'Transient segregated pressure–velocity (two-phase VoF)' },
              { label: 'Transient scheme',    value: 'First-order backward Euler (BDF1)' },
              { label: 'Advection',           value: 'High-resolution' },
              { label: 'Outer iterations',    value: <><M math="1" />–<M math="15" /> per timestep</> },
              { label: 'RMS target',          value: <M math="10^{-7}" /> },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Default (momentum, etc.)', value: <>PETSc <code>fgmres</code> + <code>bjacobi</code>, rtol <M math="10^{-2}" /></> },
              { label: 'Pressure correction', value: <>HYPRE <code>GMRES</code> + <code>BoomerAMG</code>, rtol <M math="10^{-2}" /></> },
            ]},
            { heading: 'Time stepping', rows: [
              { label: 'Type',                value: 'Fixed' },
              { label: 'Timestep',            value: <M math="\Delta t = 10^{-3}" /> },
              { label: 'Total time',          value: <M math="t = 3.0" /> },
            ]},
            { heading: 'Post-processing', rows: [
              { label: 'Output frequency',    value: <>Every <M math="50" /> timesteps (<M math="\Delta t_{\mathrm{out}} = 0.05" />)</> },
              { label: 'Benchmark quantities', value: <>Centre of mass <M math="y_c(t)" />, rise velocity <M math="U_{c,y}(t)" />, circularity <M math="\not c(t)" /></> },
            ]},
          ]}
        />
      </section>

      <section id="benchmark">
        <h2>4. Benchmark quantities</h2>
        <p>
          The reference quantities defined by Hysing et al. (2009) are three integrals over the bubble
          region <M math="\Omega_2 = \{\mathbf{x} : \alpha_2(\mathbf{x}, t) = 1\}" />.
        </p>
        <p><strong>Centre of mass</strong></p>
        <Equation math="\mathbf{X}_c(t) = (x_c, y_c) = \frac{\displaystyle\int_{\Omega_2} \mathbf{x}\, dV}{\displaystyle\int_{\Omega_2} 1\, dV}" label="4" />
        <p>By symmetry <M math="x_c \equiv 0.5" /> for all <M math="t" />; the relevant signal is the vertical component <M math="y_c(t)" />.</p>
        <p><strong>Rise velocity</strong></p>
        <Equation math="\mathbf{U}_c(t) = \frac{\displaystyle\int_{\Omega_2} \mathbf{u}\, dV}{\displaystyle\int_{\Omega_2} 1\, dV}" label="5" />
        <p>the volume average of the velocity over the bubble; the quantitative target is the peak of the vertical component <M math="\max_t |U_{c,y}(t)|" />.</p>
        <p><strong>Degree of circularity</strong></p>
        <Equation math="\not c(t) = \frac{P_a}{P_b} = \frac{\pi d_a}{P_b}" label="6" />
        <p>
          the ratio of the perimeter of an area-equivalent circle, <M math="P_a = \pi d_a" />, to the
          actual bubble perimeter <M math="P_b" />. A perfect circle gives <M math="\not c = 1" />;
          deformation lowers <M math="\not c" /> monotonically. For Test 1 the relevant target is the
          minimum value <M math="\min_t \not c(t)" />.
        </p>

        <DataTable
          label="Table 2"
          caption={<>Hysing Test Case 1 benchmark quantities computed with OpenAccel, compared with the
            TP2D reference. Centre-of-mass height and minimum circularity are reported at{' '}
            <M math="t = 3" />; the rise velocity is the peak value over <M math="t \in [0, 3]" />.</>}
          headers={['Quantity', 'OpenAccel', 'Reference (TP2D)']}
          rows={[
            [<>Centre-of-mass height <M math="y_c(t{=}3)" /></>, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="1.083" /></span>, <M math="1.081" />],
            [<>Peak rise velocity <M math="\max_t |U_{c,y}|" /></>, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="0.2413" /></span>, <M math="0.2417" />],
            [<>Minimum circularity <M math="\min_t \not c" /></>, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="0.8971" /></span>, <M math="0.9013" />],
          ]}
        />
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <p>
          Table 2 compares the three benchmark quantities computed with OpenAccel against the TP2D
          reference of Hysing et al. (2009) at the final benchmark time <M math="t = 3" />.
        </p>

        <h3>Centre-of-mass trajectory</h3>
        <p>
          Figure 2 shows the time history of the vertical centre-of-mass coordinate <M math="y_c(t)" />{' '}
          over the benchmark window <M math="t \in [0, 3]" />. The bubble accelerates from rest,
          transitions through a phase of nearly linear rise, and approaches its final position.
        </p>
        <TutorialFigure label="Figure 2"
          src={`${import.meta.env.BASE_URL}figures/bubble_yc.svg`}
          alt="Centre-of-mass trajectory"
          caption={<>Centre-of-mass trajectory <M math="y_c(t)" /> over the benchmark window{' '}
            <M math="t \in [0, 3]" /> for the Hysing Test 1 configuration.</>}
        />

        <h3>Rise velocity</h3>
        <p>
          The volume-averaged vertical velocity <M math="U_{c,y}(t)" /> is plotted in Figure 3. The
          signal exhibits an initial acceleration as buoyancy overcomes surface tension and viscous
          resistance, a single peak near <M math="t \approx 1.9" /> where the bubble reaches its
          terminal-like velocity, and a slow decay as the deformed shape continues to evolve.
        </p>
        <TutorialFigure label="Figure 3"
          src={`${import.meta.env.BASE_URL}figures/bubble_rise_velocity.svg`}
          alt="Bubble rise velocity"
          caption={<>Bubble rise velocity <M math="U_{c,y}(t)" /> over the benchmark window.</>}
        />

        <h3>Final bubble shape</h3>
        <p>
          Figure 4 shows the bubble interface at the final benchmark time <M math="t = 3" />, overlaid
          with the TP2D, FreeLIFE, and MooNMD reference contours. The bubble has settled into a smooth
          ellipsoidal shape with a slight depression at the lower pole; this is the hallmark of the
          low-Eötvös regime in which surface tension keeps the deformation moderate.
        </p>
        <TutorialFigure label="Figure 4"
          src={`${import.meta.env.BASE_URL}figures/bubble_shape.svg`}
          alt="Final bubble shape"
          caption={<>Bubble shape at the final benchmark time <M math="t = 3" /> for the Hysing Test 1
            configuration, compared against the reference contours.</>}
        />
      </section>

      <Takeaway>
        OpenAccel reproduces all three Hysing benchmark quantities in close agreement with the TP2D
        reference. The final centre-of-mass height <M math="y_c(t{=}3) \approx 1.083" /> lies within
        <M math="0.14\%" /> of the reference value of <M math="1.081" />, the vertical rise velocity peaks at{' '}
        <M math="\max_t |U_{c,y}| \approx 0.241" /> near <M math="t \approx 1.9" /> —
        indistinguishable from the TP2D curve to graphical accuracy — and the minimum circularity{' '}
        <M math="\min_t \not c \approx 0.897" /> deviates from the reference value of <M math="0.9013" /> by <M math="0.45\%" />.
        The smooth ellipsoidal terminal shape and the clean rise-velocity trace confirm that the
        combination of volume-fraction smoothing and consistent CSF body-force redistribution
        suppresses the parasitic interface currents that otherwise contaminate two-phase computations
        at this Eötvös number on Cartesian grids.
      </Takeaway>

      <AcceptanceCriterion>
        The three Hysing Test Case 1 benchmark quantities — centre-of-mass height{' '}
        <M math="y_c(t = 3)" />, peak rise velocity <M math="\max_t |U_{c,y}|" />, and minimum
        circularity <M math="\min_t \not c" /> — should agree with the TP2D reference values
        (<M math="1.081" />, <M math="0.2417" />, <M math="0.9013" />) to within <M math="1\%" />, and the bubble
        shape at <M math="t = 3" /> matches the TP2D reference contour to graphical accuracy.
      </AcceptanceCriterion>
    </>
  );
}
