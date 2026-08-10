import { TutorialFigure } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { M } from '@/components/tutorial/Equation';

// velocity_elbow.pdf letter-landscape (792×612 pt → cm); source trim 3 1 3 1.
const LAND: [number, number] = [27.94, 21.59];

export function ElbowContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC017' },
        { label: 'Reference',    value: 'Demonstration case' },
        { label: 'Solver mode',  value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics / models', value: '3-D incompressible laminar Navier–Stokes' },
        { label: 'Special',      value: 'Two inlets, one outlet; wedge-element mesh' },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          The elbow case is a steady-state, laminar, two-inlet flow demonstrator that exercises three
          things at once: (i) the multi-inlet boundary-condition layer, (ii) the wedge element type in
          the CVFEM assembler, and (iii) the steady-state SIMPLE algorithm under mass-balanced inflow
          conditions. Two streams enter the elbow at right angles to each other — a horizontal stream
          on one branch and a vertical stream on the other — and mix before exiting through a single
          outlet.
        </p>
        <p>
          This is a feature-demonstrator rather than a benchmark with reference data: there is no
          analytical solution for a confined two-inlet mixing junction and no widely-cited
          experimental dataset for this exact geometry. Its role in the validation suite is to confirm
          that the solver produces a physically reasonable mixing pattern, conserves mass to machine
          precision at the outlet, and converges cleanly with the prescribed steady-state
          under-relaxation.
        </p>
      </section>

      <section id="setup">
        <h2>2. Setup</h2>
        <SetupTable label="Table 1"
          caption="Elbow — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Element type',       value: <>Wedge (<code>unspecified-2-wedge</code>)</> },
            ]},
            { heading: 'Fluid properties (air)', rows: [
              { label: <>Density <M math="\rho" /></>,          value: <M math="1.185~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Dynamic viscosity <M math="\mu" /></>, value: <M math="1.831 \times 10^{-5}~\mathrm{Pa\,s}" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: <code>inlet1</code>,             value: <>Velocity inlet, <M math="\mathbf{v} = (1,\,0,\,0)~\mathrm{m/s}" /></> },
              { label: <code>inlet2</code>,             value: <>Velocity inlet, <M math="\mathbf{v} = (0,\,3,\,0)~\mathrm{m/s}" /></> },
              { label: <code>outlet</code>,             value: <>Static pressure, relative <M math="p = 0" /></> },
              { label: <code>wall</code>,               value: 'No-slip wall' },
              { label: <><code>front</code>, <code>back</code></>, value: 'Symmetry' },
              { label: 'Reference pressure', value: <M math="p_{\mathrm{ref}} = 101\,325~\mathrm{Pa}" /> },
            ]},
            { heading: 'Initialisation', rows: [
              { label: 'Velocity, pressure', value: <><M math="\mathbf{v}_0 = \mathbf{0}" />, <M math="p_0 = 0" /></> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Analysis type',      value: 'Steady state' },
              { label: 'Algorithm',          value: 'SIMPLE' },
              { label: 'Advection scheme',   value: 'First-order upwind' },
              { label: 'Under-relaxation',   value: <><M math="\lambda^v = 0.8" />, <M math="\lambda^p = 0.2" /></> },
              { label: 'Physical timescale', value: <M math="\Delta t_{\mathrm{ps}} = 1~\mathrm{s}" /> },
              { label: 'Outer iterations',   value: <><M math="1" />–<M math="250" /> per run</> },
            ]},
            { heading: 'Linear solver', rows: [
              { label: 'Default',            value: <>PETSc / FGMRES + block-Jacobi; rel. tol. <M math="10^{-1}" />, abs. tol. <M math="10^{-12}" />, <M math="3" />–<M math="20" /> iters</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS residual target', value: <M math="10^{-6}" /> },
            ]},
            { heading: 'Output', rows: [
              { label: 'File / fields',      value: <><code>results.e</code> / <code>velocity</code>, <code>pressure</code></> },
              { label: 'Output frequency',   value: <>every <M math="10" /> outer iters</> },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>3. Results</h2>
        <TutorialFigure label="Figure 1"
          src="/figures/velocity_elbow.svg"
          alt="Velocity magnitude in elbow"
          caption={<>Velocity magnitude. The stronger vertical inlet (<M math="v = 3~\mathrm{m/s}" />)
            dominates the merged stream after the junction.</>}
          trim={[3, 1, 3, 1]}
          trimBase={LAND}
        />
      </section>

      <Takeaway>
        The merged-stream momentum is the vector sum of the two inlet contributions weighted by mass
        flux: with equal inlet areas, the vertical inlet delivers three times the momentum flux and
        dominates the post-junction direction. The case is a good first stress test of the
        boundary-condition system because it forces the solver to handle two inflow patches with
        different prescribed velocities simultaneously, and to balance them through a single outlet
        pressure condition. Mass conservation should hold to machine precision at convergence, which
        is the single quantitative check worth running on every output. The mass flow rate at inlet 1
        is <M math="35.5~\mathrm{kg/s}" />, at inlet 2 is <M math="26.7~\mathrm{kg/s}" />, and at
        outlet is <M math="62.2~\mathrm{kg/s}" />, which confirms mass conservation.
      </Takeaway>

      <AcceptanceCriterion>
        At convergence, the integrated mass flux at the outlet shall equal the sum of the integrated
        mass fluxes at the two inlets to within machine precision, and the RMS residual shall fall
        below <M math="10^{-6}" /> within the <M math="250" />-iteration outer cap.
      </AcceptanceCriterion>
    </>
  );
}
