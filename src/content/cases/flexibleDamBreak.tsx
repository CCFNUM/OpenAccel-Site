import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { M } from '@/components/tutorial/Equation';

// OpenAccel snapshot plates are letter-landscape (792×612 pt → cm); source trim
// 4cm 1cm 4cm 8cm (L B R T). The Walhorn reference PNGs carry no trim.
const LAND: [number, number] = [27.94, 21.59];
const SNAP_TRIM: [number, number, number, number] = [4, 1, 4, 8];

export function FlexibleDamBreakContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC007' },
        { label: 'Reference',    value: 'Walhorn et al. (2005)' },
        { label: 'Solver mode',  value: 'Transient, segregated; partitioned FSI with Aitken' },
        { label: 'Physics / models', value: '2-D incompressible VoF + ALE + linear elasticity' },
        { label: 'Coupling',     value: <>Aitken <M math="\Delta^2" /> relaxation</> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          The flexible dam-break problem is the most demanding test in this manual: it couples VoF
          free-surface tracking with a moving mesh (ALE) and a partitioned FSI solver, and exercises
          all three under large interface deformations. A water column collapses under gravity,
          sweeps across an air-filled domain, impacts a clamped flexible obstacle, and deforms it.
          The validation target is the time history of the obstacle tip displacement against the
          space–time finite-element reference of Walhorn et al. (2005).
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src={`${import.meta.env.BASE_URL}figures/flelxible_dam_schematic.svg`}
          alt="Flexible dam break schematic"
          caption={<>Flexible dam-break configuration: a water column of dimensions{' '}
            <M math="w \times b = 0.146 \times 0.292~\mathrm{m}" /> sits at the lower-left of a{' '}
            <M math="0.584 \times 0.584~\mathrm{m}" /> domain. A clamped elastic obstacle stands at
            the centre.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Flexible dam-break — complete case setup."
          groups={[
            { heading: 'Geometry', rows: [
              { label: 'Domain',              value: <M math="L = W = 0.584~\mathrm{m}" /> },
              { label: 'Water column',        value: <M math="w \times b = 0.146 \times 0.292~\mathrm{m}" /> },
              { label: 'Obstacle',            value: <><M math="a \times w_{\mathrm{obs}} = 0.08 \times 0.012~\mathrm{m}" />, clamped at base</> },
              { label: 'Initialisation',      value: <code>{'if(x<=0.146 and y<=0.292, 1, 0)'}</code> },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: <>Water <M math="\rho_w" />, <M math="\mu_w" /></>,     value: <><M math="1000~\mathrm{kg\,m^{-3}}" />, <M math="10^{-3}~\mathrm{Pa\,s}" /></> },
              { label: <>Air <M math="\rho_a" />, <M math="\mu_a" /></>,       value: <><M math="1~\mathrm{kg\,m^{-3}}" />, <M math="1.48\times10^{-5}~\mathrm{Pa\,s}" /></> },
              { label: 'Surface tension',     value: <><M math="\sigma = 0.07~\mathrm{N/m}" /> (CSF)</> },
              { label: 'Boussinesq ref. density', value: <M math="1~\mathrm{kg\,m^{-3}}" /> },
            ]},
            { heading: 'Solid properties (total-Lagrangian linear elastic)', rows: [
              { label: <>Density <M math="\rho_s" /></>,        value: <M math="2700~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Young's modulus <M math="E" /></>,   value: <M math="10^6~\mathrm{Pa}" /> },
              { label: <>Poisson's ratio <M math="\nu" /></>,   value: <M math="0" /> },
            ]},
            { heading: 'Body force', rows: [
              { label: 'Gravity',             value: <><M math="g = 9.81~\mathrm{m\,s^{-2}}" /> downward</> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',    value: 'First-order backward Euler' },
              { label: <>Initial <M math="\Delta t" /></>,          value: <><M math="10^{-3}~\mathrm{s}" />, adaptive with <M math="\mathrm{Co}_{\max} = 1" /></> },
              { label: <><M math="\Delta t" /> bounds</>,       value: <M math="[10^{-6},\,1]~\mathrm{s}" /> },
              { label: 'End time',            value: <M math="0.5~\mathrm{s}" /> },
              { label: 'Advection',           value: 'High-resolution Barth–Jespersen' },
              { label: 'VoF FCT',             value: <>Compression level <M math="2" />; <M math="2" /> <M math="\alpha" />-correction sweeps</> },
              { label: 'VoF smoothing',       value: <><M math="3" /> iterations, <M math="\mathrm{Fo} = 0.25" /></> },
              { label: 'Mesh stiffness',      value: <>Inverse-volume (exponent <M math="2" />), reference = initial mesh</> },
              { label: 'Mesh smoothing',      value: <>up to <M math="25" /> iterations per step</> },
            ]},
            { heading: 'FSI coupling', rows: [
              { label: 'Interface type',      value: <>General-connection, search tol. <M math="5\times10^{-4}" /></> },
              { label: 'Acceleration',        value: <>Aitken <M math="\Delta^2" />, <M math="\omega_0 = 0.1" />, <M math="\omega \in [0.01,\,0.5]" /></> },
              { label: 'Pressure sub-iterations', value: <><M math="4" /> per outer loop</> },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'All systems',         value: <>Trilinos / GMRES + ILU (rel. tol. <M math="10^{-2}" />)</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: <><M math="10^{-8}" /> / <M math="5" /> per step</> },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <TutorialFigure label="Figure 2"
          src={`${import.meta.env.BASE_URL}figures/flexibleDam_tipDisplacement.png`}
          alt="Flexible dam tip displacement"
          caption={<>Horizontal tip displacement <M math="\delta_x(t)" /> of the flexible obstacle
            compared with reference results from the literature.</>}
        />

        <p>
          The free-surface snapshots below compare the OpenAccel solution (left) with the space–time
          FEM reference of Walhorn et al. (right) at three instants.
        </p>

        <TutorialSubfigureRow label="Figure 3"
          left={{ src: '/figures/flexDam_openaccel_t015.svg', alt: 'OpenAccel t=0.15s', subcaption: <><M math="t = 0.15~\mathrm{s}" /> (OpenAccel)</>, trim: SNAP_TRIM, trimBase: LAND }}
          right={{ src: '/figures/flexDam_walhorn_t015.png',  alt: 'Walhorn t=0.15s',  subcaption: <><M math="t = 0.15~\mathrm{s}" /> (Walhorn)</> }}
          caption={<>Free surface at <M math="t = 0.15~\mathrm{s}" />.</>}
        />
        <TutorialSubfigureRow label="Figure 4"
          left={{ src: '/figures/flexDam_openaccel_t0185.svg', alt: 'OpenAccel t=0.185s', subcaption: <><M math="t = 0.185~\mathrm{s}" /> (OpenAccel)</>, trim: SNAP_TRIM, trimBase: LAND }}
          right={{ src: '/figures/flexDam_walhorn_t0185.png',  alt: 'Walhorn t=0.185s',  subcaption: <><M math="t = 0.185~\mathrm{s}" /> (Walhorn)</> }}
          caption={<>Free surface at <M math="t = 0.185~\mathrm{s}" />.</>}
        />
        <TutorialSubfigureRow label="Figure 5"
          left={{ src: '/figures/flexDam_openaccel_t025.svg', alt: 'OpenAccel t=0.25s', subcaption: <><M math="t = 0.25~\mathrm{s}" /> (OpenAccel)</>, trim: SNAP_TRIM, trimBase: LAND }}
          right={{ src: '/figures/flexDam_walhorn_t025.png',  alt: 'Walhorn t=0.25s',  subcaption: <><M math="t = 0.25~\mathrm{s}" /> (Walhorn)</> }}
          caption={<>Free surface at <M math="t = 0.25~\mathrm{s}" />.</>}
        />
      </section>

      <Takeaway>
        The tip-displacement history matches the Walhorn reference within graphical agreement across
        the full transient, and the snapshots reproduce the impact, the upward jet, and the secondary
        fall-back. Note the distinctive Aitken trace: the relaxation factor begins at{' '}
        <M math="\omega_0 = 0.1" /> and adapts dynamically as the residual sign changes during the
        impact, which is what allows convergence at the relatively coarse outer-iteration cap of
        five. Without dynamic relaxation, the added-mass effect at the water–solid interface would
        force the relaxation factor permanently to its lower bound and stall convergence.
      </Takeaway>

      <AcceptanceCriterion>
        The horizontal tip displacement <M math="\delta_x(t)" /> shall fall within the scatter band
        of the reference solutions over <M math="0 \le t \le 0.5~\mathrm{s}" />. The free-surface
        snapshots at <M math="t = 0.15,\,0.185,\,0.25~\mathrm{s}" /> shall reproduce the impact, jet,
        and fall-back features of the Walhorn reference.
      </AcceptanceCriterion>
    </>
  );
}
