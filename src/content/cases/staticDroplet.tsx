import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// pressure_droplet_distribution.pdf natural page size 772.214×547.81 pt → cm.
const DIST_BASE: [number, number] = [27.24, 19.32];
// Letter-landscape contour plates (792×612 pt → cm); source trim 4 2.5 4 1.
const LAND: [number, number] = [27.94, 21.59];
const CONTOUR_TRIM: [number, number, number, number] = [4, 2.5, 4, 1];

export function StaticDropletContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC010' },
        { label: 'References',   value: 'Brackbill et al. (1992); François et al. (2006)' },
        { label: 'Solver mode',  value: 'Transient, segregated' },
        { label: 'Physics / models', value: '2-D incompressible VoF + CSF surface tension' },
        { label: 'Reference solution', value: <>Young–Laplace, <M math="\Delta p = \sigma/R = 365~\mathrm{Pa}" /></> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          The static droplet is the canonical isolation test for the Continuum Surface Force (CSF)
          model and the curvature-computation pipeline. A circular droplet sits at the centre of a
          quiescent ambient fluid; in the absence of gravity and with matched fluid properties on
          both sides of the interface, the only physical effect is the surface-tension-induced
          pressure jump given by the Young–Laplace relation:
        </p>
        <Equation math="\Delta p = \sigma\kappa" />
        <p>
          For a 2-D circular droplet <M math="\kappa = 1/R" />, so for the present configuration{' '}
          <M math="\Delta p_{\mathrm{exact}} = 73 / 0.2 = 365~\mathrm{Pa}" />. The velocity field
          should remain identically zero in the absence of any perturbation; any non-zero residual
          velocity is the diagnostic for <em>spurious parasitic currents</em> — a known numerical
          artefact of the CSF formulation arising from imbalances between the discrete
          surface-tension force and the discrete pressure gradient.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src="/figures/droplet.svg"
          alt="Static droplet geometry"
          caption={<>Static droplet of radius <M math="R = 0.2~\mathrm{m}" /> centred in a unit-square
            domain. Inward arrows mark the direction of the surface-tension force.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Static droplet — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',             value: 'Unit square' },
              { label: <>Droplet radius <M math="R" /></>,   value: <><M math="0.2~\mathrm{m}" />, centred at <M math="(0.5,\,0.5)" /></> },
              { label: 'Mesh',               value: <><M math="100 \times 100 \times 1" /> hexahedra (<M math="N_e = 10\,000" />)</> },
              { label: <>Initialisation (<M math="\alpha_{\mathrm{water}}" />)</>, value: <>Smoothed Heaviside, <M math="\alpha = \tfrac{1}{2}\bigl\{1 - \tanh\bigl[(r - R)/\varepsilon\bigr]\bigr\}" />, <M math="\varepsilon = h/2 = 5 \times 10^{-3}" /></> },
              { label: 'Radial coordinate',  value: <M math="r = \sqrt{(x - 0.5)^{2} + (y - 0.5)^{2}}" /> },
            ]},
            { heading: 'Fluid properties (matched)', rows: [
              { label: 'Density (both phases)', value: <M math="\rho = 1000~\mathrm{kg\,m^{-3}}" /> },
              { label: 'Viscosity (both phases)', value: <M math="\mu = 10^{-3}~\mathrm{Pa\,s}" /> },
              { label: 'Surface tension',    value: <M math="\sigma = 73~\mathrm{N/m}" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'All boundaries',     value: 'Symmetry (no gravity)' },
              { label: 'Pressure pin',       value: <>Reference pressure <M math="p = 0" /> at the origin</> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: 'End time',           value: <M math="5~\mathrm{s}" /> },
              { label: <>Initial <M math="\Delta t" /></>,         value: <><M math="10^{-4}~\mathrm{s}" />, adaptive with <M math="\mathrm{Co}_{\max} = 0.5" /></> },
              { label: <><M math="\Delta t" /> bounds</>,      value: <M math="[10^{-7},\,0.1]~\mathrm{s}" /> },
              { label: 'Advection',          value: 'High-resolution' },
              { label: 'VoF smoothing',      value: <><M math="6" /> iterations, <M math="\mathrm{Fo} = 0.25" />; body-force redistribution on</> },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Momentum',            value: <>PETSc / FGMRES + block-Jacobi (rel. tol. <M math="10^{-2}" />)</> },
              { label: 'Pressure correction', value: <>Trilinos / GMRES + ILU (rel. tol. <M math="10^{-6}" />)</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: <><M math="10^{-7}" /> / up to <M math="15" /> per step</> },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <p>The pressure-jump accuracy is quantified by three metrics following François et al. (2006):</p>
        <ul>
          <li><M math="\Delta P_{\mathrm{total}} = \bar{P}_{\mathrm{in}} - \bar{P}_{\mathrm{out}}" />, averaging over all cells with <M math="r \le R" /> and <M math="r > R" /> respectively;</li>
          <li><M math="\Delta P_{\mathrm{partial}}" />, averaging over <M math="r \le R/2" /> and <M math="r \ge 3R/2" /> to exclude the diffuse-interface transition;</li>
          <li><M math="\Delta P_{\max} = P_{\max} - P_{\min}" /> over the full domain.</li>
        </ul>
        <p>
          The relative error is{' '}
          <M math="E(\Delta P) = |\Delta P_{\mathrm{num}} - \Delta P_{\mathrm{exact}}| / \Delta P_{\mathrm{exact}} \times 100\%" />.
          The maximum spurious velocity <M math="\|\mathbf{U}\|_{\max}" /> is reported as a measure of
          the parasitic currents; for a perfect static droplet this would be identically zero.
        </p>

        <DataTable
          label="Table 2"
          caption={<>Static droplet: pressure-jump metrics and maximum spurious velocity. Analytical:{' '}
            <M math="\Delta p_{\mathrm{exact}} = 365~\mathrm{Pa}" />, <M math="\|\mathbf{U}\|_{\mathrm{exact}} = 0" />.</>}
          headers={['Metric', 'Analytical (Pa)', 'Numerical (Pa)', 'Error (%)']}
          rows={[
            [<M math="\Delta P_{\mathrm{total}}" />, <M math="365" />, <M math="333.1" />, <M math="8.7" />],
            [<M math="\Delta P_{\mathrm{partial}}" />, <M math="365" />, <M math="350.8" />, <M math="3.8" />],
            [<M math="\Delta P_{\max}" />, <M math="365" />, <M math="352.0" />, <M math="3.5" />],
            [<M math="\|\mathbf{U}\|_{\max}~[\mathrm{m/s}]" />, <M math="0" />, <M math="0.07" />, '—'],
          ]}
        />

        <TutorialFigure label="Figure 2"
          src="/figures/pressure_droplet_distribution.svg"
          alt="Pressure centreline distribution"
          caption={<>Pressure distribution along the horizontal centreline <M math="y = 0.5~\mathrm{m}" />,
            compared against the analytical Young–Laplace solution
            (<M math="\Delta p_{\mathrm{exact}} = 365~\mathrm{Pa}" />).</>}
          trim={[0, 0.7, 0, 0.5]}
          trimBase={DIST_BASE}
        />
        <TutorialSubfigureRow label="Figure 3"
          left={{ src: '/figures/pressure_droplet.svg', alt: 'Pressure contour', subcaption: 'Pressure contour.', trim: CONTOUR_TRIM, trimBase: LAND }}
          right={{ src: '/figures/velocity_droplet.svg', alt: 'Velocity magnitude', subcaption: 'Velocity magnitude (parasitic currents).', trim: CONTOUR_TRIM, trimBase: LAND }}
          caption="Static droplet contours. The pressure jump across the interface is uniform inside and outside, while the velocity field exhibits the characteristic CSF parasitic currents localised at the interface."
        />
      </section>

      <Takeaway>
        OpenAccel reproduces the Young–Laplace pressure jump on a <M math="100 \times 100" /> grid
        with the plateau-based metric <M math="\Delta P_{\mathrm{partial}} \approx 351~\mathrm{Pa}" />{' '}
        and the global maximum-pressure metric <M math="\Delta P_{\max} \approx 352~\mathrm{Pa}" />,
        both within <M math="4\%" /> of the analytical value{' '}
        <M math="\Delta p_{\mathrm{exact}} = \sigma/R = 365~\mathrm{Pa}" />. The smoothed initial
        volume-fraction field, together with the consistent CSF body-force redistribution, keeps the
        parasitic capillary number{' '}
        <M math="\mathrm{Ca}_{\mathrm{par}} = \mu \|\mathbf{U}\|_{\max} / \sigma" /> of order{' '}
        <M math="\mathcal{O}(10^{-6})" /> throughout the time window, so the pressure plateaus inside
        and outside the droplet are clean and the time-averaged measurement is repeatable to the last
        significant digit. The pressure transition across the interface is spread over approximately
        four cells, consistent with the smeared-force nature of the CSF discretisation; metrics
        evaluated over the diffuse band (<M math="\Delta P_{\mathrm{total}}" />) therefore
        under-report the jump and the plateau-based metrics are the appropriate benchmark figures of
        merit.
      </Takeaway>

      <AcceptanceCriterion>
        <M math="\Delta P_{\mathrm{partial}}" /> and <M math="\Delta P_{\max}" /> shall agree with the
        Young–Laplace value of <M math="365~\mathrm{Pa}" /> to within <M math="10\%" />, and the maximum spurious
        velocity shall remain <M math="\|\mathbf{U}\|_{\max} < 0.1~\mathrm{m/s}" /> on the{' '}
        <M math="100\times100" /> grid.
      </AcceptanceCriterion>
    </>
  );
}
