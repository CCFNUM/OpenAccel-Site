import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { Equation, M } from '@/components/tutorial/Equation';
import { FigurePlaceholder } from '@/components/theory/FigurePlaceholder';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch2Preliminaries() {
  useDocumentTitle('Mathematical Preliminaries — Theory Manual');
  return (
    <TheoryLayout chNum="2" title="Mathematical Preliminaries">
      <SEO
        title="Mathematical Preliminaries — Theory Manual"
        description="Notation used throughout the guide: vector/tensor calculus identities, the Green–Gauss nodal gradient, and the gradient correction applied at symmetry planes."
        path="/theory/preliminaries"
      />

      <H2 id="basic-calculus" num="2.1">Basic Calculus</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Consider a vector <M math="\mathbf{u}=[u_x,u_y,u_z]" /> and a vector{' '}
        <M math="\mathbf{v}=[v_x,v_y,v_z]" />; the inner product is computed as
      </p>
      <Equation label="2.1" math="\mathbf{u}\cdot\mathbf{v} = u_x v_x + u_y v_y + u_z v_z ," />
      <p style={{ color: 'var(--text-dim)' }}>while the outer product is</p>
      <Equation label="2.2" math="\mathbf{u}\mathbf{v} =
        \begin{bmatrix}
          u_xv_x & u_xv_y & u_xv_z \\[0.5em]
          u_yv_x & u_yv_y & u_yv_z \\[0.5em]
          u_zv_x & u_zv_y & u_zv_z
        \end{bmatrix}." />
      <p style={{ color: 'var(--text-dim)' }}>An important identity to use is</p>
      <Equation label="2.3" math="\mathbf{u}\mathbf{v} = \left(\mathbf{v}\mathbf{u}\right)^{T}." />
      <p style={{ color: 'var(--text-dim)' }}>Also, considering a tensor <M math="\mathbf{T}" />, given as</p>
      <Equation label="2.4" math="\mathbf{T} =
        \begin{bmatrix}
          T_{xx} & T_{xy} & T_{xz} \\[0.5em]
          T_{yx} & T_{yy} & T_{yz} \\[0.5em]
          T_{zx} & T_{zy} & T_{zz}
        \end{bmatrix}," />
      <p style={{ color: 'var(--text-dim)' }}>the following commutative identity holds:</p>
      <Equation label="2.5" math="\mathbf{u}\cdot\mathbf{T} = \mathbf{T}^{T}\cdot\mathbf{u}." />

      <H2 id="gradient-computation" num="2.2">Gradient Computation</H2>

      <H3 id="scalar-field-gradient" num="2.2.1">Scalar Field Gradient</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        At a node <M math="i" />, the gradient of a scalar field <M math="\phi" /> is calculated as
      </p>
      <KeyBox title="Green–Gauss nodal gradient">
        <Equation math="\nabla\phi_i = \frac{\sum\limits_{ip}\mathbf{S}_{ip}\,\phi_{ip}}{V_i}," />
        where the sum runs over the integration points <M math="ip" /> on the control surface of
        the dual control volume <M math="V_i" /> and <M math="\mathbf{S}_{ip}" /> is the outward
        area vector.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>The storage layout can be expressed as</p>
      <Equation label="2.6" math="\nabla\phi_i =
        \begin{bmatrix}
          \dfrac{\partial\phi}{\partial x}, \
          \dfrac{\partial\phi}{\partial y}, \
          \dfrac{\partial\phi}{\partial z}
        \end{bmatrix}_i ." />

      <H3 id="vector-field-gradient" num="2.2.2">Vector Field Gradient</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Similarly at a node <M math="i" />, the gradient of a vector field{' '}
        <M math="\boldsymbol{\phi}=\left[\phi_x,\phi_y,\phi_z\right]" /> is
      </p>
      <Equation label="2.7" math="\nabla\boldsymbol{\phi}_i = \frac{\sum\limits_{ip}\mathbf{S}_{ip}\,\boldsymbol{\phi}_{ip}}{V_i}," />
      <p style={{ color: 'var(--text-dim)' }}>and the storage layout can be expressed as</p>
      <Equation label="2.8" math="\nabla\boldsymbol{\phi}_i =
        \begin{bmatrix}
          \frac{\partial\phi_x}{\partial x} & \frac{\partial\phi_y}{\partial x} & \frac{\partial\phi_z}{\partial x}\\[0.5em]
          \frac{\partial\phi_x}{\partial y} & \frac{\partial\phi_y}{\partial y} & \frac{\partial\phi_z}{\partial y}\\[0.5em]
          \frac{\partial\phi_x}{\partial z} & \frac{\partial\phi_y}{\partial z} & \frac{\partial\phi_z}{\partial z}
        \end{bmatrix}_i ." />

      <H2 id="symmetry" num="2.3">Gradient Correction at Symmetry Planes</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        At symmetry planes (or slip walls), the gradient of a field must be corrected to ensure
        compatibility with the physical boundary conditions. This is crucial in preserving zero
        shear stress and preventing artificial fluxes through the boundary. The physical
        constraints for a symmetry plane are well established (Blazek, 2015, Section 8.6), and can
        be summarised as follows:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>No flux through the boundary.</li>
        <li>
          Vanishing scalar quantity gradient in the normal direction:{' '}
          <M math="\mathbf{n}\cdot\nabla\phi = 0" />.
        </li>
        <li>
          Vanishing normal derivative of tangential vector quantity:{' '}
          <M math="\mathbf{n}\cdot\nabla(\boldsymbol{\phi}\cdot\mathbf{t}) = 0" />.
        </li>
        <li>
          Vanishing tangential derivative of normal vector quantity:{' '}
          <M math="\mathbf{t}\cdot\nabla(\boldsymbol{\phi}\cdot\mathbf{n}) = 0" />.
        </li>
      </ol>
      <p style={{ color: 'var(--text-dim)' }}>
        Points (2)&ndash;(4) relate to gradient behaviour and are handled at the discrete level by
        projecting the computed gradient onto the subspace compatible with these constraints
        (Figure 2.1).
      </p>

      <FigurePlaceholder
        label="Figure 2.1"
        description="Mirror symmetry at a symmetry-plane node: a hand-drawn TikZ diagram showing the physical domain and its mirror image across the symmetry plane, with the boundary quantity decomposed into tangential and normal parts."
        caption={<>
          Mirror symmetry at a symmetry-plane node <M math="i" />. A boundary quantity{' '}
          <M math="\boldsymbol{\phi}" /> in the physical domain (solid) decomposes into a
          tangential part <M math="\boldsymbol{\phi}_t" /> and a normal part{' '}
          <M math="\phi_n\mathbf{n}" />. Its mirror image <M math="\boldsymbol{\phi}'" /> (dashed)
          keeps the same tangential part but reverses the normal part &mdash; the reflection the
          gradient projection enforces by removing the cross terms between the normal and
          tangential directions.
        </>}
      />

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Scalar Gradient Correction.</strong>{' '}
        Let <M math="\mathbf{n}_i" /> be the unit normal vector at boundary node <M math="i" />,
        and let <M math="\nabla\phi_i" /> be the computed gradient of a scalar field. To
        enforce <M math="\mathbf{n}_i\cdot\nabla\phi_i = 0" />, we project out the normal
        component:
      </p>
      <Equation label="2.9" math="\nabla\phi_i^{\,\text{corrected}} = \nabla\phi_i
        - (\mathbf{n}_i\cdot\nabla\phi_i)\,\mathbf{n}_i ." />

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Vector Gradient Correction.</strong>{' '}
        For vector fields (e.g.\ velocity), the full gradient tensor{' '}
        <M math="\nabla\boldsymbol{\phi}_i\in\mathbb{R}^{d\times d}" /> must be corrected to
        eliminate the normal derivative of tangential components (to eliminate shear stress) and
        the tangential derivative of the normal component (to preserve zero normal velocity along
        the surface). We denote
      </p>
      <Equation math="\phi_{n,i} = \boldsymbol{\phi}_i\cdot\mathbf{n}_i, \qquad
        \boldsymbol{\phi}_{t,i} = \boldsymbol{\phi}_i - \phi_{n,i}\,\mathbf{n}_i ." />
      <p style={{ color: 'var(--text-dim)' }}>The corrected gradient tensor is given by</p>
      <Equation label="2.10" math="(\nabla\boldsymbol{\phi}_i)^{\,\text{corrected}}_{mn} =
        (\nabla\boldsymbol{\phi}_i)_{mn}
        - (\nabla\phi_{i,m}\cdot\mathbf{n}_i)\,n_{i,n}
        - n_{i,m}(\nabla\phi_{i,n}\cdot\mathbf{n}_i)
        + 2\,n_{i,m}n_{i,n}\bigl(\mathbf{n}_i\cdot\nabla(\boldsymbol{\phi}_i\cdot\mathbf{n}_i)\bigr)," />
      <p style={{ color: 'var(--text-dim)' }}>where</p>
      <Equation math="\begin{aligned}
        \nabla\phi_{i,m}\cdot\mathbf{n}_i &= \sum_{k=1}^{d}\frac{\partial\phi_{i,m}}{\partial x_k}\,n_{i,k}, \\
        \nabla(\boldsymbol{\phi}_i\cdot\mathbf{n}_i)_n &= \sum_{k=1}^{d}\frac{\partial\phi_{i,k}}{\partial x_n}\,n_{i,k}, \\
        \mathbf{n}_i\cdot\nabla(\boldsymbol{\phi}_i\cdot\mathbf{n}_i) &=
        \sum_{m=1}^{d}\sum_{n=1}^{d} n_{i,m}\,\frac{\partial\phi_{i,m}}{\partial x_n}\,n_{i,n}.
        \end{aligned}" />
      <p style={{ color: 'var(--text-dim)' }}>
        This projection removes cross terms between normal and tangential directions and retains
        only the components compatible with symmetry-plane behaviour. It is equivalent to applying
        a tensor projection operator:
      </p>
      <Equation label="2.11" math="\nabla\boldsymbol{\phi}^{\,\text{corrected}} =
        \mathbf{P}_\tau\cdot\nabla\boldsymbol{\phi}\cdot\mathbf{P}_\tau
        + (\mathbf{n}\cdot\nabla\phi_n)\,\mathbf{n}\otimes\mathbf{n},
        \qquad
        \mathbf{P}_\tau = \mathbf{I} - \mathbf{n}\otimes\mathbf{n}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\mathbf{P}_\tau" /> projects onto the tangential plane.
      </p>
    </TheoryLayout>
  );
}
