import { Info, AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch6Buoyancy() {
  useDocumentTitle('Buoyancy and Pressure Treatment — Theory Manual');
  return (
    <TheoryLayout chNum="6" title="Buoyancy and Pressure Treatment">
      <SEO
        title="Buoyancy and Pressure Treatment — Theory Manual"
        description="Full and Boussinesq buoyancy body forces, body-force redistribution, and the pressure decompositions used across incompressible, Boussinesq, and compressible regimes."
        path="/theory/buoyancy-pressure"
      />

      <H2 id="buoyancy-driven-flows" num="6.1">Buoyancy-Driven Flows</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Two buoyancy models feed a body force into the momentum equation. The <em>full</em> model
        uses the actual density deficit relative to a reference,
      </p>
      <Equation label="6.1" math="\mathbf{F}_{full} = (\rho-\rho_{ref})\,\mathbf{g}." />
      <p style={{ color: 'var(--text-dim)' }}>
        For cases where temperature variations are not large, the density can be safely assumed
        constant, even though small changes exist; gravitational effects caused by those small
        density changes might still be significant. In such situations a Boussinesq approximation
        is used to model the buoyancy force.
      </p>

      <KeyBox title="Boussinesq body force (as implemented)">
        <Equation math="\mathbf{F}_{B} = -\,\rho\,\beta\,(T-T_{ref})\,\mathbf{g}," />
        with <M math="\beta" /> the thermal-expansion coefficient and <M math="\mathbf{g}" /> gravity.
      </KeyBox>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        This is a <em>non-standard</em> Boussinesq variant: it multiplies by the <em>local</em>{' '}
        density <M math="\rho" />, not the reference density <M math="\rho_{ref}" /> of the
        textbook form <M math="-\rho_{ref}\beta(T-T_{ref})\mathbf{g}" />. Furthermore, the
        Boussinesq model is restricted to constant-density materials: combining it with the
        ideal-gas equation of state is explicitly disallowed at run time.
      </DocCallout>

      <H3 id="body-force-redistribution" num="6.1.1">Body-force redistribution</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        To prevent a spatially discontinuous per-node body force from driving checkerboard
        pressure/velocity artifacts, an optional single-pass volume-weighted smoothing (
        <code>expert_parameters &gt; body_force_redistribution</code>) averages the raw nodal force
        to each element through the sub-control-volume (SCV) volumes and scatters it back:
      </p>
      <Equation label="6.2" math="\mathbf{B}_e = \frac{\sum_{i\in e}\mathbf{F}^{orig}_i\,V^{scv}_i}{\sum_{i\in e}V^{scv}_i},
        \qquad
        \mathbf{F}_i = \frac{1}{V_i}\sum_{e\ni i}\mathbf{B}_e\,V^{scv}_{i\in e}." />
      <p style={{ color: 'var(--text-dim)' }}>
        The smoothed force also feeds the body-force stabilisation term of the Rhie&ndash;Chow
        flux (see <a href="/theory/pv-coupling">Chapter 15</a>).
      </p>

      <H2 id="pressure-decomposition" num="6.2">Pressure Decomposition and Offsets</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Depending on the flow regime and the presence of gravitational body forces, OpenAccel
        employs different decompositions of the pressure variable to improve numerical
        conditioning and physical interpretability.
      </p>

      <H3 id="incompressible-flows" num="6.2.1">Incompressible flows</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        For incompressible flows, the continuity equation is independent of the absolute pressure
        level, and only pressure differences are physically meaningful. OpenAccel therefore always
        solves for the <em>relative</em> (gauge) pressure <M math="p_{rel}" />, defined with
        respect to a user-specified reference pressure <M math="p_{ref}" />:
      </p>
      <Equation label="6.3" math="p_{abs} = p_{rel} + p_{ref}." />
      <p style={{ color: 'var(--text-dim)' }}>
        This avoids round-off errors that would arise from working with absolute pressure values
        (e.g. atmospheric) in flow problems where only local pressure differences drive the flow.
      </p>

      <H3 id="incompressible-boussinesq" num="6.2.2">Incompressible flows with Boussinesq buoyancy</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        When the Boussinesq approximation is active, the large hydrostatic pressure gradient{' '}
        <M math="\rho_{ref}\,\mathbf{g}" /> is present in the momentum equation but carries no
        hydrodynamic information. Retaining it in the solved pressure variable leads to poor
        conditioning. OpenAccel therefore further decomposes the relative pressure into a{' '}
        <em>modified pressure</em> <M math="p_{mod}" /> that excludes the hydrostatic
        contribution:
      </p>
      <Equation label="6.4" math="p_{mod} = p_{rel} - \rho_{ref}\,\mathbf{g}\cdot(\mathbf{R}-\mathbf{R}_{ref})," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\mathbf{R}-\mathbf{R}_{ref}" /> is the position vector relative to a
        user-specified reference location. The pressure gradient in the momentum equation is
        recovered as
      </p>
      <Equation label="6.5" math="\nabla p_{rel} = \nabla p_{mod} + \rho_{ref}\,\mathbf{g}," />
      <p style={{ color: 'var(--text-dim)' }}>
        so the hydrostatic body force cancels exactly with the hydrostatic pressure gradient, and
        only the dynamic pressure gradient drives the flow.
      </p>

      <H3 id="compressible-flows" num="6.2.3">Compressible flows</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        For compressible flows, the pressure appears explicitly in the equation of state and must
        be tracked as an absolute quantity; OpenAccel solves for <M math="p_{abs}=p_{rel}+p_{ref}" />,
        which all thermodynamic property evaluations use. In compressible flows where
        gravitational effects are significant, a modified absolute pressure analogous to Equation
        6.4 is employed:
      </p>
      <Equation label="6.6" math="p_{mod,abs} = p_{abs} - \rho_{ref}\,\mathbf{g}\cdot(\mathbf{R}-\mathbf{R}_{ref})." />

      <H3 id="stored-pressure" num="6.2.4">Stored pressure by regime</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Collecting the cases, the internally stored pressure as a function of the user-input
        (relative) pressure is:
      </p>
      <KeyBox title="Stored pressure by regime">
        <Equation math="\begin{aligned}
          \text{incompressible, no buoyancy:}\quad & p_{stored} = p_{input},\\
          \text{incompressible, buoyant:}\quad & p_{stored} = p_{input} - \rho_{ref}\,\mathbf{g}\cdot(\mathbf{x}-\mathbf{x}_{ref}) \quad\text{(piezometric)},\\
          \text{ideal gas, no buoyancy:}\quad & p_{stored} = p_{input} + p_{ref} \quad\text{(absolute)},\\
          \text{ideal gas, buoyant:}\quad & p_{stored} = (p_{input}+p_{ref}) - \rho_{ref}\,\mathbf{g}\cdot(\mathbf{x}-\mathbf{x}_{ref}).
          \end{aligned}" />
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        The same shift is applied consistently to any static-, average-static- or total-pressure
        boundary value; time- and expression-driven boundary values are re-shifted every
        iteration, while constant and profile-data values are shifted once at initialisation.
      </p>

      <H3 id="floating-pressure-level" num="6.2.5">Floating pressure level</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        When a domain has no Dirichlet pressure boundary condition, the pressure is determined
        only up to an additive constant (a purely Neumann problem). The solver fixes this level by
        choosing a reference node and shifting the whole field so that node reaches a
        user-specified target,
      </p>
      <Equation label="6.7" math="p \mathrel{-}= \bigl(p_{\text{ref node}} - p_{level}\bigr),
        \qquad
        p_{level} = p_{\text{rel level}}\ (+\,p_{ref}\ \text{if compressible})," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="p_{level}" /> buoyancy-shifted to the reference node's location. If this
        domain does not itself need a level but a neighbour across a fluid&ndash;fluid interface
        does, the neighbour's reference-node pressure from the <em>previous</em> iteration is
        borrowed to keep the levels consistent &mdash; introducing a one-iteration lag in that
        specific multi-domain case.
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        These pressure-convention routines are bookkeeping only; they are <em>not</em> the
        velocity&ndash;pressure coupling algorithm. That algorithm lives in the assembly layer and
        is the subject of <a href="/theory/pv-coupling">Chapter 15</a>.
      </DocCallout>
    </TheoryLayout>
  );
}
