import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// nusselt_slab.pdf natural page size 772.214×547.81 pt → cm.
const NU_BASE: [number, number] = [27.24, 19.32];
// temp_contour_slab.pdf letter-landscape (792×612 pt → cm); source trim 2.7 5 2.7 1.
const LAND: [number, number] = [27.94, 21.59];

export function SlabContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC012' },
        { label: 'Reference',    value: 'Vynnycky et al. (1998); Pohlhausen flat-plate correlation' },
        { label: 'Solver mode',  value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics / models', value: '2-D incompressible laminar flow + thermal energy in fluid and solid' },
        { label: 'Special',      value: 'Two-domain CHT coupling at the fluid–solid interface' },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This case is the foundational test of OpenAccel's intelligent multi-domain design for
          conjugate heat transfer (CHT). A solid slab is embedded in the floor of a fluid channel;
          forced convection over the slab surface couples the temperature field across the
          fluid–solid interface. Because the energy equation is shared by both domains, the
          multi-domain framework automatically assembles a single, implicitly coupled linear system
          spanning fluid and solid degrees of freedom and solves them simultaneously — without the
          iteration lag of explicit boundary-condition exchange between separate solvers.
        </p>
        <p>
          The validation has two layers. First, the local Nusselt-number distribution along the
          interface is compared with the Pohlhausen correlation for laminar forced convection over a
          flat plate at constant wall temperature, expected to hold approximately given the
          significant differences between the present finite-length, conjugate configuration and the
          semi-infinite, isothermal-plate idealisation. Second, the dimensionless interface
          temperature and its normal gradient are compared with the high-fidelity numerical benchmark
          of Vynnycky et al. (1998), which is the more stringent test.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src={`${import.meta.env.BASE_URL}figures/slab.svg`}
          alt="CHT slab geometry"
          caption={<>CHT validation case (not to scale). A solid slab is embedded centrally in the
            floor of the fluid channel; the bottom face of the slab is held at{' '}
            <M math="T_{\mathrm{hot}} = 310~\mathrm{K}" />, and the slab side walls are adiabatic.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="CHT heated slab — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Fluid domain',       value: <M math="L_f \times H_f = 10 \times 5~\mathrm{m}" /> },
              { label: 'Solid slab',         value: <><M math="w \times H_s = 1 \times 0.25~\mathrm{m}" />, centred on the floor</> },
              { label: 'Mesh',               value: <><M math="25\,820" /> nodes / <M math="12\,580" /> elements (combined)</> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',              value: <>Velocity inlet at <M math="u_{\mathrm{in}}" />, <M math="T_{\mathrm{in}}" /></> },
              { label: 'Outlet',             value: 'Zero-gauge static pressure' },
              { label: 'Lower fluid wall',   value: 'No-slip' },
              { label: 'Upper fluid wall',   value: 'Free-slip' },
              { label: 'Slab bottom',        value: <M math="T_{\mathrm{hot}} = 310~\mathrm{K}" /> },
              { label: 'Slab sides',         value: 'Adiabatic' },
              { label: 'Fluid–solid interface', value: <>General-connection CHT (search tol. <M math="10^{-4}" />, standard quadrature)</> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',          value: 'SIMPLE (steady-state)' },
              { label: 'Advection',          value: 'High-resolution Barth–Jespersen' },
              { label: 'Under-relaxation',   value: <><M math="\lambda^v = 0.8" />, <M math="\lambda^p = 0.2" /></> },
              { label: 'Pseudo-time-scale',  value: <M math="\Delta t_{\mathrm{ps}} = 100~\mathrm{s}" /> },
              { label: 'Energy equation',    value: 'Thermal-energy form (viscous work excluded)' },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'All systems',        value: <>Trilinos / GMRES + ILU (rel. tol. <M math="10^{-2}" />)</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: <><M math="10^{-10}" /> / up to <M math="1000" /></> },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <p>The Pohlhausen reference for laminar forced convection over a flat plate at constant wall temperature is</p>
        <Equation math="\mathit{Nu}(\tilde{x}) = 0.332\,\mathit{Re}_{\tilde{x}}^{1/2}\,\mathit{Pr}^{1/3}, \qquad \tilde{x} = x - x_{\mathrm{LE}}" label="1" />
        <p>
          where <M math="\tilde{x}" /> is measured from the leading edge of the slab,{' '}
          <M math="\mathit{Re}_{\tilde{x}} = \rho u_{\mathrm{in}}\tilde{x}/\mu = 500\,\tilde{x}" />,
          and <M math="\mathit{Pr} = \mu c_p / \lambda_f = 0.01" />.
        </p>

        <TutorialFigure label="Figure 2"
          src={`${import.meta.env.BASE_URL}figures/nusselt_slab.svg`}
          alt="Local Nusselt number distribution"
          caption={<>Local Nusselt number <M math="\mathit{Nu}(\tilde{x})" /> along the fluid–solid
            interface, compared with the Pohlhausen correlation for an isothermal flat plate at{' '}
            <M math="\mathit{Pr} = 0.01" />.</>}
          trim={[1, 0.5, 0, 0]}
          trimBase={NU_BASE}
        />
        <TutorialSubfigureStack label="Figure 3"
          items={[
            { src: '/figures/temp_slab.svg',          alt: 'Dimensionless interface temperature', subcaption: <>Dimensionless interface temperature <M math="\theta = (T - T_{\mathrm{in}})/(T_{\mathrm{hot}} - T_{\mathrm{in}})" />.</> },
            { src: '/figures/temp_gradient_slab.svg', alt: 'Wall-normal temperature gradient',    subcaption: <>Dimensionless wall-normal temperature gradient <M math="\partial\theta/\partial y" />.</> },
          ]}
          caption={<>CHT validation: comparison of (a) the dimensionless interface temperature and (b)
            its wall-normal gradient with the numerical benchmark of Vynnycky et al. (1998).</>}
        />
        <TutorialFigure label="Figure 4"
          src={`${import.meta.env.BASE_URL}figures/temp_contour_slab.svg`}
          alt="Steady-state temperature contour"
          caption="Steady-state temperature contour of the CHT case."
          trim={[2.7, 5, 2.7, 1]}
          trimBase={LAND}
        />
      </section>

      <Takeaway>
        Some discrepancy between the present <M math="\mathit{Nu}" /> and the Pohlhausen correlation
        is expected and physically meaningful: the reference assumes a semi-infinite isothermal plate
        in a uniform free stream, whereas this case features a finite-length heated slab embedded in a
        confined channel, and the interface temperature is non-uniform because of the two-way CHT
        coupling rather than fixed. The more demanding test — the comparison against the
        conjugate-aware reference of Vynnycky et al. (1998) — shows excellent agreement on both the
        interface temperature <M math="\theta" /> and its wall-normal gradient, confirming that
        OpenAccel's multi-domain CHT coupling enforces both temperature and heat-flux continuity at
        the interface.
      </Takeaway>

      <AcceptanceCriterion>
        The dimensionless interface temperature and its wall-normal gradient shall match the benchmark
        of Vynnycky et al. (1998) in graphical agreement, and the local Nusselt number shall remain
        within engineering accuracy of the Pohlhausen correlation in the bulk of the slab.
      </AcceptanceCriterion>
    </>
  );
}
