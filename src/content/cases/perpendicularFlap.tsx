import { TutorialFigure } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { M } from '@/components/tutorial/Equation';

// velocity.png is 3000×1500 px at 72 dpi → natural size in cm; source trim 9 0 9 0.
const VEL_BASE: [number, number] = [105.83, 52.92];

export function PerpendicularFlapContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC009' },
        { label: 'Reference',    value: 'preCICE tutorial suite (2022)' },
        { label: 'Solver mode',  value: 'Transient, segregated; partitioned FSI with Aitken' },
        { label: 'Physics / models', value: '2-D incompressible Navier–Stokes + linear elasticity' },
        { label: 'Coupling',     value: <>Aitken <M math="\Delta^2" /> relaxation</> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          The perpendicular flap is a single-phase FSI benchmark from the preCICE tutorial suite: a
          thin elastic flap mounted perpendicular to a uniform inflow deflects under the hydrodynamic
          load, and the dynamic interaction generates an unsteady wake. Compared to the flexible
          dam-break case, this case isolates the FSI coupling without VoF. Reference data are the
          tip-displacement histories produced by several open-source toolchains coupled through
          preCICE.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src="/figures/flap_schematic.svg"
          alt="Perpendicular flap schematic"
          caption={<>Perpendicular flap: a thin elastic flap of height <M math="1~\mathrm{m}" /> and
            thickness <M math="0.1~\mathrm{m}" /> on the lower wall of a{' '}
            <M math="L \times H = 6 \times 4~\mathrm{m}" /> channel.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Perpendicular flap — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Channel size',       value: <M math="L \times H = 6 \times 4~\mathrm{m}" /> },
              { label: 'Flap',               value: <><M math="1~\mathrm{m}" /> height, <M math="0.1~\mathrm{m}" /> thickness, centred on lower wall</> },
              { label: 'Mesh',               value: <><M math="7\,414" /> nodes / <M math="3\,510" /> elements</> },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: <>Density <M math="\rho_f" /></>,        value: <M math="1.0~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Kin. viscosity <M math="\nu_f" /></>, value: <M math="1.0~\mathrm{m^2\,s^{-1}}" /> },
            ]},
            { heading: 'Solid properties (linear elastic)', rows: [
              { label: <>Density <M math="\rho_s" /></>,        value: <M math="3000~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Young's modulus <M math="E" /></>,   value: <M math="4.0\times10^6~\mathrm{kg\,m^{-1}\,s^{-2}}" /> },
              { label: <>Poisson's ratio <M math="\nu_s" /></>, value: <M math="0.3" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',              value: <>Uniform horizontal <M math="U_\infty = 10~\mathrm{m/s}" /></> },
              { label: 'Outlet',             value: 'Outflow' },
              { label: 'Top, bottom, flap',  value: 'No-slip walls' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: <><M math="\Delta t" />, end time</>,       value: <><M math="0.01~\mathrm{s}" />, <M math="5~\mathrm{s}" /></> },
              { label: 'Advection',          value: 'First-order upwind' },
              { label: 'Under-relaxation',   value: <><M math="\lambda^v = 0.7" />, <M math="\lambda^p = 0.3" /></> },
              { label: 'Mesh stiffness',     value: 'Inverse-volume (exponent 2), 3 smoothing iters/step' },
            ]},
            { heading: 'FSI coupling', rows: [
              { label: 'Interface type',     value: <>General-connection, search tol. <M math="5\times10^{-3}" /></> },
              { label: 'Acceleration',       value: <>Aitken, <M math="\omega_0 = 0.5" />, <M math="\omega \in [0.1,\,1.0]" /></> },
              { label: 'Sub-iterations',     value: '10 (flow) / 30 (solid) per outer loop' },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'All systems',        value: <>Trilinos / GMRES + ILU (rel. tol. <M math="10^{-2}" />)</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: <><M math="10^{-6}" /> / up to 50 per step</> },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <TutorialFigure label="Figure 2"
          src="/figures/displacement-flap.svg"
          alt="Flap tip displacement"
          caption={<>Time history of horizontal tip displacement <M math="\delta_x^{\mathrm{tip}}(t)" />{' '}
            of the perpendicular flap, compared against the preCICE reference toolchain combinations.</>}
        />
        <TutorialFigure label="Figure 3"
          src="/figures/velocity.png"
          alt="Velocity magnitude around flap"
          caption={<>Velocity magnitude around the perpendicular flap at <M math="t = 2~\mathrm{s}" />.
            The flow accelerates around the flap tip and forms a recirculation zone in the wake.</>}
          trim={[9, 0, 9, 0]}
          trimBase={VEL_BASE}
        />
      </section>

      <Takeaway>
        The OpenAccel tip-displacement trace falls within the scatter band of the preCICE reference
        toolchain combinations, with closest agreement against the OpenFOAM–Nutils result. The
        total-Lagrangian linear-elastic solid formulation, coupled with incompressible Navier–Stokes
        through the partitioned interface and accelerated by Aitken <M math="\Delta^2" />, reproduces
        both the oscillation period and the steady-state deflection. The relatively wide
        outer-iteration cap (50) is justified by the high-added-mass character of this configuration
        — comparable to the flexible dam-break, but persistent rather than transient.
      </Takeaway>

      <AcceptanceCriterion>
        The horizontal tip-displacement history <M math="\delta_x^{\mathrm{tip}}(t)" /> shall fall
        within the scatter band of the preCICE reference combinations over{' '}
        <M math="0 \le t \le 5~\mathrm{s}" />.
      </AcceptanceCriterion>
    </>
  );
}
