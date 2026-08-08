import { TutorialFigure, TutorialSubfigureRow, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { M } from '@/components/tutorial/Equation';

// Simulation snapshot plates are letter-landscape (792×612 pt → cm); source trim
// 3cm 1.5cm 3cm 1.5cm (L B R T).
const LAND: [number, number] = [27.94, 21.59];
const SIM_TRIM: [number, number, number, number] = [3, 1.5, 3, 1.5];
// Experiment photos are PNGs at 72 dpi; natural size in cm = px/72×2.54.
const EXP01: [number, number] = [78.65, 54.19];
const EXP02: [number, number] = [37.96, 26.81];
const EXP03: [number, number] = [77.27, 54.19];
const EXP05: [number, number] = [76.11, 54.19];

export function DamBreakContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC008' },
        { label: 'References',   value: 'Koshizuka et al. (1995); Walhorn et al. (2005); Hänsch et al. (2012)' },
        { label: 'Solver mode',  value: 'Transient, segregated' },
        { label: 'Physics / models', value: '2-D incompressible VoF, two-phase' },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          The rigid dam-break with a fixed obstacle is the canonical free-surface benchmark for
          gravity-driven transient flow with strong interface deformation, impact, and overtopping.
          Compared to the flexible variant (the flexible dam-break with FSI), this case isolates the
          VoF and free-surface tracking machinery from the FSI layer. Three reference quantities are
          compared: the water column height at the left wall against the experiment of Koshizuka et
          al. (1995), the horizontal water-front displacement against the reference simulations of
          Walhorn et al. (2005), and the pressure history at a probe on the obstacle face against the
          simulations of Hänsch et al. (2012).
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src="/figures/dam_schematic.svg"
          alt="Rigid dam break schematic"
          caption="Rigid dam-break configuration. Point B on the upstream face of the obstacle at mid-height serves as a pressure probe."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Rigid dam-break — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',              value: <M math="L = 0.584~\mathrm{m}" /> },
              { label: 'Water column',        value: <><M math="w \times h = 0.146 \times 0.292~\mathrm{m}" /> at lower-left corner</> },
              { label: 'Obstacle (rigid)',    value: <><M math="w_o \times h_o = 0.024 \times 0.048~\mathrm{m}" /> at <M math="x = 0.292~\mathrm{m}" /></> },
              { label: 'Initialisation',      value: <code>{'if(x<=0.146 and y<=0.292, 1, 0)'}</code> },
              { label: 'Mesh',               value: <><M math="4\,746" /> nodes / <M math="2\,268" /> elements</> },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: <>Water <M math="\rho_w" />, <M math="\mu_w" /></>,     value: <><M math="1000~\mathrm{kg\,m^{-3}}" />, <M math="10^{-3}~\mathrm{Pa\,s}" /></> },
              { label: <>Air <M math="\rho_a" />, <M math="\mu_a" /></>,       value: <><M math="1~\mathrm{kg\,m^{-3}}" />, <M math="1.48\times10^{-5}~\mathrm{Pa\,s}" /></> },
              { label: 'Surface tension',     value: <><M math="\sigma = 0.07~\mathrm{N/m}" /> (CSF)</> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Left, right, bottom, obstacle', value: 'No-slip walls' },
              { label: 'Top',                value: 'Opening (zero-gauge static pressure)' },
              { label: 'Front, back',        value: 'Symmetry' },
              { label: 'Body force',         value: <><M math="g = 9.81~\mathrm{m/s^2}" />, Boussinesq ref. density <M math="1~\mathrm{kg/m^3}" /></> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: 'Time step',          value: <>Constant <M math="\Delta t = 5\times10^{-4}~\mathrm{s}" /></> },
              { label: 'End time',           value: <M math="0.6~\mathrm{s}" /> },
              { label: 'Advection',          value: 'High-resolution Barth–Jespersen' },
              { label: 'VoF FCT',            value: <>Compression level 2; 2 <M math="\alpha" />-correction sweeps</> },
              { label: 'VoF smoothing',      value: <>5 iterations, <M math="\mathrm{Fo} = 0.25" /></> },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Momentum',            value: <>PETSc / FGMRES + block-Jacobi (rel. tol. <M math="10^{-2}" />)</> },
              { label: 'Pressure correction', value: <>Trilinos / GMRES + ILU (rel. tol. <M math="10^{-2}" />)</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: <><M math="10^{-8}" /> / up to 20 per step</> },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <p>Simulation (left) vs experiment — Koshizuka et al. (right):</p>

        <TutorialSubfigureRow label="Figure 2"
          left={{ src: '/figures/0.1_sec_rigid_dam.svg', alt: 'Simulation t=0.1s', subcaption: <>Simulation, <M math="t = 0.1~\mathrm{s}" /></>, trim: SIM_TRIM, trimBase: LAND }}
          right={{ src: '/figures/exp_0.1.png',           alt: 'Experiment t=0.1s', subcaption: <>Experiment, <M math="t = 0.1~\mathrm{s}" /></>, trim: [0, 0, 3, 8], trimBase: EXP01 }}
          caption={<>Free surface at <M math="t = 0.1~\mathrm{s}" />.</>}
        />
        <TutorialSubfigureRow label="Figure 3"
          left={{ src: '/figures/0.2_sec_rigid_dam.svg', alt: 'Simulation t=0.2s', subcaption: <>Simulation, <M math="t = 0.2~\mathrm{s}" /></>, trim: SIM_TRIM, trimBase: LAND }}
          right={{ src: '/figures/exp_0.2.png',           alt: 'Experiment t=0.2s', subcaption: <>Experiment, <M math="t = 0.2~\mathrm{s}" /></>, trim: [0, 0, 3, 4], trimBase: EXP02 }}
          caption={<>Free surface at <M math="t = 0.2~\mathrm{s}" />.</>}
        />
        <TutorialSubfigureRow label="Figure 4"
          left={{ src: '/figures/0.3_sec_rigid_dam.svg', alt: 'Simulation t=0.3s', subcaption: <>Simulation, <M math="t = 0.3~\mathrm{s}" /></>, trim: SIM_TRIM, trimBase: LAND }}
          right={{ src: '/figures/exp_0.3.png',           alt: 'Experiment t=0.3s', subcaption: <>Experiment, <M math="t = 0.3~\mathrm{s}" /></>, trim: [0, 0, 3, 8], trimBase: EXP03 }}
          caption={<>Free surface at <M math="t = 0.3~\mathrm{s}" />.</>}
        />
        <TutorialSubfigureRow label="Figure 5"
          left={{ src: '/figures/0.5_sec_rigid_dam.svg', alt: 'Simulation t=0.5s', subcaption: <>Simulation, <M math="t = 0.5~\mathrm{s}" /></>, trim: SIM_TRIM, trimBase: LAND }}
          right={{ src: '/figures/exp_0.5.png',           alt: 'Experiment t=0.5s', subcaption: <>Experiment, <M math="t = 0.5~\mathrm{s}" /></>, trim: [0, 0, 3, 8], trimBase: EXP05 }}
          caption={<>Free surface at <M math="t = 0.5~\mathrm{s}" /> — note the entrapped air pocket
            near the lower-right corner.</>}
        />

        <TutorialFigure label="Figure 6"
          src="/figures/pressure_rigid_dam2.svg"
          alt="Pressure history at probe B"
          caption="Pressure history at probe point B (centre of the upstream face of the obstacle) compared with Hänsch et al. (2012)."
        />

        <TutorialSubfigureStack label="Figure 7"
          items={[
            { src: '/figures/water_height.svg',     alt: 'Water column height', subcaption: 'Water-column height at the left wall vs. Koshizuka et al.' },
            { src: '/figures/water_distance_x.svg', alt: 'Water front distance', subcaption: 'Horizontal water-front displacement at the bottom wall vs. Walhorn et al.' },
          ]}
          caption="Time-resolved validation quantities for the rigid dam break."
        />
      </section>

      <Takeaway>
        At <M math="t = 0.1~\mathrm{s}" /> the simulated water front has not yet reached the obstacle,
        while in the experiment a thin film along the bottom has already arrived — this is a known
        limitation of CSF-based VoF on coarse meshes near the floor and is not affected by solver
        settings. From <M math="t = 0.2~\mathrm{s}" /> onward the agreement with the experimental
        snapshots is very close, including the upward jet and the fall-back that traps an air pocket
        near the lower-right corner at <M math="t = 0.5~\mathrm{s}" />, consistent with both the
        experimental and numerical references.
      </Takeaway>

      <AcceptanceCriterion>
        The water-column height at the left wall and the horizontal water-front displacement at the
        bottom wall shall both match their respective references in graphical agreement. The
        free-surface snapshots at <M math="t \in \{0.1,\,0.2,\,0.3,\,0.5\}~\mathrm{s}" /> shall
        reproduce the qualitative features of the Koshizuka experiment, in particular the air pocket
        trapped near the lower-right corner at <M math="t = 0.5~\mathrm{s}" />.
      </AcceptanceCriterion>
    </>
  );
}
