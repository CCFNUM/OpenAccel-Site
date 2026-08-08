import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function CircularArcContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC006' },
        { label: 'Reference',    value: 'Favini et al. (1996)' },
        { label: 'Solver mode',  value: 'Steady-state, segregated (SIMPLEC)' },
        { label: 'Physics',      value: '2-D inviscid compressible Euler, ideal gas' },
        { label: 'Mach numbers', value: 'M_in = 0.5 (subsonic) and 0.675 (transonic)' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          Inviscid compressible flow over a circular-arc bump validates the pressure-correction algorithm
          with ideal-gas thermodynamics across two flow regimes within a single geometry. At M<sub>in</sub> = 0.5
          the flow remains fully subsonic and the Mach distribution along the walls is nearly symmetric about
          the bump crest. At M<sub>in</sub> = 0.675 the flow accelerates to locally supersonic conditions above
          the crest, forming a supersonic pocket that terminates in a recompression shock — the classical transonic
          test for the unified incompressible/compressible pressure-based scheme of Darwish et al.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/bump.svg"
          alt="Circular bump geometry"
          caption="Computational domain for flow over a circular bump. Channel height H = 1 m, length L = 3 m, arc height-to-chord ratio h/C = 0.1."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="Bump — shared setup for both Mach numbers"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Channel size',       value: 'L = 3 m, H = 1 m, h/C = 0.1' },
              { label: 'Mesh',               value: '31 018 nodes / 30 000 elements' },
            ]},
            { heading: 'Fluid properties (ideal gas)', rows: [
              { label: 'Molar mass M',       value: '28.96 g/mol' },
              { label: 'c_p',                value: '1004.4 J/(kg·K)' },
              { label: 'Thermal conductivity', value: 'λ = 0.0261 W/(m·K)' },
              { label: 'Dynamic viscosity',  value: 'μ = 10⁻¹⁶ Pa·s (Euler approximation)' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Outlet',             value: 'Zero-gauge static pressure' },
              { label: 'Bump surface, top wall', value: 'Free-slip walls' },
              { label: 'Spanwise faces',     value: 'Symmetry' },
            ]},
            { heading: 'Numerics (shared)', rows: [
              { label: 'Under-relaxation',   value: 'λᵛ = 0.9' },
              { label: 'Pseudo-time-scale',  value: 'Δt_ps = 10⁻² s' },
              { label: 'Pressure correction', value: 'HYPRE / BoomerAMG' },
            ]},
          ]}
        />

        <h3>Subsonic case (M<sub>in</sub> = 0.5)</h3>
        <SetupTable
          caption="Subsonic bump — case-specific parameters"
          groups={[
            { heading: 'Inlet', rows: [
              { label: 'Total pressure',     value: 'P_t,in = 101 325 + 18 871.4 Pa' },
              { label: 'Total temperature',  value: 'T_t,in = 315.01 K' },
              { label: 'Flow direction',     value: '(1, 0, 0)' },
              { label: 'Initial u, T',       value: '173.64 m/s, 300 K' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',          value: 'SIMPLEC (consistent: true)' },
              { label: 'Energy equation',    value: 'Thermal-energy form' },
              { label: 'Advection',          value: 'First-order upwind' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / max iters', value: '10⁻⁶ / 1000' },
            ]},
          ]}
        />

        <h3>Transonic case (M<sub>in</sub> = 0.675)</h3>
        <SetupTable
          caption="Transonic bump — case-specific parameters"
          groups={[
            { heading: 'Inlet', rows: [
              { label: 'Total pressure',     value: 'P_t,in = 101 325 + 36 173.5 Pa' },
              { label: 'Total temperature',  value: 'T_t,in = 327.35 K' },
              { label: 'Flow direction',     value: '(1, 0, 0)' },
              { label: 'Initial u, T',       value: '234.415 m/s, 300 K' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Energy equation',    value: 'Total-energy form (required for mixed sub/supersonic flow)' },
              { label: 'Advection',          value: 'High-resolution Barth–Jespersen' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / max iters', value: '10⁻⁸ / 1000' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <TutorialFigure
          src="/figures/mach%20distribution.png"
          alt="Subsonic Mach wall distribution"
          caption="Subsonic case (M_in = 0.5): predicted Mach number along the upper and lower walls compared with Favini et al. (1996)."
        />
        <TutorialFigure
          src="/figures/sonic.svg"
          alt="Transonic Mach wall distribution"
          caption="Transonic case (M_in = 0.675): predicted Mach number along the upper and lower walls compared with Favini et al. The recompression shock at x ≈ 1.7 m is captured."
        />
        <TutorialSubfigureStack
          items={[
            { src: '/figures/contour-subsonic.svg', alt: 'Subsonic Mach contour', subcaption: 'Subsonic (M_in = 0.5): smooth acceleration over the crest, flow remains subsonic throughout.' },
            { src: '/figures/contour_trans.svg',    alt: 'Transonic Mach contour', subcaption: 'Transonic (M_in = 0.675): supersonic pocket above the crest terminating in a recompression shock.' },
          ]}
          caption="Mach number contours for the bump cases."
        />
      </section>

      <Takeaway>
        At M<sub>in</sub> = 0.5 the wall Mach distributions overlap the Favini reference almost perfectly, confirming
        that the pressure-correction scheme handles compressible inertia correctly via the ψ-augmentation of the
        pressure equation. At M<sub>in</sub> = 0.675 the recompression shock requires the total-energy form — using
        the thermal-energy form here would smear the shock through neglected kinetic-energy work. The shock
        location and strength match the reference closely, demonstrating correct shock capturing within the unified
        incompressible/compressible framework.
      </Takeaway>

      <AcceptanceCriterion>
        For both Mach numbers, the wall Mach distributions shall match the reference data of Favini et al. in
        graphical agreement, including the location and strength of the transonic recompression shock at
        M<sub>in</sub> = 0.675.
      </AcceptanceCriterion>
    </>
  );
}
