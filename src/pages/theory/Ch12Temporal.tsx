import { Info, AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2 } from '../get-started/GsLayout';

export function Ch12Temporal() {
  useDocumentTitle('Temporal Discretisation — Theory Manual');
  return (
    <TheoryLayout chNum="12" title="Temporal Discretisation">
      <SEO
        title="Temporal Discretisation — Theory Manual"
        description="First- and second-order backward-difference time-stepping (BDF1/BDF2), the leading transient coefficient, and the false-transient term for steady-state runs."
        path="/theory/temporal"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        The transient term <M math="\partial(\rho\phi)/\partial t" /> appears in the diagonal
        coefficient <M math="a_{ii}" /> and the source <M math="b_i" /> of <em>every</em>{' '}
        transport equation (see <a href="/theory/cvfem">Chapter 11</a>). Rather than repeat its
        discretisation in each model chapter, this chapter collects the time-stepping schemes
        once. OpenAccel offers two backward-difference schemes &mdash; first- and second-order
        &mdash; selected through <code>transient_scheme</code>; steady runs replace the physical
        transient term with the false-transient term of{' '}
        <a href="#false-transient">Section 12.4</a>.
      </p>

      <H2 id="bdf1" num="12.1">First-Order Backward Euler (BDF1)</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The first-order scheme uses a two-level backward difference. Writing the transient term
        through interpolation coefficients <M math="c=\{c_0,c_1\}=\{1,-1\}" />, its contribution
        to the discrete system is
      </p>
      <KeyBox title="BDF1 transient contribution">
        <Equation math="a_{ii} \mathrel{+}= \frac{\rho_i V_i}{\Delta t},
          \qquad
          b_i \mathrel{-}= \frac{\rho_i V_i}{\Delta t}\bigl(\phi_i - \phi_i^{\circ}\bigr)," />
        which is the standard <M math="\dfrac{\rho V}{\Delta t}\bigl(\phi^{n+1}-\phi^{n}\bigr)" />{' '}
        first-order transient term, with <M math="\phi^{\circ}=\phi^{n}" /> the previous-time-step
        value.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        BDF1 is unconditionally stable and strictly bounded, at the cost of first-order temporal
        accuracy (numerical diffusion in time).
      </p>

      <H2 id="bdf2" num="12.2">Second-Order Backward Difference (BDF2)</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The second-order scheme uses a three-level stencil. For a possibly non-uniform time step,
        with the ratio <M math="\omega=\Delta t/\Delta t^{\text{prev}}" />, the coefficients are
      </p>
      <KeyBox title="BDF2 coefficients and contribution">
        <Equation math="c_0 = \frac{1+2\omega}{1+\omega},\qquad
          c_1 = -(1+\omega),\qquad
          c_2 = \frac{\omega^{2}}{1+\omega}," />
        <Equation math="a_{ii} \mathrel{+}= c_0\,\frac{\rho_i V_i}{\Delta t},
          \qquad
          b_i \mathrel{-}= \frac{V_i}{\Delta t}\bigl(c_0\,\rho_i\phi_i
          + c_1\,\rho_i^{\circ}\phi_i^{\circ}
          + c_2\,\rho_i^{\circ\circ}\phi_i^{\circ\circ}\bigr)," />
        with <M math="\phi^{\circ}=\phi^{n}" /> and <M math="\phi^{\circ\circ}=\phi^{n-1}" />.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        For a uniform time step (<M math="\omega=1" />) the coefficients reduce to the textbook
        constant-step values <M math="c_0=\tfrac32" />, <M math="c_1=-2" />, <M math="c_2=\tfrac12" />.
        BDF2 is second-order accurate and remains unconditionally stable, but is not strictly
        monotone, so it can admit small temporal overshoots on sharp fronts.
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        On the very first time step there is no second previous level <M math="\phi^{n-1}" />, so
        the scheme falls back to BDF1 for that step only. This fallback is a decision made at the{' '}
        <em>call site</em> that assembles the transient term &mdash; it chooses which coefficient
        set to request &mdash; rather than a branch inside the BDF2 coefficient routine itself.
      </DocCallout>

      <H2 id="leading-coefficient" num="12.3">The Leading Coefficient and Coupling</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The leading transient coefficient, denoted <M math="\gamma_1" />, is <M math="c_0" /> of
        the selected scheme: <M math="\gamma_1=1" /> for BDF1 (and for steady runs), and{' '}
        <M math="\gamma_1=(1+2\omega)/(1+\omega)" /> for BDF2. This same coefficient sets the
        fractional-step pressure-velocity coupling coefficient{' '}
        <M math="D=\Delta t/(\gamma_1\rho)" /> of <a href="/theory/pv-coupling">Chapter 15</a>,
        tying the projection method's mass-flux scaling directly to the temporal scheme in use.
      </p>

      <H2 id="false-transient" num="12.4">Steady-State Analysis and the False-Transient Term</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A steady analysis drops the physical transient term, but it does <em>not</em> leave the
        diagonal untouched. Every equation's node-terms assembler instead adds a{' '}
        <em>false-transient</em> (pseudo-transient) term to the matrix diagonal, structurally
        identical to a first-order transient term but built from a single fixed pseudo-time-scale{' '}
        <M math="\tau" /> rather than a physical time step.
      </p>

      <KeyBox title="False-transient diagonal term">
        <Equation math="a_{ii} \mathrel{+}= \frac{\rho_i V_i}{\tau},
          \qquad
          \text{(diagonal only — no contribution to } b_i\text{)}," />
        where <M math="\tau" /> is the user-specified <code>physical_timescale</code> (default{' '}
        <M math="1.0" />), a single global scalar applied identically to every equation.
      </KeyBox>

      <p style={{ color: 'var(--text-dim)' }}>
        The absence of any right-hand-side contribution is the essential difference from a real
        BDF1 step: there is no previous pseudo-state <M math="\phi^{\circ}" /> to subtract, so the
        term does not march the solution through pseudo-time &mdash; it only augments the
        diagonal. It therefore acts as an <em>implicit conditioning/relaxation</em> device: a
        smaller <M math="\tau" /> adds more diagonal dominance and damps the update more strongly
        (robust but slow), while a larger <M math="\tau" /> approaches the undamped steady
        operator (faster but less stable). This is why it is often called a false transient
        &mdash; it borrows the <em>form</em> of a transient term for stability without
        integrating in time.
      </p>

      <p style={{ color: 'var(--text-dim)' }}>
        Mechanically, the steady path reuses the transient machinery directly: the coupling
        coefficient of <a href="/theory/pv-coupling">Chapter 15</a> is assembled from{' '}
        <M math="\mathrm{d}t = \tau" /> for a steady run (the physical time step is simply
        replaced by <M math="\tau" /> in the same expression), while the BDF coefficient branches
        remain gated by the transient flag and are never taken, so <M math="\gamma_1=1" /> and the
        pseudo-step <M math="D" /> coefficient becomes <M math="D = \tau/\rho" /> &mdash;
        structurally a BDF1 step with <M math="\gamma_1=1" />.
      </p>

      <KeyBox title="Steady-state diagonal, general equation">
        <Equation math="a_{ii} = \underbrace{\frac{\rho_i V_i}{\tau}}_{\text{false transient}}
          + \sum_{ip}\Bigl(\text{advection} + \text{diffusion}\Bigr),
          \qquad \tau = \texttt{physical\_timescale}." />
      </KeyBox>

      <p style={{ color: 'var(--text-dim)' }}>
        Two independent mechanisms therefore stabilise a steady run and stack together: the
        false-transient term changes what is assembled into the matrix, and the implicit
        under-relaxation factors of <a href="/theory/pv-coupling">Chapter 15</a> and{' '}
        <a href="/theory/linear-solvers">Chapter 16</a> relax the solution update after each
        solve. Neither replaces the other.
      </p>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        <M math="\tau" /> is a <em>fixed</em> global constant: it is not a per-cell CFL/Courant-based
        local time step, and it is neither computed automatically nor ramped over the run. Faster
        or slower pseudo-time convergence requires manually choosing a different{' '}
        <code>physical_timescale</code> up front. The key is read only for steady-state runs (
        <code>analysis_type &gt; option: steady_state</code>); it is ignored for transient runs,
        and if the <code>convergence_controls</code> block is omitted it silently keeps its
        default of <M math="1.0" />.
      </DocCallout>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        Only these two temporal schemes exist: <code>first_order_backward_euler</code> and{' '}
        <code>second_order_backward_euler</code>. There is no Crank&ndash;Nicolson, no
        higher-than-second-order backward scheme, and no explicit Runge&ndash;Kutta path for the
        flow or scalar transport equations. (The RK4 integrator of{' '}
        <a href="/theory/rigidbody-fsi">Chapter 10</a> is a separate ODE solver for rigid-body
        dynamics, not a flow time-integration scheme.)
      </DocCallout>
    </TheoryLayout>
  );
}
