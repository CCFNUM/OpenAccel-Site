import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, Note, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// Contour plates are letter-landscape (792×612 pt → cm); source LaTeX trim for
// the eddy-viscosity / dissipation contours is 3cm 1cm 3cm 1cm (L B R T).
const BUMP_BASE: [number, number] = [27.94, 21.59];
const BUMP_TRIM: [number, number, number, number] = [3, 1, 3, 1];

export function BumpSSTContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC021' },
        { label: 'Reference',    value: 'NASA Langley Turbulence Modeling Resource (TMR) 2-D bump-in-channel' },
        { label: 'Solver mode',  value: 'Steady-state, incompressible, segregated SIMPLE' },
        { label: 'Physics models', value: '2-D RANS; Menter shear-stress-transport (SST) closure' },
        { label: 'Mach / Re',    value: <><M math="M_\infty = 0.2" />, <M math="\mathit{Re}_L = 3\times10^6" /></> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This case verifies OpenAccel's Menter SST turbulence-model implementation against the NASA
          Langley TMR 2-D bump-in-channel benchmark. It is the canonical verification problem for SST
          in modern RANS codes: a smooth bump mounted on the lower wall of a planar channel generates a
          moderate adverse pressure gradient and a fully attached turbulent boundary layer, exercising
          the BSL blending function, the near-wall behaviour of <M math="\omega" />, and the
          wall-distance computation underpinning <M math="F_1" /> and <M math="F_2" />.
        </p>
        <p>
          A uniform flow at <M math="U_\infty = 69.44" /> enters a planar channel and passes over a
          smooth bump on the lower wall. The relevant dimensionless groups, defined on the verification
          length scale <M math="L = 1" /> and the inlet velocity <M math="U_\infty" />, are the Mach
          number
        </p>
        <Equation math="M_\infty = \frac{U_\infty}{a_\infty} = \frac{69.44}{347.2} = 0.2" label="1" />
        <p>and the Reynolds number</p>
        <Equation math="\mathit{Re}_L = \frac{\rho_\infty U_\infty L}{\mu_\infty} = \frac{1.0 \cdot 69.44 \cdot 1.0}{2.31 \times 10^{-5}} = 3.00 \times 10^{6}" label="2" />
        <p>
          At <M math="M_\infty = 0.2" /> the flow is essentially incompressible; the differences
          between a compressible and incompressible solution at this Mach number are well within
          plotting accuracy on the converged grid. CFL3D (cell-centred structured FV) and FUN3D
          (node-centred unstructured FV) provide the independent grid-converged reference solutions
          from the NASA TMR database.
        </p>

        <Note>
          <p>
            <strong>Why this benchmark.</strong> Unlike the flat-plate verification, the
            bump-in-channel case introduces streamwise curvature and a pressure gradient, both of which
            are necessary to exercise the cross-diffusion term in the <M math="\omega" /> equation and
            the <M math="F_1" /> blending between <M math="k" />–<M math="\omega" /> and{' '}
            <M math="k" />–<M math="\varepsilon" /> regions of the SST model. The flow remains attached,
            making this a clean <em>verification</em> test rather than a model validation against
            experiment — the goal is to confirm that the OpenAccel SST implementation reproduces the
            grid-converged solution to which CFL3D and FUN3D agree.
          </p>
        </Note>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <p>
          The computational domain is a rectangle of length <M math="51.5" /> and height{' '}
          <M math="5.0" />, with the bump leading edge at <M math="x = 0.3" /> and trailing edge at{' '}
          <M math="x = 1.2" />. The lower-wall bump shape follows the NASA TMR analytical definition:
        </p>
        <Equation math="y_{\mathrm{bump}}(x) = \begin{cases} 0.05 \sin^{4}\!\bigl(\pi x/0.9 - \pi/3\bigr) & 0.3 \leq x \leq 1.2 \\ 0 & 0 \leq x < 0.3 \text{ or } 1.2 < x \leq 1.5 \end{cases}" label="3" />
        <p>
          with maximum height <M math="y_{\mathrm{max}} = 0.05" /> at <M math="x = 0.75" />. The
          upstream and downstream extensions of the lower wall, and the upper boundary at{' '}
          <M math="y = 5.0" />, are symmetry planes.
        </p>
        <TutorialFigure label="Figure 1"
          src="/figures/bump2D_schematic.svg"
          alt="2D bump-in-channel geometry"
          caption={<>Geometry and boundary conditions for the NASA TMR 2-D bump-in-channel benchmark.
            Top: full computational domain drawn to scale, <M math="x \in [-25, 26.5]" />,{' '}
            <M math="y \in [0, 5]" />. Bottom: close-up of the bump showing the analytical{' '}
            <M math="\sin^{4}" /> profile with peak height <M math="0.05" /> at <M math="x = 0.75" />.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Numerical setup</h2>
        <SetupTable label="Table 1"
          caption="2-D bump-in-channel (NASA TMR SST) — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',                 value: <><M math="[-25, 26.5] \times [0, 5]" /> rectangle</> },
              { label: 'Viscous wall segment',   value: <><M math="0 \leq x \leq 1.5" /> on lower boundary</> },
              { label: 'Bump curvature',         value: <><M math="0.3 \leq x \leq 1.2" />, peak at <M math="x = 0.75" /></> },
              { label: 'Bump shape',             value: <M math="y = 0.05 \sin^{4}(\pi x/0.9 - \pi/3)" /> },
              { label: 'Maximum bump height',    value: <M math="0.05" /> },
              { label: 'Mesh',                   value: <>NASA TMR <M math="705 \times 321" /> grid, <M math="225\,280" /> quadrilateral cells</> },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: <>Density <M math="\rho_\infty" /></>,             value: <M math="1.0" /> },
              { label: <>Dynamic viscosity <M math="\mu_\infty" /></>,    value: <M math="2.31 \times 10^{-5}" /> },
            ]},
            { heading: 'Flow conditions', rows: [
              { label: <>Inlet velocity <M math="U_\infty" /></>,      value: <M math="69.44" /> },
              { label: <>Mach number <M math="M_\infty" /></>,         value: <M math="0.2" /> },
              { label: <>Reynolds number <M math="\mathit{Re}_L" /></>, value: <><M math="3.00 \times 10^{6}" /> (based on <M math="L = 1" />)</> },
              { label: <>Inlet <M math="k" /></>,                      value: <><M math="1.08 \times 10^{-3}" /> (NASA TMR: <M math="9 \times 10^{-9}\,a_\infty^2" />)</> },
              { label: <>Inlet <M math="\omega" /></>,                 value: <><M math="5220.8" /> (NASA TMR: <M math="10^{-6}\rho a_\infty^2/\mu" />)</> },
              { label: <>Implied <M math="\mu_t / \mu_\infty" /></>,   value: <M math="0.009" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: <>Inlet (<M math="x = -25" />)</>,             value: <>Uniform velocity inflow at <M math="U_\infty" /></> },
              { label: <>Outlet (<M math="x = 26.5" />)</>,           value: <>Fixed static pressure, <M math="p_{\mathrm{rel}} = 0" /></> },
              { label: 'Bump surface',           value: 'No-slip viscous wall' },
              { label: 'Lower wall outside bump segment', value: 'Symmetry (slip)' },
              { label: <>Upper wall (<M math="y = 5" />)</>, value: 'Symmetry (slip)' },
            ]},
            { heading: 'Turbulence closure', rows: [
              { label: 'Model',                  value: <>Menter SST <M math="k" />–<M math="\omega" /></> },
              { label: 'Wall distance',          value: 'Mesh-wave method' },
              { label: 'Turbulence advection',   value: 'High-resolution' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',              value: 'SIMPLE (steady-state pseudo-transient)' },
              { label: 'Advection (momentum)',   value: 'High-resolution' },
              { label: 'Pseudo-time scale',      value: <M math="0.01" /> },
              { label: 'Under-relaxation',       value: <><M math="\lambda^v = \lambda^p = 0.5" />, <M math="\lambda^{k} = \lambda^{\omega} = 0.6" /></> },
              { label: 'Maximum outer iterations', value: <M math="25\,000" /> },
              { label: 'RMS target',             value: <M math="10^{-10}" /> },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Default',                value: <>PETSc <code>fgmres</code> + <code>bjacobi</code>, rtol <M math="10^{-3}" /></> },
              { label: 'Pressure correction',    value: <>HYPRE <code>GMRES</code> + <code>BoomerAMG</code>, rtol <M math="10^{-3}" /></> },
            ]},
          ]}
        />
      </section>

      <section id="benchmark">
        <h2>4. Benchmark quantities</h2>
        <p>Surface pressure and skin-friction coefficients along the lower wall:</p>
        <Equation math="C_p(x) = \frac{p(x) - p_\infty}{\tfrac{1}{2}\rho_\infty U_\infty^2}, \qquad C_f(x) = \frac{|\boldsymbol{\tau}_w(x)|}{\tfrac{1}{2}\rho_\infty U_\infty^2}" label="4" />
        <p>
          where the friction velocity <M math="\mathbf{u}_\tau" /> is computed directly from the
          OpenAccel <code>wall_friction_velocity</code> vector field. Integrated force coefficients on
          the bump (reference length <M math="L_b = 1.5" />):
        </p>
        <Equation math="C_D = \frac{F_x}{\tfrac{1}{2}\rho_\infty U_\infty^2\,L_b}, \qquad C_L = \frac{F_y}{\tfrac{1}{2}\rho_\infty U_\infty^2\,L_b}" label="5" />
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <p>
          Figures 4 and 5 compare the OpenAccel surface-pressure and skin-friction distributions on the
          bump, computed on the second-finest NASA TMR grid (<M math="705 \times 321" />), against the
          FUN3D reference on the finest TMR grid (<M math="1409 \times 641" />). The integrated
          coefficients in Table 2 use a matched-grid comparison. Figure 6 compares the streamwise
          velocity profiles at two stations, and Figures 2 and 3 compare the non-dimensional
          turbulence-field contours of eddy viscosity and specific dissipation rate against CFL3D.
        </p>

        <TutorialSubfigureRow label="Figure 2"
          left={{ src: '/figures/mu_bump_openaccel.svg', alt: 'Eddy viscosity – OpenAccel', subcaption: <><M math="\mu_t/\mu_{\text{ref}}" /> — OpenAccel (<M math="705\times321" />, 2nd finest grid)</>, trim: BUMP_TRIM, trimBase: BUMP_BASE }}
          right={{ src: '/figures/mu_bump_CFL3d.svg', alt: 'Eddy viscosity – CFL3D', subcaption: <><M math="\mu_t/\mu_{\text{ref}}" /> — CFL3D (<M math="1409\times641" />, finest grid)</>, trim: BUMP_TRIM, trimBase: BUMP_BASE }}
          caption={<>Turbulent eddy-viscosity ratio <M math="\mu_t/\mu_{\text{ref}}" /> over the bump.</>}
        />
        <TutorialSubfigureRow label="Figure 3"
          left={{ src: '/figures/omega_bump_openaccel.svg', alt: 'Specific dissipation rate – OpenAccel', subcaption: <><M math="\omega\,\mu_{\text{ref}}/(\rho_{\text{ref}}\, a_{\text{ref}}^2)" /> — OpenAccel (<M math="705\times321" />)</>, trim: BUMP_TRIM, trimBase: BUMP_BASE }}
          right={{ src: '/figures/omega_bump_CFL3d.svg', alt: 'Specific dissipation rate – CFL3D', subcaption: <><M math="\omega\,\mu_{\text{ref}}/(\rho_{\text{ref}}\, a_{\text{ref}}^2)" /> — CFL3D (<M math="1409\times641" />)</>, trim: BUMP_TRIM, trimBase: BUMP_BASE }}
          caption={<>Specific dissipation rate (normalised per NASA TMR convention). The freestream
            value is <M math="10^{-6}" /> at the inlet.</>}
        />

        <TutorialFigure label="Figure 4"
          src="/figures/Cp_bump.svg"
          alt="Surface Cp distribution"
          caption={<>Surface pressure coefficient <M math="C_p" /> along the lower wall. OpenAccel on
            the 2nd-finest NASA TMR grid (<M math="705 \times 321" />) vs. FUN3D reference on the finest
            grid (<M math="1409 \times 641" />).</>}
        />
        <TutorialFigure label="Figure 5"
          src="/figures/Cf_bump.svg"
          alt="Surface Cf distribution"
          caption={<>Surface skin-friction coefficient <M math="C_f" /> along the lower wall. Localised
            anomalies near <M math="x = 0" /> (turbulence-model activation) and <M math="x = 1.5" />{' '}
            (trailing-edge numerical influence) are inherent to the benchmark and appear in all
            participating codes.</>}
        />
        <TutorialFigure label="Figure 6"
          src="/figures/velocity_profile_bump.svg"
          alt="Streamwise velocity profiles"
          caption={<>Streamwise velocity profiles <M math="U_x/U_\infty" /> versus wall-normal distance
            at two stations: <M math="x=0.75" /> (bump apex, favourable pressure-gradient region) and{' '}
            <M math="x=1.20148" /> (leeward recovery, adverse pressure-gradient region). OpenAccel on
            the 2nd-finest grid vs. CFL3D on the finest grid.</>}
        />

        <DataTable
          label="Table 2"
          caption={<>Integrated lift and drag coefficients on the bump at <M math="\mathit{Re}_L = 3\times10^{6}" />, <M math="M_\infty = 0.2" />.</>}
          headers={['Quantity', 'OpenAccel', 'CFL3D', 'Diff (%)', 'FUN3D', 'Diff (%)']}
          rows={[
            [<M math="C_D\ \text{(total)}" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}>0.00361</span>, <M math="0.00360" />, <M math="0.27\,\%" />, <M math="0.00359" />, <M math="0.55\,\%" />],
            [<M math="C_L\ \text{(total)}" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}>0.02491</span>, <M math="0.02497" />, <M math="0.24\,\%" />, <M math="0.02508" />, <M math="0.67\,\%" />],
          ]}
        />
      </section>

      <Takeaway>
        OpenAccel reproduces the surface <M math="C_p" /> and <M math="C_f" /> distributions in close
        agreement with the FUN3D node-centred reference — even though OpenAccel is on the second-finest
        grid (<M math="705 \times 321" />) and FUN3D is on the finest (<M math="1409 \times 641" />).
        The integrated <M math="C_D" /> and <M math="C_L" /> values fall within the inter-code scatter
        between CFL3D and FUN3D. The streamwise velocity profiles at <M math="x = 0.75" /> and{' '}
        <M math="x = 1.20148" /> match the CFL3D reference under both favourable and adverse pressure
        gradients, and the eddy-viscosity and specific-dissipation-rate contours reproduce the CFL3D
        boundary-layer structure. The near-leading-edge <M math="C_f" /> anomaly near <M math="x = 0" />{' '}
        and the trailing-edge dip near <M math="x = 1.5" /> are properties of the benchmark, shared by
        all SST implementations, not of the present implementation.
      </Takeaway>

      <AcceptanceCriterion>
        The <M math="C_p(x)" /> and <M math="C_f(x)" /> distributions, computed on the second-finest
        TMR grid, shall match the FUN3D reference solution on the finest TMR grid to graphical accuracy.
        The integrated coefficients <M math="C_D" />, <M math="C_{D,p}" />, <M math="C_{D,v}" />, and{' '}
        <M math="C_L" />, evaluated at the same nominal grid resolution as the reference codes, shall
        agree with the FUN3D reference values to within 1% and with the CFL3D values to within 10%.
      </AcceptanceCriterion>
    </>
  );
}
