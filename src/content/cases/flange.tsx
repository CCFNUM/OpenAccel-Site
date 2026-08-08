import { TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { M } from '@/components/tutorial/Equation';

// Letter-landscape contour plates (792×612 pt → cm); source trim 3 1 3 1.
const LAND: [number, number] = [27.94, 21.59];
const TRIM: [number, number, number, number] = [3, 1, 3, 1];

export function FlangeContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC016' },
        { label: 'Reference',    value: 'Demonstration / textbook conduction' },
        { label: 'Solver mode',  value: 'Transient, single-domain solid heat transfer' },
        { label: 'Physics / models', value: '3-D thermal-energy equation in a solid (no flow)' },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          The flange case is the simplest possible exercise of the thermal-energy equation in
          OpenAccel: a solid part with no flow, no buoyancy, and no coupling to a fluid domain — just
          transient diffusion of heat under prescribed Dirichlet conditions on two of its four
          patches. This is the "hello world" of any heat-transfer solver, and a useful entry point to
          the multi-domain CHT cases (the heated slab): it confirms that the solid-side thermal-energy
          assembly is correct in isolation before being coupled to a fluid.
        </p>
        <p>
          The geometry is a flange composed of mixed hexahedral and prismatic elements
          (<code>solid-hex</code> and <code>solid-pri</code> mesh blocks), which incidentally
          exercises the CVFEM machinery's uniform handling of mixed-element topologies on a single
          domain. There is no analytical reference for this specific geometry; the validation is
          qualitative — the temperature field should evolve smoothly between the two
          prescribed-temperature patches, with adiabatic patches showing no normal-flux artefacts at
          convergence to steady state.
        </p>
      </section>

      <section id="setup">
        <h2>2. Setup</h2>
        <SetupTable label="Table 1"
          caption="Flange thermal diffusion — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',             value: 'Solid flange, mixed hex + prism elements' },
              { label: 'Mesh blocks',        value: <><code>solid-hex</code>, <code>solid-pri</code></> },
            ]},
            { heading: 'Material (synthetic)', rows: [
              { label: <>Density <M math="\rho" /></>,          value: <M math="1~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Specific heat <M math="c_p" /></>,  value: <M math="1~\mathrm{J\,kg^{-1}\,K^{-1}}" /> },
              { label: <>Thermal conductivity <M math="\lambda" /></>, value: <M math="4 \times 10^{-5}~\mathrm{W\,m^{-1}\,K^{-1}}" /> },
              { label: 'Thermal diffusivity', value: <M math="\alpha = \lambda/(\rho c_p) = 4 \times 10^{-5}~\mathrm{m^2\,s^{-1}}" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: <code>patch1</code>,             value: 'Adiabatic wall (zero heat flux)' },
              { label: <code>patch2</code>,             value: <>Fixed temperature <M math="T = 273~\mathrm{K}" /></> },
              { label: <code>patch3</code>,             value: 'Adiabatic wall (zero heat flux)' },
              { label: <code>patch4</code>,             value: <>Fixed temperature <M math="T = 573~\mathrm{K}" /></> },
              { label: 'Volumetric source',  value: <M math="S^h = 0" /> },
            ]},
            { heading: 'Initialisation', rows: [
              { label: 'Initial temperature', value: <><M math="T_0 = 273~\mathrm{K}" /> (uniform)</> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Analysis type',      value: 'Transient' },
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: 'Time step / total time', value: <><M math="\Delta t = 5 \times 10^{-3}~\mathrm{s}" />, <M math="t_{\mathrm{end}} = 3~\mathrm{s}" /></> },
              { label: 'Temperature interpolation', value: <code>linear_linear</code> },
              { label: 'Outer iterations',   value: <>1–5 per step (<code>min</code>/<code>max</code>)</> },
            ]},
            { heading: 'Linear solver', rows: [
              { label: 'Energy equation',    value: <>PETSc / FGMRES + block-Jacobi; rel. tol. <M math="10^{-1}" />, abs. tol. <M math="10^{-12}" />, max 20 iters</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS residual target', value: <M math="10^{-6}" /> },
            ]},
            { heading: 'Output', rows: [
              { label: 'File / fields',      value: <><code>results.e</code> / <code>temperature</code></> },
              { label: 'Output frequency',   value: 'every 20 timesteps' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>3. Results</h2>
        <TutorialSubfigureRow label="Figure 1"
          left={{ src: '/figures/temp_contour_flange_0.1.svg', alt: 'Early transient temperature', subcaption: 'Temperature field at an early time (transient).', trim: TRIM, trimBase: LAND }}
          right={{ src: '/figures/temp_contour_flange_3.svg',  alt: 'Steady-state temperature',    subcaption: <>Steady-state temperature field at <M math="t = 3~\mathrm{s}" />.</>, trim: TRIM, trimBase: LAND }}
          caption="Temperature evolution in the flange. The thermal field smoothly bridges the two prescribed-temperature patches; adiabatic boundaries are silent (zero normal flux) at convergence."
        />
      </section>

      <Takeaway>
        With a thermal diffusivity of <M math="\alpha = 4 \times 10^{-5}~\mathrm{m^2\,s^{-1}}" /> and
        a <M math="3~\mathrm{s}" /> simulation window, the diffusion length scale{' '}
        <M math="\sqrt{\alpha t}" /> is on the order of <M math="1.1\times10^{-2}~\mathrm{m}" /> — so
        for typical flange dimensions the field has not yet reached full steady state by{' '}
        <M math="t = 3~\mathrm{s}" />, and the result genuinely tests the transient term as well as
        the steady operator. Running to a longer horizon recovers the steady solution, which by
        linearity must be harmonic in the bulk with the prescribed Dirichlet values acting as the only
        forcing. The case also serves as a smoke test that the mixed hex–prism mesh assembly is
        correctly summing contributions across element types in the dual control volumes.
      </Takeaway>

      <AcceptanceCriterion>
        The temperature field shall remain bounded between <M math="T_{\mathrm{cold}} = 273~\mathrm{K}" />{' '}
        and <M math="T_{\mathrm{hot}} = 573~\mathrm{K}" /> throughout the transient (maximum-principle
        compliance), the adiabatic patches shall carry no normal heat flux at convergence, and the RMS
        residual shall fall below <M math="10^{-6}" /> within the five-iteration outer cap on each
        timestep.
      </AcceptanceCriterion>
    </>
  );
}
