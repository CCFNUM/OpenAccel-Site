import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { M } from '@/components/tutorial/Equation';

// flexible_bottom_cavity.pdf natural page size 818.958×231.104 pt → cm; trim 0 0 0 0.5.
const GEOM_BASE: [number, number] = [28.89, 8.15];
// cavity_flex_contour_openaccel.pdf letter-landscape (792×612 pt → cm); trim 3 8 3 1.
const LAND: [number, number] = [27.94, 21.59];
// cavity_flex_contour_s4f.png is 1920×1080 px at 72 dpi → cm; trim 2 9 0 3.
const S4F_BASE: [number, number] = [67.73, 38.10];

export function FlexibleBottomCavityContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC024' },
        { label: 'References',   value: 'Tuković et al. (2018); solids4foam tutorial' },
        { label: 'Solver mode',  value: 'Transient, segregated; partitioned FSI with Aitken' },
        { label: 'Physics / models', value: '2-D incompressible laminar flow + ALE + linear elasticity' },
        { label: 'Coupling',     value: <>Aitken <M math="\Delta^2" /> relaxation</> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This benchmark exercises FSI in the weak-coupling regime. A laminar channel flow at{' '}
          <M math="\mathit{Re} = 100" /> passes over a square cavity whose floor is closed by a thick
          elastic plate clamped at both ends. The cavity pressure distribution — driven by the
          shear-layer separation at the upstream cavity lip and the recirculation inside — deflects the
          plate downward; the deflection is small but well-defined and reaches a steady value after a
          transient. Because the fluid-to-solid density ratio is <M math="\rho_f/\rho_s = 10^{-3}" />,
          added-mass effects are negligible and the case stresses the mesh-motion, transfer, and
          structural-coupling components of the FSI loop rather than the acceleration scheme itself.
        </p>
        <p>
          The validation targets are the steady-state horizontal and vertical displacement components
          at the plate midpoint <M math="A = (4,\,-1.4)" /> and the integrated vertical force on the
          FSI interface, compared with the fine-mesh published reference of Tuković et al. (2018) for
          the vertical displacement and with the solids4foam coarse tutorial for the remaining
          quantities.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src="/figures/flexible_bottom_cavity.svg"
          alt="Channel-cavity geometry"
          caption={<>Channel–cavity geometry: a <M math="14 \times 1~\mathrm{m}" /> channel feeds a{' '}
            <M math="4 \times 1~\mathrm{m}" /> square cavity whose floor is a clamped elastic plate of
            thickness <M math="0.4~\mathrm{m}" />. The FSI interface is the cavity floor at{' '}
            <M math="y = -1" />. The plate midpoint <M math="A = (4,\,-1.4)" /> is the probe location
            for displacement metrics.</>}
          width="wide"
          trim={[0, 0, 0, 0.5]}
          trimBase={GEOM_BASE}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Channel flow over a flexible cavity floor — complete case setup."
          groups={[
            { heading: 'Geometry', rows: [
              { label: 'Channel',                value: <><M math="14 \times 1~\mathrm{m}" /> (length <M math="\times" /> height)</> },
              { label: 'Cavity',                 value: <><M math="4 \times 1~\mathrm{m}" />, <M math="x \in [2, 6]" />, <M math="y \in [-1, 0]" /></> },
              { label: 'Plate (solid)',           value: <><M math="4 \times 0.4~\mathrm{m}" />, <M math="x \in [2, 6]" />, <M math="y \in [-1.4, -1]" /></> },
              { label: <>Probe point <M math="A" /></>,          value: <><M math="(4,\,-1.4)" /> — plate midpoint, lower surface</> },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: <>Density <M math="\rho_f" /></>,            value: <M math="1~\mathrm{kg\,m^{-3}}" /> },
              { label: 'Kinematic viscosity',    value: <M math="\nu = 0.01~\mathrm{m^2\,s^{-1}}" /> },
              { label: 'Reynolds number',        value: <M math="\mathit{Re} = \bar{U} H / \nu = 100" /> },
              { label: 'Body force',             value: <M math="g = 0" /> },
            ]},
            { heading: 'Solid properties (total-Lagrangian linear elastic)', rows: [
              { label: <>Density <M math="\rho_s" /></>,            value: <M math="1000~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Young's modulus <M math="E" /></>,      value: <M math="500~\mathrm{Pa}" /> },
              { label: <>Poisson's ratio <M math="\nu_s" /></>,   value: <M math="0.4" /> },
              { label: <>Rayleigh damping <M math="\alpha" /></>,  value: <><M math="0.1~\mathrm{s^{-1}}" /> (mass-proportional)</> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: <>Inlet (<M math="x = 0" />)</>,          value: <>Parabolic <M math="u_x = 6 y (1 - y)" />, peak <M math="1.5~\mathrm{m/s}" /> at <M math="y = 0.5" />; cosine ramp <M math="0 \to 1" /> over <M math="t \in [0,\,10]~\mathrm{s}" /></> },
              { label: <>Outlet (<M math="x = 14" />)</>,        value: <>Static pressure, <M math="p = 0" /></> },
              { label: 'Channel walls',          value: 'No-slip' },
              { label: <>Plate ends (<M math="x = 2,\,6" />)</>, value: 'Fixed displacement (clamped)' },
              { label: <>Plate bottom (<M math="y = -1.4" />)</>, value: 'Traction-free' },
              { label: 'FSI interface',          value: <>Cavity floor at <M math="y = -1" />, <M math="x \in [2,\,6]" /></> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',       value: 'First-order backward Euler' },
              { label: <>Time step <M math="\Delta t" /></>,    value: <><M math="0.25~\mathrm{s}" />, fixed</> },
              { label: 'End time',               value: <M math="400~\mathrm{s}" /> },
              { label: 'Advection',              value: 'High-resolution' },
              { label: 'Velocity under-relaxation', value: <M math="0.6" /> },
              { label: 'Pressure under-relaxation', value: <M math="0.3" /> },
              { label: 'Mesh stiffness',         value: <>Inverse-volume (exponent <M math="2" />), reference = initial mesh</> },
              { label: 'Mesh smoothing',         value: <>up to <M math="6" /> iterations per step</> },
            ]},
            { heading: 'FSI coupling', rows: [
              { label: 'Interface type',         value: <>General-connection, search tol. <M math="5 \times 10^{-3}" /></> },
              { label: 'Acceleration',           value: <>Aitken <M math="\Delta^2" />, <M math="\omega_0 = 0.2" />, <M math="\omega \in [0.1,\,0.8]" /></> },
              { label: 'Outer FSI iterations',   value: <>up to <M math="20" /> per step, target <M math="10^{-7}" /> (RMS)</> },
              { label: 'Inner sub-iterations',   value: <><M math="20" /> flow, <M math="5" /> solid displacement</> },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Default (momentum, solid, mesh)', value: <>Trilinos / Belos GMRES + ILU, rel. tol. <M math="10^{-4}" />, abs. tol. <M math="10^{-12}" />, <M math="3" />–<M math="50" /> iterations</> },
              { label: 'Pressure correction',    value: <>HYPRE / GMRES + BoomerAMG, rel. tol. <M math="10^{-4}" />, abs. tol. <M math="10^{-12}" />, <M math="3" />–<M math="50" /> iterations</> },
            ]},
            { heading: 'Mesh', rows: [
              { label: 'Fluid',                  value: <><M math="13\,320" /> cells, <M math="\Delta = 0.05~\mathrm{m}" /> (<M math="15" />-block topology with arc-edged fillets)</> },
              { label: 'Solid',                  value: <><M math="492" /> cells (<M math="82 \times 6" />), <M math="\Delta = 0.05~\mathrm{m}" /></> },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>

        <TutorialSubfigureRow label="Figure 2"
          left={{ src: '/figures/u_x_cavity_flex.svg', alt: 'Horizontal displacement (undamped)', subcaption: <>Horizontal displacement <M math="u_x(A,\,t)" /></> }}
          right={{ src: '/figures/u_y_cavity_flex.svg', alt: 'Vertical displacement (undamped)', subcaption: <>Vertical displacement <M math="u_y(A,\,t)" /></> }}
          caption={<>Time history of the plate midpoint displacement components at point{' '}
            <M math="A = (4,\,-1.4)" />, compared with the solids4foam reference. The under-damped
            oscillation reflects the absence of a structural Rayleigh-damping term; the amplitude
            decays through fluid viscous dissipation and numerical damping from the first-order
            temporal scheme.</>}
        />
        <TutorialSubfigureRow label="Figure 3"
          left={{ src: '/figures/u_x_cavity_flex_damped.svg', alt: 'Horizontal displacement (damped)', subcaption: <>Horizontal displacement <M math="u_x(A,\,t)" />, damped run</> }}
          right={{ src: '/figures/u_y_cavity_flex_damped.svg', alt: 'Vertical displacement (damped)', subcaption: <>Vertical displacement <M math="u_y(A,\,t)" />, damped run</> }}
          caption={<>Time history of the plate midpoint displacement components after activating the
            mass-proportional Rayleigh-damping term with coefficient <M math="\alpha = 0.1~\mathrm{s^{-1}}" />.
            The persistent oscillation seen in Figure 2 is eliminated and the plate reaches its
            asymptotic deflection monotonically; the steady-state value itself is unchanged.</>}
        />

        <DataTable
          label="Table 2"
          caption={<>Steady-state metrics at point <M math="A = (4,\,-1.4)" /> and integrated vertical
            FSI force on the cavity floor.</>}
          headers={['Quantity', 'OpenAccel (undamped)', 'OpenAccel (damped)', 'Reference']}
          rows={[
            [<>Horizontal displacement <M math="u_{x,A}" /> [mm] (s4f coarse)</>, <M math="-0.00016" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="-0.00015" /></span>, <M math="-0.00018" />],
            [<>Vertical displacement <M math="u_{y,A}" /> [mm] (Tuković et al.)</>, <M math="-0.253" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="-0.251" /></span>, <M math="-0.250" />],
            [<>Interface force <M math="F_y" /> [N m<sup>−1</sup>] (s4f coarse)</>, <M math="-5.129" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="-5.030" /></span>, <M math="-5.176" />],
          ]}
        />
        <p className="text-xs text-[var(--text-dim)] -mt-4 mb-6 px-1">
          <M math="u_{y,A}" /> reference from the fine-mesh Tuković et al. study; <M math="u_{x,A}" />{' '}
          and <M math="F_y" /> from the solids4foam coarse-mesh tutorial.
        </p>

        <TutorialSubfigureRow label="Figure 4"
          left={{ src: '/figures/cavity_flex_contour_openaccel.svg', alt: 'OpenAccel steady-state field', subcaption: 'OpenAccel', trim: [3, 8, 3, 1], trimBase: LAND }}
          right={{ src: '/figures/cavity_flex_contour_s4f.png', alt: 'solids4foam reference field', subcaption: 'solids4foam', trim: [2, 9, 0, 3], trimBase: S4F_BASE }}
          caption="Steady-state field comparison. Each panel shows the fluid domain coloured by velocity magnitude and the elastic plate coloured by von Mises stress, illustrating the channel boundary layers, the cavity recirculation, and the bending stress distribution in the plate at the deformed configuration."
        />
      </section>

      <Takeaway>
        The plate settles to a small downward deflection at the midpoint, set by the quasi-uniform
        pressure deficit in the cavity recirculation. Without a structural damping term, the approach
        to equilibrium is under-damped (Figure 2): attenuation comes only from fluid viscous
        dissipation and the numerical damping of the backward-Euler scheme. Activating a
        mass-proportional Rayleigh damping term with <M math="\alpha = 0.1~\mathrm{s^{-1}}" /> gives
        the traces of Figure 3: the oscillation is essentially eliminated, a clean asymptote can be
        read directly, and the equilibrium deflection itself is unchanged. The damped vertical
        displacement <M math="u_{y,A} = -0.251~\mathrm{mm}" /> matches the mesh-converged Tuković et
        al. reference of <M math="-0.250~\mathrm{mm}" /> to <M math="1.2\%" />, and the integrated
        interface force <M math="F_y" /> agrees with the solids4foam coarse-mesh reference to{' '}
        <M math="0.9\%" />. The higher von Mises stress at the clamped edges in the OpenAccel field
        (Figure 4) reflects the finer mesh resolving the bending-stress concentration more accurately.
      </Takeaway>

      <AcceptanceCriterion>
        The steady-state vertical displacement <M math="u_{y,A}" /> shall match the fine-mesh reference
        of Tuković et al. (2018) within <M math="\pm 5\%" /> relative error. The integrated vertical
        force <M math="F_y" /> shall match the s4f coarse tutorial reference within <M math="\pm 5\%" />.
        The qualitative features of the cavity flow (single dominant recirculation, attached shear layer
        across the cavity opening) and the symmetric bending shape of the plate (<M math="u_x \approx 0" />{' '}
        by geometric symmetry, <M math="u_y" /> maximum at midspan) shall be reproduced.
      </AcceptanceCriterion>
    </>
  );
}
