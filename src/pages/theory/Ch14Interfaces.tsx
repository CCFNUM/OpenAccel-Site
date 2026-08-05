import { AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch14Interfaces() {
  useDocumentTitle('Interfaces — Theory Manual');
  return (
    <TheoryLayout chNum="14" title="Interfaces">
      <SEO
        title="Interfaces — Theory Manual"
        description="Conformal vs. non-conformal coupling, the discontinuous-Galerkin (SIPG) interface flux, periodicity, and conjugate heat transfer at fluid-solid interfaces."
        path="/theory/interfaces"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        Interfaces connect mesh regions that do not share a conformal node-to-node matching:
        rotor&ndash;stator couplings, periodic boundaries, and every fluid&ndash;solid coupling.
        OpenAccel treats them with a single non-conformal technology and a runtime conformality
        test.
      </p>

      <H2 id="conformal-nonconformal" num="14.1">Conformal and Non-Conformal Coupling</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        At setup, every interface is geometrically tested for conformality against a
        coincident-node tolerance (<M math="10^{-6}" /> by default): if the two sides match
        node-for-node, a conformal node-matching path is used; otherwise the interface is treated
        non-conformally. This test runs regardless of what the user declared &mdash; a nominally
        non-conformal interface whose meshes happen to match is detected as conformal and treated
        accordingly, unless non-conformal treatment is explicitly forced.
      </p>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        There is exactly <em>one</em> non-conformal method: discontinuous Galerkin (DG). It is
        selected once <em>globally</em> through <code>expert_parameters &gt; non_conformal_method</code>{' '}
        and inherited by every interface; it is <em>not</em> a per-interface setting. The
        per-interface keys that do exist control the DG search, not the method.
        Fluid&ndash;solid interfaces are always forced onto the DG path irrespective of the
        user's setting.
      </DocCallout>

      <H2 id="dg-flux" num="14.2">The Discontinuous-Galerkin Interface Flux</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        On a non-conformal interface, one side's integration points are projected onto the other
        side's elements through a geometric search, and the coupling flux is evaluated with the
        receiving element's shape functions. The assembled condition is a symmetric
        interior-penalty Galerkin (SIPG) pair &mdash; an averaged consistency flux plus a penalty
        on the solution jump.
      </p>

      <KeyBox title="SIPG interface flux (per component)">
        <Equation math="\mathrm{flux}_i = \Bigl[
          \tfrac12\bigl(\mathrm{diffFlux}^{c}_i - \mathrm{diffFlux}^{o}_i\bigr)
          + \pi_{ip}\,\bigl(U^{c}_i - U^{o}_i\bigr)\Bigr]\,A_{ip}
          + \mathrm{advective\ flux}_i ," />
        with the penalty coefficient
        <Equation math="\pi_{ip} = \eta\;\tfrac12\Bigl(\mu_{eff}\,\ell^{-1}\big|_{c}
          + \mu_{eff}\,\ell^{-1}\big|_{o}\Bigr),
          \qquad
          \ell^{-1} = \sum_{\text{face nodes}} \nabla N\cdot\hat{\mathbf{n}}," />
        where <M math="c" />/<M math="o" /> denote the current and opposing sides,{' '}
        <M math="\eta" /> the per-interface <code>penalty_factor</code>, and{' '}
        <M math="\ell^{-1}" /> an inverse element length scale. The averaging weight is fixed at{' '}
        <M math="\tfrac12" /> (symmetric), which makes the jump-term prefactor exactly one
        &mdash; a standard averaged-flux + penalty-jump SIPG pair rather than a full Nitsche
        formulation with an independent symmetrisation parameter.
      </KeyBox>

      <H3 id="pressure-jump" num="14.2.1">Pressure-jump penalty</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        On a non-conformal fluid&ndash;fluid interface the Rhie&ndash;Chow mass flux (see{' '}
        <a href="/theory/pv-coupling">Chapter 15</a>) carries its own interior-penalty term that
        enforces pressure continuity across the partially overlapping faces,
      </p>
      <Equation label="14.1" math="\dot{m}^{penalty}_{ip} = \eta\,\tfrac12
        \Bigl(\rho\,D\,\ell^{-1}\big|_{c} + \rho\,D\,\ell^{-1}\big|_{o}\Bigr)\,(p_c-p_o)," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="\ell^{-1}=\mathbf{n}\cdot\nabla N" /> the inverse element length scale on
        each side and <M math="\eta" /> the same <code>penalty_factor</code>. This term is absent
        at plain interior faces; it is what keeps the pressure field continuous when the two sides
        do not share nodes.
      </p>
      <p style={{ color: 'var(--text-dim)' }}>
        The same per-component structure serves every transported quantity &mdash;
        velocity/momentum with <M math="\mu_{eff}" />, temperature/enthalpy with the effective
        conductivity &mdash; and the pressure-correction equation adds its own pressure-jump
        penalty (below).
      </p>

      <H3 id="search-quadrature" num="14.2.2">Search and quadrature controls</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The Gauss-point projection is controlled per interface: <code>search_tolerance</code>{' '}
        (default <M math="0.01" />), <code>expand_box_percentage</code> (default <M math="0" />),{' '}
        <code>search_method</code> (default <code>stk_kdtree</code>),{' '}
        <code>activate_dynamic_search_algorithm</code> (re-search as sides move),{' '}
        <code>clip_isoparametric_coordinates</code>, and <code>gauss_lobatto_quadrature</code>{' '}
        &mdash; the last selecting node-collocated Gauss&ndash;Lobatto points, the same
        shifted/non-shifted shape-function distinction as{' '}
        <code>velocity_interpolation_type</code> (see <a href="/theory/cvfem">Chapter 11</a>).
      </p>

      <H2 id="periodicity" num="14.3">Periodicity</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Periodic interfaces reuse the DG machinery with a geometric transform between the two
        sides, determined <em>automatically</em> from the mesh:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>
          <strong style={{ color: 'var(--text)' }}>Rotational:</strong> the user supplies{' '}
          <code>rotation_axis</code> and <code>axis_location</code>; the separation{' '}
          <em>angle</em> itself is measured geometrically from the two sides. The transform is{' '}
          <M math="\mathbf{R}=\mathbf{R}(-\theta,\hat{\mathbf{a}})" /> with translation{' '}
          <M math="\mathbf{t}=\mathbf{x}_{axis}-\mathbf{R}\,\mathbf{x}_{axis}" /> accounting for
          rotation about a point offset from the origin.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Translational:</strong> identity rotation; the
          translation vector is likewise measured geometrically &mdash; the user only marks the
          interface as translationally periodic.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>General connection:</strong> identity transform
          &mdash; the plain tied interface used for ordinary solid&ndash;solid and
          fluid&ndash;solid coupling.
        </li>
      </ul>

      <H2 id="cht" num="14.4">Conjugate Heat Transfer</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        CHT is not a separate model: it falls out of applying the energy interface conditions
        across a <code>fluid_solid</code> interface. Two distinct mechanisms exist, chosen{' '}
        <em>dynamically</em> by the turbulence state of the fluid side.
      </p>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>
          Resolved conduction (laminar fluid, solid&ndash;solid, fluid&ndash;fluid).
        </strong>{' '}
        The plain SIPG structure above built on the temperature/enthalpy fields:
      </p>
      <Equation label="14.2" math="\lambda_{eff} = \Gamma\,c_p,
        \qquad
        \mathrm{diffFlux} = -\lambda_{eff}\,\nabla T\cdot\hat{\mathbf{n}}," />
      <Equation label="14.3" math="\mathrm{flux} = \Bigl[\tfrac12\bigl(\mathrm{diffFlux}^{c}-\mathrm{diffFlux}^{o}\bigr)
        + \pi_{ip}(T^{c}-T^{o})\Bigr]A_{ip}
        + \underbrace{\tfrac{\dot{m}}{2}(h^{c}+h^{o}) + \tfrac{|\dot{m}|}{2}(h^{c}-h^{o})}_{\text{upwind-blended enthalpy advection}}," />
      <p style={{ color: 'var(--text-dim)' }}>the advective part active when the side is a fluid.</p>

      <KeyBox title="Turbulent fluid–solid interfaces: HTC treatment">
        When the fluid side is <em>turbulent</em>, the resolved conductive gradient at the wall is
        not meaningful and the interface switches to a wall-function heat-transfer-coefficient
        formulation &mdash; Newton's law of cooling with the wall-function-derived coefficient:
        <Equation math="\mathrm{flux} = -\,h_{wall}\,A\,\bigl(T^{o}-T^{c}\bigr)," />
        the thermal analogue of the momentum wall-function coefficient (see{' '}
        <a href="/theory/postprocessing">Chapter 18</a>). The switch is automatic; no user input
        selects it.
      </KeyBox>
    </TheoryLayout>
  );
}
