import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function BenardCellsContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC011' },
        { label: 'Reference',    value: 'Chandrasekhar (1961); Clever & Busse (1974)' },
        { label: 'Solver mode',  value: 'Transient, segregated' },
        { label: 'Physics / models', value: '2-D incompressible laminar NS + thermal energy + Boussinesq buoyancy' },
        { label: 'Rayleigh number', value: <><M math="\mathit{Ra} = 9810" /> (<M math="\mathit{Ra}/\mathit{Ra}_c \approx 5.75" />)</> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          Rayleigh–Bénard convection in a differentially heated horizontal cavity is the canonical
          test for Boussinesq buoyancy coupling. Below the critical Rayleigh number{' '}
          <M math="\mathit{Ra}_c = 1707.76" /> the fluid remains motionless. Above{' '}
          <M math="\mathit{Ra}_c" />, buoyancy overcomes viscous and diffusive damping, and the
          layer organises into a periodic array of counter-rotating convection rolls. The
          validation case sits at <M math="\mathit{Ra} = 9810" />, validating the buoyancy source
          term, velocity–temperature coupling, and Nusselt number against the spectral benchmark of
          Clever &amp; Busse (1974).
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure
          src={`${import.meta.env.BASE_URL}figures/bernard.svg`}
          alt="Rayleigh–Bénard cavity schematic"
          label="Figure 1"
          caption="Rayleigh–Bénard cavity (not to scale). The hot floor and cold ceiling drive buoyant motion; side walls are adiabatic no-slip."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          label="Table 1"
          caption="Rayleigh–Bénard convection — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: <>Aspect ratio <M math="L/H" /></>, value: <M math="9\!:\!1" /> },
              { label: 'Mesh',               value: <><M math="180 \times 20 \times 1" /> (<M math="N_n = 7\,602" />, <M math="N_e = 3\,600" />)</> },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: <>Density <M math="\rho" /></>,          value: <M math="1~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Dynamic viscosity <M math="\mu" /></>, value: <M math="10^{-3}~\mathrm{Pa\,s}" /> },
              { label: <>Specific heat <M math="c_p" /></>,     value: <M math="1~\mathrm{J\,kg^{-1}\,K^{-1}}" /> },
              { label: <>Thermal conductivity <M math="\lambda" /></>, value: <M math="10^{-3}~\mathrm{W\,m^{-1}\,K^{-1}}" /> },
              { label: <>Thermal expansion <M math="\beta_T" /></>, value: <M math="10^{-3}~\mathrm{K^{-1}}" /> },
              { label: 'Prandtl number',     value: <M math="\mathit{Pr} = 1" /> },
              { label: 'Rayleigh number',    value: <M math="\mathit{Ra} = \rho g \beta_T \Delta T H^3 / (\mu \alpha) = 9810" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Floor',              value: <><M math="T_{\mathrm{hot}} = 301~\mathrm{K}" />, no-slip</> },
              { label: 'Ceiling',            value: <><M math="T_{\mathrm{cold}} = 300~\mathrm{K}" />, no-slip</> },
              { label: 'Side walls',         value: 'Adiabatic no-slip' },
              { label: 'Body force',         value: <><M math="g = 9.81~\mathrm{m\,s^{-2}}" /> downward, Boussinesq <M math="T_{\mathrm{ref}} = 300~\mathrm{K}" /></> },
              { label: 'Initial perturbation', value: <><M math="u = 10^{-4}~\mathrm{m/s}" /> (to seed instability)</> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: 'Time step / end time', value: <><M math="\Delta t = 5~\mathrm{s}" />, <M math="t_{\mathrm{end}} = 1500~\mathrm{s}" /> (<M math="300" /> steps)</> },
              { label: 'Advection',          value: 'First-order upwind' },
              { label: 'Under-relaxation',   value: <><M math="\lambda^v = 0.9" />, <M math="\lambda^p = 0.1" /></> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: <><M math="10^{-5}" /> / up to <M math="10" /> per step</> },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <p>The principal validation quantity is the Nusselt number:</p>
        <Equation math="\mathit{Nu} = \frac{q\,H}{\lambda\,\Delta T}" />

        <TutorialSubfigureStack
          label="Figure 2"
          items={[
            { src: '/figures/velocity_cells.svg',     alt: 'y-velocity contour', subcaption: <><M math="y" />-velocity contour at steady state, showing six counter-rotating roll pairs.</> },
            { src: '/figures/temperature_cells.svg',  alt: 'Temperature contour', subcaption: <>Temperature contour: hot plumes rise from the floor and cold plumes descend from the ceiling. The double-headed arrow marks one convection wavelength <M math="\lambda_r = 1.5~\mathrm{m}" />.</> },
          ]}
          caption={<>Steady-state Rayleigh&ndash;Bénard solution at <M math="\mathit{Ra} = 9810" />, <M math="\mathit{Pr} = 1" />.</>}
        />

        <DataTable
          label="Table 2"
          caption={<>Nusselt number compared with the spectral benchmark of Clever &amp; Busse (1974).</>}
          headers={['Source', <M math="\mathit{Ra}" />, <M math="k" />, <M math="\mathit{Pr}" />, <M math="\mathit{Nu}" />]}
          rows={[
            ['Clever & Busse (1974)', <M math="10\,000" />, <M math="3.117" />, <M math="0.71" />, <M math="2.661" />],
            ['Present work', <M math="9\,810" />, <M math="4.18" />, <M math="1.0" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="2.67" /></span>],
          ]}
        />
      </section>

      <Takeaway>
        <p>
          The <M math="0.34\%" /> agreement with the spectral benchmark of Clever &amp; Busse (1974) validates
          both the Boussinesq buoyancy coupling and the thermal-energy advection. The mild
          differences in <M math="\mathit{Ra}" />, <M math="k" />, and <M math="\mathit{Pr}" />{' '}
          between the two configurations do not affect the comparison: at moderate Rayleigh numbers
          the Nusselt number is only weakly sensitive to the Prandtl number in the range{' '}
          <M math="\mathit{Pr} \in [0.71, 1]" />.
        </p>
      </Takeaway>

      <AcceptanceCriterion>
        <p>
          The time-averaged Nusselt number shall agree with the Clever &amp; Busse benchmark to
          within <M math="1\%" /> on the <M math="180 \times 20" /> mesh, and the steady-state flow shall develop
          into a periodic array of counter-rotating convection rolls.
        </p>
      </AcceptanceCriterion>
    </>
  );
}
