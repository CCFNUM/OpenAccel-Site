import { Info, AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { SourceBox } from '@/components/SourceBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch5Heat() {
  useDocumentTitle('Heat Transfer and Compressible Flow — Theory Manual');
  return (
    <TheoryLayout chNum="5" title="Heat Transfer and Compressible Flow">
      <SEO
        title="Heat Transfer and Compressible Flow — Theory Manual"
        description="Thermal-energy and total-energy formulations, the NASA-polynomial specific-heat law, the ideal-gas equation of state, transport properties, and compressible stabilisation."
        path="/theory/heat"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        In case of any possible heat-transfer phenomena, or in the case of a compressible flow,
        the energy conservation is employed. Heat transfer is activated per domain through{' '}
        <code>heat_transfer</code> (<code>isothermal</code>, <code>thermal_energy</code>, or{' '}
        <code>total_energy</code>); solid domains require the constant-density equation of state.
      </p>

      <H2 id="thermal-energy" num="5.1">Incompressible Scenario: Thermal Energy</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        For heat-transfer modelling in incompressible scenarios, the thermal energy equation is
        employed. This equation uses the specific enthalpy <M math="h" /> as the transported
        scalar, which is related to temperature through the differential relation{' '}
        <M math="\mathrm{d}h=c_p\,\mathrm{d}T" />. The thermal energy equation reads
      </p>
      <Equation label="5.1" math="\frac{\partial\rho h}{\partial t} + \nabla\cdot(\rho\mathbf{v}h)
        = \nabla\cdot\!\left(\frac{\lambda_{eff}}{c_p}\nabla h\right) + S^{h}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\lambda_{eff}=\lambda+\mu_t c_p/Pr_t" /> is the effective thermal
        conductivity combining laminar and turbulent contributions, <M math="Pr_t" /> is the
        turbulent Prandtl number, and <M math="S^{h}" /> represents volumetric energy sources.
        This equation follows the general transport equation form (see{' '}
        <a href="/theory/flow">Chapter 3</a>) with diffusion coefficient{' '}
        <M math="\Gamma^{h}=\lambda_{eff}/c_p" />. For a constant specific heat capacity{' '}
        <M math="c_p" />, the temperature is recovered from the specific enthalpy as
      </p>
      <Equation label="5.2" math="T = T_{ref} + \frac{h-h_{ref}}{c_p}." />
      <p style={{ color: 'var(--text-dim)' }}>
        The only source term assembled in the thermal-energy path is a plain user-specified
        volumetric or total energy source, <M math="b_i \mathrel{+}= S^{h}_i\,V_i" /> (a total
        source is divided by the domain volume); no viscous-work or pressure-work terms exist in
        this path, consistent with its incompressible/low-Mach scope.
      </p>

      <H2 id="total-energy" num="5.2">Compressible Scenario: Total Energy</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        For a compressible flow, the energy source will involve, among other contributions, a
        pressure work which arises due to change of density:
      </p>
      <Equation label="5.3" math="S^{T} = \frac{Dp}{Dt} = \frac{\partial p}{\partial t} + \mathbf{v}\cdot\nabla p ." />
      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel allows for a total energy equation solution rather than a thermal energy
        equation. The total energy equation features specific total enthalpy <M math="h_0" /> as
        the solution field:
      </p>
      <Equation label="5.4" math="\frac{\partial\rho h_0}{\partial t} + \nabla\cdot(\rho\mathbf{v}h_0)
        = \nabla\cdot(\lambda_{eff}\nabla T) + \frac{\partial p}{\partial t} + S^{h_0}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="S^{h_0}" /> represents energy sources such as viscous dissipation. The
        specific total enthalpy is related to the specific enthalpy according to
      </p>
      <Equation label="5.5" math="h = h_0 - \frac{1}{2}\,\mathbf{v}\cdot\mathbf{v}." />

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        Because the transported variable is the total <em>enthalpy</em>{' '}
        <M math="h_0=h+\tfrac12|\mathbf{v}|^{2}" /> rather than the total energy{' '}
        <M math="E=e+\tfrac12|\mathbf{v}|^{2}" />, the pressure-work effect (the{' '}
        <M math="p/\rho" /> contribution) is already baked into the choice of <M math="h" />{' '}
        versus <M math="e" /> as the transported scalar &mdash; solving the enthalpy form is the
        standard way to avoid a separate explicit pressure-work source term, and none is
        assembled.
      </DocCallout>

      <H3 id="viscous-work" num="5.2.1">Viscous work</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        When <code>include_viscous_work: true</code>, the viscous-work source is assembled with
        the full compressible stress tensor,
      </p>
      <Equation label="5.6" math="\tau_{ji} = \mu_{eff}\!\left(\frac{\partial U_j}{\partial x_i}
        + \frac{\partial U_i}{\partial x_j}\right)
        - \frac{2}{3}\,\mu_{eff}\,(\nabla\cdot\mathbf{v})\,\delta_{ji},
        \qquad
        VW_i = \sum_j \tau_{ji}\,U_j ," />
      <p style={{ color: 'var(--text-dim)' }}>
        whose flux divergence enters the <M math="h_0" /> balance &mdash; the same{' '}
        <M math="-\tfrac23\mu\,\nabla\cdot\mathbf{v}" /> correction as in the momentum stress (see{' '}
        <a href="/theory/flow">Chapter 3</a>).
      </p>

      <H3 id="enthalpy-polynomial" num="5.2.2">Enthalpy and the specific heat polynomial</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        For an ideal gas, <M math="h" /> is a function of temperature and is given by
      </p>
      <Equation label="5.7" math="h(T) = h_{ref} + \int_{T_{ref}}^{T} c_p(T)\,\mathrm{d}T ." />
      <p style={{ color: 'var(--text-dim)' }}>
        The specific heat capacity at constant pressure can be expressed as a <M math="p" />-order
        polynomial in <M math="T" />:
      </p>
      <Equation label="5.8" math="c_p(T) = a_0 + a_1 T + a_2 T^{2} + a_3 T^{3} + \dots + a_p T^{p}." />
      <p style={{ color: 'var(--text-dim)' }}>
        Substituting into Equation 5.7 and evaluating the integral gives
      </p>
      <Equation label="5.9" math="h(T) = h_{ref} + \sum_{k=0}^{p}\frac{a_k}{k+1}\bigl(T^{k+1}-T_{ref}^{k+1}\bigr)." />
      <p style={{ color: 'var(--text-dim)' }}>
        To determine the temperature corresponding to a given specific enthalpy <M math="h" />,
        one must solve for <M math="T" /> in Equation 5.9. Letting the right-hand side be a
        function of <M math="T" />, this becomes a nonlinear algebraic equation:
      </p>
      <Equation label="5.10" math="f(T) = \sum_{k=0}^{p}\frac{a_k}{k+1}\,T^{k+1} - C = 0,
        \qquad
        C = h - h_{ref} + \sum_{k=0}^{p}\frac{a_k}{k+1}\,T_{ref}^{k+1}," />
      <p style={{ color: 'var(--text-dim)' }}>
        which generally does not admit an analytical solution, especially for <M math="p>3" />,
        and must be solved numerically.
      </p>

      <SourceBox>
        The implemented polynomial is the NASA form with up to eight coefficients,{' '}
        <M math="c_p/R = a_1 + a_2 T + \dots + a_8 T^{7}" /> (<M math="a_1" />&ndash;
        <M math="a_5" /> mandatory, <M math="a_6" />&ndash;<M math="a_8" /> optional), integrated
        term by term through the recurrence <M math="h\text{-coeff}_{k+1}=R\,a_k/k" />.
      </SourceBox>

      <p style={{ color: 'var(--text-dim)' }}>
        The diffusion term in the total-enthalpy equation explicitly involves the temperature{' '}
        <M math="T" />; it can, however, be reformulated in terms of <M math="h_0" />. Starting
        from <M math="\mathrm{d}h=c_p\,\mathrm{d}T" /> we obtain <M math="\nabla h = c_p\nabla T" />;
        taking the gradient of <M math="h_0 = h + \tfrac12\mathbf{v}\cdot\mathbf{v}" /> gives
      </p>
      <Equation label="5.11" math="\nabla h_0 = c_p\nabla T + \frac{1}{2}\nabla(\mathbf{v}\cdot\mathbf{v})," />
      <p style={{ color: 'var(--text-dim)' }}>and solving for <M math="\nabla T" />:</p>
      <Equation label="5.12" math="\nabla T = \frac{1}{c_p}\nabla h_0
        - \frac{1}{2c_p}\nabla(\mathbf{v}\cdot\mathbf{v})." />

      <H2 id="equation-of-state" num="5.3">Equation of State</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A constitutive relation, i.e. the ideal gas law, is required to relate density to pressure
        and temperature:
      </p>
      <KeyBox title="Ideal-gas law and compressibility">
        <Equation math="\rho = \frac{p}{RT} = \psi\,p,
          \qquad
          \psi = \frac{1}{RT}," />
        where <M math="\psi" /> is the compressibility field used by the compressible
        pressure-correction equation of <a href="/theory/pv-coupling">Chapter 15</a>.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        The ideal gas is the only equation of state implemented besides constant density; no
        real-gas or cubic equation of state exists.
      </p>

      <H2 id="transport-properties" num="5.4">Transport Properties</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The dynamic viscosity and thermal conductivity may be constant or temperature dependent.
        Sutherland's law is available for both:
      </p>
      <Equation label="5.13" math="\mu(T) = \mu_{ref}\left(\frac{T}{T_{ref}}\right)^{\!n}
        \frac{T_{ref}+S}{T+S}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with reference value, reference temperature, Sutherland constant <M math="S" /> and
        temperature exponent <M math="n" /> as the four parameters (conductivity uses the same
        form with its own four).
      </p>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        The conductivity option named <code>kinetic_theory_model</code> does <em>not</em> implement
        a kinetic-theory (Chapman&ndash;Enskog, <M math="\lambda\propto\sqrt{T}" />) law. The
        implemented formula is a simple linear correlation,{' '}
        <M math="\lambda(T) = c_1 + c_2\,T" />, so the name is misleading &mdash; treat it as a
        two-parameter linear conductivity model.
      </DocCallout>

      <p style={{ color: 'var(--text-dim)' }}>
        The momentum diffusion uses <M math="\mu_{eff}=\mu+\mu_t" />. To guard against a cold
        start before the turbulence model has run, the assembled value is floored rather than
        overwritten: for a laminar domain <M math="\mu_{eff}=\mu" /> exactly, while for a
        turbulent domain <M math="\mu_{eff}=\max(\mu_{eff},\mu)" />, so the turbulence
        contribution is never erased but can never fall below the molecular value.
      </p>

      <H2 id="compressible-stabilisation" num="5.5">Compressible Stabilisation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Near shocks the high-resolution scheme needs additional dissipation. When{' '}
        <code>high_speed_blend_damping</code> is enabled, a pressure-extrema shock sensor blended
        with a supersonic gate produces a local damping factor:
      </p>
      <Equation label="5.14" math="\begin{aligned}
        s = \frac{p_{max}-p_{min}}{\max\bigl(|p+p_{ref}|,\ \epsilon\bigr)}, &\qquad
        g = \mathrm{clamp}\!\left(\frac{M-M_{lo}}{M_{hi}-M_{lo}},\,0,\,1\right)
        \end{aligned}" />
      <Equation label="5.15" math="\begin{aligned}
        \nu = C_{damp}\,g\,s, &\qquad
        \text{damp} = \frac{1}{1+\nu^{2}}
        \end{aligned}" />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="s" /> measures the local pressure jump across the stencil and{' '}
        <M math="g" /> activates the damping only above <M math="M_{lo}" />, with the Mach number
        of <a href="/theory/postprocessing">Chapter 18</a>.
      </p>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        The sensor constants <M math="M_{lo}=0.7" />, <M math="M_{hi}=1.0" /> and{' '}
        <M math="C_{damp}=3.0" /> are <em>hard-coded</em>, not YAML-exposed: the feature can be
        toggled but its sensitivity and activation range cannot be tuned from input.
      </DocCallout>
    </TheoryLayout>
  );
}
