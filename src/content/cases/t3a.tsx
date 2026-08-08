import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { Equation, M } from '@/components/tutorial/Equation';

const F = (name: string) => `/figures/${name}.svg`;

/** Filename has a typo in the source ("flateplate") — preserved as-is. */
const uPlusFig = F('u+-flateplate');

export function T3AContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',          value: 'VC005' },
        { label: 'References',       value: 'Roach (1992); Savill (1993); Langtry & Menter (2009)' },
        { label: 'Solver mode',      value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics / models', value: <>2-D incompressible RANS, <M math="\gamma" />–<M math="\mathit{Re}_{\theta t}" /> Transition SST</> },
        { label: 'Inlet conditions', value: <><M math="U_\infty = 5.4~\mathrm{m/s}" />, <M math="Tu = 3.3\%" /></> },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem description</h2>
        <p className="mb-4">
          The ERCOFTAC T3A test case is a zero-pressure-gradient flat plate in elevated free-stream
          turbulence, deliberately designed to isolate <em>bypass</em> transition from the natural
          Tollmien–Schlichting route. It is the canonical benchmark for the{' '}
          <M math="\gamma" />–<M math="\mathit{Re}_{\theta t}" /> transition model and verifies that
          the transport equations for intermittency <M math="\gamma" /> and onset momentum-thickness
          Reynolds number <M math="\widetilde{\mathit{Re}}_{\theta t}" /> correctly predict the
          laminar-to-turbulent transition location and the subsequent recovery to a fully developed
          turbulent boundary layer.
        </p>
        <p>
          A successful validation requires the solver to reproduce three distinct flow regimes in
          sequence: a Blasius laminar boundary layer upstream of transition, a sharp rise in skin
          friction through the transitional zone, and convergence toward the White turbulent
          correlation downstream.
        </p>
      </section>

      <section id="geometry" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src={F('flatplate')}
          alt="ERCOFTAC T3A flat plate schematic"
          caption={<>ERCOFTAC T3A flat plate (not to scale). The free-stream turbulence intensity{' '}
            <M math="Tu = 3.3\%" /> triggers bypass transition on the plate surface.</>}
          width="wide"
        />
      </section>

      <section id="setup" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">3. Setup</h2>
        <p className="mb-4 text-sm text-[var(--text-dim)]">
          The inlet turbulence quantities are computed from the prescribed turbulence intensity{' '}
          <M math="Tu = 3.3\%" /> and eddy-viscosity ratio of 12:
        </p>
        <Equation
          math={String.raw`k = \tfrac{3}{2}(Tu \cdot U_\infty)^2 = 0.0476~\mathrm{m^2\,s^{-2}}, \qquad \omega = \frac{k^{1/2}}{C_\mu^{1/4}\,\ell_t} = 264.63~\mathrm{s^{-1}}`}
        />

        <SetupTable label="Table 1"
          caption="T3A flat plate — complete case setup."
          groups={[
            {
              heading: 'Geometry and mesh',
              rows: [
                { label: <>Plate length <M math="L" /></>, value: <><M math="3~\mathrm{m}" />, <M math="x_{\mathrm{LE}} = 0.04~\mathrm{m}" /> to <M math="x = 3.04~\mathrm{m}" /></> },
                { label: <>Domain height <M math="H" /></>, value: <M math="1~\mathrm{m}" /> },
                { label: 'Mesh',             value: <><M math="54\,496" /> nodes / <M math="26\,820" /> elements</> },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: <>Density <M math="\rho" /></>,           value: <M math="1.0~\mathrm{kg\,m^{-3}}" /> },
                { label: <>Dynamic viscosity <M math="\mu" /></>,  value: <M math="1.5\times10^{-5}~\mathrm{Pa\,s}" /> },
                { label: 'Free-stream velocity',  value: <M math="U_\infty = 5.4~\mathrm{m/s}" /> },
                { label: 'Turbulence intensity',  value: <M math="Tu = 3.3\%" /> },
                { label: 'Eddy-viscosity ratio',  value: <M math="\mu_t/\mu = 12" /> },
              ],
            },
            {
              heading: 'Boundary conditions',
              rows: [
                { label: 'Plate (downstream of LE)', value: 'No-slip wall' },
                { label: 'Top, upstream of LE',      value: 'Free-slip wall' },
                { label: 'Outlet',                   value: 'Zero-gauge static pressure' },
                { label: 'Front, back',              value: 'Symmetry' },
              ],
            },
            {
              heading: 'Numerics',
              rows: [
                { label: 'Algorithm',                  value: 'SIMPLE (steady-state)' },
                { label: 'Advection (momentum)',        value: 'High-resolution Barth–Jespersen' },
                { label: 'Advection (turb./trans.)',    value: 'First-order upwind' },
              ],
            },
            {
              heading: 'Convergence',
              rows: [
                { label: 'RMS residual target', value: <M math="10^{-12}" /> },
              ],
            },
          ]}
        />
      </section>

      <section id="results" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">4. Results</h2>
        <p className="mb-4">
          The principal validation quantity is the skin-friction coefficient
        </p>
        <Equation
          math={String.raw`C_f = \frac{\tau_w}{\tfrac{1}{2}\rho U_\infty^2}`}
          label="1"
        />
        <p className="mb-4 text-sm text-[var(--text-dim)]">
          plotted against the local Reynolds number <M math="\mathit{Re}_x = \rho U_\infty x / \mu" />.
          Reference correlations are the Blasius laminar solution{' '}
          <M math="C_f = 0.664\,\mathit{Re}_x^{-1/2}" /> and the White turbulent correlation{' '}
          <M math="C_f = 0.455 / \ln^2(0.06\,\mathit{Re}_x)" />.
        </p>

        <TutorialFigure label="Figure 2"
          src={F('Cf-flatplate')}
          alt="Skin-friction coefficient vs local Reynolds number"
          caption={<>Skin-friction coefficient <M math="C_f" /> vs. local Reynolds number{' '}
            <M math="\mathit{Re}_x" />. The three regimes — Blasius laminar, transition rise, and
            White turbulent — are clearly resolved.</>}
          width="normal"
        />

        <DataTable
          label="Table 2"
          caption="Identified transition extent on the T3A plate."
          headers={['Event', <M math="\mathit{Re}_x" />, <M math="x~[\mathrm{m}]" />]}
          rows={[
            [<>Transition onset (min of <M math="C_f" />)</>, <M math="\approx 1.5\times10^5" />, <M math="\approx 0.42" />],
            [<>Transition complete (peak of <M math="C_f" />)</>, <M math="\approx 3.0\times10^5" />, <M math="\approx 0.83" />],
          ]}
        />

        <p className="mb-6 text-sm text-[var(--text-dim)]">
          To inspect the boundary-layer structure across the three regimes, velocity profiles are
          extracted at three streamwise stations and presented in inner wall units, with{' '}
          <M math="y^+ = \rho u_\tau y / \mu" />, <M math="u^+ = u/u_\tau" />, and{' '}
          <M math="u_\tau = \sqrt{\tau_w/\rho}" />. At the turbulent station the profile is expected
          to follow <M math="u^+ = y^+" /> in the viscous sublayer and{' '}
          <M math="u^+ = (1/\kappa)\ln y^+ + B" /> with <M math="\kappa = 0.41" />, <M math="B = 5" />{' '}
          in the log layer.
        </p>

        <TutorialSubfigureRow label="Figure 3"
          left={{
            src: uPlusFig,
            alt: 'u+ vs y+ at three streamwise stations',
            subcaption: <><M math="u^+" /> vs. <M math="y^+" /> at three streamwise stations:{' '}
              <M math="x = 0.295~\mathrm{m}" /> (laminar), <M math="0.659~\mathrm{m}" /> (transitional),{' '}
              <M math="1.295~\mathrm{m}" /> (turbulent).</>,
          }}
          right={{
            src: F('flatplate-1.495'),
            alt: 'Turbulent station u+ profile',
            subcaption: <>Turbulent station <M math="x = 1.495~\mathrm{m}" />, with viscous sublayer
              and log-law references overlaid.</>,
          }}
          caption="Non-dimensional velocity profiles for the T3A plate."
        />

        <Takeaway>
          <p>
            The transition zone identified from the <M math="C_f" /> minimum and peak spans{' '}
            <M math="0.42~\text{m} \le x \le 0.83~\text{m}" />, matching the ERCOFTAC reference
            window for T3A. Downstream of transition, the inner-scaled velocity profile collapses
            onto the classical viscous-sublayer and log-law relations, confirming both the
            friction-velocity recovery and the model's correct asymptotic behaviour.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The skin-friction coefficient shall (i) follow the Blasius laminar correlation upstream
            of transition, (ii) rise sharply through a transition zone identifiable from the{' '}
            <M math="C_f" /> minimum and peak, and (iii) approach the White turbulent correlation
            downstream of transition. The turbulent-station velocity profile shall obey{' '}
            <M math="u^+ = y^+" /> for <M math="y^+ < 5" /> and{' '}
            <M math="u^+ = (1/0.41)\ln y^+ + 5" /> for <M math="y^+ > 30" />.
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
