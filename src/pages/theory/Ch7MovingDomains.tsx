import { Info } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { SourceBox } from '@/components/SourceBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch7MovingDomains() {
  useDocumentTitle('Moving and Deforming Domains — Theory Manual');
  return (
    <TheoryLayout chNum="7" title="Moving and Deforming Domains">
      <SEO
        title="Moving and Deforming Domains — Theory Manual"
        description="Moving reference frame, rigid transient rotation, displacement-diffusion mesh deformation, mesh velocity, and the geometric conservation law."
        path="/theory/moving-domains"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        Three distinct mechanisms let a domain move: a rotating reference frame (the mesh is
        fixed, the frame rotates), rigid transient rotation (the mesh itself rotates), and general
        mesh deformation (the mesh distorts to follow a moving boundary). All three modify the
        advective flux to use a velocity relative to the moving mesh or frame.
      </p>

      <H2 id="mrf" num="7.1">Steady-State Scenario: Moving Reference Frame</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        For a moving reference frame, suitable for nearly steady-state rotational flows, the
        momentum conservation equation is adjusted to account for a Coriolis acceleration term
        resulting from an angular velocity <M math="\Omega" />, and another adjustment related to
        the mass-flux field used in the advection of all transported variables. The resultant
        system appears as
      </p>
      <Equation label="7.1" math="\nabla\cdot(\rho\mathbf{v}_r) = 0" />
      <Equation label="7.2" math="\nabla\cdot(\rho\mathbf{v}_r\mathbf{v}) + \rho\,\boldsymbol{\Omega}\times\mathbf{v}
        = \nabla\cdot\boldsymbol{\tau} - \nabla p + \mathbf{F}" />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\mathbf{v}_r" /> is the relative velocity defined as
      </p>
      <Equation label="7.3" math="\mathbf{v}_r = \mathbf{v} - \boldsymbol{\Omega}\times\mathbf{r}." />
      <p style={{ color: 'var(--text-dim)' }}>
        The discretisation of the Coriolis term is performed <em>implicitly</em> following the
        approach developed in Mangani et al. (2014): a skew-symmetric matrix is built from the
        frame angular velocity,
      </p>
      <Equation label="7.4" math="\mathbf{C} =
        \begin{bmatrix} 0 & -\Omega\\ \Omega & 0 \end{bmatrix}\ \text{(2D)},
        \qquad
        \mathbf{C} =
        \begin{bmatrix} 0 & -\Omega_z & \Omega_y\\ \Omega_z & 0 & -\Omega_x\\
        -\Omega_y & \Omega_x & 0 \end{bmatrix}\ \text{(3D)}," />
      <p style={{ color: 'var(--text-dim)' }}>
        and <M math="\rho V_i\,\mathbf{C}" /> is added directly into the momentum central
        coefficient rather than treating <M math="\boldsymbol{\Omega}\times\mathbf{v}" /> as an
        explicit source. This implicit coupling is what makes the MRF momentum balance robust at
        high rotation rates. Similar adjustments are required for any transport equation of a
        quantity <M math="\phi" />:
      </p>
      <Equation label="7.5" math="\nabla\cdot(\rho\mathbf{v}_r\phi) = \nabla\cdot(\Gamma^{\phi}\nabla\phi) + S^{\phi}." />

      <KeyBox title="Relative mass-flux transform">
        The advective mass flux entails the relative mass flux, obtained from the absolute flux by
        subtracting the frame-motion term through the same Coriolis matrix and rotation origin{' '}
        <M math="\mathbf{x}_0" />:
        <Equation math="\dot{m}_{ip,r} = \dot{m}_{ip}
          - \rho_{ip}^{HR}\sum_{i,j} C_{ij}\,(x_{ip,j}-x_{0,j})\,S_{ip,i}," />
        where <M math="\rho_{ip}^{HR}" /> is the same upwind-blended (deferred-correction) density
        used to build the absolute flux, so the velocity field and the advected mass flux are
        transformed consistently. The inverse (relative &rarr; absolute) transform adds the same
        term back.
      </KeyBox>

      <SourceBox>
        The frame is activated per zone by a rotation transform (<code>angular_velocity</code>,{' '}
        <code>axis</code>, <code>origin</code>). Rotating-frame and deforming-mesh handling are
        mutually exclusive branches; the ALE branch subtracts the mesh-velocity flux{' '}
        <M math="\rho_{ip}\,\mathbf{v}_{m,ip}\cdot\mathbf{S}_{ip}" /> using plain linear density
        interpolation instead of the upwind blend.
      </SourceBox>

      <H2 id="rigid-rotation" num="7.2">Transient Scenario: Rigid Rotation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        In a transient case, the domain motion (rotation) is applied explicitly, where the domain
        mesh itself rotates. In this case the Coriolis acceleration term in the momentum
        conservation equation drops out. The equations are
      </p>
      <Equation label="7.6" math="\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\mathbf{v}_r) = 0," />
      <Equation label="7.7" math="\frac{\partial\rho\mathbf{v}}{\partial t} + \nabla\cdot(\rho\mathbf{v}_r\mathbf{v})
        = \nabla\cdot\boldsymbol{\tau} - \nabla p + \mathbf{F}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="\mathbf{v}_r = \mathbf{v}-\boldsymbol{\Omega}\times\mathbf{r}" />, and the
        analogous adjustment for any transported quantity <M math="\phi" />.
      </p>

      <H2 id="mesh-deformation" num="7.3">Mesh Deformation Theory</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        There are cases where walls and possibly other patches move in time, a situation which
        requires the whole mesh to re-adapt to the new patch position. The mesh, however, has to
        move in a way which preserves its quality. The displacement diffusion equation is one of
        the most popular economical ways to deform a mesh:
      </p>
      <KeyBox title="Displacement diffusion">
        <Equation math="-\nabla\cdot\bigl(\Gamma^{\mathbf{D}}\,\nabla\mathbf{D}\bigr) = 0," />
        where <M math="\mathbf{D}" /> is the node displacement and <M math="\Gamma^{\mathbf{D}}" />{' '}
        is the displacement diffusion coefficient (mesh stiffness).
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        The displacement diffusion equation is a linear elliptic (Laplace-type) problem solved
        once per configuration for the nodal displacement <M math="\mathbf{D}" />, using the same
        generic diffusion-equation assembly as any other scalar diffusion problem in the solver;
        it carries no advection or transient term of its own. Its boundary conditions are of two
        kinds only: prescribed-motion boundaries receive a <em>Dirichlet</em> fixed displacement,
        whether that value comes from a user-specified displacement, a periodic transform, or the
        rigid-body solution of <a href="/theory/rigidbody-fsi">Chapter 10</a>, and all remaining
        boundaries (symmetry planes, and any boundary with no displacement condition) inherit the{' '}
        <em>natural</em> zero-flux Neumann behaviour of the unconstrained diffusion operator
        &mdash; no separate Neumann term is assembled. Any other boundary-condition type on a
        moving boundary is a configuration error.
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        Displacement diffusion is the <em>only</em> mesh-deformation model in OpenAccel: there is
        no spring-analogy, radial-basis-function, or elasticity-based mesh mover. Its single
        tuning freedom is the spatial stiffness field <M math="\Gamma^{\mathbf{D}}" />, for which
        four formulations are supported.
      </DocCallout>

      <p style={{ color: 'var(--text-dim)' }}>
        A spatially varying <M math="\Gamma^{\mathbf{D}}" /> is desirable to concentrate mesh
        deformation in regions of large control volumes while protecting fine near-wall regions.
      </p>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>1. Constant stiffness.</strong>{' '}
        The simplest option assigns a uniform user-specified value throughout the moving domain:
      </p>
      <Equation label="7.8" math="\Gamma^{\mathbf{D}}_i = c ." />

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>2. Inverse-volume stiffness.</strong>{' '}
        Stiffness is increased near small control volumes, protecting the fine mesh regions near
        boundaries:
      </p>
      <Equation label="7.9" math="\Gamma^{\mathbf{D}}_i = \left(\frac{V_{ref}}{V_i}\right)^{\!n}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="V_{ref}" /> is the mean nodal dual control volume computed over all nodes
        of the moving domain, <M math="V_i" /> the local dual control volume, and <M math="n" />{' '}
        a user-specified model exponent.
      </p>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>3. Inverse-distance stiffness.</strong>{' '}
        Stiffness is increased near boundaries using the minimum wall distance <M math="y_{min,i}" />:
      </p>
      <Equation label="7.10" math="\Gamma^{\mathbf{D}}_i = \left(\frac{L_{ref}}{\max(y_{min,i},\,d_{wall})}\right)^{\!n}." />

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>4. Blended volume&ndash;distance stiffness.</strong>{' '}
        A combined formulation that blends the contributions from both local volume and wall
        distance:
      </p>
      <Equation label="7.11" math="\Gamma^{\mathbf{D}}_i =
        A\left(\frac{V_{ref}}{V_i}\right)^{\!C_{vol}}
        + B\left(\frac{L_{ref}}{\max(y_{min,i},\,d_{wall})}\right)^{\!C_{dis}}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="A" /> and <M math="B" /> are user-specified blending weights (
        <code>blended_volume_weight</code>, <code>blended_distance_weight</code>),{' '}
        <M math="C_{vol}" /> and <M math="C_{dis}" /> the corresponding exponents (
        <code>blended_volume_exponent</code>, <code>blended_distance_exponent</code>), and
      </p>
      <Equation label="7.12" math="d_{wall} = 10\,V_{min}^{1/3},
        \qquad
        L_{ref} = \tfrac{1}{2}\,V_{domain}^{1/3}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="V_{min}" /> the minimum nodal control volume in the domain and{' '}
        <M math="V_{domain}" /> the total domain volume. The floor <M math="d_{wall}" /> prevents
        singularities in the distance term very close to the wall. In all four formulations the
        computed stiffness is clipped to <M math="[10^{-15},\,10^{15}]" /> to prevent
        ill-conditioning.
      </p>

      <H3 id="mesh-velocity" num="7.3.1">Mesh velocity computation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Once the displacement diffusion equation is solved for the total displacement{' '}
        <M math="\mathbf{D}" />, the mesh velocity <M math="\mathbf{v}_m" /> is computed using a
        second-order backward difference formula (BDF2):
      </p>
      <Equation label="7.13" math="\mathbf{v}_m^{n} =
        \frac{c_0\,\mathbf{D}^{n} + c_1\,\mathbf{D}^{n-1} + c_2\,\mathbf{D}^{n-2}}{\Delta t^{n}}," />
      <p style={{ color: 'var(--text-dim)' }}>where the BDF2 coefficients are</p>
      <Equation label="7.14" math="c_0 = \frac{1+2\omega}{1+\omega},\qquad
        c_1 = -(1+\omega),\qquad
        c_2 = \frac{\omega^{2}}{1+\omega},\qquad
        \omega = \frac{\Delta t^{n}}{\Delta t^{n-1}}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="\Delta t^{n}" /> and <M math="\Delta t^{n-1}" /> the current and previous
        time-step sizes. When the time-step size is constant (<M math="\omega=1" />) the
        coefficients reduce to <M math="c_0=3/2" />, <M math="c_1=-2" />, <M math="c_2=1/2" />,
        recovering the standard uniform BDF2 stencil.
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        The mesh velocity genuinely uses the full BDF2 stencil above (falling back to first-order
        only on the first step, where no second previous level exists). An inline source comment
        describing it as &ldquo;first-order backward Euler always&rdquo; is stale and does not
        reflect the implemented coefficients.
      </DocCallout>

      <p style={{ color: 'var(--text-dim)' }}>
        Therefore, flow equations exhibit changes in the advection fluxes, such that a relative
        advecting velocity is used:
      </p>
      <Equation label="7.15" math="\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\mathbf{v}_r) = 0," />
      <Equation label="7.16" math="\frac{\partial\rho\mathbf{v}}{\partial t} + \nabla\cdot(\rho\mathbf{v}_r\mathbf{v})
        = \nabla\cdot\boldsymbol{\tau} - \nabla p + \mathbf{F}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\mathbf{v}_r = \mathbf{v}-\mathbf{v}_m" />, and similarly for any
        transported quantity <M math="\phi" />:
      </p>
      <Equation label="7.17" math="\frac{\partial\rho\phi}{\partial t} + \nabla\cdot(\rho\mathbf{v}_r\phi)
        = \nabla\cdot(\Gamma^{\phi}\nabla\phi) + S^{\phi}." />

      <H2 id="gcl" num="7.4">The Geometric Conservation Law</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The general conservation equation for the quantity <M math="\phi" /> in differential
        form, assuming no sources, is
      </p>
      <Equation label="7.18" math="\frac{\partial(\rho\phi)}{\partial t} + \nabla\cdot(\rho\phi\,\mathbf{v}) = 0," />
      <p style={{ color: 'var(--text-dim)' }}>
        which expresses the local conservation of <M math="\phi" />. Integrating over a moving
        control volume <M math="V(t)" /> yields
      </p>
      <Equation label="7.19" math="\int_{V(t)}\frac{\partial(\rho\phi)}{\partial t}\,dV
        + \int_{S(t)}\rho\phi\,\mathbf{v}\cdot\mathbf{n}\,dS = 0." />
      <p style={{ color: 'var(--text-dim)' }}>
        Applying the Leibniz rule (the Reynolds transport theorem) gives
      </p>
      <Equation label="7.20" math="\frac{d}{dt}\int_{V(t)}\rho\phi\,dV
        = \int_{V(t)}\frac{\partial(\rho\phi)}{\partial t}\,dV
        + \int_{S(t)}\rho\phi\,\mathbf{v}_m\cdot\mathbf{n}\,dS," />
      <p style={{ color: 'var(--text-dim)' }}>
        which relates the time derivative of the integral over the moving volume to the local
        time derivative and the flux due to the mesh velocity <M math="\mathbf{v}_m" />.
        Substituting back into the integral conservation equation yields the final integral
        transport equation
      </p>
      <Equation label="7.21" math="\frac{d}{dt}\int_{V(t)}\rho\phi\,dV
        + \int_{S(t)}\rho\phi\,(\mathbf{v}-\mathbf{v}_m)\cdot\mathbf{n}\,dS = 0," />
      <p style={{ color: 'var(--text-dim)' }}>
        which clearly shows the advection term involving the relative velocity{' '}
        <M math="\mathbf{v}-\mathbf{v}_m" /> and accounts for the moving control volume.
      </p>
      <p style={{ color: 'var(--text-dim)' }}>
        Further manipulation of the first term is required. Expanding the mesh-flux surface
        integral by the divergence theorem and the product rule,{' '}
        <M math="\nabla\cdot(\rho\phi\,\mathbf{v}_m) = \rho\phi\,\nabla\cdot\mathbf{v}_m +
        \mathbf{v}_m\cdot\nabla(\rho\phi)" />, and recognising the material derivative following
        the mesh, one obtains
      </p>
      <Equation label="7.22" math="\frac{d}{dt}\int_{V(t)}\rho\phi\,dV
        = \int_{V(t)}\frac{D}{Dt}\bigg|_{\mathbf{v}_m}(\rho\phi)\,dV
        + \int_{V(t)}\rho\phi\,\nabla\cdot\mathbf{v}_m\,dV," />
      <p style={{ color: 'var(--text-dim)' }}>so that the conservation statement becomes</p>
      <Equation label="7.23" math="\int_{V(t)}\frac{D}{Dt}\bigg|_{\mathbf{v}_m}(\rho\phi)\,dV
        + \underbrace{\int_{V(t)}\rho\phi\,\nabla\cdot\mathbf{v}_m\,dV}_{\text{GCL}}
        + \int_{S(t)}\rho\phi\,(\mathbf{v}-\mathbf{v}_m)\cdot\mathbf{n}\,dS = 0." />
      <p style={{ color: 'var(--text-dim)' }}>
        In Equations 7.15&ndash;7.17, where the mesh deforms, the unsteady term must therefore
        account for the GCL term; its discrete treatment is given in{' '}
        <a href="/theory/cvfem">Chapter 11</a>. Enforcing the GCL is what guarantees a uniform
        field is preserved exactly on a moving mesh &mdash; even impermeable walls contribute
        their swept-volume flux to the continuity residual as the mesh moves.
      </p>
    </TheoryLayout>
  );
}
