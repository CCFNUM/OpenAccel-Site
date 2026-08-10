import { TutorialFigure, TutorialSubfigureStack, CroppedImage } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, Note, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// Letter-landscape plates (792×612 pt → cm).
const LAND: [number, number] = [27.94, 21.59];
// velocity_osc_cylinder.pdf natural page size 1037.4×278.999 pt → cm; trim 0 0 3.2 0.
const VEL_BASE: [number, number] = [36.60, 9.84];
// OpenAccel vorticity panels: source trim 6.12cm 5.74cm 5.8cm 5.82cm on the letter plate.
const VORT_TRIM: [number, number, number, number] = [6.12, 5.74, 5.8, 5.82];

const PHASES: [phase: string, oa: string, ref: string][] = [
  ['96', 'vorticity_96_cylinder', 'osc_cylinder_96'],
  ['192', 'vorticity_192_cylinder', 'osc_cylinder_192'],
  ['288', 'vorticity_288_cylinder', 'osc_cylinder_288'],
];

export function OscillatingCylinderContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC022' },
        { label: 'Reference',    value: 'Dütsch, Durst, Becker & Lienhart (1998), J. Fluid Mech. 360:249–271' },
        { label: 'Solver mode',  value: 'Transient, incompressible, laminar' },
        { label: 'Physics models', value: 'Laminar flow; prescribed boundary motion; displacement-diffusion mesh deformation (ALE)' },
        { label: 'Re / KC',      value: <><M math="\mathit{Re} = 100" />, <M math="\mathit{KC} = 5" />, <M math="\beta = 20" /></> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This case validates OpenAccel's mesh-deformation capability on the canonical problem of a
          circular cylinder oscillating harmonically along its diameter in an otherwise quiescent
          fluid. Unlike the rotating cylinder (VC019), where the moving sub-domain is displaced rigidly
          across a sliding interface, the present case deforms a single body-fitted mesh: the cylinder
          wall is driven sinusoidally and the interior nodes are relaxed by the displacement-diffusion
          solver while the outer boundary is held fixed. It therefore verifies that the deforming-mesh
          formulation satisfies the geometric conservation law and recovers the correct unsteady
          hydrodynamic loading, quantified here through the Morison drag and inertia coefficients
          reported by Dütsch et al. (1998).
        </p>
        <p>
          A circular cylinder of diameter <M math="D = 0.01~\mathrm{m}" /> is immersed in quiescent
          water and translated harmonically along the <M math="x" />-axis according to
        </p>
        <Equation math="x_c(t) = -A \sin(2\pi f t)" label="1" />
        <p>
          The oscillation amplitude <M math="A" /> and frequency <M math="f" /> are fixed by the two
          governing dimensionless groups, the Reynolds and Keulegan–Carpenter numbers,
        </p>
        <Equation math="\mathit{Re} = \frac{U_{\max} D}{\nu} = 100, \qquad \mathit{KC} = \frac{U_{\max}}{f D} = 5" label="2" />
        <p>
          where <M math="U_{\max} = 2\pi f A" /> is the peak cylinder velocity and{' '}
          <M math="\nu = 1.01\times10^{-6}~\mathrm{m^2/s}" /> is the kinematic viscosity of water. The
          ratio <M math="\beta = \mathit{Re}/\mathit{KC} = 20" /> is the Stokes parameter. From
          Equation (2) the amplitude follows as{' '}
          <M math="A = \mathit{KC}\,D/(2\pi) = 7.958\times10^{-3}~\mathrm{m}\,(= 0.796\,D)" />, the peak
          velocity as <M math="U_{\max} = \nu\,\mathit{Re}/D = 1.010\times10^{-2}~\mathrm{m/s}" />, and
          the frequency as <M math="f = U_{\max}/(2\pi A) = 0.2020~\mathrm{Hz}" />, giving a period{' '}
          <M math="T = 1/f = 4.9505~\mathrm{s}" />.
        </p>

        <Note>
          <p>
            <strong>On the moving frame of reference.</strong> The reference frame is fixed to the
            undisturbed fluid, not to the cylinder, so the relevant velocity scale is the prescribed
            cylinder velocity <M math="\dot{x}_c" /> rather than a free-stream value. The cylinder
            kinematics follow from Equation (1) as <M math="\dot{x}_c(t) = -U_{\max}\cos(\omega t)" />{' '}
            and <M math="\ddot{x}_c(t) = U_{\max}\,\omega\sin(\omega t)" /> with{' '}
            <M math="\omega = 2\pi f" />. Because the body moves through a still fluid, the inertia
            coefficient <M math="c_i" /> measured here is the viscous added-mass term <em>without</em>{' '}
            the Froude–Krylov contribution; this is the origin of the relation{' '}
            <M math="c_m = c_i + 1" /> below.
          </p>
        </Note>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <p>
          The computational domain is a concentric O-grid: a circular outer boundary of radius{' '}
          <M math="60\,D" /> surrounds the cylinder. The mesh is body-fitted with radial clustering
          towards the cylinder wall, the first cell height being <M math="10^{-3}\,D" />. The grid
          corresponds to the medium resolution (Set B1) of Dütsch et al., with <M math="192" /> cells around the
          circumference and <M math="128" /> in the radial direction (<M math="24\,576" /> quadrilateral cells). The
          cylinder wall (<code>CYLINDER</code>) is a no-slip boundary whose position is prescribed by
          the periodic displacement of Equation (1). The outer boundary (<code>FARFIELD</code>) is held
          fixed and treated as a wall, pinning the mesh-deformation field at the domain edge. Grid
          parameters are listed in Table 1.
        </p>
        <TutorialSubfigureStack label="Figure 1"
          items={[
            { src: '/figures/oscillating_cylinder.svg', alt: 'Geometry and BCs', subcaption: 'Geometry and boundary conditions.' },
            { src: '/figures/mesh_osc_cylinder.svg', alt: 'Near-wall mesh close-up', subcaption: <>Close-up of the body-fitted O-grid at the cylinder surface, showing the radial clustering used to resolve the unsteady boundary layer (first cell height <M math="10^{-3}\,D" />).</>, trim: [5, 3, 5, 3], trimBase: LAND },
          ]}
          caption={<>Geometry and computational mesh for the in-line oscillating-cylinder case. (a)
            Schematic of the circular far-field domain, boundary conditions, and prescribed cylinder
            motion. (b) Close-up of the body-fitted O-grid at the cylinder surface.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Numerical setup</h2>
        <SetupTable label="Table 1"
          caption="Numerical setup for the in-line oscillating-cylinder case (Dütsch Set B1)."
          groups={[
            { heading: 'Geometry and mesh (Dütsch Set B1)', rows: [
              { label: <>Cylinder diameter <M math="D" /></>,    value: <M math="0.01~\mathrm{m}" /> },
              { label: 'Circumferential cells',  value: <M math="192" /> },
              { label: 'Radial cells',           value: <M math="128" /> },
              { label: 'Total cells',            value: <><M math="24\,576" /> (QUAD4)</> },
              { label: 'Outer-boundary radius',  value: <M math="60\,D = 0.6~\mathrm{m}" /> },
              { label: 'First cell height at wall', value: <M math="10^{-3}\,D" /> },
            ]},
            { heading: 'Fluid properties (water)', rows: [
              { label: <>Density <M math="\rho" /></>,              value: <M math="998.2~\mathrm{kg/m^3}" /> },
              { label: <>Dynamic viscosity <M math="\mu" /></>,     value: <M math="1.00818\times10^{-3}~\mathrm{Pa\cdot s}" /> },
              { label: <>Kinematic viscosity <M math="\nu" /></>,   value: <M math="1.01\times10^{-6}~\mathrm{m^2/s}" /> },
            ]},
            { heading: 'Cylinder motion', rows: [
              { label: <>Diameter <M math="D" /></>,             value: <M math="0.01~\mathrm{m}" /> },
              { label: <>Amplitude <M math="A" /></>,            value: <M math="7.95775\times10^{-3}~\mathrm{m}\,(= 0.796\,D)" /> },
              { label: <>Frequency <M math="f" /></>,            value: <M math="0.20200~\mathrm{Hz}" /> },
              { label: <>Period <M math="T" /></>,               value: <M math="4.9505~\mathrm{s}" /> },
              { label: <>Peak velocity <M math="U_{\max}" /></>,  value: <M math="1.010\times10^{-2}~\mathrm{m/s}" /> },
              { label: <>Reynolds number <M math="\mathit{Re}" /></>, value: <M math="100" /> },
              { label: <>Keulegan–Carpenter <M math="\mathit{KC}" /></>, value: <M math="5" /> },
              { label: <>Stokes parameter <M math="\beta" /></>,  value: <M math="20" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: <>Cylinder (<code>CYLINDER</code>)</>, value: <>No-slip wall, <code>periodic_displacement</code>, value <M math="[-7.95775\times10^{-3},0,0]" />, <M math="f = 0.20200" /></> },
              { label: <>Far field (<code>FARFIELD</code>)</>, value: 'Fixed wall (pins mesh-deformation field)' },
              { label: 'Initial condition',      value: <><M math="\mathbf{u} = (0,0,0)" />, <M math="p = 0" /></> },
            ]},
            { heading: 'Mesh deformation', rows: [
              { label: 'Model',                  value: 'Displacement diffusion, relative to initial mesh' },
              { label: 'Stiffness',              value: 'Blended distance and small volumes' },
              { label: 'Distance exponent',      value: <M math="0.5" /> },
              { label: 'Volume exponent',        value: <M math="2.0" /> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Solver / formulation',   value: 'Transient, incompressible, segregated pressure–velocity' },
              { label: 'Turbulence model',       value: 'Laminar' },
              { label: 'Transient scheme',       value: 'Second-order backward Euler (BDF2)' },
              { label: 'Advection scheme',       value: 'High-resolution' },
              { label: <>Timestep <M math="\Delta t" /></>,     value: <M math="6.876\times10^{-3}~\mathrm{s}\,(= T/720)" /> },
              { label: 'Total time',             value: <><M math="49.505~\mathrm{s}" /> (<M math="10" /> periods)</> },
              { label: 'Velocity / pressure URF', value: <M math="0.6\ /\ 0.4" /> },
              { label: 'Outer iterations',       value: <><M math="1" />–<M math="20" /> per timestep</> },
              { label: 'Pressure reference',     value: <>Pinned at <M math="(0.55,0,0)" /></> },
              { label: 'RMS target',             value: <M math="10^{-6}" /> },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Default',                value: <>Trilinos <code>gmres</code> + <code>riluk</code> (<M math="k{=}2" />), rtol <M math="10^{-4}" /></> },
            ]},
            { heading: 'Output', rows: [
              { label: 'Force / moment monitor', value: <>Surface integral on <code>CYLINDER</code>, moment about origin, every timestep</> },
              { label: 'Field output interval',  value: <>Every <M math="10" /> timesteps (<M math="24" /> frames/period)</> },
            ]},
          ]}
        />
      </section>

      <section id="benchmark">
        <h2>4. Benchmark quantities</h2>
        <p>
          The principal validation quantity is the in-line hydrodynamic force per unit length,{' '}
          <M math="F_1(t)" />, which Dütsch et al. (1998) represent through the Morison equation
        </p>
        <Equation math="F_x(t) = -\tfrac{1}{2}\,\rho D\, c_d\, \dot{x}_c\,|\dot{x}_c| - \tfrac{\pi}{4}\,\rho D^2\, c_i\, \ddot{x}_c" label="3" />
        <p>
          with <M math="c_d" /> the drag coefficient and <M math="c_i" /> the inertia coefficient. The
          mass (added-mass) coefficient is <M math="c_m = c_i + 1" />, the additive unity being the
          displaced-fluid (Froude–Krylov) term. The coefficients are obtained from the fundamental
          Fourier components of the computed force over one oscillation period,
        </p>
        <Equation math="a_1 = \frac{2}{T}\int_{t_0}^{t_0+T} F_x(t)\,\cos(\omega t)\,\mathrm{d}t, \qquad b_1 = \frac{2}{T}\int_{t_0}^{t_0+T} F_x(t)\,\sin(\omega t)\,\mathrm{d}t" label="4" />
        <p>whence the drag and inertia coefficients follow in closed form as</p>
        <Equation math="c_d = \frac{3\pi\, a_1}{4\,\rho D\, U_{\max}^2}, \qquad c_i = -\frac{2\, b_1}{\pi^2 f\, \rho D^2\, U_{\max}}, \qquad c_m = c_i + 1" label="5" />

        <DataTable
          label="Table 2"
          caption={<>Morison coefficients for the in-line oscillating cylinder at <M math="\mathit{Re} = 100" />,
            <M math="\mathit{KC} = 5" />, compared with the reference values of Dütsch et al. (1998).</>}
          headers={['Coefficient', 'OpenAccel', 'Ref. (Dütsch)', 'Diff (%)']}
          rows={[
            [<M math="c_d" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="2.11" /></span>, <M math="2.10" />, <M math="+0.5" />],
            [<M math="c_i" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="1.50" /></span>, <M math="1.45" />, <M math="+3.4" />],
            [<M math="c_m" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}><M math="2.50" /></span>, <M math="2.45" />, <M math="+2.0" />],
          ]}
        />
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <p>
          The Morison coefficients extracted from the final oscillation period are compared with the
          reference values of Dütsch et al. (1998) in Table 2. All three coefficients agree to within
          the inter-method scatter of the reference study.
        </p>

        <h3>Convergence to the periodic state</h3>
        <p>
          Figure 2 shows the computed in-line force per unit length <M math="F_1(t)" /> over the full
          <M math="10" />-period run. The impulsive start at <M math="t = 0" /> produces a brief transient that
          decays within the first cycle; from roughly the second cycle onward the force history is
          periodic and indistinguishable from cycle to cycle within plotting resolution.
        </p>
        <TutorialFigure label="Figure 2"
          src="/figures/F_x_cycle.svg"
          alt="In-line force over 10 periods"
          caption={<>In-line hydrodynamic force per unit length, <M math="F_1(t)" />, over ten
            oscillation periods. The impulsive start-up transient decays within the first cycle; the
            remaining cycles are periodic to plotting accuracy. The extraction window for the Morison
            coefficient fit is the tenth period (highlighted band).</>}
        />

        <h3>In-line force history</h3>
        <p>
          Figure 3 shows one period of the computed in-line force <M math="F_1(t)" />, the
          two-parameter Morison reconstruction built from the extracted <M math="c_d" /> and{' '}
          <M math="c_i" /> via Equation (3), and the reference force history of Dütsch et al. (1998).
          The OpenAccel force tracks the reference closely, including the characteristic twin peaks near
          flow reversal, while the Morison fit departs visibly around the velocity extrema where the
          higher-harmonic content is largest.
        </p>
        <TutorialFigure label="Figure 3"
          src="/figures/inline_force_osc_cylinder.svg"
          alt="In-line force history — one period"
          caption={<>In-line hydrodynamic force on the oscillating cylinder at <M math="\mathit{Re} = 100" />,
            <M math="\mathit{KC} = 5" />, over the last highlighted period in Figure 2. The Morison
            reconstruction captures the fundamental but not the higher harmonics, in the same way for
            both the OpenAccel and reference forces.</>}
        />

        <h3>Cross-stream velocity profiles</h3>
        <p>
          A more discriminating point-wise comparison is provided by the phase-averaged velocity
          profiles along two cross-stream stations of constant <M math="x" />, shown in Figure 4. The
          OpenAccel profiles fall on top of the reference numerical curves through the boundary layer,
          the near-wake shear layer, and the outer return flow, and reproduce the experimental data to
          within the measurement scatter.
        </p>
        <TutorialFigure label="Figure 4"
          src="/figures/velocity_osc_cylinder.svg"
          alt="Phase-averaged velocity profiles"
          caption={<>Phase-averaged velocity profiles at two cross-stream stations of constant{' '}
            <M math="x" />. (a) Streamwise component <M math="u" />. (b) Cross-stream component{' '}
            <M math="v" />. Each station compares OpenAccel with the reference numerical solution and
            the laser-Doppler measurements of Dütsch et al. (1998).</>}
          trim={[0, 0, 3.2, 0]}
          trimBase={VEL_BASE}
          width="wide"
        />

        <h3>Wake vorticity field</h3>
        <p>
          Figure 5 compares the computed out-of-plane vorticity isolines with the phase-averaged
          reference fields of Dütsch et al. at oscillation phases <M math="\phi = 96^\circ" />,{' '}
          <M math="192^\circ" />, and <M math="288^\circ" />, spanning the leftward stroke, flow
          reversal, and rightward stroke of the cycle. The vortex-pair topology and the asymmetric
          tilting through stroke reversal are reproduced in their correct positions.
        </p>
        <figure className="my-8">
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4 text-center text-xs font-semibold" style={{ color: 'var(--text)' }}>
              <span>OpenAccel</span><span>Dütsch et al. (1998)</span>
            </div>
            {PHASES.map(([phase, oa, ref]) => (
              <div key={phase}>
                <div className="grid grid-cols-2 gap-4">
                  <CroppedImage src={`/figures/${oa}.svg`} alt={`OpenAccel vorticity φ=${phase}°`} trim={VORT_TRIM} trimBase={LAND} />
                  <img src={`/figures/${ref}.png`} alt={`Reference vorticity φ=${phase}°`} className="w-full h-auto object-contain" loading="lazy" />
                </div>
                <p className="text-xs text-center mt-1 mb-2" style={{ color: 'var(--text-dim)' }}>
                  <M math={`\\phi = ${phase}^\\circ`} />
                </p>
              </div>
            ))}
          </div>
          <figcaption className="mt-2 text-sm text-[var(--text-dim)] text-center leading-relaxed px-2">
            <strong style={{ color: 'var(--text)' }}>Figure 5.</strong> Out-of-plane vorticity isolines
            around the oscillating cylinder at three phases of the cycle. Left column: OpenAccel; right
            column: Dütsch et al. (1998) reference. The cylinder body sweeps over{' '}
            <M math="|x| \leq A + D/2 \approx 13~\mathrm{mm}" />.
          </figcaption>
        </figure>
      </section>

      <Takeaway>
        OpenAccel reproduces the unsteady hydrodynamic loading of an in-line oscillating cylinder in
        close agreement with the Dütsch et al. (1998) reference across every metric reported in the
        original study. The Morison drag coefficient is recovered to within <M math="0.5\%" /> and the
        inertia coefficient to within <M math="3.4\%" /> of the spectral-element values, both
        comfortably inside the scatter between that study's computation and its laser-Doppler
        measurements. The in-line force history matches the reference in phase and amplitude, retaining
        the higher-harmonic content that a two-parameter Morison fit cannot capture. The point-wise
        velocity profiles fall on top of both the reference numerical and experimental data, and the
        vorticity-isoline topology is preserved across the three reported phases. Taken together, these
        results establish that the displacement-diffusion mesh-deformation formulation conserves the
        flow structure through the prescribed wall motion.
      </Takeaway>

      <AcceptanceCriterion>
        The Morison drag and inertia coefficients extracted from the periodic state shall agree with
        the reference values of Dütsch et al. (1998) to within <M math="5\%" />; the in-line force
        history, the cross-stream velocity profiles, and the near-wake vorticity isolines shall
        reproduce the reference fields to graphical accuracy.
      </AcceptanceCriterion>
    </>
  );
}
