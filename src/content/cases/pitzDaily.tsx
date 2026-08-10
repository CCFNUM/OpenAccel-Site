import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { M } from '@/components/tutorial/Equation';

const F = (name: string) => `/figures/${name}.svg`;

// Contour plates are letter-landscape (792×612 pt → cm); source LaTeX trim for
// the pitzdaily u-velocity contours is 2.7cm 7.5cm 2.7cm 5cm (L B R T).
const PD_BASE: [number, number] = [27.94, 21.59];
const PD_TRIM: [number, number, number, number] = [2.7, 7.5, 2.7, 5];

export function PitzDailyContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',         value: 'VC002' },
        { label: 'References',      value: 'Pitz & Daily (1983); Ruck & Makiola (1993)' },
        { label: 'Solver mode',     value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics / models', value: <>2-D incompressible RANS; <M math="k" />–<M math="\omega" /> SST and standard <M math="k" />–<M math="\varepsilon" /></> },
        { label: 'Reynolds number', value: <><M math="\mathit{Re}_h = 25\,400" /> (step-height-based)</> },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem description</h2>
        <p className="mb-4">
          The Pitz–Daily geometry is the workhorse benchmark for separated and reattaching turbulent
          shear flows, and a stringent test of a two-equation RANS closure's behaviour under an
          adverse pressure gradient. A uniform inlet flow expands suddenly over a backward step,
          separating from the corner and reattaching some distance downstream.
        </p>
        <p className="mb-4">
          Two quantities matter for validation: the streamwise reattachment length{' '}
          <M math="x_r/h" /> on the lower wall and the recovery of the velocity profile downstream
          of reattachment. Reference data are taken from the experimental measurements of Ruck
          &amp; Makiola (1993) for a <M math="90^\circ" /> backward-facing step at expansion ratio{' '}
          <M math="ER = 2.0" />, at <M math="\mathit{Re}_h = 15\,000" /> and{' '}
          <M math="\mathit{Re}_h = 33\,000" />, bracketing the present{' '}
          <M math="\mathit{Re}_h = 25\,400" />. In this fully-turbulent regime the velocity profiles
          and reattachment length (<M math="x_r/h \approx 8\text{--}9" />) are essentially
          Reynolds-number independent.
        </p>
        <p>
          To corroborate the prediction and isolate any closure-specific bias, the case is run with
          two turbulence models — the <M math="k" />–<M math="\omega" /> SST model and the standard{' '}
          <M math="k" />–<M math="\varepsilon" /> model — on identical mesh and numerics.
        </p>
      </section>

      <section id="geometry" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src={F('pitzdaily')}
          alt="Pitz–Daily backward-facing step geometry"
          caption={<>Pitz–Daily backward-facing step. Flow enters uniformly through the inlet at{' '}
            <M math="u = 10~\mathrm{m/s}" />, expands over a step of height <M math="h = 0.0254~\mathrm{m}" />{' '}
            into a channel of height <M math="H = 0.0508~\mathrm{m}" /> and length{' '}
            <M math="L = 0.29~\mathrm{m}" />, and exits through a symmetrically converging nozzle.</>}
          width="wide"
        />
      </section>

      <section id="setup" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Pitz–Daily backward-facing step — complete case setup."
          groups={[
            {
              heading: 'Geometry and mesh',
              rows: [
                { label: <>Step height <M math="h" /></>,    value: <M math="0.0254~\mathrm{m}" /> },
                { label: <>Channel height <M math="H" /></>, value: <M math="0.0508~\mathrm{m}" /> },
                { label: <>Total length <M math="L" /></>,   value: <M math="0.29~\mathrm{m}" /> },
                { label: 'Mesh',             value: <><M math="6\,468" /> nodes / <M math="3\,093" /> elements</> },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: <>Density <M math="\rho" /></>,           value: <M math="1~\mathrm{kg\,m^{-3}}" /> },
                { label: <>Dynamic viscosity <M math="\mu" /></>,  value: <M math="10^{-5}~\mathrm{Pa\,s}" /> },
              ],
            },
            {
              heading: 'Turbulence closures',
              rows: [
                { label: 'Model 1', value: <><M math="k" />–<M math="\omega" /> SST</> },
                { label: 'Model 2', value: <>Standard <M math="k" />–<M math="\varepsilon" /> (scalable wall functions)</> },
              ],
            },
            {
              heading: 'Boundary conditions',
              rows: [
                { label: 'Inlet (SST)',   value: <><M math="U_0 = 10~\mathrm{m/s}" />; <M math="k = 0.375~\mathrm{m^2\,s^{-2}}" />; <M math="\omega = 440.15~\mathrm{s^{-1}}" /></> },
                { label: <>Inlet (<M math="k" />–<M math="\varepsilon" />)</>, value: <><M math="U_0 = 10~\mathrm{m/s}" />; <M math="k = 0.375~\mathrm{m^2\,s^{-2}}" />; <M math="\varepsilon = 21.2~\mathrm{m^2\,s^{-3}}" /></> },
                { label: 'Outlet',        value: 'Zero-gauge static pressure' },
                { label: 'Top, bottom',   value: 'No-slip walls (with wall-distance via mesh-wave method)' },
                { label: 'Front, back',   value: 'Symmetry' },
              ],
            },
            {
              heading: 'Numerics',
              rows: [
                { label: 'Algorithm',               value: 'SIMPLE (steady-state)' },
                { label: 'Advection (momentum)',    value: 'High-resolution Barth–Jespersen' },
                { label: 'Advection (turbulence)',  value: 'First-order upwind' },
                { label: 'Under-relaxation',        value: <><M math="\lambda^v = 0.5" />, <M math="\lambda^p = 0.3" /></> },
              ],
            },
            {
              heading: 'Linear solvers',
              rows: [
                { label: 'Momentum, turbulence',  value: <>PETSc / FGMRES + block-Jacobi (rel. tol. <M math="10^{-1}" />)</> },
                { label: 'Pressure correction',   value: <>HYPRE / GMRES + BoomerAMG (HMIS coarsening, <M math="\theta_{\mathrm{strong}} = 0.25" />, L1-Gauss–Seidel relaxation)</> },
              ],
            },
            {
              heading: 'Convergence',
              rows: [
                { label: 'RMS residual target', value: <M math="10^{-8}" /> },
                { label: 'Maximum outer iters', value: <M math="2500" /> },
              ],
            },
          ]}
        />
      </section>

      <section id="results" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">4. Results</h2>
        <p className="mb-6">
          The transient development of the recirculation pocket is summarised in Figure 3: at
          iteration <M math="300" /> the vortex is still forming behind the step corner, while by iteration <M math="1000" />
          the steady-state recirculation has stretched to its final reattachment location. The
          streamwise velocity profiles at three downstream stations (Figure 2) show the
          negative-velocity envelope inside the recirculation pocket and the gradual recovery toward
          a fully attached boundary layer.
        </p>
        <p className="mb-6">
          The standard <M math="k" />–<M math="\varepsilon" /> closure, run on the same mesh and with
          otherwise identical settings, produces velocity profiles that are essentially
          indistinguishable from the SST result on the scale of the experimental scatter, and both
          closures predict a reattachment length inside the experimental band of Ruck &amp; Makiola
          (1993).
        </p>

        <TutorialFigure label="Figure 2"
          src={F('velocity_profile_pitzdaily')}
          alt="Normalised streamwise velocity profiles at several axial stations"
          caption={<>Normalised streamwise velocity profiles <M math="u/u_{\mathrm{in}}" /> at several
            axial stations downstream of the step, compared with the experimental data of Ruck
            &amp; Makiola (1993).</>}
          width="wide"
        />

        <TutorialSubfigureStack label="Figure 3"
          items={[
            { src: F('uvelocity1'), alt: 'u-velocity at iteration 300',  subcaption: <>Iteration <M math="300" /> — the recirculation vortex is still developing.</>, trim: PD_TRIM, trimBase: PD_BASE },
            { src: F('uvelocity2'), alt: 'u-velocity at iteration 1000', subcaption: <>Iteration <M math="1000" /> — steady state. The vortex has reached its final reattachment location.</>, trim: PD_TRIM, trimBase: PD_BASE },
          ]}
          caption={<>Streamwise velocity contours at <M math="\mathit{Re}_h = 25\,400" /> during the
            iterative development toward steady state.</>}
        />

        <Takeaway>
          <p>
            The predicted reattachment length sits in the experimental band of{' '}
            <M math="x_r/h \approx 8\text{--}9" /> reported by Ruck &amp; Makiola (1993) at{' '}
            <M math="\mathit{Re}_h = 15\,000" /> and <M math="33\,000" />, and the velocity profiles
            track both datasets well across the Reynolds-independent turbulent plateau. This is a
            known sweet spot for <M math="k" />–<M math="\omega" /> SST: the BSL blending function
            reduces to <M math="k" />–<M math="\omega" /> near the wall (avoiding the wall-treatment
            sensitivity of standard <M math="k" />–<M math="\varepsilon" /> at low <M math="y^+" />)
            while behaving as <M math="k" />–<M math="\varepsilon" /> in the free shear, where it
            correctly captures the spreading rate of the recirculating mixing layer. That the
            standard <M math="k" />–<M math="\varepsilon" /> run with scalable wall functions
            reproduces essentially the same solution is consistent with this picture: downstream
            recovery in this geometry is dominated by free-shear mixing, where the two closures are
            formally equivalent.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The streamwise reattachment length on the lower wall shall fall within{' '}
            <M math="x_r/h \in [8, 9]" />, and the velocity profiles at the reported axial stations
            shall match the experimental data of Ruck &amp; Makiola (1993) in graphical agreement.
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
