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

export function Ch10RigidbodyFsi() {
  useDocumentTitle('Rigid-Body Dynamics and Fluid–Structure Interaction — Theory Manual');
  return (
    <TheoryLayout chNum="10" title="Rigid-Body Dynamics and Fluid–Structure Interaction">
      <SEO
        title="Rigid-Body Dynamics and Fluid–Structure Interaction — Theory Manual"
        description="6-DOF rigid-body dynamics, the two-way rigid-body/flow coupling cycle, and the partitioned Dirichlet-Neumann FSI loop with fixed relaxation, Aitken, and IQN-ILS acceleration."
        path="/theory/rigidbody-fsi"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        Two coupling mechanisms connect the flow to moving structures: rigid-body (6-DOF) dynamics
        for non-deforming bodies, and partitioned fluid&ndash;structure interaction for deformable
        solids. Both are genuinely two-way: the flow loads the structure, the structure moves, and
        its motion returns to the fluid through arbitrary Lagrangian&ndash;Eulerian (ALE) mesh
        motion.
      </p>

      <H2 id="rigid-body" num="10.1">Rigid-Body (6-DOF) Dynamics</H2>

      <H3 id="equations-of-motion" num="10.1.1">Equations of motion</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The translational motion is advanced with an average-acceleration
        (trapezoidal-style) scheme,
      </p>
      <Equation label="10.1" math="\mathbf{a}^{n} = \tfrac12\,\mathbf{a}^{n-1}
        + \tfrac12\,\frac{\mathbf{F}+\mathbf{F}_{ext}}{m},
        \qquad
        \mathbf{U}^{n} = \mathbf{U}^{n-1} + \Delta t\,\mathbf{a}^{n}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="\mathbf{F}" /> the fluid force, <M math="\mathbf{F}_{ext}" /> any external
        force and <M math="m" /> the body mass.
      </p>

      <KeyBox title="Euler rigid-body equations and quaternion kinematics">
        In three dimensions the rotation integrates the Euler rigid-body equations about the
        principal axes,
        <Equation math="\frac{\mathrm{d}\omega_i}{\mathrm{d}t}
          = \frac{M_i - (I_j-I_k)\,\omega_j\,\omega_k}{I_i}
          \qquad \text{(cyclic in } i,j,k\text{)}," />
        while the orientation is tracked as a quaternion <M math="\mathbf{q}=(q_0,q_1,q_2,q_3)" />{' '}
        obeying <M math="\dot{\mathbf{q}}=\tfrac12\,\mathbf{q}\otimes[0,\boldsymbol{\omega}]" />,
        i.e.
        <Equation math="\begin{aligned}
          \dot{q}_0 &= \tfrac12(-q_1\omega_x - q_2\omega_y - q_3\omega_z), &
          \dot{q}_1 &= \tfrac12(\;\,q_0\omega_x + q_3\omega_y - q_2\omega_z),\\
          \dot{q}_2 &= \tfrac12(-q_3\omega_x + q_0\omega_y + q_1\omega_z), &
          \dot{q}_3 &= \tfrac12(\;\,q_2\omega_x - q_1\omega_y + q_0\omega_z).
          \end{aligned}" />
        Both ODE systems are advanced with classical fourth-order Runge&ndash;Kutta; the
        quaternion is renormalised after each step and the Euler angles are re-extracted from it.
        In 2D a single scalar-angle explicit update is used: <M math="\alpha=(M_z+M_{ext,z})/I_{zz}" />,{' '}
        <M math="\omega\mathrel{+}=\alpha\Delta t" />, <M math="\theta\mathrel{+}=\omega\Delta t" />.
      </KeyBox>

      <p style={{ color: 'var(--text-dim)' }}>
        Individual translation and rotation axes can be frozen through per-axis degree-of-freedom
        masks, and body-frame/laboratory-frame conversions are applied around the angular-velocity
        integration.
      </p>

      <H3 id="two-way-coupling" num="10.1.2">Two-way coupling</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The fluid force and moment on the body are obtained by integrating the pressure and the
        wall shear stress over the wetted boundary (see <a href="/theory/postprocessing">Chapter 18</a>).
        These drive the integrators above; the resulting pose sets the displacement of the body's
        boundary through the <code>rigid_body_solution</code> boundary condition, and the interior
        mesh follows by the displacement diffusion of{' '}
        <a href="/theory/moving-domains">Chapter 7</a>. Figure 10.1 shows the cycle.
      </p>

      <FlowChart
        label="Figure 10.1"
        caption={<>Two-way rigid-body/flow coupling. Fluid forces drive the 6-DOF integrators; the
          resulting body pose is imposed on the mesh through the <code>rigid_body_solution</code>{' '}
          boundary condition and propagated by ALE mesh motion.</>}
        steps={[
          { id: 'flow', kind: 'start', title: 'Flow solution', subtitle: 'Flow field at time $t^{n}$' },
          { id: 'force', kind: 'process', title: 'Force & moment', subtitle: 'Integrate $-p\\,\\mathbf{n} + \\boldsymbol{\\tau}_w$ over the wetted surface $\\Rightarrow \\mathbf{F},\\ \\mathbf{M}$' },
          { id: 'integ', kind: 'process', title: '6-DOF integrators', subtitle: 'Average-acceleration (translation); RK4 + quaternion (rotation)' },
          { id: 'mask', kind: 'process', title: 'Apply DOF masks', subtitle: 'New pose: position $\\mathbf{x}$, orientation quaternion $\\mathbf{q}$' },
          { id: 'bc', kind: 'process', title: 'Impose boundary displacement', subtitle: '$\\texttt{rigid\\_body\\_solution}$ BC $\\Rightarrow$ ALE mesh update' },
        ]}
        loop={{ from: 'bc', to: 'flow', label: 'advance to $t^{n+1}$' }}
      />

      <H2 id="partitioned-fsi" num="10.2">Partitioned Fluid&ndash;Structure Interaction</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Deformable FSI couples the flow to the finite-strain solid of{' '}
        <a href="/theory/solid">Chapter 9</a> through a shared interface. OpenAccel uses a{' '}
        <em>partitioned</em> Dirichlet&ndash;Neumann scheme: the fluid and solid are solved as
        separate systems within each coupling iteration, exchanging traction one way and
        displacement the other, and the coupling is stabilised by relaxation or quasi-Newton
        acceleration.
      </p>

      <H3 id="coupling-loop" num="10.2.1">The coupling loop</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Within a time step, the solver iterates the loop of Figure 10.2: the fluid momentum and
        pressure-correction equations are solved on the current mesh; the interface traction is
        transferred to the solid as a Neumann load; the solid displacement equation is solved; the
        resulting interface displacement is relaxed and imposed on the fluid mesh through ALE; and
        the interface residual is tested. Two loop layers exist: the outer physics/interface-
        convergence loop, and the inner per-equation sub-iteration (assemble-then-solve) cycle.
      </p>

      <FlowChart
        label="Figure 10.2"
        caption={<>Partitioned Dirichlet&ndash;Neumann FSI loop. The interface residual{' '}
          <M math="\mathbf{r}^{k}=\tilde{\mathbf{d}}^{k}-\mathbf{d}^{k-1}" /> is driven to zero by
          fixed under-relaxation, Aitken's dynamic factor, or IQN-ILS quasi-Newton acceleration.</>}
        steps={[
          { id: 's', kind: 'start', title: 'Outer coupling iteration $k$' },
          { id: 'f', kind: 'process', title: 'Solve fluid', subtitle: 'Momentum + pressure correction $\\Rightarrow$ interface traction $\\mathbf{t}^{k}$' },
          { id: 'tr', kind: 'process', title: 'Transfer traction', subtitle: 'Neumann load to the solid, via the DG interface' },
          { id: 'sol', kind: 'process', title: 'Solve solid displacement', subtitle: 'Produces the predicted interface displacement $\\tilde{\\mathbf{d}}^{k}$' },
          { id: 'rel', kind: 'process', title: 'Relax / accelerate', subtitle: '$\\mathbf{d}^{k} = \\mathbf{d}^{k-1} + \\omega\\,\\mathbf{r}^{k}$ — fixed URF, Aitken, or IQN-ILS' },
          { id: 'mesh', kind: 'process', title: 'Move fluid mesh', subtitle: 'ALE update to the relaxed displacement $\\mathbf{d}^{k}$' },
          { id: 'dec', kind: 'decision', title: 'Converged?', subtitle: 'Interface residual below target?' },
          { id: 'done', kind: 'end', title: 'Advance to $t^{n+1}$' },
        ]}
        loop={{ from: 'dec', to: 'f', label: 'no, $k := k+1$', exitLabel: 'yes' }}
      />

      <SourceBox>
        Fluid&ndash;solid interfaces are always forced onto the discontinuous-Galerkin
        non-conformal path (see <a href="/theory/interfaces">Chapter 14</a>); traction/displacement
        transfer reuses the general Gauss-point projection machinery rather than a separate
        mapping library. Acceleration is configured per equation under{' '}
        <code>solver_control &gt; advanced_options &gt; equation_controls &gt; acceleration &gt;</code>{' '}
        <em>equation_name</em> with <code>option: none|aitken|iqn_ils</code> and the parameters
        below.
      </SourceBox>

      <H3 id="fixed-relaxation" num="10.2.2">Fixed under-relaxation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The simplest choice keeps <M math="\omega" /> constant,{' '}
        <M math="\mathbf{d}^{k}=\mathbf{d}^{k-1}+\omega\,\mathbf{r}^{k}" /> with{' '}
        <M math="\mathbf{r}^{k}=\tilde{\mathbf{d}}^{k}-\mathbf{d}^{k-1}" />. It is robust but slow.
      </p>

      <H3 id="aitken" num="10.2.3">Aitken's <M math="\Delta^{2}" /> relaxation</H3>
      <p style={{ color: 'var(--text-dim)' }}>The relaxation factor is adapted from successive residuals:</p>
      <KeyBox title="Aitken update (as implemented)">
        <Equation math="\omega^{k} = \omega^{k-1}\,
          \frac{\mathbf{r}^{k-1}\cdot(\mathbf{r}^{k-1}-\mathbf{r}^{k})}
               {\lVert\mathbf{r}^{k}-\mathbf{r}^{k-1}\rVert^{2}},
          \qquad
          \omega^{k} \leftarrow \mathrm{clamp}\bigl(\omega^{k},\,\omega_{min},\,\omega_{max}\bigr)," />
        with defaults <M math="\omega^{0}=" /> <code>initial_omega</code> <M math="=1.0" />,{' '}
        <M math="\omega_{min}=0.1" />, <M math="\omega_{max}=1.0" />. The first iteration returns{' '}
        <code>initial_omega</code> directly, all inner products are MPI-summed, and the update is
        skipped when the residual difference is at machine zero.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        The clamp <M math="\omega_{min}" /> must not be set too low (<M math="\gtrsim0.1" />):
        during a noisy impact a collapsing <M math="\omega" /> stops the structure responding.
      </p>

      <H3 id="iqn-ils" num="10.2.4">IQN-ILS quasi-Newton acceleration</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The interface quasi-Newton inverse-least-squares method (Degroote et al., 2009;
        Tukovi&#263; et al., 2018) builds an approximate inverse Jacobian of the fixed-point
        operator from the history of residuals and solver outputs. At outer iteration{' '}
        <M math="k" />, with residual <M math="\mathbf{r}^{k}=\tilde{\mathbf{x}}^{k}-\mathbf{x}^{k}" />,
        the history deques (capped at <M math="m=" /> <code>iqn_ils_window</code>, default 5)
        provide the difference matrices
      </p>
      <Equation label="10.2" math="\mathbf{V} = \bigl[\Delta\mathbf{r}^{1},\dots,\Delta\mathbf{r}^{m}\bigr],
        \qquad
        \mathbf{W} = \bigl[\Delta\tilde{\mathbf{x}}^{1},\dots,\Delta\tilde{\mathbf{x}}^{m}\bigr],
        \qquad
        \Delta\tilde{\mathbf{x}}^{i} = \Delta\mathbf{x}^{i} + \Delta\mathbf{r}^{i}." />
      <p style={{ color: 'var(--text-dim)' }}>
        The least-squares problem <M math="\min_{\mathbf{c}}\lVert\mathbf{V}\mathbf{c}+\mathbf{r}^{k}\rVert" />{' '}
        is solved by a fully parallel modified Gram&ndash;Schmidt QR decomposition, and the
        interface update is
      </p>
      <KeyBox title="IQN-ILS update">
        <Equation math="\mathbf{x}^{k+1} - \mathbf{x}^{k}
          = \mathbf{r}^{k} + \sum_{i}\mathbf{W}_i\,c_i ,
          \qquad
          \mathbf{c} = \mathbf{R}^{-1}\mathbf{Q}^{T}(-\mathbf{r}^{k})." />
        Columns are orthogonalised <em>newest first</em>, so the rank filter preferentially drops
        the oldest information. A column is filtered (its coefficient set to zero) when
        <Equation math="|R_{ii}| \le \varepsilon,
          \qquad
          \varepsilon = \tau\,\max_{j}\Bigl(\sum_{i\le j}|R_{ij}|\Bigr)," />
        with <M math="\tau=" /> <code>iqn_ils_filter_threshold</code> (default <M math="10^{-10}" />),
        matching the solids4foam criterion. With fewer than two history columns the update falls
        back to plain fixed relaxation.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>iqn_ils_reuse_across_timesteps</code> (default <code>false</code>) controls whether
        the history deques are cleared at each new time step or preserved across steps (the
        Degroote reuse extension). IQN-ILS typically reaches interface convergence in a handful of
        iterations where fixed relaxation needs dozens.
      </p>

      <H3 id="convergence-criteria" num="10.2.5">Convergence criteria</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Convergence of the outer loop is measured per interface by the displacement-change norm,
        normalised by the running maximum norm observed for that interface:
      </p>
      <Equation label="10.3" math="r_{rel} = \frac{\lVert\mathbf{D}^{k}-\mathbf{D}^{k-1}\rVert_2}
        {\max_{k'\le k}\lVert\mathbf{D}^{k'}-\mathbf{D}^{k'-1}\rVert_2 + \epsilon}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with the global residual the maximum over all interfaces, tested against the user target.
      </p>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        Normalisation is by the <em>running maximum</em> residual ever observed &mdash; not by the
        first-iteration residual as in most published FSI residual definitions. Moreover, the
        alternative criterion <code>fsi_force_residual</code> is registered but{' '}
        <em>non-functional</em>: its residual is never computed and its convergence check
        unconditionally returns not-converged, so a simulation using only this criterion would
        never converge. Use the interface (displacement) residual.
      </DocCallout>
    </TheoryLayout>
  );
}
