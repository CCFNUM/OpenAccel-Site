import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Equation } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function SlabContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC012' },
        { label: 'References',   value: 'Vynnycky et al. (1998); Pohlhausen flat-plate correlation' },
        { label: 'Solver mode',  value: 'Steady-state, segregated (SIMPLE)' },
        { label: 'Physics',      value: '2-D incompressible laminar flow + thermal energy in fluid and solid' },
        { label: 'Special',      value: 'Two-domain CHT coupling at the fluid–solid interface' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          This case is the foundational test of OpenAccel's conjugate heat transfer (CHT) capability. A solid
          slab is embedded in the floor of a fluid channel; forced convection over the slab surface couples the
          temperature field across the fluid–solid interface. The multi-domain framework assembles a single,
          implicitly coupled linear system spanning fluid and solid degrees of freedom simultaneously — without
          iteration lag.
        </p>
        <p>
          Validation has two layers: the local Nusselt-number distribution is compared with the Pohlhausen
          correlation for laminar forced convection over a flat plate, and the dimensionless interface temperature
          and its normal gradient are compared with the high-fidelity numerical benchmark of Vynnycky et al. (1998).
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/slab.svg"
          alt="CHT slab geometry"
          caption="CHT validation case (not to scale). A solid slab is embedded centrally in the floor of the fluid channel; the bottom face of the slab is held at T_hot = 310 K, and the slab side walls are adiabatic."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="CHT heated slab — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Fluid domain',       value: 'L_f × H_f = 10 × 5 m' },
              { label: 'Solid slab',         value: 'w × H_s = 1 × 0.25 m, centred on the floor' },
              { label: 'Mesh',               value: '25 820 nodes / 12 580 elements (combined)' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inlet',              value: 'Velocity inlet at u_in, T_in' },
              { label: 'Outlet',             value: 'Zero-gauge static pressure' },
              { label: 'Slab bottom',        value: 'T_hot = 310 K' },
              { label: 'Slab sides',         value: 'Adiabatic' },
              { label: 'Fluid–solid interface', value: 'General-connection CHT (search tol. 10⁻⁴)' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Algorithm',          value: 'SIMPLE (steady-state)' },
              { label: 'Advection',          value: 'High-resolution Barth–Jespersen' },
              { label: 'Under-relaxation',   value: 'λᵛ = 0.8, λᵖ = 0.2' },
              { label: 'Energy equation',    value: 'Thermal-energy form (viscous work excluded)' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: '10⁻¹⁰ / up to 1000' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <p>The Pohlhausen reference for laminar forced convection over a flat plate at constant wall temperature is:</p>
        <Equation math="\mathrm{Nu}(\tilde{x}) = 0.332\,\mathrm{Re}_{\tilde{x}}^{1/2}\,\mathrm{Pr}^{1/3}" />
        <p>where x̃ is measured from the leading edge of the slab, Re_x̃ = ρ u_in x̃ / μ = 500 x̃, and Pr = 0.01.</p>

        <TutorialFigure
          src="/figures/nusselt_slab.svg"
          alt="Local Nusselt number distribution"
          caption="Local Nusselt number Nu(x̃) along the fluid–solid interface, compared with the Pohlhausen correlation for an isothermal flat plate at Pr = 0.01."
        />
        <TutorialSubfigureStack
          items={[
            { src: '/figures/temp_slab.svg',          alt: 'Dimensionless interface temperature', subcaption: 'Dimensionless interface temperature θ = (T − T_in)/(T_hot − T_in).' },
            { src: '/figures/temp_gradient_slab.svg', alt: 'Wall-normal temperature gradient',    subcaption: 'Dimensionless wall-normal temperature gradient ∂θ/∂y.' },
          ]}
          caption="CHT validation: comparison of the dimensionless interface temperature and its wall-normal gradient with Vynnycky et al. (1998)."
        />
        <TutorialFigure
          src="/figures/temp_contour_slab.svg"
          alt="Steady-state temperature contour"
          caption="Steady-state temperature contour of the CHT case."
        />
      </section>

      <Takeaway>
        Some discrepancy between the present Nu and the Pohlhausen correlation is expected: the reference assumes
        a semi-infinite isothermal plate in a uniform free stream, whereas this case features a finite-length
        heated slab in a confined channel with non-uniform interface temperature. The more demanding test —
        comparison against the conjugate-aware reference of Vynnycky et al. — shows excellent agreement on both
        the interface temperature θ and its wall-normal gradient, confirming that the multi-domain CHT coupling
        enforces both temperature and heat-flux continuity at the interface.
      </Takeaway>

      <AcceptanceCriterion>
        The dimensionless interface temperature and its wall-normal gradient shall match the benchmark of
        Vynnycky et al. (1998) in graphical agreement, and the local Nusselt number shall remain within
        engineering accuracy of the Pohlhausen correlation in the bulk of the slab.
      </AcceptanceCriterion>
    </>
  );
}
