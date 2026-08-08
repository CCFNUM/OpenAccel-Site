import { TutorialFigure, TutorialSubfigureRow, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// Letter-landscape contour plates (792×612 pt → cm).
const LAND: [number, number] = [27.94, 21.59];

export function TaylorCouetteContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC013' },
        { label: 'Reference',    value: 'Analytical (Taylor–Couette + annular Poiseuille)' },
        { label: 'Solver mode',  value: 'Steady-state, segregated; rotating reference frame' },
        { label: 'Physics / models', value: '3-D incompressible laminar Navier–Stokes in a non-inertial frame' },
        { label: 'Special',      value: <>Rotational periodic boundary conditions on a <M math="90^\circ" /> sector</> },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This case rigorously verifies two infrastructure features in tandem: the implicit
          implementation of the Coriolis source term in a rotating reference frame, following Mangani
          et al. (2014), and the rotational periodic boundary conditions that allow a 3-D annular flow
          to be modelled on a <M math="90^\circ" /> azimuthal sector at a quarter of the cost. Because
          the flow is strictly invariant in the azimuthal direction (<M math="\partial/\partial\theta = 0" />),
          the rotational periodic interface preserves the exact continuous physics of the full{' '}
          <M math="360^\circ" /> annulus.
        </p>
        <p>
          The configuration combines two analytical reference solutions: the Taylor–Couette profile
          arising from the relative rotation of the inner cylinder, and the annular Poiseuille profile
          arising from an imposed axial pressure gradient. In the rotating frame, the inner cylinder
          is stationary, the outer cylinder counter-rotates, and the axial pressure gradient drives
          the through-flow. The artificial Coriolis and centrifugal body forces must balance the
          pressure gradient and viscous shear exactly to recover the analytical velocity profiles.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure label="Figure 1"
          src="/figures/taylor.svg"
          alt="Taylor–Couette–Poiseuille setup"
          caption={<>Taylor–Couette–Poiseuille validation case. Top: <M math="r" />–<M math="\theta" />{' '}
            plane showing the <M math="90^\circ" /> annular sector with the rotating frame{' '}
            <M math="\Omega_{\mathrm{frame}}" /> and the counter-rotating outer wall. Bottom:{' '}
            <M math="r" />–<M math="z" /> plane showing the annular gap and the axial velocity profile{' '}
            <M math="v_z(r)" /> driven by the imposed pressure gradient.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="Taylor–Couette–Poiseuille — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: <>Inner radius <M math="R_i" /></>,   value: <M math="1.0~\mathrm{m}" /> },
              { label: <>Outer radius <M math="R_o" /></>,   value: <M math="2.0~\mathrm{m}" /> },
              { label: <>Length <M math="L" /></>,           value: <M math="4.0~\mathrm{m}" /> },
              { label: 'Azimuthal extent',   value: <><M math="90^\circ" /> (<M math="\pi/2" /> rad) sector</> },
              { label: 'Mesh',               value: <><M math="79\,947" /> nodes / <M math="73\,600" /> elements</> },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: <>Density <M math="\rho" /></>,          value: <M math="5.85~\mathrm{kg\,m^{-3}}" /> },
              { label: <>Dynamic viscosity <M math="\mu" /></>, value: <M math="1.3185~\mathrm{Pa\,s}" /> },
            ]},
            { heading: 'Frame and forcing', rows: [
              { label: 'Frame angular velocity', value: <M math="\Omega_{\mathrm{frame}} = 13.5~\mathrm{rad/s}" /> },
              { label: 'Axial pressure gradient', value: <M math="\partial p / \partial z = -250~\mathrm{Pa/m}" /> },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inner cylinder (in frame)', value: <>Stationary <M math="\Rightarrow" /> rotates at <M math="\Omega_{\mathrm{frame}} R_i = 13.5~\mathrm{m/s}" /> in lab</> },
              { label: 'Outer cylinder (in frame)', value: <>Counter-rotates at <M math="-13.5~\mathrm{rad/s}" /> relative <M math="\Rightarrow" /> stationary in lab</> },
              { label: 'Meridional faces',   value: 'Rotational periodic' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',          value: 'SIMPLE (steady-state)' },
              { label: 'Advection',          value: 'High-resolution Barth–Jespersen' },
              { label: 'Coriolis treatment', value: 'Implicit, per Mangani et al. (2014)' },
            ]},
          ]}
        />
      </section>

      <section id="analytical">
        <h2>4. Analytical reference</h2>
        <p>The relative azimuthal velocity in the rotating frame is</p>
        <Equation math="v_{\theta,\mathrm{rel}}(r) = -18r + \frac{18}{r}~\text{m/s}" />
        <p>
          and in the laboratory frame{' '}
          <M math="v_{\theta,\mathrm{lab}}(r) = v_{\theta,\mathrm{rel}}(r) + \Omega_{\mathrm{frame}} r = -4.5r + 18/r~\text{m/s}" />.
          The boundary conditions are recovered exactly:{' '}
          <M math="v_{\theta,\mathrm{lab}}(R_i) = 13.5~\mathrm{m/s}" /> and{' '}
          <M math="v_{\theta,\mathrm{lab}}(R_o) = 0" />. The axial velocity from the annular Poiseuille
          solution is
        </p>
        <Equation math="v_z(r) = -47.40\,r^2 + 205.16\,\ln r + 47.40~\text{m/s}" />
        <p>
          vanishing at both walls and reaching <M math="\approx 24~\mathrm{m/s}" /> at{' '}
          <M math="r \approx 1.47~\mathrm{m}" />.
        </p>
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <p>
          The error metrics defined in the V&amp;V introduction (<M math="E_{L^2}" />,{' '}
          <M math="E_{L^\infty}" />, <M math="\bar{E}_{\mathrm{rel}}" />) are evaluated on the radial
          line at the axial midplane <M math="z = L/2" />.
        </p>

        <DataTable
          label="Table 2"
          caption={<>Taylor–Couette–Poiseuille: error metrics for the simulated profiles at{' '}
            <M math="z = L/2" />.</>}
          headers={['Metric', <M math="v_{\theta,\mathrm{rel}}(r)~[\mathrm{m/s}]" />, <M math="v_z(r)~[\mathrm{m/s}]" />]}
          rows={[
            [<M math="E_{L^2}" />, '0.0032', '0.0401'],
            [<M math="E_{L^\infty}" />, '0.0203', '0.1168'],
            [<M math="\bar{E}_{\mathrm{rel}}~[\%]" />, '0.06', '0.45'],
          ]}
        />

        <TutorialSubfigureRow label="Figure 2"
          left={{ src: '/figures/vy-taylor.svg',        alt: 'Axial velocity contour',     subcaption: <>Axial velocity <M math="v_z" /> contour.</>, trim: [5, 3, 3, 3], trimBase: LAND }}
          right={{ src: '/figures/vx-taylor-vector.svg', alt: 'Azimuthal velocity contour', subcaption: <>Relative azimuthal velocity <M math="v_{\theta,\mathrm{rel}}" /> contour.</>, trim: [3, 3, 3, 3], trimBase: LAND }}
          caption={<>Velocity contours over the <M math="90^\circ" /> annular sector. The strict
            azimuthal symmetry confirms the validity of the rotational periodic interface.</>}
        />
        <TutorialSubfigureStack label="Figure 3"
          items={[
            { src: '/figures/vz-taylor.svg',      alt: 'Axial velocity profile',     subcaption: <>Axial velocity <M math="v_z(r)" /> vs. analytical annular Poiseuille profile.</> },
            { src: '/figures/v-theta-taylor.svg', alt: 'Azimuthal velocity profile', subcaption: <>Relative azimuthal velocity <M math="v_{\theta,\mathrm{rel}}(r)" /> vs. analytical Taylor–Couette profile.</> },
          ]}
          caption={<>Radial velocity profiles at the axial midplane <M math="z = L/2" />.</>}
        />
      </section>

      <Takeaway>
        Mean relative errors below 0.5% on both velocity components confirm two independent features
        of the framework simultaneously: the implicit Coriolis source term recovers the exact balance
        with the pressure gradient and viscous shear, and the rotational periodic interface enforces{' '}
        <M math="\theta" />-symmetry without introducing numerical asymmetries. This is the foundation
        on which all turbomachinery validations rest.
      </Takeaway>

      <AcceptanceCriterion>
        The mean relative error against the analytical solution shall remain below 1% for both{' '}
        <M math="v_{\theta,\mathrm{rel}}(r)" /> and <M math="v_z(r)" /> at the axial midplane.
      </AcceptanceCriterion>
    </>
  );
}
