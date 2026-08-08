import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { Equation } from '@/components/tutorial/Equation';

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
        { label: 'Physics',          value: '2-D incompressible RANS, γ–Re_θt Transition SST' },
        { label: 'Inlet conditions', value: 'U∞ = 5.4 m/s, Tu = 3.3%' },
      ]} />

      <section id="problem" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">1. Problem Description</h2>
        <p className="mb-4">
          The ERCOFTAC T3A test case is a zero-pressure-gradient flat plate in elevated free-stream
          turbulence, deliberately designed to isolate <em>bypass</em> transition from the natural
          Tollmien–Schlichting route. It is the canonical benchmark for the γ–Re<sub>θt</sub>{' '}
          transition model and verifies that the transport equations for intermittency γ and onset
          momentum-thickness Reynolds number Re<sub>θt</sub> correctly predict the
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
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure label="Figure 1"
          src={F('flatplate')}
          alt="ERCOFTAC T3A flat plate schematic"
          caption="ERCOFTAC T3A flat plate (not to scale). The free-stream turbulence intensity Tu = 3.3% triggers bypass transition on the plate surface."
          width="wide"
        />
      </section>

      <section id="setup" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">3. Setup</h2>
        <p className="mb-4 text-sm text-[var(--text-dim)]">
          The inlet turbulence quantities are computed from the prescribed turbulence intensity
          Tu = 3.3% and eddy-viscosity ratio of 12:
        </p>
        <Equation
          math={String.raw`k = \tfrac{3}{2}(Tu \cdot U_\infty)^2 = 0.0476\;\text{m}^2/\text{s}^2, \qquad \omega = \frac{k^{1/2}}{C_\mu^{1/4}\,\ell_t} = 264.63\;\text{s}^{-1}`}
        />

        <SetupTable label="Table 1"
          caption="T3A flat plate — complete case setup."
          groups={[
            {
              heading: 'Geometry and mesh',
              rows: [
                { label: 'Plate length L',   value: '3 m, x_LE = 0.04 m to x = 3.04 m' },
                { label: 'Domain height H',  value: '1 m' },
                { label: 'Mesh',             value: '54 496 nodes / 26 820 elements' },
              ],
            },
            {
              heading: 'Fluid properties',
              rows: [
                { label: 'Density ρ',            value: '1.0 kg/m³' },
                { label: 'Dynamic viscosity μ',   value: '1.5 × 10⁻⁵ Pa·s' },
                { label: 'Free-stream velocity',  value: 'U∞ = 5.4 m/s' },
                { label: 'Turbulence intensity',  value: 'Tu = 3.3%' },
                { label: 'Eddy-viscosity ratio',  value: 'μt/μ = 12' },
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
                { label: 'RMS residual target', value: '10⁻¹²' },
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
          plotted against the local Reynolds number Re<sub>x</sub> = ρ U∞ x / μ. Reference
          correlations are the Blasius laminar solution C<sub>f</sub> = 0.664 Re<sub>x</sub>
          <sup>−1/2</sup> and the White turbulent correlation C<sub>f</sub> = 0.455 / ln²(0.06 Re<sub>x</sub>).
        </p>

        <TutorialFigure label="Figure 2"
          src={F('Cf-flatplate')}
          alt="Skin-friction coefficient vs local Reynolds number"
          caption="Skin-friction coefficient C_f vs. local Reynolds number Re_x. The three regimes — Blasius laminar, transition rise, and White turbulent — are clearly resolved."
          width="normal"
        />

        <DataTable
          label="Table 2"
          caption="Identified transition extent on the T3A plate."
          headers={['Event', 'Re_x', 'x [m]']}
          rows={[
            ['Transition onset (min of C_f)', '≈ 1.5 × 10⁵', '≈ 0.42'],
            ['Transition complete (peak of C_f)', '≈ 3.0 × 10⁵', '≈ 0.83'],
          ]}
        />

        <p className="mb-6 text-sm text-[var(--text-dim)]">
          To inspect the boundary-layer structure across the three regimes, velocity profiles are
          extracted at three streamwise stations and presented in inner wall units, with{' '}
          y⁺ = ρ u_τ y / μ, u⁺ = u/u_τ, and u_τ = √(τ_w/ρ). At the turbulent station the profile
          is expected to follow u⁺ = y⁺ in the viscous sublayer and the log law in the outer layer.
        </p>

        <TutorialSubfigureRow label="Figure 3"
          left={{
            src: uPlusFig,
            alt: 'u+ vs y+ at three streamwise stations',
            subcaption: 'u⁺ vs. y⁺ at three streamwise stations: x = 0.295 m (laminar), 0.659 m (transitional), 1.295 m (turbulent).',
          }}
          right={{
            src: F('flatplate-1.495'),
            alt: 'Turbulent station u+ profile',
            subcaption: 'Turbulent station x = 1.495 m, with viscous sublayer and log-law references overlaid.',
          }}
          caption="Non-dimensional velocity profiles for the T3A plate."
        />

        <Takeaway>
          <p>
            The transition zone identified from the <em>C</em><sub>f</sub> minimum and peak spans
            0.42 m ≤ x ≤ 0.83 m, matching the ERCOFTAC reference window for T3A. Downstream of
            transition, the inner-scaled velocity profile collapses onto the classical
            viscous-sublayer and log-law relations, confirming both the friction-velocity recovery
            and the model's correct asymptotic behaviour.
          </p>
        </Takeaway>

        <AcceptanceCriterion>
          <p>
            The skin-friction coefficient shall (i) follow the Blasius laminar correlation upstream
            of transition, (ii) rise sharply through a transition zone identifiable from the{' '}
            <em>C</em><sub>f</sub> minimum and peak, and (iii) approach the White turbulent
            correlation downstream of transition. The turbulent-station velocity profile shall obey
            u⁺ = y⁺ for y⁺ &lt; 5 and u⁺ = (1/0.41) ln y⁺ + 5 for y⁺ &gt; 30.
          </p>
        </AcceptanceCriterion>
      </section>
    </>
  );
}
