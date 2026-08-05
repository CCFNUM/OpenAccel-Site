import { AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { SourceBox } from '@/components/SourceBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch9Solid() {
  useDocumentTitle('Solid Mechanics — Theory Manual');
  return (
    <TheoryLayout chNum="9" title="Solid Mechanics">
      <SEO
        title="Solid Mechanics — Theory Manual"
        description="OpenAccel's total-Lagrangian solid displacement solver: linear elasticity, finite-strain kinematics, neo-Hookean and Saint-Venant-Kirchhoff constitutive models, lumped-mass transient dynamics, and the Picard solution strategy."
        path="/theory/solid"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel solves the solid displacement field <M math="\mathbf{u}" /> for structural
        analysis, thermo-mechanical coupling, and the structural side of fluid&ndash;structure
        interaction. Four constitutive models are implemented &mdash; linear elastic, simplified
        neo-Hookean, neo-Hookean, and Saint-Venant&ndash;Kirchhoff &mdash; all in a
        total-Lagrangian setting.
      </p>

      <H2 id="governing-equation" num="9.1">Governing Equation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The quasi-static equilibrium equation for solid displacement <M math="\mathbf{u}" /> in
        the absence of body forces is
      </p>
      <Equation label="9.1" math="\nabla\cdot\boldsymbol{\sigma} = 0," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\boldsymbol{\sigma}" /> is the Cauchy stress tensor. For transient problems
        the inertial term is included:
      </p>
      <Equation label="9.2" math="\rho_s\frac{\partial^{2}\mathbf{u}}{\partial t^{2}}
        + \nabla\cdot\boldsymbol{\sigma} = \mathbf{F}_b ," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\rho_s" /> is the solid density and <M math="\mathbf{F}_b" /> represents
        body forces.
      </p>

      <H2 id="linear-elasticity" num="9.2">Linear Elasticity</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        For isotropic linear elastic materials, the stress tensor is related to the strain tensor{' '}
        <M math="\boldsymbol{\varepsilon}" /> through Hooke's law:
      </p>
      <Equation label="9.3" math="\boldsymbol{\sigma} = 2\mu\,\boldsymbol{\varepsilon}
        + \lambda\,(\nabla\cdot\mathbf{u})\,\mathbf{I}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\mu" /> and <M math="\lambda" /> are the Lam&eacute; parameters and{' '}
        <M math="\mathbf{I}" /> is the identity tensor. The strain tensor is the symmetric part of
        the displacement gradient:
      </p>
      <Equation label="9.4" math="\boldsymbol{\varepsilon}
        = \tfrac{1}{2}\bigl(\nabla\mathbf{u} + (\nabla\mathbf{u})^{T}\bigr)." />
      <p style={{ color: 'var(--text-dim)' }}>
        Substituting Equation 9.4 into Equation 9.3 and then into Equation 9.1, the
        displacement-based formulation becomes
      </p>
      <Equation label="9.5" math="\nabla\cdot\bigl[2\mu\,\boldsymbol{\varepsilon}
        + \lambda\,(\nabla\cdot\mathbf{u})\,\mathbf{I}\bigr] = 0 ." />

      <H3 id="material-properties" num="9.2.1">Material properties</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The Lam&eacute; parameters are related to Young's modulus <M math="E" /> and Poisson's
        ratio <M math="\nu" /> through
      </p>
      <Equation label="9.6" math="\mu = \frac{E}{2(1+\nu)} ." />
      <p style={{ color: 'var(--text-dim)' }}>For three-dimensional and plane-strain conditions:</p>
      <Equation label="9.7" math="\lambda = \frac{\nu E}{(1+\nu)(1-2\nu)} ," />
      <p style={{ color: 'var(--text-dim)' }}>while for plane-stress conditions (thin structures):</p>
      <Equation label="9.8" math="\lambda = \frac{\nu E}{(1+\nu)(1-\nu)} ." />
      <p style={{ color: 'var(--text-dim)' }}>
        The parameter <M math="\mu" /> is also known as the shear modulus; the combination{' '}
        <M math="2\mu+\lambda" /> appearing in the diffusion coefficient represents the material's
        resistance to volumetric deformation.
      </p>

      <H3 id="plane-stress-strain" num="9.2.2">Plane stress vs. plane strain</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The choice depends on the geometry and loading conditions:{' '}
        <strong style={{ color: 'var(--text)' }}>plane stress</strong> is valid for thin
        structures where the out-of-plane stress is negligible (<M math="\sigma_{zz}=0" />, e.g.
        thin plates and shells), while <strong style={{ color: 'var(--text)' }}>plane strain</strong>{' '}
        is valid for thick structures where the out-of-plane strain is constrained (
        <M math="\varepsilon_{zz}=0" />, e.g. long cylinders and dams). Either assumption is
        selected through the appropriate Lam&eacute; parameter <M math="\lambda" /> above.
      </p>

      <H2 id="finite-strain" num="9.3">Finite-Strain Kinematics (Total Lagrangian)</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        For finite deformations the kinematics are referred to the <em>original</em> (undeformed)
        configuration. The deformation gradient and its determinant are
      </p>
      <KeyBox title="Total-Lagrangian kinematics">
        <Equation math="\mathbf{F} = \mathbf{I} + \nabla_0\mathbf{u},
          \qquad
          J = \det\mathbf{F}," />
        where <M math="\nabla_0" /> is taken against the fixed reference coordinates, fetched once
        and never updated.
      </KeyBox>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        The updated-Lagrangian formulation (<code>updated_lagrangian</code>) is registered but
        rejected at run time (&ldquo;not implemented yet&rdquo;). Total Lagrangian is the only
        working kinematic formulation.
      </DocCallout>

      <H2 id="hyperelastic" num="9.4">Hyperelastic Constitutive Models</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The assembler evaluates the Cauchy or second Piola&ndash;Kirchhoff stress for the selected
        model and converts it to the first Piola&ndash;Kirchhoff (PK1) stress <M math="\mathbf{P}" />,
        the natural stress measure for a total-Lagrangian residual (it is the work conjugate of{' '}
        <M math="\mathbf{F}" /> and integrates over the reference configuration).
      </p>

      <H3 id="neo-hookean" num="9.4.1">Neo-Hookean</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The (compressible) neo-Hookean model (Simo &amp; Hughes, 1998) gives the Cauchy stress
        from the left Cauchy&ndash;Green tensor <M math="\mathbf{B}=\mathbf{F}\mathbf{F}^{T}" />,
      </p>
      <Equation label="9.9" math="\boldsymbol{\sigma} = \frac{\mu}{J}\bigl(\mathbf{B}-\mathbf{I}\bigr)
        + \frac{\lambda\ln J}{J}\,\mathbf{I}." />

      <KeyBox title="Neo-Hookean PK1 conversion">
        The stress delivered to the residual is the first Piola&ndash;Kirchhoff stress obtained
        from the Cauchy stress by the Piola transform
        <Equation math="\mathbf{P} = J\,\boldsymbol{\sigma}\,\mathbf{F}^{-T}." />
        Skipping this Cauchy&rarr;PK1 map &mdash; subtracting a Cauchy stress from a PK1-based
        residual &mdash; is dimensionally inconsistent and drives the solid displacement to drift;
        the conversion is essential.
      </KeyBox>

      <H3 id="svk" num="9.4.2">Saint-Venant&ndash;Kirchhoff</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The Saint-Venant&ndash;Kirchhoff (SVK) model (Belytschko et al., 2014) is the
        finite-strain extension of Hooke's law written in the reference configuration. It uses the
        Green&ndash;Lagrange strain to form the second Piola&ndash;Kirchhoff stress{' '}
        <M math="\mathbf{S}" />, then maps to PK1 with <M math="\mathbf{F}" />:
      </p>
      <Equation label="9.10" math="\mathbf{E} = \tfrac12\bigl(\mathbf{F}^{T}\mathbf{F}-\mathbf{I}\bigr),
        \qquad
        \mathbf{S} = 2\mu\,\mathbf{E} + \lambda\,\mathrm{tr}(\mathbf{E})\,\mathbf{I},
        \qquad
        \mathbf{P} = \mathbf{F}\,\mathbf{S}." />
      <p style={{ color: 'var(--text-dim)' }}>
        SVK is accurate for large rotations but only moderate strains; beyond moderate strain it
        is non-physical in compression, which is a property of the model, not of the
        implementation.
      </p>

      <H3 id="simplified-neo-hookean" num="9.4.3">Simplified neo-Hookean (legacy)</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        A third, legacy branch implements an OpenAccel-specific invariant-based formulation that
        should <em>not</em> be attributed to a textbook neo-Hookean model. It builds a per-element
        gradient tensor <M math="\mathbf{G}=\mathbf{I}+\nabla\mathbf{u}" /> and forms
      </p>
      <Equation label="9.11" math="I_c = \sum_{i,j} G_{ij}^{2},
        \qquad
        \beta = 1 - \frac{1}{1+I_c},
        \qquad
        J = \det\mathbf{G}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with the shear-like stiffness scaling as <M math="\mu\beta/J" /> and the volumetric part
        as <M math="\lambda\bigl(J-(1+0.75\,\mu/\lambda)\bigr)" /> &mdash; a bespoke custom form
        retained for backward compatibility.
      </p>

      <H3 id="plane-stress-thickness" num="9.4.4">Plane-stress thickness stretch</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Under plane stress the out-of-plane stretch <M math="F_{33}" /> is not free; it is found
        by enforcing <M math="\sigma_{33}=0" />. For SVK this closes in a closed form; for
        neo-Hookean it is a scalar root found by a one-dimensional Newton iteration at each node.
      </p>

      <H2 id="transient-mass-damping" num="9.5">Transient Term: Lumped Mass and Damping</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Transient solid dynamics uses a <em>lumped</em> mass matrix with a BDF2-style second time
        derivative:
      </p>
      <KeyBox title="Lumped-mass inertia">
        <Equation math="\rho_s\frac{\partial^{2}\mathbf{D}}{\partial t^{2}}
          \;\approx\;
          \frac{\rho_s}{\Delta t^{2}}\bigl(\mathbf{D}^{k+1}-2\mathbf{D}^{n}+\mathbf{D}^{n-1}\bigr)," />
        contributing <M math="\rho_s V_0/\Delta t^{2}" /> to the diagonal, with <M math="V_0" />{' '}
        the reference nodal volume.
      </KeyBox>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        The consistent (non-lumped) mass matrix is registered (<code>lumped_mass: false</code>)
        but rejected at run time &mdash; the lumped BDF2 scheme above is the only working
        transient solid-dynamics discretisation.
      </DocCallout>

      <H3 id="rayleigh-damping" num="9.5.1">Structural (Rayleigh) damping</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        A mass-proportional Rayleigh damping term is available to dissipate spurious
        high-frequency structural oscillations &mdash; for example the ringing that a partitioned
        scheme can excite in a thin flexible structure such as the flexible bottom of a driven
        cavity or a sloshing tank. With damping coefficient <M math="\alpha" /> the term is
        discretised Euler-implicitly,
      </p>
      <KeyBox title="Mass-proportional damping">
        <Equation math="\alpha\,\rho_s\frac{\partial\mathbf{D}}{\partial t}
          \;\approx\;
          \frac{\alpha\,\rho_s}{\Delta t}\bigl(\mathbf{D}^{k+1}-\mathbf{D}^{n}\bigr)," />
        contributing <M math="+\alpha\rho_s V_0/\Delta t" /> to the diagonal and{' '}
        <M math="-\tfrac{\alpha\rho_s V_0}{\Delta t}(\mathbf{D}^{k+1}-\mathbf{D}^{n})" /> to the
        right-hand side.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        Being mass-proportional, the coefficient <M math="\alpha" /> [s<sup>&minus;1</sup>] damps
        the low-frequency rigid-body-like modes most strongly and leaves the quasi-static response
        essentially unchanged, so it stabilises a lightly loaded flexible structure without
        corrupting its steady deflection. It is distinct from the coupling-loop relaxation of{' '}
        <a href="/theory/rigidbody-fsi">Chapter 10</a>: <M math="\alpha" /> acts on the{' '}
        <em>physical</em> structural velocity, whereas the FSI relaxation acts on the
        interface-iteration residual.
      </p>

      <H2 id="solution-strategy" num="9.6">Solution Strategy</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The nonlinear residual is solved by a Picard (fixed-point) scheme, <em>not</em> by a
        Jacobian-free Newton&ndash;Krylov method &mdash; no JFNK path exists anywhere in the
        solver. The implicit left-hand side is the linear-elastic operator of Equation 9.5 (the
        full <M math="\mu" />-Laplacian plus <M math="\lambda" />-divergence with the{' '}
        <M math="\nabla\mathbf{u}^{T}" /> cancellation), used as a Picard preconditioner. The
        nonlinear correction is carried explicitly on the right-hand side as the difference
        between the true PK1 stress and the linearised one,
      </p>
      <Equation label="9.12" math="\mathbf{P}_{lin} = J\,\boldsymbol{\sigma}_{lin}\,\mathbf{F}^{-T},
        \qquad
        \mathbf{r} = \nabla\cdot(\mathbf{P}-\mathbf{P}_{lin})," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\boldsymbol{\sigma}_{lin}" /> is the linear-elastic Cauchy stress. Two
        implementation details are essential for stability: the LHS must be the <em>full</em>{' '}
        linear-elastic operator (a scalar-only Laplacian leaves the off-diagonal{' '}
        <M math="\lambda" />-coupling entirely on the RHS and lets the displacement drift without
        bound), and under-relaxation is applied on the <em>first</em> inner Picard iteration only,
        set to unity thereafter, so relaxation stabilises the update without slowing the converged
        nonlinear correction.
      </p>

      <SourceBox>
        Constitutive evaluation and the Picard linearisation live in the solid-displacement
        element-term assembler. An alternative FEM (non-CVFEM) discretisation exists but is dead
        code under the default build.
      </SourceBox>
    </TheoryLayout>
  );
}
