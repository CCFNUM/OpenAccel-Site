import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { M } from '@/components/tutorial/Equation';

// Letter-landscape contour plates (792×612 pt → cm); source trim 3 5 3 2 (L B R T).
const LAND: [number, number] = [27.94, 21.59];
const CONTOUR_TRIM: [number, number, number, number] = [3, 5, 3, 2];

export function CircularArcContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC006' },
        { label: 'Reference',    value: 'Favini et al. (1996)' },
        { label: 'Solver mode',  value: 'Steady-state, segregated (SIMPLEC)' },
        { label: 'Physics / models', value: '2-D inviscid compressible Euler, ideal gas' },
        { label: 'Mach numbers', value: <><M math="\mathit{Ma}_{\mathrm{in}} = 0.5" /> (subsonic) and <M math="0.675" /> (transonic)</> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          Inviscid compressible flow over a circular-arc bump validates the pressure-correction
          algorithm with ideal-gas thermodynamics across two flow regimes within a single geometry.
          At <M math="\mathit{Ma}_{\mathrm{in}} = 0.5" /> the flow remains fully subsonic and the
          Mach distribution along the walls is nearly symmetric about the bump crest. At{' '}
          <M math="\mathit{Ma}_{\mathrm{in}} = 0.675" /> the flow accelerates to locally supersonic
          conditions above the crest, forming a supersonic pocket that terminates in a recompression
          shock — the classical transonic test for the unified incompressible/compressible
          pressure-based scheme of Darwish et al.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src={`${import.meta.env.BASE_URL}figures/bump.svg`}
          alt="Circular bump geometry"
          caption={<>Computational domain for flow over a circular bump. Channel height{' '}
            <M math="H = 1~\mathrm{m}" />, length <M math="L = 3~\mathrm{m}" />, arc
            height-to-chord ratio <M math="h/C = 0.1" />.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Bump — shared setup for both Mach numbers."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Channel size',       value: <><M math="L = 3~\mathrm{m}" />, <M math="H = 1~\mathrm{m}" />, <M math="h/C = 0.1" /></> },
              { label: 'Mesh',               value: <><M math="31\,018" /> nodes / <M math="30\,000" /> elements</> },
            ]},
            { heading: 'Fluid properties (ideal gas)', rows: [
              { label: <>Molar mass <M math="M" /></>,       value: <M math="28.96~\mathrm{g/mol}" /> },
              { label: <M math="c_p" />,                value: <M math="1004.4~\mathrm{J\,kg^{-1}\,K^{-1}}" /> },
              { label: 'Thermal conductivity', value: <M math="\lambda = 0.0261~\mathrm{W\,m^{-1}\,K^{-1}}" /> },
              { label: 'Dynamic viscosity',  value: <><M math="\mu = 10^{-16}~\mathrm{Pa\,s}" /> (Euler approximation)</> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Outlet',             value: 'Zero-gauge static pressure' },
              { label: 'Bump surface, top wall', value: 'Free-slip walls' },
              { label: 'Spanwise faces',     value: 'Symmetry' },
            ]},
            { heading: 'Numerics (shared)', rows: [
              { label: 'Under-relaxation',   value: <M math="\lambda^v = 0.9" /> },
              { label: 'Pseudo-time-scale',  value: <M math="\Delta t_{\mathrm{ps}} = 10^{-2}~\mathrm{s}" /> },
              { label: 'Pressure correction', value: 'HYPRE / BoomerAMG' },
            ]},
          ]}
        />

        <h3>Subsonic case (<M math="\mathit{Ma}_{\mathrm{in}} = 0.5" />)</h3>
        <SetupTable label="Table 2"
          caption="Subsonic bump — case-specific parameters."
          groups={[
            { heading: 'Inlet', rows: [
              { label: 'Total pressure',     value: <M math="P_{t,\mathrm{in}} = 101\,325 + 18\,871.4~\mathrm{Pa}" /> },
              { label: 'Total temperature',  value: <M math="T_{t,\mathrm{in}} = 315.01~\mathrm{K}" /> },
              { label: 'Flow direction',     value: <M math="(1, 0, 0)" /> },
              { label: <>Initial <M math="u, T" /></>,       value: <><M math="173.64~\mathrm{m/s}" />, <M math="300~\mathrm{K}" /></> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',          value: <>SIMPLEC (<code>consistent: true</code>)</> },
              { label: 'Energy equation',    value: 'Thermal-energy form' },
              { label: 'Advection',          value: 'First-order upwind' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / max iters', value: <><M math="10^{-6}" /> / <M math="1000" /></> },
            ]},
          ]}
        />

        <h3>Transonic case (<M math="\mathit{Ma}_{\mathrm{in}} = 0.675" />)</h3>
        <SetupTable label="Table 3"
          caption="Transonic bump — case-specific parameters."
          groups={[
            { heading: 'Inlet', rows: [
              { label: 'Total pressure',     value: <M math="P_{t,\mathrm{in}} = 101\,325 + 36\,173.5~\mathrm{Pa}" /> },
              { label: 'Total temperature',  value: <M math="T_{t,\mathrm{in}} = 327.35~\mathrm{K}" /> },
              { label: 'Flow direction',     value: <M math="(1, 0, 0)" /> },
              { label: <>Initial <M math="u, T" /></>,       value: <><M math="234.415~\mathrm{m/s}" />, <M math="300~\mathrm{K}" /></> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Energy equation',    value: 'Total-energy form (required for mixed sub/supersonic flow)' },
              { label: 'Advection',          value: 'High-resolution Barth–Jespersen' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / max iters', value: <><M math="10^{-8}" /> / <M math="1000" /></> },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <TutorialFigure label="Figure 2"
          src={`${import.meta.env.BASE_URL}figures/mach%20distribution.svg`}
          alt="Subsonic Mach wall distribution"
          caption={<>Subsonic case (<M math="\mathit{Ma}_{\mathrm{in}} = 0.5" />): predicted Mach
            number along the upper and lower walls compared with Favini et al. (1996).</>}
        />
        <TutorialFigure label="Figure 3"
          src={`${import.meta.env.BASE_URL}figures/sonic.svg`}
          alt="Transonic Mach wall distribution"
          caption={<>Transonic case (<M math="\mathit{Ma}_{\mathrm{in}} = 0.675" />): predicted Mach
            number along the upper and lower walls compared with Favini et al. The recompression
            shock at <M math="x \approx 1.7~\mathrm{m}" /> is captured.</>}
        />
        <TutorialSubfigureStack label="Figure 4"
          items={[
            { src: '/figures/contour-subsonic.svg', alt: 'Subsonic Mach contour', subcaption: <>Subsonic (<M math="\mathit{Ma}_{\mathrm{in}} = 0.5" />): smooth acceleration over the crest, flow remains subsonic throughout.</>, trim: CONTOUR_TRIM, trimBase: LAND },
            { src: '/figures/contour_trans.svg',    alt: 'Transonic Mach contour', subcaption: <>Transonic (<M math="\mathit{Ma}_{\mathrm{in}} = 0.675" />): supersonic pocket above the crest terminating in a recompression shock.</>, trim: CONTOUR_TRIM, trimBase: LAND },
          ]}
          caption="Mach number contours for the bump cases."
        />
      </section>

      <Takeaway>
        At <M math="\mathit{Ma}_{\mathrm{in}} = 0.5" /> the wall Mach distributions overlap the
        Favini reference almost perfectly, confirming that the pressure-correction scheme handles
        compressible inertia correctly via the <M math="\psi" />-augmentation of the pressure
        equation. At <M math="\mathit{Ma}_{\mathrm{in}} = 0.675" /> the recompression shock requires
        the total-energy form — using the thermal-energy form here would smear the shock through
        neglected kinetic-energy work. The shock location and strength match the reference closely,
        demonstrating correct shock capturing within the unified incompressible/compressible
        framework.
      </Takeaway>

      <AcceptanceCriterion>
        For both Mach numbers, the wall Mach distributions shall match the reference data of Favini
        et al. in graphical agreement, including the location and strength of the transonic
        recompression shock at <M math="\mathit{Ma}_{\mathrm{in}} = 0.675" />.
      </AcceptanceCriterion>
    </>
  );
}
