import { TutorialFigure, TutorialSubfigureRow, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
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
        <TutorialFigure label="Figure 1"
          src="/figures/taylor.svg"
          alt="Taylor–Couette–Poiseuille setup"
          caption="Taylor–Couette–Poiseuille validation case. Top: r–θ plane showing the 90° annular sector. Bottom: r–z plane showing the annular gap and the axial velocity profile v_z(r) driven by the imposed pressure gradient."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
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

        <DataTable
          label="Table 2"
          caption={<>Error metrics for the simulated profiles at <M math="z = L/2" />.</>}
          headers={['Metric', <M math="v_{\theta,\mathrm{rel}}(r)~[\mathrm{m/s}]" />, <M math="v_z(r)~[\mathrm{m/s}]" />]}
          rows={[
            [<M math="E_{L^2}" />, '0.0032', '0.0401'],
            [<M math="E_{L^\infty}" />, '0.0203', '0.1168'],
            [<M math="\bar{E}_{\mathrm{rel}}~[\%]" />, '0.06', '0.45'],
          ]}
        />
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <TutorialSubfigureRow label="Figure 2"
          left={{ src: '/figures/vy-taylor.svg',        alt: 'Axial velocity contour',     subcaption: 'Axial velocity v_z contour.' }}
          right={{ src: '/figures/vx-taylor-vector.svg', alt: 'Azimuthal velocity contour', subcaption: 'Relative azimuthal velocity v_θ,rel contour.' }}
          caption="Velocity contours over the 90° annular sector. Strict azimuthal symmetry confirms the rotational periodic interface."
        />
        <TutorialSubfigureStack label="Figure 3"
          items={[
            { src: '/figures/vz-taylor.svg',      alt: 'Axial velocity profile',     subcaption: 'Axial velocity v_z(r) vs. analytical annular Poiseuille profile.' },
            { src: '/figures/v-theta-taylor.svg', alt: 'Azimuthal velocity profile', subcaption: 'Relative azimuthal velocity v_θ,rel(r) vs. analytical Taylor–Couette profile.' },
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
