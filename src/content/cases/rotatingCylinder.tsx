import { TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, Note, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// mesh_cylinder.pdf letter-landscape (792×612 pt → cm); source trim 4 1 4 1.
const LAND: [number, number] = [27.94, 21.59];

export function RotatingCylinderContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC019' },
        { label: 'Reference',    value: 'Mittal & Kumar (2003), J. Fluid Mech. 476:303–334' },
        { label: 'Solver mode',  value: 'Transient, incompressible, laminar' },
        { label: 'Physics / models', value: '2-D incompressible laminar NS; rigid-body domain rotation; non-conformal sliding interface (AMI)' },
        { label: 'Special',      value: 'Sliding-mesh coupling between a rotating sub-domain and a stationary far field' },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This case validates OpenAccel's sliding-mesh capability on the canonical problem of
          two-dimensional incompressible flow past a rotating circular cylinder. It exercises a
          rotating, non-conformal arbitrary mesh interface (AMI) that couples a spinning annular
          sub-domain to a stationary far field, and demonstrates that the resulting force coefficients
          reproduce the published reference data of Mittal &amp; Kumar (2003). Whereas the
          oscillating-box case (VC018) exercises prescribed-displacement ALE on a single conformal
          mesh, the present case introduces a genuinely non-conformal interface whose interpolation
          weights are recomputed at every timestep.
        </p>
        <p>
          A circular cylinder of diameter <M math="D = 1" /> is immersed in a uniform free stream of
          velocity <M math="U_\infty = 1" /> and rotates about its own axis at a constant angular
          velocity <M math="\omega" />. The Reynolds number, based on the cylinder diameter, is held
          fixed at
        </p>
        <Equation math="\mathit{Re} = \frac{\rho U_\infty D}{\mu} = \frac{1 \cdot 1 \cdot 1}{0.005} = 200" />
        <p>
          so that the flow remains laminar throughout. The strength of the rotation is characterised
          by the non-dimensional rotation rate
        </p>
        <Equation math="\alpha = \frac{\omega \, r}{U_\infty} = \frac{\omega D}{2 U_\infty}" label="1" />
        <p>
          where <M math="r = D/2" /> is the cylinder radius. With <M math="r = 0.5" /> and{' '}
          <M math="U_\infty = 1" />, the imposed angular velocity is simply <M math="\omega = 2\alpha" />.
          The rotation imparts a Magnus-type asymmetry to the wake: as <M math="\alpha" /> increases,
          the upper shear layer is energised and the lower one weakened, the rear stagnation point
          migrates, and a net transverse (lift) force develops. Above a critical rotation rate{' '}
          <M math="\alpha_L \approx 1.9" />, periodic vortex shedding is suppressed and the flow
          becomes steady; a second, narrow band of unsteadiness re-emerges near{' '}
          <M math="\alpha \approx 4.4\text{--}4.8" />.
        </p>
        <p>
          To span these regimes, three rotation rates are considered, summarised in Table 1. The
          angular velocities follow directly from Equation (1).
        </p>

        <DataTable
          label="Table 1"
          caption={<>Rotation rates considered and their expected flow regime at <M math="\mathit{Re}=200" />.</>}
          headers={[<M math="\alpha" />, <M math="\omega~[\mathrm{rad/s}]" />, 'Regime', 'Expected behaviour']}
          rows={[
            [<M math="1.0" />, <M math="2.0" />, 'Unsteady', 'Periodic vortex shedding persists; the wake is asymmetric and the lift is non-zero in the mean with a periodic component.'],
            [<M math="3.0" />, <M math="6.0" />, 'Steady', <>Shedding fully suppressed (<M math="\alpha > \alpha_L" />); steady asymmetric wake with a large steady downward lift.</>],
            [<M math="4.5" />, <M math="9.0" />, 'Unsteady (II)', 'Within the second shedding window; low-frequency one-sided vortex shedding re-appears.'],
          ]}
        />

        <Note>
          <p>
            <strong>On the time non-dimensionalisation.</strong> Following Mittal &amp; Kumar (2003),
            time is reported in convective units <M math="t^{*} = t\,U_\infty/D" />, i.e. one unit is
            the time for the free stream to travel one cylinder diameter. With{' '}
            <M math="U_\infty = D = 1" /> the simulation time equals <M math="t^{*}" /> directly. One
            cylinder revolution corresponds to <M math="T_{\mathrm{rev}} = \pi/\alpha" /> convective
            units; the long integration times used here are dictated by the convective washout of the
            far field, not by the rotation period.
          </p>
        </Note>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <p>
          The domain is decomposed into two concentric regions joined by a sliding interface at radius{' '}
          <M math="r = 1.5" /> (i.e. <M math="1.5\,D" /> from the axis), as illustrated in Figure 1(a):
          a <em>rotor</em>, an O-grid annulus spanning <M math="0.5 \le r \le 1.5" /> that rotates
          rigidly with the cylinder; and a <em>stator</em>, a stationary outer region extending to{' '}
          <M math="\pm 50\,D" /> built with an O–H block topology. The two meshes are conformal at{' '}
          <M math="t = 0" /> but become non-conformal as the rotor turns, so the AMI must re-compute
          interface weights every timestep, as visible in the mesh detail of Figure 1(b). The uniform
          stream enters at the inlet with <M math="\mathbf{u}=(1,0,0)" />; the outlet imposes a static
          pressure <M math="p=0" />; the lateral boundaries and the front/back planes are symmetry
          planes (the case is solved as a single-cell-thick quasi-2D slab).
        </p>
        <TutorialSubfigureStack label="Figure 1"
          items={[
            { src: '/figures/rotating_cylinder.svg', alt: 'Domain layout and boundary conditions', subcaption: 'Computational domain and boundary conditions (not to scale).' },
            { src: '/figures/mesh_cylinder.svg',     alt: 'Near-field mesh detail', subcaption: 'Close up view of the mesh near the cylinder, showing the rotor O-grid and the sliding interface with the stator.', trim: [4, 1, 4, 1], trimBase: LAND },
          ]}
          caption={<>Rotating-cylinder validation case. (a) Domain layout with boundary conditions,
            the rotating sub-domain (rotor) and the stationary far field (stator) joined by a
            non-conformal sliding interface (AMI) at <M math="r=1.5" />. (b) Mesh in the near-field
            region.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <p>
          The case is run as a transient, laminar, incompressible simulation. Mesh motion is imposed
          rigidly on the rotor sub-domain through the <code>domain_motion</code> option with{' '}
          <code>option: rotating</code>, about the <M math="z" />-axis through the origin. The cylinder
          wall is assigned <code>frame_type: rotating</code> so that the no-slip condition is applied
          in the rotating frame. The sliding interface is declared as a <code>general_connection</code>{' '}
          of type <code>fluid_fluid</code> between the rotor and stator interface patches, with
          Gauss–Lobatto quadrature enabled for the interface flux integration. A representative
          configuration (<M math="\alpha = 1" />) is summarised below; for <M math="\alpha = 3" /> and{' '}
          <M math="\alpha = 4.5" /> set <M math="\omega = 6.0" /> and <M math="\omega = 9.0" />,
          reducing the timestep in proportion to the higher interface speed.
        </p>
        <SetupTable label="Table 2"
          caption={<>Rotating cylinder (<M math="\alpha = 1" />) — complete case setup.</>}
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: <>Cylinder diameter <M math="D" /></>, value: <M math="1.0" /> },
              { label: <>AMI radius <M math="R_i" /></>,      value: <><M math="1.5" /> (<M math="1.5\,D" />)</> },
              { label: 'Far-field extent',    value: <><M math="\pm 50\,D" /> in <M math="x" /> and <M math="y" /></> },
              { label: 'Mesh (rotor / stator)', value: <><M math="8\,000" /> / <M math="13\,200" /> cells; total <M math="21\,200" /></> },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: <>Density <M math="\rho" /></>,           value: <M math="1.0" /> },
              { label: <>Dynamic viscosity <M math="\mu" /></>,  value: <M math="0.005" /> },
              { label: 'Reynolds number',      value: <M math="\mathit{Re} = \rho U_\infty D / \mu = 200" /> },
            ]},
            { heading: 'Rotation and frame', rows: [
              { label: 'Non-dim. rotation rate', value: <M math="\alpha = 1.0" /> },
              { label: 'Cylinder angular velocity', value: <M math="\omega = 2\alpha = 2.0~\mathrm{rad/s}" /> },
              { label: 'Mesh motion (rotor)',  value: <><code>domain_motion: rotating</code>, axis <M math="[0,0,1]" />, origin <M math="[0,0,0]" /></> },
              { label: 'Cylinder wall frame',  value: <><code>frame_type: rotating</code> (no-slip in rotating frame)</> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',               value: <>Uniform velocity <M math="\mathbf{u} = (1,0,0)" /></> },
              { label: 'Outlet',              value: <>Static pressure <M math="p = 0" /></> },
              { label: 'Top / bottom',        value: 'Symmetry' },
              { label: 'Front / back',        value: 'Symmetry (quasi-2D slab)' },
              { label: 'Sliding interface',   value: <><code>general_connection</code>, <code>fluid_fluid</code>, AMI at <M math="r=1.5" />, Gauss–Lobatto quadrature</> },
              { label: 'Pressure reference',  value: <>Pinned at <M math="(49,0,0)" /></> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',           value: 'Transient segregated pressure–velocity' },
              { label: 'Transient scheme',    value: 'Second-order backward Euler (BDF2)' },
              { label: 'Advection',           value: 'High-resolution' },
              { label: 'Velocity / pressure URF', value: <M math="0.5\ /\ 0.2" /> },
              { label: 'Outer iterations',    value: <><M math="2" />–<M math="20" /> per timestep</> },
              { label: 'Linear solver (all systems)', value: <>Trilinos GMRES, RILU(<M math="k{=}2" />) preconditioner</> },
              { label: 'RMS target',          value: <M math="10^{-6}" /> },
              { label: 'Timestep',            value: <M math="\Delta t = 0.002" /> },
              { label: 'Total time',          value: <M math="t^{*} = 15\times T_{rev} = 50" /> },
            ]},
            { heading: 'Post-processing', rows: [
              { label: 'Force / moment monitor', value: <>Surface integral on <code>cylinder</code>, moment about <M math="[0,0,0]" />, every timestep</> },
            ]},
          ]}
        />

        <Takeaway>
          <p>
            <strong>Sliding-mesh timestep restriction.</strong> The non-conformal interface imposes an
            effective Courant-type limit{' '}
            <M math="\Delta t \, \omega \, R_i \lesssim \Delta s_{\mathrm{face}}" />, where{' '}
            <M math="R_i = 1.5" /> is the interface radius and <M math="\Delta s_{\mathrm{face}}" /> the
            azimuthal face size at the interface. In practice the rotor should advance no more than
            roughly one interface face per timestep. Because <M math="\omega" /> scales with{' '}
            <M math="\alpha" />, the timestep must be reduced accordingly for the higher rotation rates
            (e.g. <M math="\Delta t = 0.002" /> at <M math="\alpha = 1" /> scaling down towards{' '}
            <M math="\Delta t \approx 5\times 10^{-4}" /> at <M math="\alpha = 4.5" />) to keep the
            interface interpolation mass-conservative.
          </p>
        </Takeaway>
      </section>

      <section id="force">
        <h2>4. Force coefficients</h2>
        <p>
          The drag and lift forces are obtained by integrating the pressure and viscous tractions over
          the cylinder surface. With the present non-dimensionalisation (<M math="\rho = 1" />,{' '}
          <M math="U_\infty = 1" />, <M math="D = 1" />) and a spanwise thickness{' '}
          <M math="L_z = 0.1" /> of the single-cell-thick mesh, the force coefficients are
        </p>
        <Equation math="C_D = \frac{F_x}{\tfrac{1}{2}\rho U_\infty^2 D L_z} = \frac{F_x}{0.05} = 20\,F_x, \qquad C_L = \frac{F_y}{\tfrac{1}{2}\rho U_\infty^2 D L_z} = 20\,F_y" label="2" />
        <p>
          For the unsteady cases (<M math="\alpha = 1" /> and <M math="\alpha = 4.5" />) the
          coefficients are reported as mean values with the shedding amplitude; for the steady case
          (<M math="\alpha = 3" />) a single converged value is reported. In all cases the averaging
          window excludes the initial transient (<M math="t^{*} < 25" />).
        </p>
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <p>
          Table 3 compares the computed mean force coefficients against the reference data of Mittal
          &amp; Kumar (2003) for the three rotation rates.
        </p>
        <DataTable
          label="Table 3"
          caption={<>Mean force coefficients and Strouhal number for the rotating cylinder at{' '}
            <M math="\mathit{Re}=200" />, compared with Mittal &amp; Kumar (2003).</>}
          headers={[<M math="\alpha" />, <M math="C_{D,avg}~\text{(M\&K)}" />, <M math="C_{L,avg}~\text{(M\&K)}" />, <M math="St~\text{(M\&K)}" />]}
          rows={[
            [<M math="1.0" />, <M math="1.05" />, <M math="-2.65" />, <M math="0.192" />],
            [<M math="3.0" />, <M math="0.04" />, <M math="-10.33" />, '—'],
            [<M math="4.5" />, <M math="-0.36" />, <M math="-22.35" />, <M math="0.025" />],
          ]}
        />
        <p className="text-sm text-[var(--text-dim)] italic">
          OpenAccel results are being computed. The table currently shows Mittal &amp; Kumar reference
          values only.
        </p>
      </section>

      <AcceptanceCriterion>
        The time-averaged drag and lift coefficients at <M math="\alpha = 1" />, <M math="3" />, and{' '}
        <M math="4.5" /> agree with the reference values of Mittal &amp; Kumar (2003) to within the
        typical benchmark scatter, and the solver correctly reproduces the qualitative regime
        sequence: shedding at <M math="\alpha = 1" />, a steady deflected wake at <M math="\alpha = 3" />,
        and the re-emergence of one-sided shedding at <M math="\alpha = 4.5" />.
      </AcceptanceCriterion>
    </>
  );
}
