import { Info } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { SourceBox } from '@/components/SourceBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { FigurePlaceholder } from '@/components/theory/FigurePlaceholder';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch11Cvfem() {
  useDocumentTitle('CVFEM Discretisation — Theory Manual');
  return (
    <TheoryLayout chNum="11" title="CVFEM Discretisation">
      <SEO
        title="CVFEM Discretisation — Theory Manual"
        description="The vertex-based control-volume finite-element method: median-dual control volumes, discrete transport coefficients, the GCL term, Barth-Jespersen advection limiting, and the nonlinear stabilisation operator."
        path="/theory/cvfem"
      />

      <H2 id="cvfem-approach" num="11.1">The CVFEM Approach</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel discretises every conservation law with a vertex-based control-volume
        finite-element (CVFEM) method. The unknowns live at the mesh vertices (nodes); around
        each node a <em>median-dual</em> control volume is constructed by joining the centroid of
        every incident element to the midpoints of the element edges meeting at that node.
      </p>
      <p style={{ color: 'var(--text-dim)' }}>
        Figure 11.1 shows the control volume associated with the node <M math="i" /> (shaded). An
        integration point (<M math="ip" />) is located on the control surface of this control
        volume, connecting it to the neighbouring control volumes of the nodes that together form
        the element containing the <M math="ip" />; these node indices are <em>global</em> indices.
        The <M math="ip" /> involves interpolations from all the nodes of its corresponding
        element, which are assigned <em>local</em> indices <M math="k" /> (Figure 11.2). Figure
        11.3 highlights the physical connection of the control volume of node <M math="i" /> with
        a neighbouring control volume of node <M math="j" />: the subset of integration points
        surrounding <M math="i" /> that physically connect it to <M math="j" /> is highlighted. A{' '}
        <em>shared</em> <M math="ip" /> is located on a control surface common to the control
        volumes of both nodes, while a <em>non-shared</em> <M math="ip" /> resides solely on the
        control surface of node <M math="i" />'s control volume; the fluxes through both kinds are
        influenced by the value at node <M math="j" /> through the shape-function interpolation,
        and this influence is reflected in the coefficients below. The subscript <M math="ip" />{' '}
        denotes any integration point on the control surface of node <M math="i" />'s control
        volume, and the superscripts <M math="*" /> and <M math="\circ" /> designate the latest
        available value and the previous-time-step value, respectively.
      </p>

      <FigurePlaceholder
        label="Figure 11.1"
        description="Hand-drawn TikZ schematic of a sample mesh with the median-dual control volume V_i (shaded) centred at node i, its element-centroid and edge-midpoint corners, integration points ip carrying the outward area vector S_ip, and the four neighbour nodes j1-j4."
        caption={<>
          Sample mesh depicting the median-dual control volume <M math="V_i" /> (shaded) centred
          at node <M math="i" />. Element centroids and edge midpoints define the control-surface
          vertices; integration points <M math="ip" /> sit at the midpoint of each
          sub-control-surface and carry the outward area vector <M math="\mathbf{S}_{ip}" />.
          Neighbour nodes <M math="j_1,\dots,j_4" /> contribute to the discrete balance at{' '}
          <M math="i" />.
        </>}
      />

      <FigurePlaceholder
        label="Figure 11.2"
        description="Hand-drawn TikZ schematic of a quadrilateral element with local node indices k=1..4, its centroid c, the median partition into four element sub-control-volumes, and the integration point ip on the sub-control-surface bounding local node 1."
        caption={<>
          A quadrilateral element with local node indices <M math="k=1,\dots,4" />, centroid{' '}
          <M math="c" />, and the median partition into four element sub-control-volumes. The
          integration point <M math="ip" /> lies on the sub-control-surface bounding local node 1;
          the field there is interpolated from all four element nodes,{' '}
          <M math="\phi_{ip}=\sum_k N_k^{ip}\phi_k" />.
        </>}
      />

      <FigurePlaceholder
        label="Figure 11.3"
        description="Hand-drawn TikZ schematic showing the physical connection between the control volumes of neighbouring nodes i and j, distinguishing shared integration points (on the common control surface) from non-shared integration points (on node i's control surface only)."
        caption={<>
          Physical connection between the control volumes of nodes <M math="i" /> and{' '}
          <M math="j" />. The subset of integration points around <M math="i" /> linking it to{' '}
          <M math="j" /> (<M math="ip/i\text{-}j" />) comprises shared <M math="ip" />'s, located
          on the control surface common to both control volumes, and non-shared <M math="ip" />
          's, located solely on the control surface of node <M math="i" />'s control volume; both
          are influenced by the value at node <M math="j" />.
        </>}
      />

      <H3 id="shape-function-interpolation" num="11.1.1">Shape-function interpolation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Interpolations to an <M math="ip" /> from the straddling nodes are done using first-order
        shape functions. For any scalar <M math="\phi" />, the interpolation formula from all
        values <M math="\phi_k" />, with <M math="k" /> a local index of a node of the element
        encapsulating <M math="ip" />, is
      </p>
      <KeyBox title="Integration-point interpolation">
        <Equation math="\phi_{ip} = \sum_{k=1}^{n} N_k^{ip}\,\phi_k,
          \qquad
          \nabla\phi_{ip} = \sum_{k=1}^{n} \nabla N_k^{ip}\,\phi_k," />
        where <M math="N_k^{ip}" /> is the shape-function coefficient at node <M math="k" />{' '}
        corresponding to the integration point <M math="ip" />, and <M math="\nabla N_k^{ip}" />{' '}
        its spatial derivative.
      </KeyBox>

      <p style={{ color: 'var(--text-dim)' }}>
        Two integration-point families exist: standard interior Gauss points (<code>trilinear</code>)
        and node-collocated Gauss&ndash;Lobatto points (<code>linear_linear</code>), selected per
        field through <code>interpolation_scheme &gt; velocity_interpolation_type</code> /{' '}
        <code>pressure_interpolation_type</code>. When the shifted (Gauss&ndash;Lobatto) scheme is
        selected, the assemblers evaluate shifted shape functions and gradients; the same
        shifted/non-shifted distinction underlies the per-interface{' '}
        <code>gauss_lobatto_quadrature</code> key of <a href="/theory/interfaces">Chapter 14</a>.
      </p>

      <SourceBox>
        The master-element machinery &mdash; the SCS/SCV integration-point layout, area-vector
        computation <M math="\mathbf{S}_{ip}" />, SCV volumes, and shape-function tables &mdash; is
        vendored from Sandia's Nalu-Wind CVFEM library (<code>external/nalu</code>); the geometry
        itself is therefore documented in the Nalu-Wind theory manual, while everything built on
        top of it (the physics, models and assembly of this guide) is OpenAccel's own.
      </SourceBox>

      <H2 id="discrete-transport" num="11.2">Discretisation of the General Scalar Transport Equation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The same discretisation applies to all scalar conservation equations, including those for
        specific total enthalpy <M math="h_0" /> or turbulent transport quantities like{' '}
        <M math="k" /> and <M math="\omega" />. The conservation equation of any general transport
        variable <M math="\phi" /> takes the following discrete residual form:
      </p>
      <Equation label="11.1" math="a_{ii}^{\phi}\,\phi_i' + \sum_{j} a_{ij}^{\phi}\,\phi_j' = r_i^{\phi}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\phi'" /> is the correction of <M math="\phi" /> such that{' '}
        <M math="\phi=\phi^{*}+\phi'" /> and <M math="\phi^{*}" /> is the most recent approximate
        value. <M math="r_i^{\phi}" /> is the residual at node <M math="i" />:
      </p>
      <Equation label="11.2" math="r_i^{\phi} = b_i^{\phi} - a_{ii}^{\phi}\phi_i^{*} - \sum_{j} a_{ij}^{\phi}\phi_j^{*}," />
      <p style={{ color: 'var(--text-dim)' }}>with the central coefficient given by</p>
      <KeyBox title="Discrete transport coefficients">
        <Equation math="a_{ii}^{\phi} = \underbrace{\frac{\rho_i V_i}{\Delta t}}_{\text{transient}}
          + \sum_{ip}\left(
          \underbrace{\frac{\dot{m}_{ip}^{*}+|\dot{m}_{ip}^{*}|}{2}}_{\text{advection}}
          - \underbrace{\Gamma^{\phi}_{ip}\,\nabla N_i^{ip}\cdot\mathbf{S}_{ip}}_{\text{diffusion}}
          \right)" />
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        In addition, the off-diagonal coefficients, considering only the <M math="ip" />'s
        indicated in Figure 11.3, are expressed as
      </p>
      <Equation label="11.3" math="a_{ij}^{\phi} = \sum_{ip/i\text{-}j}\left(
        \underbrace{\frac{\dot{m}_{ip}^{*}-|\dot{m}_{ip}^{*}|}{2}}_{\text{advection (0 if non-shared }ip\text{)}}
        - \underbrace{\Gamma^{\phi}_{ip}\,\nabla N_j^{ip}\cdot\mathbf{S}_{ip}}_{\text{diffusion}}
        \right)," />
      <p style={{ color: 'var(--text-dim)' }}>while the source is given by</p>
      <Equation label="11.4" math="b_i^{\phi} = \underbrace{\frac{\rho_i V_i}{\Delta t}\,\phi_i^{\circ}}_{\text{transient}}
        + \underbrace{S_i^{\phi}\,V_i}_{\text{source}} ." />

      <H3 id="gcl-term" num="11.2.1">The GCL term</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        In the equations of <a href="/theory/moving-domains">Chapter 7</a>, where the mesh
        deforms, the unsteady term must account for the geometric-conservation-law term derived
        there. The GCL term is added to the right-hand side of the discrete equation as such:
      </p>
      <Equation label="11.5" math="b_i^{\phi} = \underbrace{\frac{\rho_i V_i}{\Delta t}\,\phi_i^{\circ}}_{\text{transient}}
        - \underbrace{\rho_i V_i\,\phi_i\,(\nabla\cdot\mathbf{v}_{m,i})}_{\text{GCL}}
        + \underbrace{S_i^{\phi}\,V_i}_{\text{source}},
        \qquad
        (\nabla\cdot\mathbf{v}_m)_i = \frac{1}{V_i}\sum_{ip}\mathbf{v}_{m,ip}\cdot\mathbf{S}_{ip}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with the mesh-velocity divergence computed by the same Gauss sum as every other flux.
        With this term a constant field is preserved to machine precision as the mesh moves.
      </p>

      <H2 id="advection" num="11.3">High-Resolution Advection: Barth&ndash;Jespersen Limiter</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Two advection schemes are registered: <code>upwind</code> and{' '}
        <code>high_resolution</code>. Both share the same implicit matrix; they differ only in an
        explicit correction added to the right-hand side, so that the linear system stays
        diagonally dominant regardless of the scheme.
      </p>

      <H3 id="upwind-flux" num="11.3.1">Upwind flux and the implicit operator</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        At each sub-control-surface integration point the advected value is taken from the{' '}
        <em>donor</em> (upwind) node determined by the sign of the mass flux, and the resulting
        contribution is split between the two straddling nodes' rows exactly as in the discrete
        coefficients of <a href="#discrete-transport">Section 11.2</a>:
      </p>
      <KeyBox title="Upwind advective split">
        <Equation math="\phi_{ip}^{\text{upw}} =
          \begin{cases}\phi_L & \dot{m}_{ip} > 0\\[2pt]\phi_R & \dot{m}_{ip}\le 0\end{cases},
          \qquad
          a_{LL}\!\mathrel{+}=\!\tfrac{\dot{m}_{ip}+|\dot{m}_{ip}|}{2},\quad
          a_{RR}\!\mathrel{-}=\!\tfrac{\dot{m}_{ip}-|\dot{m}_{ip}|}{2}," />
        with the off-diagonal entries <M math="a_{RL}" />, <M math="a_{LR}" /> taking the opposite
        signs. This donor-weighted split is assembled <em>unconditionally</em> &mdash; it is the
        implicit operator for both schemes.
      </KeyBox>

      <H3 id="deferred-correction" num="11.3.2">High-resolution deferred correction</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The <code>high_resolution</code> scheme keeps that same upwind matrix and adds a
        slope-limited linear reconstruction of the donor value purely on the right-hand side (a
        deferred correction). At each integration point the reconstructed value is
      </p>
      <KeyBox title="Deferred-correction reconstruction">
        <Equation math="\phi_{ip} = \phi_U + \beta_{U}\,\nabla\phi_U\cdot(\mathbf{r}_{ip}-\mathbf{r}_U),
          \qquad
          b \mathrel{-}= \dot{m}_{ip}\bigl(\phi_{ip}-\phi_U\bigr)," />
        where <M math="\phi_U" />/<M math="\nabla\phi_U" /> are the donor node's value and
        unlimited gradient and <M math="\beta_U\in[0,\beta_{max}]" /> is the limiter below.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        Choosing <code>upwind</code> is equivalent to setting <M math="\beta\equiv0" />: no
        correction is added and only the implicit upwind operator remains. Because the correction
        is explicit, the high-resolution scheme never degrades the diagonal dominance of the
        matrix &mdash; it improves accuracy without destabilising the linear solve.
      </p>

      <H3 id="slope-limiter" num="11.3.3">The slope limiter</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The limiter <M math="\beta" /> is a Barth&ndash;Jespersen extremum test (Barth &amp;
        Jespersen, 1989) followed by a rational smoothing step. The raw Barth&ndash;Jespersen
        candidate at node <M math="i" /> is
      </p>
      <Equation label="11.6" math="\beta_i = \min_{j\in\mathcal{N}(i)}
        \begin{cases}
          \min\!\left(1,\ \dfrac{\phi_{max,i}-\phi_i}{\Delta\phi_j}\right) & \Delta\phi_j > 0\\[1em]
          \min\!\left(1,\ \dfrac{\phi_{min,i}-\phi_i}{\Delta\phi_j}\right) & \Delta\phi_j < 0\\[1em]
          1 & \Delta\phi_j = 0
        \end{cases}" />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\Delta\phi_j=\nabla\phi_i\cdot(\mathbf{r}_j-\mathbf{r}_i)" /> is the
        reconstructed increment toward neighbouring node <M math="j" />, and{' '}
        <M math="\phi_{max,i}" />, <M math="\phi_{min,i}" /> are the maximum and minimum of{' '}
        <M math="\phi" /> over node <M math="i" /> and its immediate neighbours{' '}
        <M math="\mathcal{N}(i)" />, accumulated as a running minimum over every
        sub-control-surface edge touching the node.
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        The implemented limiter is not the plain Barth&ndash;Jespersen limiter. Whenever{' '}
        <M math="\beta_{max}<2" /> (the default), the raw candidate <M math="y" /> above is passed
        through a Venkatakrishnan-style rational smoothing,
        <Equation math="\beta = \frac{y^{2}+2y}{y^{2}+y+2}," />
        which removes the non-differentiable clipping of the pure Barth&ndash;Jespersen form and
        greatly improves iterative convergence, at a small loss of strict monotonicity.
      </DocCallout>

      <p style={{ color: 'var(--text-dim)' }}>
        The upper bound <M math="\beta_{max}" /> controls the allowable steepness of the
        reconstruction:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>
          for all general scalar and momentum transport equations (velocity, turbulence
          quantities, enthalpy, &hellip;), <M math="\beta_{max}=1" />: the smoothing above is
          active and new local extrema are suppressed;
        </li>
        <li>
          for the volume-fraction equation, <M math="\beta_{max}" /> is set separately through{' '}
          <code>volume_fraction_compressive_beta_max</code> (an expert parameter): a value{' '}
          <M math="\ge 2" /> disables the smoothing to give a sharper, more compressive limiter
          for interface capturing.
        </li>
      </ul>
      <p style={{ color: 'var(--text-dim)' }}>
        The min/max stencil extrema are merged consistently across conformal interfaces, including
        a bounds transformation for rotational and translational periodic interfaces, so a limited
        field remains bounded across a periodic boundary.
      </p>

      <H3 id="scheme-selection" num="11.3.4">Scheme selection</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The limiter and reconstruction infrastructure lives once in the generic nodal-field base
        class and is reused by every transported field &mdash; scalar, vector, and turbulence
        quantity alike &mdash; rather than reimplemented per equation. The scheme is chosen
        globally through <code>advection_scheme</code> (<code>upwind</code> | <code>high_resolution</code>);
        the turbulence transport equations may use a different scheme through{' '}
        <code>turbulence_numerics</code> (same value set, read through the same converter),
        typically the more diffusive <code>upwind</code> for <M math="k" />, <M math="\varepsilon" />,{' '}
        <M math="\omega" />, <M math="\gamma" />, <M math="\widetilde{Re}_{\theta t}" /> while
        momentum and energy keep <code>high_resolution</code>. These two are the only advection
        schemes in the code &mdash; there is no central-differencing, linear-upwind or
        separately-named TVD scheme.
      </p>

      <H2 id="nso" num="11.4">Nonlinear Stabilisation Operator (NSO)</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Alongside the slope limiter, an optional residual-based artificial-viscosity stabilisation
        (Nalu-Wind style) is available for the momentum advection, gated by{' '}
        <code>expert_parameters &gt; nso</code>. The commutation-error residual of the advective
        operator is evaluated at each integration point,
      </p>
      <Equation label="11.7" math="\mathcal{R}_{ip} =
        \frac{\partial(\rho u_j u_i)}{\partial x_j}
        - u_i\frac{\partial(\rho u_j)}{\partial x_j}
        - \rho u_j\frac{\partial u_i}{\partial x_j}," />
      <p style={{ color: 'var(--text-dim)' }}>
        from which a residual-based viscosity magnitude is formed and blended with a first-order
        upwind bound,
      </p>
      <Equation label="11.8" math="\nu_{res} = \sqrt{\frac{\mathcal{R}_{ip}^{2}}
        {\nabla u\cdot\mathbf{G}^{ij}\cdot\nabla u}},
        \qquad
        \nu = f_{nso}\,\min\bigl(C_{upw}\,\nu_{1st},\ \nu_{res}\bigr)," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\mathbf{G}^{ij}" /> is the element metric tensor. The stabilising flux is
      </p>
      <Equation label="11.9" math="\mathrm{NSO}_i = -\,\nu\,\mathbf{G}^{ij}
        \left(\frac{\partial u_k}{\partial x_j}
        - f_{4}\,\overline{\frac{\partial u_k}{\partial x_j}}\right) S_i," />
      <p style={{ color: 'var(--text-dim)' }}>
        with the fourth-order factor <M math="f_4\in[0,1]" /> (<code>nsoFourthOrderFac</code>):{' '}
        <M math="f_4=0" /> gives a second-order stabilisation, <M math="f_4=1" /> a fourth-order
        one. This is a fundamentally different technique from slope limiting &mdash; residual-based
        artificial viscosity rather than flux limiting &mdash; and the two can be active together.
      </p>
    </TheoryLayout>
  );
}
