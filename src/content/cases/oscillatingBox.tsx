import { TutorialFigure, CroppedImage } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';
import { Equation, M } from '@/components/tutorial/Equation';

// Letter-landscape plates (792×612 pt → cm).
const LAND: [number, number] = [27.94, 21.59];
// Box contour source trim 3cm 4.5cm 3cm 4.5cm (L B R T); legends trim 7cm 17cm 7cm 1cm.
const BOX_TRIM: [number, number, number, number] = [3, 4.5, 3, 4.5];
const LEGEND_TRIM: [number, number, number, number] = [7, 17, 7, 1];

const INSTANTS: [key: string, label: string][] = [
  ['0', '0'], ['0.1', '0.1'], ['0.3', '0.3'], ['0.4', '0.4'], ['0.5', '0.5'],
  ['0.6', '0.6'], ['0.8', '0.8'], ['0.9', '0.9'], ['1', '1'],
];

export function OscillatingBoxContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC018' },
        { label: 'Reference',    value: 'Demonstration of dynamic mesh capability' },
        { label: 'Solver mode',  value: 'Transient, segregated; ALE with prescribed boundary motion' },
        { label: 'Physics / models', value: '3-D incompressible laminar Navier–Stokes + displacement-diffusion mesh motion' },
        { label: 'Special',      value: 'Periodic Dirichlet displacement on an interior wall' },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          The oscillating-box case isolates the ALE machinery from the rest of the multi-physics
          stack. A rigid square obstacle inside a closed cavity is forced to translate periodically in
          the vertical direction; the surrounding fluid mesh must deform accordingly via the
          displacement-diffusion equation, and the resulting mesh velocity feeds into the
          Navier–Stokes equations through the relative-velocity term and the geometric conservation
          law.
        </p>
        <p>
          Compared to the FSI cases (the flexible dam-break and the perpendicular flap), here the
          structural deformation is prescribed rather than computed — there is no solid solver in the
          loop, no partitioned coupling, and no Aitken or IQN-ILS acceleration. The case isolates{' '}
          <em>only</em> the mesh-motion layer: the displacement-diffusion stiffness model, the
          BDF2-based mesh-velocity computation, and the GCL source term in the fluid transport
          equations. If this case behaves correctly, then any failure on a full FSI case can be traced
          to the FSI coupling layer rather than to the underlying ALE infrastructure.
        </p>
        <p>
          The blended distance-and-volume mesh-stiffness formulation is exercised here, with distance
          exponent <M math="0.5" /> and volume exponent <M math="2.0" />. This combination stiffens
          both the small near-wall control volumes and the elements close to the moving obstacle,
          preserving boundary-layer-like resolution under deformation.
        </p>
      </section>

      <section id="setup">
        <h2>2. Setup</h2>
        <SetupTable label="Table 1"
          caption="Oscillating box — complete case setup."
          groups={[
            { heading: 'Fluid properties (air)', rows: [
              { label: <>Density <M math="\rho" /></>,           value: <M math="1.185~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Dynamic viscosity <M math="\mu" /></>,  value: <M math="1.831 \times 10^{-5}~\mathrm{Pa\,s}" /> },
              { label: 'Reference pressure',   value: <M math="p_{\mathrm{ref}} = 101\,325~\mathrm{Pa}" /> },
            ]},
            { heading: 'Mesh motion', rows: [
              { label: 'Model',                value: 'Displacement-diffusion' },
              { label: 'Stiffness',            value: 'Blended distance-and-small-volumes' },
              { label: 'Distance exponent',    value: <M math="0.5" /> },
              { label: 'Volume exponent',      value: <M math="2.0" /> },
              { label: 'Reference configuration', value: 'Initial mesh' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: <code>square</code>,    value: <>Periodic prescribed displacement: frequency <M math="f = 1~\mathrm{Hz}" />, amplitude <M math="\mathbf{D} = (0,\,0.1,\,0)~\mathrm{m}" /></> },
              { label: <><code>left</code>, <code>right</code>, <code>bottom</code>, <code>top</code></>, value: 'No-slip walls' },
              { label: <code>symmetry</code>,  value: 'Symmetry plane' },
              { label: 'Pressure pin',         value: <><M math="p_{\mathrm{rel}} = 0" /> at <M math="(-0.5,\,-0.3,\,0)" /></> },
            ]},
            { heading: 'Initialisation', rows: [
              { label: 'Velocity, pressure',   value: <><M math="\mathbf{v}_0 = \mathbf{0}" />, <M math="p_0 = 0" /></> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Analysis type',        value: 'Transient' },
              { label: 'Time integration',     value: 'First-order backward Euler' },
              { label: 'Time step / total time', value: <><M math="\Delta t = 0.1~\mathrm{s}" />, <M math="t_{\mathrm{end}} = 1~\mathrm{s}" /></> },
              { label: 'Advection scheme',     value: 'First-order upwind' },
              { label: 'Under-relaxation',     value: <><M math="\lambda^v = 0.8" />, <M math="\lambda^p = 0.2" /></> },
              { label: 'Outer iterations',     value: <><M math="1" />–<M math="50" /> per step</> },
            ]},
            { heading: 'Linear solver', rows: [
              { label: 'Default',              value: <>Trilinos / GMRES + RILUK; rel. tol. <M math="10^{-6}" />, abs. tol. <M math="10^{-12}" /></> },
              { label: 'RILUK level-of-fill',  value: <M math="2" /> },
              { label: 'RILUK drop tolerance', value: <M math="10^{-3}" /> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS residual target',  value: <M math="10^{-6}" /> },
            ]},
            { heading: 'Output', rows: [
              { label: 'File / fields',        value: <><code>results.e</code> / <code>velocity</code>, <code>pressure</code>, <code>displacement_mesh</code></> },
              { label: 'Output frequency',     value: 'every timestep' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>3. Results</h2>
        <TutorialFigure label="Figure 1"
          src={`${import.meta.env.BASE_URL}figures/y-disp-box.svg`}
          alt="Box vertical displacement"
          caption={<>Probe-point vertical displacement for the oscillating box. The OpenAccel ALE
            solution (symbols) is compared against the prescribed sinusoidal motion{' '}
            <M math="y(t) = 0.1\,\sin(2\pi t)" /> with frequency <M math="f = 1~\mathrm{Hz}" /> and
            amplitude <M math="A = 0.1~\mathrm{m}" /> (solid line). The two curves overlap to within{' '}
            <M math="10^{-4}~\mathrm{m}" /> over one full cycle, confirming the mesh-motion solver
            reproduces the imposed displacement field.</>}
        />

        <figure className="my-8">
          <div className="grid grid-cols-2 gap-4 mb-2 max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <CroppedImage src={`${import.meta.env.BASE_URL}figures/legend_velo_box.svg`} alt="Velocity legend" trim={LEGEND_TRIM} trimBase={LAND} />
              <span className="text-xs font-semibold mt-1" style={{ color: 'var(--text)' }}>Velocity</span>
            </div>
            <div className="flex flex-col items-center">
              <CroppedImage src={`${import.meta.env.BASE_URL}figures/legend_press_box.svg`} alt="Pressure legend" trim={LEGEND_TRIM} trimBase={LAND} />
              <span className="text-xs font-semibold mt-1" style={{ color: 'var(--text)' }}>Pressure</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-md mx-auto">
            {INSTANTS.map(([key, label]) => (
              <div key={key}>
                <div className="grid grid-cols-2 gap-4">
                  <CroppedImage src={`/figures/box_${key}_velocity.svg`} alt={`Velocity t=${label}s`} trim={BOX_TRIM} trimBase={LAND} />
                  <CroppedImage src={`/figures/box_${key}_press.svg`} alt={`Pressure t=${label}s`} trim={BOX_TRIM} trimBase={LAND} />
                </div>
                <p className="text-xs text-center mt-1 mb-2" style={{ color: 'var(--text-dim)' }}>
                  <M math={`t = ${key}~\\mathrm{s}`} />
                </p>
              </div>
            ))}
          </div>
          <figcaption className="mt-2 text-sm text-[var(--text-dim)] text-center leading-relaxed px-2">
            <strong style={{ color: 'var(--text)' }}>Figure 2.</strong> Oscillating box: velocity
            magnitude (left column) and pressure contours (right column) at different instants during
            one oscillation cycle.
          </figcaption>
        </figure>
      </section>

      <Takeaway>
        <p>
          With a <M math="1~\mathrm{Hz}" /> oscillation and a <M math="1~\mathrm{s}" /> simulation
          window, the box completes one full cycle. The blended stiffness keeps the elements adjacent
          to the oscillating wall well-conditioned — the volume-exponent term protects the small
          near-wall cells, and the distance-exponent term protects the elements near the lateral walls
          from being crushed. The case is also a useful regression test for the GCL implementation: a
          spatially uniform field (e.g. a constant velocity initialisation in the absence of boundary
          forcing) should remain uniform on the deforming mesh if the GCL source is correctly
          augmenting the transport-equation residual according to
        </p>
        <Equation math="b_i^\phi \mathrel{-}= \rho_i V_i \phi_i (\nabla \cdot \mathbf{v}_{m,i})" />
      </Takeaway>

      <AcceptanceCriterion>
        The mesh shall complete one full oscillation cycle without element inversion (positive
        Jacobians throughout); the prescribed boundary displacement shall be tracked exactly by the
        mesh; and the RMS residual shall fall below <M math="10^{-6}" /> within the <M math="50" />-iteration outer
        cap on each timestep.
      </AcceptanceCriterion>
    </>
  );
}
