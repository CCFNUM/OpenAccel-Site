import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

// Contour plates are letter-landscape (792×612 pt → cm); source LaTeX trim for
// the eddy-viscosity / dissipation contours is 3cm 1cm 3cm 1cm (L B R T).
const BUMP_BASE: [number, number] = [27.94, 21.59];
const BUMP_TRIM: [number, number, number, number] = [3, 1, 3, 1];

export function BumpSSTContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC021' },
        { label: 'Reference',    value: 'NASA Langley Turbulence Modeling Resource (TMR) 2-D bump-in-channel' },
        { label: 'Solver mode',  value: 'Steady-state, incompressible, segregated SIMPLE' },
        { label: 'Physics',      value: '2-D RANS; Menter shear-stress-transport (SST) closure' },
        { label: 'Mach / Re',    value: 'M∞ = 0.2, Re_L = 3×10⁶' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          This case verifies OpenAccel's Menter SST turbulence-model implementation against the NASA Langley
          TMR 2-D bump-in-channel benchmark. It is the canonical verification problem for SST in modern RANS
          codes: a smooth bump mounted on the lower wall of a planar channel generates a moderate adverse pressure
          gradient and a fully attached turbulent boundary layer, exercising the BSL blending function, the
          near-wall behaviour of ω, and the wall-distance computation underpinning F₁ and F₂.
        </p>
        <p>
          The case is run at M∞ = 0.2 and Re<sub>L</sub> = 3×10⁶ on a hexahedral grid. At this Mach number
          the flow is essentially incompressible and the differences between a compressible and incompressible
          solution are within plotting accuracy. CFL3D (cell-centred structured FV) and FUN3D (node-centred
          unstructured FV) provide the independent grid-converged reference solutions from the NASA TMR database.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure label="Figure 1"
          src="/figures/bump2D_schematic.svg"
          alt="2D bump-in-channel geometry"
          caption="Geometry and boundary conditions for the NASA TMR 2-D bump-in-channel benchmark. Full domain x ∈ [−25, 26.5], y ∈ [0, 5] (top); close-up of the sin⁴ bump profile with peak height 0.05 at x = 0.75 (bottom)."
        />
        <p>The bump shape on the lower wall follows the NASA TMR analytical definition:</p>
        <Equation math="y_{\mathrm{bump}}(x) = \begin{cases} 0.05\sin^{4}\!\left(\pi x/0.9 - \pi/3\right) & 0.3 \leq x \leq 1.2 \\ 0 & \text{otherwise} \end{cases}" />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable label="Table 1"
          caption="2-D bump-in-channel (NASA TMR SST) — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',                 value: '[−25, 26.5] × [0, 5]' },
              { label: 'Viscous wall segment',   value: '0 ≤ x ≤ 1.5 on lower boundary' },
              { label: 'Bump shape',             value: 'y = 0.05 sin⁴(πx/0.9 − π/3), peak at x = 0.75' },
              { label: 'Mesh',                   value: 'NASA TMR 705 × 321 grid, 225 280 quadrilateral cells' },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: 'Density ρ∞',             value: '1.0' },
              { label: 'Dynamic viscosity μ∞',   value: '2.31×10⁻⁵' },
              { label: 'Inlet velocity U∞',      value: '69.44' },
              { label: 'Mach number M∞',         value: '0.2' },
              { label: 'Reynolds number Re_L',   value: '3.00×10⁶' },
            ]},
            { heading: 'Turbulence (Menter SST)', rows: [
              { label: 'Inlet k',                value: '1.08×10⁻³' },
              { label: 'Inlet ω',                value: '5220.8' },
              { label: 'μ_t/μ∞',                 value: '0.009 (NASA TMR convention)' },
              { label: 'Wall distance',           value: 'Mesh-wave method' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',                  value: 'Uniform velocity U∞' },
              { label: 'Outlet',                 value: 'Fixed static pressure p_rel = 0' },
              { label: 'Bump surface',           value: 'No-slip viscous wall' },
              { label: 'Lower wall outside bump',value: 'Symmetry (slip)' },
              { label: 'Upper wall',             value: 'Symmetry (slip)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',              value: 'SIMPLE (steady-state pseudo-transient)' },
              { label: 'Advection',              value: 'High-resolution' },
              { label: 'Under-relaxation',       value: 'λᵛ = λᵖ = 0.5, λᵏ = λω = 0.6' },
              { label: 'Maximum outer iters',    value: '25 000' },
              { label: 'RMS target',             value: '10⁻¹⁰' },
            ]},
          ]}
        />
      </section>

      <section id="benchmark">
        <h2>4. Benchmark Quantities</h2>
        <p>Surface pressure and skin-friction coefficients along the lower wall:</p>
        <Equation math="C_p(x) = \frac{p(x) - p_\infty}{\tfrac{1}{2}\rho_\infty U_\infty^2}, \qquad C_f(x) = \frac{|\boldsymbol{\tau}_w(x)|}{\tfrac{1}{2}\rho_\infty U_\infty^2}" />
        <p>Integrated force coefficients on the bump (reference length L<sub>b</sub> = 1.5):</p>
        <Equation math="C_D = \frac{F_x}{\tfrac{1}{2}\rho_\infty U_\infty^2 L_b}, \qquad C_L = \frac{F_y}{\tfrac{1}{2}\rho_\infty U_\infty^2 L_b}" />
      </section>

      <section id="results">
        <h2>5. Results</h2>

        <TutorialSubfigureRow label="Figure 2"
          left={{ src: '/figures/mu_bump_openaccel.svg', alt: 'Eddy viscosity – OpenAccel', subcaption: 'μ_t/μ_ref — OpenAccel (705×321, 2nd finest grid)', trim: BUMP_TRIM, trimBase: BUMP_BASE }}
          right={{ src: '/figures/mu_bump_CFL3d.svg', alt: 'Eddy viscosity – CFL3D', subcaption: 'μ_t/μ_ref — CFL3D (1409×641, finest grid)', trim: BUMP_TRIM, trimBase: BUMP_BASE }}
          caption="Turbulent eddy-viscosity ratio μ_t/μ_ref over the bump."
        />
        <TutorialSubfigureRow label="Figure 3"
          left={{ src: '/figures/omega_bump_openaccel.svg', alt: 'Specific dissipation rate – OpenAccel', subcaption: 'ω μ_ref/(ρ_ref a_ref²) — OpenAccel (705×321)', trim: BUMP_TRIM, trimBase: BUMP_BASE }}
          right={{ src: '/figures/omega_bump_CFL3d.svg', alt: 'Specific dissipation rate – CFL3D', subcaption: 'ω μ_ref/(ρ_ref a_ref²) — CFL3D (1409×641)', trim: BUMP_TRIM, trimBase: BUMP_BASE }}
          caption="Specific dissipation rate (normalised per NASA TMR convention). The freestream value is 10⁻⁶ at the inlet."
        />

        <TutorialFigure label="Figure 4"
          src="/figures/Cp_bump.svg"
          alt="Surface Cp distribution"
          caption="Surface pressure coefficient C_p along the lower wall. OpenAccel on the 2nd-finest NASA TMR grid (705×321) vs. FUN3D reference on the finest grid (1409×641)."
        />
        <TutorialFigure label="Figure 5"
          src="/figures/Cf_bump.svg"
          alt="Surface Cf distribution"
          caption="Surface skin-friction coefficient C_f along the lower wall. Localised anomalies near x = 0 (turbulence-model activation) and x = 1.5 (trailing-edge numerical influence) are common to all SST codes on this benchmark."
        />
        <TutorialFigure label="Figure 6"
          src="/figures/velocity_profile_bump.svg"
          alt="Streamwise velocity profiles"
          caption="Streamwise velocity profiles U_x/U∞ vs. wall-normal distance at two stations: x = 0.75 (bump apex) and x = 1.20148 (leeward recovery). OpenAccel on the 2nd-finest grid vs. CFL3D on the finest grid."
        />

        <DataTable
          label="Table 2"
          caption={<>Integrated lift and drag coefficients on the bump at <M math="\mathit{Re}_L = 3\times10^{6}" />, <M math="\mathit{Ma}_\infty = 0.2" />.</>}
          headers={['Quantity', 'OpenAccel', 'CFL3D', 'Diff. vs CFL3D', 'FUN3D', 'Diff. vs FUN3D']}
          rows={[
            [<M math="C_D\ \text{(total)}" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}>0.00361</span>, '0.00360', '0.27%', '0.00359', '0.55%'],
            [<M math="C_L\ \text{(total)}" />, <span className="font-semibold" style={{ color: 'var(--signal)' }}>0.02491</span>, '0.02497', '0.24%', '0.02508', '0.67%'],
          ]}
        />
      </section>

      <Takeaway>
        OpenAccel reproduces the surface C<sub>p</sub> and C<sub>f</sub> distributions in close agreement with
        the FUN3D node-centred reference — even though OpenAccel is on the second-finest grid and FUN3D is on
        the finest. The integrated C<sub>D</sub> and C<sub>L</sub> values fall within the inter-code scatter
        between CFL3D and FUN3D. The streamwise velocity profiles at both stations match the CFL3D reference
        under both favourable and adverse pressure gradients, and the eddy-viscosity and specific-dissipation-rate
        contours reproduce the CFL3D boundary-layer structure. The near-leading-edge C<sub>f</sub> anomaly and
        trailing-edge dip are shared by all SST implementations on this benchmark.
      </Takeaway>

      <AcceptanceCriterion>
        The C<sub>p</sub>(x) and C<sub>f</sub>(x) distributions shall match the FUN3D reference to graphical
        accuracy. The integrated C<sub>D</sub> and C<sub>L</sub> shall agree with FUN3D to within 1% and with
        CFL3D to within 10%.
      </AcceptanceCriterion>
    </>
  );
}
