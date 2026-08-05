import { AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { SourceBox } from '@/components/SourceBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { FlowChart } from '@/components/theory/FlowChart';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch15PvCoupling() {
  useDocumentTitle('Velocity–Pressure Coupling — Theory Manual');
  return (
    <TheoryLayout chNum="15" title="Velocity–Pressure Coupling">
      <SEO
        title="Velocity–Pressure Coupling — Theory Manual"
        description="Rhie-Chow momentum interpolation, the segregated SIMPLE algorithm, compressibility, SIMPLEC, and the fractional-step method."
        path="/theory/pv-coupling"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        Velocity and pressure are physically strongly coupled to each other. The pressure-based
        approach is adopted in OpenAccel, which reformulates the mass conservation equation into a
        Poisson-like pressure-correction equation; the latter acts as a constraint equation for
        the velocity field predicted by the momentum conservation equation. OpenAccel is{' '}
        <em>segregated</em>: momentum and pressure are solved as two separate systems coupled
        through a predictor&ndash;corrector cycle, and no monolithic (block-coupled)
        velocity&ndash;pressure solver exists in the code.
      </p>

      <H2 id="rhie-chow" num="15.1">Rhie&ndash;Chow Momentum Interpolation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The mass flow rate at an integration point is expressed using the Rhie&ndash;Chow
        interpolation (Rhie &amp; Chow, 1983):
      </p>
      <Equation label="15.1" math="\dot{m}_{ip} = \rho_{ip}\left[\mathbf{v}_{ip}
        - \mathbf{D}^{\mathbf{v}}_{ip}\bigl(\nabla p_{ip}-\overline{\nabla p}_{ip}\bigr)\right]
        \cdot\mathbf{S}_{ip} ," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\overline{\nabla p}_{ip}" /> is the projected pressure gradient at{' '}
        <M math="ip" />, computed as
      </p>
      <Equation label="15.2" math="\overline{\nabla p}_{ip} = \sum_{k=1}^{n} N_k^{ip}\,\nabla p_k ," />
      <p style={{ color: 'var(--text-dim)' }}>
        and <M math="\mathbf{D}^{\mathbf{v}}_{ip}" /> is an adaptive pressure-diffusivity tensor
        interpolated to the integration point from the surrounding nodal values,
      </p>
      <Equation label="15.3" math="\mathbf{D}^{\mathbf{v}}_{ip} = \sum_{k=1}^{n} N_k^{ip}\,\mathbf{D}^{\mathbf{v}}_k ." />
      <p style={{ color: 'var(--text-dim)' }}>
        At node <M math="i" />, <M math="\mathbf{D}^{\mathbf{v}}_i" /> is a diagonal tensor given
        by
      </p>
      <Equation label="15.4" math="\mathbf{D}^{\mathbf{v}}_i =
        \begin{bmatrix}
          D^{v_x}_i & 0 & 0\\ 0 & D^{v_y}_i & 0\\ 0 & 0 & D^{v_z}_i
        \end{bmatrix}
        =
        \begin{bmatrix}
          V_i/a_{ii}^{v_xv_x} & 0 & 0\\
          0 & V_i/a_{ii}^{v_yv_y} & 0\\
          0 & 0 & V_i/a_{ii}^{v_zv_z}
        \end{bmatrix}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="a_{ii}^{v_xv_x}" />, <M math="a_{ii}^{v_yv_y}" />,{' '}
        <M math="a_{ii}^{v_zv_z}" /> are the diagonal entries of the momentum-equation central
        coefficient.
      </p>

      <H3 id="three-term-flux" num="15.1.1">The implemented three-term flux</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        As assembled, the interior mass flux carries one additional stabilisation beyond the
        textbook scheme:
      </p>
      <KeyBox title="Rhie–Chow mass flux (as assembled)">
        <Equation math="\dot{m}_{ip} =
          \underbrace{\rho_{ip}\,\mathbf{v}_{ip}\cdot\mathbf{S}_{ip}}_{\text{advection}}
          \;-\;\underbrace{\rho_{ip}\,\mathbf{D}^{\mathbf{v}}_{ip}\bigl(\nabla p_{ip}-\overline{\nabla p}_{ip}\bigr)\cdot\mathbf{S}_{ip}}_{\text{Rhie–Chow smoothing}}
          \;+\;\underbrace{\rho_{ip}\,\mathbf{D}^{\mathbf{v}}_{ip}\bigl(\mathbf{F}^{orig}_{ip}-\overline{\mathbf{F}}_{ip}\bigr)\cdot\mathbf{S}_{ip}}_{\text{body-force stabilisation}} ." />
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        The second term is the classic Rhie&ndash;Chow correction: the difference between the
        consistent (edge-normal) and interpolated pressure gradients is non-zero only when the
        pressure checkerboards, so the term adds pressure&ndash;velocity coupling without
        altering a smooth field. The third term treats a strong, spatially abrupt body force
        (buoyancy) on the same footing as the pressure gradient, so the body force itself cannot
        trigger checkerboarding; <M math="\mathbf{F}^{orig}" /> is the raw element-averaged body
        force and <M math="\overline{\mathbf{F}}" /> its interpolated-to-face counterpart (see{' '}
        <a href="/theory/buoyancy-pressure">Chapter 6</a>).
      </p>

      <SourceBox>
        The face pressure-gradient interpolation blends arithmetic and harmonic averaging by the
        material-compressibility switch: <M math="Gp_{face} = (1-comp)\,Gp_{arith} + comp\,Gp_{harm}" />,
        with the same blend applied to the body-force term. <M math="comp" /> is <em>not</em> a
        YAML key &mdash; it is set automatically from the material (<M math="comp=1" /> compressible,{' '}
        <M math="0" /> otherwise), with no user override. It is the same switch that gates the{' '}
        <M math="\tfrac23\mu_{eff}\nabla\cdot\mathbf{v}" /> stress term of{' '}
        <a href="/theory/flow">Chapter 3</a>.
      </SourceBox>

      <H2 id="simple" num="15.2">The Segregated Approach (SIMPLE Algorithm)</H2>

      <H3 id="discretised-momentum" num="15.2.1">The discretised momentum equation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The discrete momentum conservation equation is written, in residual form, as
      </p>
      <Equation label="15.5" math="\mathbf{a}_{ii}^{\mathbf{v}}\,\mathbf{v}_i' + \sum_j \mathbf{a}_{ij}^{\mathbf{v}}\,\mathbf{v}_j'
        = \mathbf{r}_i^{\mathbf{v}},
        \qquad
        \mathbf{r}_i^{\mathbf{v}} = \mathbf{b}_i^{\mathbf{v}}
        - \mathbf{a}_{ii}^{\mathbf{v}}\mathbf{v}_i^{*}
        - \sum_j \mathbf{a}_{ij}^{\mathbf{v}}\mathbf{v}_j^{*}," />
      <p style={{ color: 'var(--text-dim)' }}>with the coefficients</p>
      <KeyBox title="Discrete momentum coefficients">
        <Equation math="\begin{aligned}
          \mathbf{a}_{ii}^{\mathbf{v}} &= \left[
          \underbrace{\frac{\rho_i V_i}{\Delta t}}_{\text{transient}}
          + \sum_{ip}\left(
          \underbrace{\frac{\dot{m}^{*}_{ip}+|\dot{m}^{*}_{ip}|}{2}}_{\text{advection}}
          - \underbrace{\mu_{ip}\nabla N_i^{ip}\cdot\mathbf{S}_{ip}}_{\text{stress-part 1}}
          \right)\right]\mathbf{I}
          \;-\;\sum_{ip}\underbrace{\mu_{ip}\,\nabla N_i^{ip}\,\mathbf{S}_{ip}}_{\text{stress-part 2}}\\
          \mathbf{a}_{ij}^{\mathbf{v}} &= \sum_{ip/i\text{-}j}\left[\left(
          \underbrace{\frac{\dot{m}^{*}_{ip}-|\dot{m}^{*}_{ip}|}{2}}_{\text{advection (0 if non-shared }ip\text{)}}
          - \underbrace{\mu_{ip}\nabla N_j^{ip}\cdot\mathbf{S}_{ip}}_{\text{stress-part 1}}
          \right)\mathbf{I}
          - \underbrace{\mu_{ip}\,\nabla N_j^{ip}\,\mathbf{S}_{ip}}_{\text{stress-part 2}}\right]\\
          \mathbf{b}_i^{\mathbf{v}} &=
          \underbrace{\frac{\rho_i V_i}{\Delta t}\,\mathbf{v}_i^{\circ}}_{\text{transient}}
          - \underbrace{\nabla p_i^{*}\,V_i}_{\text{pressure gradient}}
          \end{aligned}" />
        where stress-part 1 is the scalar (Laplacian-like) contribution and stress-part 2 the
        outer-product (transpose-gradient) contribution of the viscous stress.
      </KeyBox>

      <H3 id="discretised-mass" num="15.2.2">The discretised mass conservation equation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The discrete mass conservation equation is written, in residual form, as
      </p>
      <Equation label="15.6" math="a_{ii}^{p}\,p_i' + \sum_j a_{ij}^{p}\,p_j' = r_i^{p},
        \qquad
        r_i^{p} = b_i^{p} - a_{ii}^{p}p_i^{*} + \sum_j a_{ij}^{p}p_j^{*}," />
      <p style={{ color: 'var(--text-dim)' }}>with the coefficients</p>
      <Equation label="15.7" math="a_{ii}^{p} = -\sum_{ip}\underbrace{\rho_{ip}\,\mathbf{D}^{\mathbf{v}}_{ip}\,\nabla N_i^{ip}\cdot\mathbf{S}_{ip}}_{\text{diffusion-like}}," />
      <Equation label="15.8" math="a_{ij}^{p} = -\sum_{ip/i\text{-}j}\underbrace{\rho_{ip}\,\mathbf{D}^{\mathbf{v}}_{ip}\,\nabla N_j^{ip}\cdot\mathbf{S}_{ip}}_{\text{diffusion-like}}," />
      <Equation label="15.9" math="b_i^{p} = -\sum_{ip}\underbrace{\rho_{ip}\,\mathbf{D}^{\mathbf{v}}_{ip}\,\overline{\nabla p}_{ip}\cdot\mathbf{S}_{ip}}_{\text{explicit}}
        -\sum_{ip}\underbrace{\rho_{ip}\,\mathbf{v}^{*}_{ip}\cdot\mathbf{S}_{ip}}_{\text{mass divergence}}." />
      <p style={{ color: 'var(--text-dim)' }}>The fields are then corrected as</p>
      <KeyBox title="SIMPLE corrections">
        <Equation math="p_i^{**} = p_i^{*} + \lambda^{p}\,p_i',
          \qquad
          \mathbf{v}_i^{**} = \mathbf{v}_i^{*} - \mathbf{D}^{\mathbf{v}}_i\,\nabla p_i' ." />
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        For the velocity correction, a more intuitive formula that avoids storing and calculating
        a new gradient is
      </p>
      <Equation label="15.10" math="\mathbf{v}_i^{**} = \mathbf{v}_i^{*}
        - \mathbf{D}^{\mathbf{v}}_i\bigl(\nabla p_i^{**}-\nabla p_i^{*}\bigr)/\lambda^{p}." />

      <H3 id="transient-continuity" num="15.2.3">The transient continuity residual</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        For a transient and possibly deforming mesh the mass-divergence source generalises to the
        full nodal continuity residual, assembled by scatter-adding the integration-point fluxes
        and the transient and mesh-motion contributions:
      </p>
      <Equation label="15.11" math="b_i^{\,mass} =
        \underbrace{\frac{V_i}{\Delta t}\bigl(c_0\rho_i + c_1\rho_i^{\circ} + c_2\rho_i^{\circ\circ}\bigr)}_{\text{transient (BDF1/BDF2)}}
        \;-\;\underbrace{\rho_i\,(\nabla\cdot\mathbf{v}_m)_i\,V_i}_{\text{GCL, deforming mesh}}
        \;+\;\sum_{ip\in\partial V_i}\pm\,\dot{m}_{ip}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with the BDF coefficients of <a href="/theory/moving-domains">Chapter 7</a>. Impermeable
        boundaries (walls, symmetry) contribute zero convective flux but still carry the
        mesh-motion swept-volume term, since even a stationary wall sweeps volume as the mesh
        moves.
      </p>

      <H3 id="decoupling-stabilisation" num="15.2.4">Decoupling and stabilisation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The SIMPLE algorithm solves the incompressible Navier&ndash;Stokes equations by decoupling
        the momentum and pressure-correction equations and iterating between them until
        convergence. An implicit under-relaxation of the momentum equation is essential for
        stability: it controls the updates from the nonlinear momentum equations with a
        relaxation factor <M math="\lambda^{\mathbf{v}}" />, typically <M math="0.5" />&ndash;
        <M math="0.8" />. An additional explicit pressure-field relaxation with factor{' '}
        <M math="\lambda^{p}" />, typically <M math="0.1" />&ndash;<M math="0.3" />, stabilises
        the updates from the pressure-correction equation and prevents over-correction. Together
        these balance the iterative updates so the coupled fields converge smoothly. In transient
        simulations relaxation remains useful for large time steps or strong nonlinearity, though
        the need is less pronounced thanks to the stability of implicit time stepping. The
        per-physics factors live under <code>convergence_controls &gt; relaxation_parameters</code>{' '}
        (<code>velocity_relaxation_factor</code>, <code>pressure_relaxation_factor</code>,{' '}
        <code>relax_mass</code>, and one factor per physics group).
      </p>
      <p style={{ color: 'var(--text-dim)' }}>Figure 15.1 shows the outer loop.</p>

      <FlowChart
        label="Figure 15.1"
        caption={<>SIMPLE/SIMPLEC segregated velocity&ndash;pressure coupling. SIMPLEC differs
          only in the coefficient used in the pressure-correction matrix and in permitting{' '}
          <M math="\lambda^{p}\approx1" />.</>}
        steps={[
          { id: 's', kind: 'start', title: 'Initialise', subtitle: '$p^{*}$ and fields at time $t^{n}$' },
          { id: 'mom', kind: 'process', title: 'Solve momentum predictor', subtitle: 'with $p^{*} \\Rightarrow \\mathbf{v}^{*}$' },
          { id: 'rc', kind: 'process', title: 'Rhie–Chow face mass fluxes', subtitle: 'computes $\\dot{m}^{*}$' },
          { id: 'pc', kind: 'process', title: 'Solve pressure correction $p\'$', subtitle: 'SIMPLE / SIMPLEC coefficient' },
          { id: 'corr', kind: 'process', title: 'Correct $\\mathbf{v},\\ p,\\ \\dot{m}$' },
          { id: 'aux', kind: 'process', title: 'Solve auxiliary equations', subtitle: 'energy, turbulence, phasic, …' },
          { id: 'dec', kind: 'decision', title: 'Converged?' },
          { id: 'done', kind: 'end', title: 'Advance to $t^{n+1}$' },
        ]}
        loop={{ from: 'dec', to: 'mom', label: 'no, $p^{*} := p$', exitLabel: 'yes' }}
      />

      <H2 id="compressibility" num="15.3">Compressibility Considerations</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        For compressible flows, the density variation couples to the pressure equation through
        the compressibility field <M math="\psi" /> (see <a href="/theory/heat">Chapter 5</a>).
        Revisiting the Rhie&ndash;Chow formulation, the full mass flow rate including a
        density-correction term reads
      </p>
      <Equation label="15.12" math="\dot{m}_{ip} = \rho^{*}_{ip}\,\mathbf{v}^{**}_{ip}\cdot\mathbf{S}_{ip}
        - \rho^{*}_{ip}\,\mathbf{D}^{\mathbf{v}}_{ip}\bigl(\nabla p^{**}_{ip}-\overline{\nabla p}_{ip}\bigr)\cdot\mathbf{S}_{ip}
        + \dot{m}^{(n)}_{ip}\,\frac{\psi^{*}_{ip}\,p^{**}_{ip}}{\rho^{*}_{ip}}
        - \dot{m}^{(n)}_{ip}." />
      <p style={{ color: 'var(--text-dim)' }}>
        Splitting into previous and correction terms, <M math="\dot{m}^{**}_{ip}=\dot{m}^{*}_{ip}+\dot{m}'_{ip}" />:
      </p>
      <Equation label="15.13" math="\dot{m}^{*}_{ip} = \rho^{*}_{ip}\,\mathbf{v}^{*}_{ip}\cdot\mathbf{S}_{ip}
        - \rho^{*}_{ip}\,\mathbf{D}^{\mathbf{v}}_{ip}\bigl(\nabla p^{*}_{ip}-\overline{\nabla p}_{ip}\bigr)\cdot\mathbf{S}_{ip}
        + \dot{m}^{(n)}_{ip}\,\frac{\psi^{*}_{ip}\,p^{*}_{ip}}{\rho^{*}_{ip}} - \dot{m}^{(n)}_{ip}," />
      <Equation label="15.14" math="\dot{m}'_{ip} = \rho^{*}_{ip}\,\mathbf{v}'_{ip}\cdot\mathbf{S}_{ip}
        + \dot{m}^{*}_{ip}\,\frac{\psi^{*}_{ip}\,p'_{ip}}{\rho^{*}_{ip}}
        - \rho^{*}_{ip}\,\mathbf{D}^{\mathbf{v}}_{ip}\,\nabla p'_{ip}\cdot\mathbf{S}_{ip} ." />
      <p style={{ color: 'var(--text-dim)' }}>
        The pressure-equation central coefficient is augmented with an additional compressibility
        contribution,
      </p>
      <Equation label="15.15" math="a_{ii}^{p} \mathrel{{:}{=}} a_{ii}^{p}
        + \sum_{ip}\left(\frac{\dot{m}^{*}_{ip}+|\dot{m}^{*}_{ip}|}{2}\right)\frac{\psi^{*}_{ip}}{\rho^{*}_{ip}}," />
      <Equation label="15.16" math="a_{ij}^{p} \mathrel{{:}{=}} a_{ij}^{p}
        - \sum_{ip/i\text{-}j}\left(\frac{\dot{m}^{*}_{ip}-|\dot{m}^{*}_{ip}|}{2}\right)\frac{\psi^{*}_{ip}}{\rho^{*}_{ip}}," />
      <p style={{ color: 'var(--text-dim)' }}>
        which is the upwind-split Newton&ndash;Raphson linearisation of <M math="\rho\mathbf{v}" />:
      </p>
      <Equation label="15.17" math="\rho\mathbf{v} \approx \rho_{old}\mathbf{v}_{new}
        + \rho_{new}\mathbf{v}_{old} - \rho_{old}\mathbf{v}_{old},
        \qquad \rho_{new}=\psi\,p_{new}," />
      <p style={{ color: 'var(--text-dim)' }}>
        active only when the material is compressible. The advection sensitivity makes the
        pressure-correction operator convection&ndash;diffusion rather than pure diffusion, which
        is what lets the same segregated cycle carry the equation from the incompressible into
        the transonic regime.
      </p>

      <H2 id="simplec" num="15.4">The SIMPLE-Consistent Algorithm</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The SIMPLEC algorithm (Van Doormaal &amp; Raithby, 1984) is an improved version of
        SIMPLE, as it retains the neighbouring velocity-correction terms in the
        pressure-correction equation, making the pressure update more consistent with the
        momentum equations. The pressure-diffusivity coefficient is modified, denoted{' '}
        <M math="\tilde{\mathbf{D}}^{\mathbf{v}}_i" />:
      </p>
      <KeyBox title="SIMPLEC coefficient">
        <Equation math="\tilde{D}^{v_x}_i = \frac{V_i}{a_{ii}^{v_xv_x} - \sum\limits_j a_{ij}^{v_xv_x}},
          \qquad
          \tilde{D}^{v_y}_i = \frac{V_i}{a_{ii}^{v_yv_y} - \sum\limits_j a_{ij}^{v_yv_y}},
          \qquad
          \tilde{D}^{v_z}_i = \frac{V_i}{a_{ii}^{v_zv_z} - \sum\limits_j a_{ij}^{v_zv_z}}," />
        the textbook Van Doormaal&ndash;Raithby coefficient (the off-diagonal row sum enters with
        its sign, providing the neighbour-correction consistency).
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        The mass-conservation coefficients keep the same diffusion-like structure with{' '}
        <M math="\tilde{\mathbf{D}}^{\mathbf{v}}" /> in place of <M math="\mathbf{D}^{\mathbf{v}}" />,
      </p>
      <Equation label="15.18" math="a_{ii}^{p} = -\sum_{ip}\rho_{ip}\,\tilde{\mathbf{D}}^{\mathbf{v}}_{ip}\,\nabla N_i^{ip}\cdot\mathbf{S}_{ip},
        \qquad
        a_{ij}^{p} = -\sum_{ip/i\text{-}j}\rho_{ip}\,\tilde{\mathbf{D}}^{\mathbf{v}}_{ip}\,\nabla N_j^{ip}\cdot\mathbf{S}_{ip}," />
      <p style={{ color: 'var(--text-dim)' }}>while the residual is the plain mass imbalance</p>
      <Equation label="15.19" math="r_i^{p} = -\sum_{ip}\dot{m}^{*}_{ip},
        \qquad
        \dot{m}^{*}_{ip} = \rho_{ip}\left[\mathbf{v}^{*}_{ip}
        - \mathbf{D}^{\mathbf{v}}_{ip}\bigl(\nabla p^{*}_{ip}-\overline{\nabla p}^{*}_{ip}\bigr)\right]\cdot\mathbf{S}_{ip} ." />
      <p style={{ color: 'var(--text-dim)' }}>The fields are then corrected without pressure relaxation,</p>
      <Equation label="15.20" math="p_i^{**} = p_i^{*} + p_i',
        \qquad
        \mathbf{v}_i^{**} = \mathbf{v}_i^{*} - \tilde{\mathbf{D}}^{\mathbf{v}}_i\,\nabla p_i'
        = \mathbf{v}_i^{*} - \tilde{\mathbf{D}}^{\mathbf{v}}_i\bigl(\nabla p_i^{**}-\nabla p_i^{*}\bigr)," />
      <p style={{ color: 'var(--text-dim)' }}>and the mass flow rate is re-calculated with the corrected values,</p>
      <Equation label="15.21" math="\dot{m}^{**}_{ip} = \rho_{ip}\left[\mathbf{v}^{*}_{ip}
        - \mathbf{D}^{\mathbf{v}}_{ip}\bigl(\nabla p^{**}_{ip}-\overline{\nabla p}^{*}_{ip}\bigr)\right]\cdot\mathbf{S}_{ip} ." />

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        As assembled, SIMPLEC changes the pressure-correction <em>matrix</em> only: the LHS
        coefficients use <M math="\tilde{\mathbf{D}}^{\mathbf{v}}" /> (<code>duTilde</code>) when{' '}
        <code>consistent: true</code>, while the RHS Rhie&ndash;Chow flux <em>always</em> uses the
        plain <M math="\mathbf{D}^{\mathbf{v}}" /> (<code>du</code>). This LHS/RHS asymmetry is the
        exact mechanism by which SIMPLEC differs from SIMPLE in this codebase &mdash; a one-line
        but easy-to-miss distinction.
      </DocCallout>

      <H2 id="fractional-step" num="15.5">The Fractional-Step Method</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        In the fractional-step (projection) method the pressure-diffusivity tensor components are
        decoupled from the momentum matrix entirely:
      </p>
      <KeyBox title="Fractional-step coefficient">
        <Equation math="D^{v_x}_i = D^{v_y}_i = D^{v_z}_i = \frac{\Delta t}{\gamma_1\,\rho_i}," />
        where <M math="\gamma_1" /> is the leading BDF coefficient (<M math="1" /> for
        BDF1/steady state, <M math="c_0" /> of the BDF2 coefficient in{' '}
        <a href="/theory/moving-domains">Chapter 7</a> for BDF2) &mdash; a pure time-step/density
        scaling, the classic projection-method mass-flux coefficient.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        Structurally, SIMPLE, SIMPLEC and the fractional-step method are <em>not</em> separate
        code paths: they share one coefficient formula distinguished by a runtime flag,
      </p>
      <Equation label="15.22" math="D_i = f_{fsm}\,\frac{\Delta t}{\gamma_1\,\rho_i}
        + (1-f_{fsm})\,\frac{V_i}{a_{ii}+\epsilon}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="f_{fsm}=1" /> when <code>expert_parameters &gt; fractional_step_method</code>{' '}
        is set and <M math="0" /> otherwise, and SIMPLEC adding the{' '}
        <M math="\tilde{\mathbf{D}}^{\mathbf{v}}" /> field on top.
      </p>

      <SourceBox>
        SIMPLEC is <code>advanced_options &gt; expert_parameters &gt; consistent: true</code>; the
        fractional-step method is <code>fractional_step_method: true</code>. The two are mutually
        exclusive by construction: enabling both aborts with &ldquo;<em>consistent or fractional
        step method must be enabled, not both</em>&rdquo;.
      </SourceBox>
    </TheoryLayout>
  );
}
