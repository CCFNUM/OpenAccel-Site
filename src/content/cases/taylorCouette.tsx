import { TutorialFigure, TutorialSubfigureRow, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function TaylorCouetteContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC013' },
        { label: 'Reference',    value: 'Analytical (Taylor–Couette + annular Poiseuille)' },
        { label: 'Solver mode',  value: 'Steady-state, segregated; rotating reference frame' },
        { label: 'Physics',      value: '3-D incompressible laminar Navier–Stokes in a non-inertial frame' },
        { label: 'Special',      value: 'Rotational periodic boundary conditions on a 90° sector' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          This case rigorously verifies two infrastructure features in tandem: the implicit implementation of the
          Coriolis source term in a rotating reference frame, and the rotational periodic boundary conditions that
          allow a 3-D annular flow to be modelled on a 90° azimuthal sector. The configuration combines two
          analytical reference solutions: the Taylor–Couette profile from relative rotation of the inner cylinder,
          and the annular Poiseuille profile from an imposed axial pressure gradient.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/taylor.png"
          alt="Taylor–Couette–Poiseuille setup"
          caption="Taylor–Couette–Poiseuille validation case. Top: r–θ plane showing the 90° annular sector. Bottom: r–z plane showing the annular gap and the axial velocity profile v_z(r) driven by the imposed pressure gradient."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="Taylor–Couette–Poiseuille — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Inner radius R_i',   value: '1.0 m' },
              { label: 'Outer radius R_o',   value: '2.0 m' },
              { label: 'Length L',           value: '4.0 m' },
              { label: 'Azimuthal extent',   value: '90° (π/2 rad) sector' },
              { label: 'Mesh',               value: '79 947 nodes / 73 600 elements' },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: 'Density ρ',          value: '5.85 kg/m³' },
              { label: 'Dynamic viscosity μ', value: '1.3185 Pa·s' },
            ]},
            { heading: 'Frame and forcing', rows: [
              { label: 'Frame angular velocity', value: 'Ω_frame = 13.5 rad/s' },
              { label: 'Axial pressure gradient', value: '∂p/∂z = −250 Pa/m' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inner cylinder (in frame)', value: 'Stationary → rotates at 13.5 m/s in lab' },
              { label: 'Outer cylinder (in frame)', value: 'Counter-rotates at −13.5 rad/s → stationary in lab' },
              { label: 'Meridional faces',   value: 'Rotational periodic' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',          value: 'SIMPLE (steady-state)' },
              { label: 'Advection',          value: 'High-resolution Barth–Jespersen' },
              { label: 'Coriolis treatment', value: 'Implicit, per Mangani et al.' },
            ]},
          ]}
        />
      </section>

      <section id="analytical">
        <h2>4. Analytical Reference</h2>
        <p>The relative azimuthal velocity in the rotating frame is:</p>
        <Equation math="v_{\theta,\mathrm{rel}}(r) = -18r + \frac{18}{r}~\text{m/s}" />
        <p>The axial velocity from the annular Poiseuille solution is:</p>
        <Equation math="v_z(r) = -47.40\,r^2 + 205.16\,\ln r + 47.40~\text{m/s}" />
        <p>vanishing at both walls and reaching ≈ 24 m/s at r ≈ 1.47 m.</p>

        <div className="my-6 overflow-x-auto rounded-lg border border-[var(--hairline)]">
          <table className="w-full text-sm border-collapse">
            <caption className="text-left text-xs font-mono text-[var(--text-dim)] px-4 py-2 border-b border-[var(--hairline)] bg-[var(--surface-2)] caption-top">
              Error metrics for the simulated profiles at z = L/2.
            </caption>
            <thead>
              <tr className="bg-[var(--surface-2)]">
                {['Metric', 'v_θ,rel(r) [m/s]', 'v_z(r) [m/s]'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-mono text-[var(--cold)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['E_L²',           '0.0032', '0.0401'],
                ['E_L∞',           '0.0203', '0.1168'],
                ['Ē_rel [%]',      '0.06',   '0.45'],
              ].map(([m, a, b], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-stripe)]'}>
                  <td className="px-4 py-2 text-[var(--text-dim)] font-medium font-mono">{m}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{a}</td>
                  <td className="px-4 py-2 text-[var(--text)] font-mono text-xs">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <TutorialSubfigureRow
          left={{ src: '/figures/vy-taylor.png',        alt: 'Axial velocity contour',     subcaption: 'Axial velocity v_z contour.' }}
          right={{ src: '/figures/vx-taylor-vector.png', alt: 'Azimuthal velocity contour', subcaption: 'Relative azimuthal velocity v_θ,rel contour.' }}
          caption="Velocity contours over the 90° annular sector. Strict azimuthal symmetry confirms the rotational periodic interface."
        />
        <TutorialSubfigureStack
          items={[
            { src: '/figures/vz-taylor.png',      alt: 'Axial velocity profile',     subcaption: 'Axial velocity v_z(r) vs. analytical annular Poiseuille profile.' },
            { src: '/figures/v-theta-taylor.png', alt: 'Azimuthal velocity profile', subcaption: 'Relative azimuthal velocity v_θ,rel(r) vs. analytical Taylor–Couette profile.' },
          ]}
          caption="Radial velocity profiles at the axial midplane z = L/2."
        />
      </section>

      <Takeaway>
        Mean relative errors below 0.5% on both velocity components confirm two independent features simultaneously:
        the implicit Coriolis source term recovers the exact balance with the pressure gradient and viscous shear,
        and the rotational periodic interface enforces θ-symmetry without introducing numerical asymmetries. This
        is the foundation on which all turbomachinery validations rest.
      </Takeaway>

      <AcceptanceCriterion>
        The mean relative error against the analytical solution shall remain below 1% for both v<sub>θ,rel</sub>(r)
        and v<sub>z</sub>(r) at the axial midplane.
      </AcceptanceCriterion>
    </>
  );
}
