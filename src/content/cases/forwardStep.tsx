import { TutorialSubfigureRow, TutorialFigure } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, Note, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// Source figure page size (letter, 612×792 pt → cm). The source LaTeX trim for
// every fs-*-mach/press plate is 2cm 10cm 1cm 6cm (L B R T); per DESIGN-BRIEF
// §25.3 the framing is corrected to take LESS off the bottom (keep the contour
// colourbar) and MORE off the top (drop empty space): 2cm 6cm 1cm 10cm.
const FS_BASE: [number, number] = [21.59, 27.94];
const FS_TRIM: [number, number, number, number] = [2, 6, 1, 10];

export function ForwardStepContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',        value: 'VC015' },
        { label: 'Reference',      value: <>Emery (1968); Woodward &amp; Colella (1984); normal-shock relations at <M math="\mathit{Ma} = 3" /> (analytical)</> },
        { label: 'Solver mode',    value: 'Transient, segregated (SIMPLEC)' },
        { label: 'Physics / models', value: '2-D inviscid compressible Euler, ideal gas, total energy' },
        { label: 'Inflow Mach',    value: <M math="\mathit{Ma}_\infty = 3" /> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          The supersonic forward-facing step closes the validation suite by exercising the
          compressible solver under shock-dominated conditions. First proposed by Emery (1968) and
          later established as a canonical high-resolution benchmark by Woodward and Colella (1984),
          the problem sends a uniform Mach-3 inflow against a step protruding from the lower wall.
          Because the deflection angle is <M math="90^\circ" /> &mdash; far in excess of the maximum
          attached-shock deflection <M math="\theta_{\max} \approx 34^\circ" /> for{' '}
          <M math="\mathit{Ma} = 3" /> &mdash; the shock cannot remain attached to the step face.
          Instead, a curved <em>detached bow shock</em> stands off ahead of the step, with a small
          subsonic pocket immediately behind it.
        </p>
        <p>
          Although a quasi-steady shock topology is eventually reached, the establishment of that
          topology is genuinely unsteady: the bow shock forms, propagates upstream, reflects from
          the upper boundary, and undergoes a transition to Mach reflection before the wave system
          settles. The case is therefore run as a transient simulation, and the development of the
          wave system is itself a validation target &mdash; it is the feature for which this
          benchmark is most widely used in the literature.
        </p>
        <p>
          The case additionally tests the total-energy formulation under steep gradients and the
          unified incompressible/compressible pressure-correction algorithm in a regime where
          compressible inertia dominates.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure
          src="/figures/forward.png"
          alt="Supersonic forward-facing step geometry"
          width="full"
          label="Figure 1"
          caption={<>Supersonic forward-facing step <em>(not to scale)</em>. The detached bow shock generated ahead of the step face is indicated schematically.</>}
        />
      </section>

      <section id="time">
        <h2>3. Non-dimensional time</h2>
        <p>
          Results in the literature for this benchmark are almost always reported in the
          non-dimensionalisation of Woodward and Colella, in which the freestream sound speed is
          unity. To permit direct comparison, times in this chapter are reported as the
          dimensionless group
        </p>
        <Equation math="t^{*} = \frac{t\,u_\infty}{L}" />
        <p>
          that is, the number of channel flow-through times elapsed. In the reference
          non-dimensionalisation <M math="u_\infty = 3" /> and <M math="L = 3" />, so{' '}
          <M math="u_\infty/L = 1" /> and <M math="t^{*}" /> is numerically equal to the times
          quoted in that literature. In the present dimensional setup{' '}
          <M math="u_\infty/L = 347.28~\mathrm{s^{-1}}" />, giving the correspondence below.
        </p>

        <DataTable
          label="Table 1"
          caption={<>Correspondence between the dimensionless time <M math="t^{*}" /> used throughout this case and the physical time of the present simulation.</>}
          headers={['Stage of development', <M math="t^{*}" />, 'Physical time [s]']}
          ruleBefore={[5]}
          rows={[
            ['Bow shock forming, strongly curved', '0.5', <M math="1.440\times10^{-3}" />],
            ['Shock reaching upper wall, reflection begins', '1.0', <M math="2.880\times10^{-3}" />],
            ['Mach reflection established at upper wall', '2.0', <M math="5.759\times10^{-3}" />],
            ['Triple point migrated, slip line rolling up', '4.0', <M math="1.152\times10^{-2}" />],
            ['Quasi-steady wave system (snapshot shown)', '14.0', <M math="4.031\times10^{-2}" />],
            ['Total simulated time', '15.63', <M math="4.500\times10^{-2}" />],
          ]}
        />
      </section>

      <section id="setup">
        <h2>4. Setup</h2>
        <SetupTable
          label="Table 2"
          caption="Supersonic forward-facing step — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Channel size',       value: <><M math="L = 3~\mathrm{m}" />, <M math="H = 1~\mathrm{m}" /></> },
              { label: 'Step location',      value: <><M math="x_s = 0.6~\mathrm{m}" />, height <M math="h = 0.2~\mathrm{m}" /></> },
              { label: 'Mesh',               value: '21 351 nodes / 21 000 hexahedral elements' },
              { label: 'Decomposition',      value: <>Automatic, recursive coordinate bisection (<code>rcb</code>)</> },
            ]},
            { heading: 'Fluid properties (ideal gas, air)', rows: [
              { label: <>Molar mass <M math="M" /></>,      value: '28.96 g/mol' },
              { label: <>Specific heat <M math="c_p" /></>, value: <M math="1004.4~\mathrm{J\,kg^{-1}\,K^{-1}}" /> },
              { label: 'Thermal conductivity', value: <M math="\lambda = 2.61\times10^{-2}~\mathrm{W\,m^{-1}\,K^{-1}}" /> },
              { label: 'Dynamic viscosity',  value: <><M math="\mu = 10^{-16}~\mathrm{Pa\,s}" /> (Euler approximation)</> },
            ]},
            { heading: <>Inflow (<M math="\mathit{Ma}_\infty = 3" />)</>, rows: [
              { label: <M math="u_\infty" />,  value: '1041.84 m/s' },
              { label: <M math="p_\infty" />,  value: <>101 325 Pa (gauge <M math="0" />)</> },
              { label: <M math="T_\infty" />,  value: '300 K' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',              value: 'Supersonic, velocity components and static pressure specified' },
              { label: 'Outlet',             value: 'Supersonic (all variables extrapolated)' },
              { label: 'Top, bottom',        value: 'Symmetry' },
              { label: 'Step surface',       value: 'Inviscid wall' },
              { label: 'Reference pressure', value: <M math="p_{\mathrm{ref}} = 101\,325~\mathrm{Pa}" /> },
            ]},
            { heading: 'Time integration', rows: [
              { label: 'Analysis',           value: 'Transient' },
              { label: 'Total time',         value: <><M math="4.5\times10^{-2}~\mathrm{s}" /> (<M math="t^{*} = 15.63" />)</> },
              { label: 'Time step',          value: <><M math="\Delta t = 2.5\times10^{-6}~\mathrm{s}" /> (constant), 18 000 steps</> },
              { label: 'Transient scheme',   value: 'First-order backward Euler' },
              { label: 'Output interval',    value: <M math="2.5\times10^{-4}~\mathrm{s}" /> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',          value: <>SIMPLEC (<code>consistent: true</code>)</> },
              { label: 'Energy equation',    value: 'Total-energy form' },
              { label: 'Advection',          value: 'High resolution (Barth–Jespersen limiter)' },
              { label: 'Velocity interpolation', value: <><code>linear_linear</code> (shifted integration point)</> },
              { label: 'Under-relaxation',   value: <><M math="\lambda^{v} = 0.6" />, <M math="\lambda^{h} = 0.6" />, <M math="\lambda^{p} = 0.4" /></> },
              { label: 'Inner iterations',   value: '1–15 per time step' },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Momentum (default)', value: <>PETSc / FGMRES + block-Jacobi (rel. tol. <M math="10^{-4}" />, abs. tol. <M math="10^{-12}" />, 3–30 its.)</> },
              { label: 'Pressure correction', value: <>HYPRE / GMRES + BoomerAMG (rel. tol. <M math="10^{-6}" />, abs. tol. <M math="10^{-12}" />, 3–30 its.)</> },
              { label: 'BoomerAMG settings', value: <>HMIS coarsening, extended<M math="+i" /> interpolation, <M math="\ell_1" /> Gauss–Seidel relaxation, 2 sweeps, strong threshold 0.25, max. 20 levels</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target',         value: <><M math="10^{-6}" /> per time step</> },
            ]},
          ]}
        />
      </section>

      <Note>
        <p><strong style={{ color: 'var(--text)' }}>Note on the numerical settings.</strong></p>
        <p>
          This case is run with the high-resolution advection scheme rather than first-order
          upwind. The limiter resolves the shock over substantially fewer cells and is necessary to
          capture the Mach-reflection structure and the slip line emanating from the triple point,
          neither of which survives the numerical diffusion of a first-order scheme on this grid.
          The consequences for the sampled post-shock state are discussed below.
        </p>
      </Note>

      <section id="results">
        <h2>5. Results</h2>
        <p>
          The figures below present the development of the wave system at the four instants{' '}
          <M math="t^{*} = 0.5,\,1,\,2,\,4" />, with Mach number in the left column and pressure in
          the right. Reading down either column follows the formation of the bow shock, its
          reflection from the upper boundary, and the transition to Mach reflection.
        </p>

        <TutorialSubfigureRow
          left={{ src: '/figures/fs-0.5-mach.png',  alt: 'Mach number, t* = 0.5',  subcaption: <>Mach number, <M math="t^{*} = 0.5" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          right={{ src: '/figures/fs-0.5-press.png', alt: 'Pressure, t* = 0.5', subcaption: <>Pressure, <M math="t^{*} = 0.5" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          caption={<><M math="t^{*} = 0.5" />: bow shock forming, strongly curved.</>}
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/fs-1-mach.png',  alt: 'Mach number, t* = 1.0',  subcaption: <>Mach number, <M math="t^{*} = 1.0" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          right={{ src: '/figures/fs-1-press.png', alt: 'Pressure, t* = 1.0', subcaption: <>Pressure, <M math="t^{*} = 1.0" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          caption={<><M math="t^{*} = 1.0" />: shock reaching upper wall, reflection begins.</>}
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/fs-2-mach.png',  alt: 'Mach number, t* = 2.0',  subcaption: <>Mach number, <M math="t^{*} = 2.0" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          right={{ src: '/figures/fs-2-press.png', alt: 'Pressure, t* = 2.0', subcaption: <>Pressure, <M math="t^{*} = 2.0" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          caption={<><M math="t^{*} = 2.0" />: Mach reflection established at upper wall.</>}
        />
        <TutorialSubfigureRow
          label="Figure 2"
          left={{ src: '/figures/fs-4-mach.png',  alt: 'Mach number, t* = 4.0',  subcaption: <>Mach number, <M math="t^{*} = 4.0" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          right={{ src: '/figures/fs-4-press.png', alt: 'Pressure, t* = 4.0', subcaption: <>Pressure, <M math="t^{*} = 4.0" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          caption={<>Development of the wave system over the forward-facing step at <M math="\mathit{Ma}_\infty = 3" />. Left column: Mach number. Right column: pressure. The final row (<M math="t^{*} = 4.0" />): triple point migrated, slip line rolling up.</>}
        />

        <p>
          The near-steady state reached toward the end of the run, at <M math="t^{*} = 14" />, is
          shown below. The configuration is quasi-steady rather than perfectly steady &mdash; the
          slip line trailing from the triple point continues to shed vortices.
        </p>
        <TutorialSubfigureRow
          label="Figure 3"
          left={{ src: '/figures/fs-14-mach.png',  alt: 'Mach number, t* = 14',  subcaption: <>Mach number, <M math="t^{*} = 14" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          right={{ src: '/figures/fs-14-press.png', alt: 'Pressure, t* = 14', subcaption: <>Pressure, <M math="t^{*} = 14" /></>, trim: FS_TRIM, trimBase: FS_BASE }}
          caption={<>Near-steady wave system over the forward-facing step at <M math="\mathit{Ma}_\infty = 3" />, at <M math="t^{*} = 14" />. Left: Mach number. Right: pressure.</>}
        />
      </section>

      <Takeaway>
        <p>
          <strong style={{ color: 'var(--text)' }}>Development of the wave system.</strong> The
          sequence reproduces the stages long documented for this benchmark (Emery, 1968; Woodward
          &amp; Colella, 1984). At <M math="t^{*} = 0.5" /> a detached bow shock has formed: the{' '}
          <M math="90^\circ" /> turn far exceeds the maximum attached-shock deflection at{' '}
          <M math="\mathit{Ma} = 3" /> (<M math="\theta_{\max}\approx 34^\circ" />), so the shock
          stands off the face and bows toward the upper wall. By <M math="t^{*} = 1.0" /> it has
          strengthened and reached the upper boundary, and reflection begins. By{' '}
          <M math="t^{*} = 2.0" /> the reflection reorganises into a Mach configuration &mdash;
          incident shock, near-normal Mach stem and reflected shock meeting at a triple point, with
          a slip line trailing downstream. By <M math="t^{*} = 4.0" /> the Mach reflection is fully
          developed and a Kelvin&ndash;Helmholtz roll-up is visible along the slip line, structure
          that survives only because of the high-resolution scheme (Barth &amp; Jespersen, 1989).
        </p>
        <p>
          <strong style={{ color: 'var(--text)' }}>Corner region.</strong> The recirculation at the
          step corner is not separation &mdash; the flow is inviscid. The convex corner is a
          singularity of the Euler equations, and the scheme develops a small spurious entropy
          layer there. Following common practice for this benchmark no local correction is applied;
          the artefact stays confined to the corner and does not affect the shock topology.
        </p>
        <p>
          <strong style={{ color: 'var(--text)' }}>Sampled post-shock state.</strong> The
          quantitative normal-shock comparison is withheld. The Barth&ndash;Jespersen limiter is
          not total-variation-diminishing in more than one dimension (Goodman &amp; LeVeque, 1985)
          and overshoots just behind the shock, so a single-point sample is unreliable. That
          acceptance test belongs to the monotone first-order configuration; the present
          high-resolution setup is the one for resolving the wave structure.
        </p>
      </Takeaway>

      <AcceptanceCriterion>
        <p>
          The shock topology shall remain detached, with the bow shock standing ahead of the step
          face and transitioning to a Mach reflection at the upper boundary, and the sequence of
          development shall reproduce the stages documented in the reference literature.
        </p>
        <p>
          The quantitative acceptance test on the post-shock pressure, density and temperature
          ratios &mdash; agreement to within 2% of the analytical normal-shock relations at{' '}
          <M math="\mathit{Ma}_\infty = 3" /> &mdash; applies to the first-order upwind
          configuration and is reinstated once the sampling procedure for the high-resolution
          configuration has been revised.
        </p>
      </AcceptanceCriterion>
    </>
  );
}
