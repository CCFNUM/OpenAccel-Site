import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function ForwardStepContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC015' },
        { label: 'References',   value: 'Woodward & Colella (1984); normal-shock relations at M = 3 (analytical)' },
        { label: 'Solver mode',  value: 'Transient, segregated (SIMPLEC)' },
        { label: 'Physics',      value: '2-D inviscid compressible Euler, ideal gas, total energy' },
        { label: 'Inflow Mach',  value: 'M∞ = 3' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          The supersonic forward-facing step closes the validation suite by exercising the compressible solver
          under shock-dominated conditions. A uniform Mach-3 inflow encounters a step protruding from the lower
          wall; because the deflection angle is 90° — far in excess of the maximum attached-shock deflection
          θ<sub>max</sub> ≈ 34° for M = 3 — a curved <em>detached bow shock</em> stands off ahead of the step,
          with a small subsonic pocket immediately behind it.
        </p>
        <p>
          The case is run as a transient simulation: the bow shock forms, propagates upstream, reflects from the
          upper boundary, and undergoes a transition to Mach reflection before the wave system settles. The
          development of the wave system is itself a validation target.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/forward.png"
          alt="Supersonic forward-facing step geometry"
          caption="Supersonic forward-facing step (not to scale). The detached bow shock generated ahead of the step face is indicated schematically."
        />
      </section>

      <section id="time">
        <h2>3. Non-Dimensional Time</h2>
        <p>Results are reported in the non-dimensionalisation of Woodward and Colella:</p>
        <Equation math="t^{*} = \frac{t\,u_\infty}{L}" />
        <div className="my-6 overflow-x-auto rounded-lg border border-[var(--hairline)]">
          <table className="w-full text-sm border-collapse">
            <caption className="text-left text-xs font-mono text-[var(--text-dim)] px-4 py-2 border-b border-[var(--hairline)] bg-[var(--surface-2)] caption-top">
              Correspondence between dimensionless time t* and physical time.
            </caption>
            <thead>
              <tr className="bg-[var(--surface-2)]">
                {['Stage of development', 't*', 'Physical time [s]'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-mono text-[var(--cold)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Bow shock forming, strongly curved',   '0.5',  '1.440×10⁻³'],
                ['Reflection established at upper wall', '2.0',  '5.759×10⁻³'],
                ['Mach reflection, triple point migrating', '4.0', '1.152×10⁻²'],
                ['Quasi-steady wave system',             '13.5', '3.887×10⁻²'],
              ].map(([s, t, p], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-stripe)]'}>
                  <td className="px-4 py-2 text-[var(--text-dim)] font-medium">{s}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{t}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="setup">
        <h2>4. Setup</h2>
        <SetupTable
          caption="Supersonic forward-facing step — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Channel size',       value: 'L = 3 m, H = 1 m' },
              { label: 'Step location',      value: 'x_s = 0.6 m, height h = 0.2 m' },
              { label: 'Mesh',               value: '21 351 nodes / 21 000 hexahedral elements' },
            ]},
            { heading: 'Fluid properties (ideal gas, air)', rows: [
              { label: 'Molar mass M',       value: '28.96 g/mol' },
              { label: 'Specific heat c_p',  value: '1004.4 J/(kg·K)' },
              { label: 'Dynamic viscosity',  value: 'μ = 10⁻¹⁶ Pa·s (Euler approximation)' },
            ]},
            { heading: 'Inflow (M∞ = 3)', rows: [
              { label: 'u∞',                 value: '1041.84 m/s' },
              { label: 'p∞',                 value: '101 325 Pa (gauge 0)' },
              { label: 'T∞',                 value: '300 K' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',              value: 'Supersonic, velocity components and static pressure specified' },
              { label: 'Outlet',             value: 'Supersonic (all variables extrapolated)' },
              { label: 'Top, bottom',        value: 'Symmetry' },
              { label: 'Step surface',       value: 'Inviscid wall' },
            ]},
            { heading: 'Time integration', rows: [
              { label: 'Total time',         value: '4×10⁻² s (t* = 13.89)' },
              { label: 'Time step',          value: 'Δt = 2.5×10⁻⁶ s (constant), 16 000 steps' },
              { label: 'Transient scheme',   value: 'Second-order backward Euler (BDF2)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',          value: 'SIMPLEC (consistent: true)' },
              { label: 'Energy equation',    value: 'Total-energy form' },
              { label: 'Advection',          value: 'High resolution (Barth–Jespersen limiter)' },
              { label: 'Under-relaxation',   value: 'λᵛ = 0.6, λʰ = 0.9' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <p>Development of the wave system at four instants — Mach number (left) and pressure (right):</p>

        <TutorialSubfigureRow
          left={{ src: '/figures/fs-0.5-mach.png',  alt: 'Mach t*=0.5',  subcaption: 'Mach number, t* = 0.5' }}
          right={{ src: '/figures/fs-0.5-press.png', alt: 'Pressure t*=0.5', subcaption: 'Pressure, t* = 0.5' }}
          caption="t* = 0.5: bow shock forming, strongly curved."
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/fs-1-mach.png',  alt: 'Mach t*=2.0',  subcaption: 'Mach number, t* = 2.0' }}
          right={{ src: '/figures/fs-1-press.png', alt: 'Pressure t*=2.0', subcaption: 'Pressure, t* = 2.0' }}
          caption="t* = 2.0: reflection established at upper wall."
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/fs-2-mach.png',  alt: 'Mach t*=4.0',  subcaption: 'Mach number, t* = 4.0' }}
          right={{ src: '/figures/fs-2-press.png', alt: 'Pressure t*=4.0', subcaption: 'Pressure, t* = 4.0' }}
          caption="t* = 4.0: Mach reflection, triple point migrating."
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/fs-4-mach.png',  alt: 'Mach t*=13.5',  subcaption: 'Mach number, t* = 13.5' }}
          right={{ src: '/figures/fs-4-press.png', alt: 'Pressure t*=13.5', subcaption: 'Pressure, t* = 13.5' }}
          caption="t* = 13.5: quasi-steady wave system."
        />
      </section>

      <Takeaway>
        The sequence reproduces the stages reported for this benchmark in the literature. At t* = 0.5 a detached
        bow shock has formed; by t* = 2.0 it has reflected from the upper boundary; between t* = 2.0 and 4.0 the
        reflection transitions to a Mach configuration with a visible slip line — a consequence of the
        high-resolution advection scheme. By t* = 13.5 the wave system has settled into a quasi-steady configuration.
        The small recirculation immediately downstream of the step corner is a well-documented inviscid singularity
        and does not affect the bow-shock topology.
      </Takeaway>

      <AcceptanceCriterion>
        The shock topology shall remain detached, with the bow shock standing ahead of the step face and
        transitioning to a Mach reflection at the upper boundary, and the sequence of development shall reproduce
        the stages documented in the reference literature.
      </AcceptanceCriterion>
    </>
  );
}
