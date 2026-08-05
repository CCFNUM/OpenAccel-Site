import { Info, AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2 } from '../get-started/GsLayout';

export function Ch8FreeSurface() {
  useDocumentTitle('Free-Surface Flows — Theory Manual');
  return (
    <TheoryLayout chNum="8" title="Free-Surface Flows">
      <SEO
        title="Free-Surface Flows — Theory Manual"
        description="Algebraic volume-of-fluid free-surface flow: interface compression, flux-corrected transport (cMULES), and balanced-force surface tension."
        path="/theory/free-surface"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        The free-surface flow solver in OpenAccel follows the VoF model; it assumes a homogeneous
        flow model, where all phases <M math="p" /> share the same velocity field and the same
        pressure:
      </p>
      <Equation label="8.1" math="\mathbf{v}^{p} = \mathbf{v}, \qquad p^{p} = p ." />
      <p style={{ color: 'var(--text-dim)' }}>
        The same fundamental equations of <a href="/theory/flow">Chapter 3</a> are adopted, but
        considering mixture properties rather than pure properties:
      </p>
      <Equation label="8.2" math="\rho = \sum_{p=1}^{m}\alpha^{p}\rho^{p},
        \qquad
        \mu = \sum_{p=1}^{m}\alpha^{p}\mu^{p}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\alpha^{p}" /> is the volume fraction of phase <M math="p" /> in a flow
        involving <M math="m" /> phases. The body force <M math="\mathbf{F}" /> in the momentum
        equation involves, in the context of VoF, a gravitational force and/or a surface-tension
        force. <M math="\alpha^{p}" /> is computed for each phase by solving a scalar convection
        equation in the spirit of Hirt &amp; Nichols (1981):
      </p>
      <Equation label="8.3" math="\frac{\partial\rho^{p}\alpha^{p}}{\partial t}
        + \nabla\cdot(\rho^{p}\mathbf{v}\alpha^{p}) = 0 ." />

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        OpenAccel does <em>not</em> use a geometric (donor&ndash;acceptor/PLIC) interface
        reconstruction: no donor&ndash;acceptor code exists anywhere in the source. The interface
        is kept sharp <em>algebraically</em>, by the compressive flux and flux-corrected transport
        described below. The historical &ldquo;Hirt&ndash;Nichols donor&ndash;acceptor&rdquo;
        label, common in other codes, does not describe what is implemented here.
      </DocCallout>

      <H2 id="interface-compression" num="8.1">Algebraic Interface Compression</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Equation 8.3 discretised with the Upwind Differencing (UD) scheme is diffusive in nature:
        the phase boundary smears out over time, leading to loss of sharpness. This requires the
        addition of a compressive term that limits interface diffusion. The modified phasic
        equation is
      </p>
      <KeyBox title="Compressive phasic equation">
        <Equation math="\frac{\partial\rho^{p}\alpha^{p}}{\partial t}
          + \nabla\cdot(\rho^{p}\mathbf{v}\alpha^{p})
          + \underbrace{\nabla\cdot\bigl[\rho^{p}\mathbf{v}_{cr}\,\alpha^{p}(1-\alpha^{p})\bigr]}_{\text{anti-diffusion term}}
          = 0,
          \qquad
          \mathbf{v}_{cr} = \gamma\,\lVert\mathbf{v}\rVert\,\hat{\mathbf{n}}," />
        active only within the interface where <M math="\alpha^{p}(1-\alpha^{p})>0" />.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        Here <M math="\gamma" /> is the compression factor (<code>interface_compression_level</code>)
        and <M math="\hat{\mathbf{n}}" /> is the unit interface normal,
      </p>
      <Equation label="8.4" math="\hat{\mathbf{n}} = \frac{\nabla\alpha^{p}}{\lVert\nabla\alpha^{p}\rVert+\delta}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\delta" /> is a tolerance factor of <M math="O(10^{-6})" /> chosen to avoid
        division by zero. The value of <M math="\gamma" /> is typically chosen such that{' '}
        <M math="0\le\gamma\le1" />: <M math="\gamma=0" /> recovers Equation 8.3, while{' '}
        <M math="\gamma=1" /> leads to the maximum acceptable compression of the interface, beyond
        which the location, shape and stability of the interface are adversely affected.
      </p>

      <H2 id="fct" num="8.2">Flux-Corrected Transport (cMULES)</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        An alternative interface-sharpening strategy is the Flux-Corrected Transport (FCT)
        algorithm, also referred to as cMULES. FCT guarantees strict boundedness of the volume
        fraction <M math="\alpha^{p}\in[0,1]" /> while permitting compressive high-resolution
        fluxes at the interface. The algorithm proceeds in two steps:
      </p>
      <ol className="list-decimal pl-6 space-y-3 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>
          <strong style={{ color: 'var(--text)' }}>Bounded (upwind) predictor:</strong> a bounded
          solution <M math="\alpha^{p,UD}" /> is obtained by solving Equation 8.3 using the
          first-order upwind scheme. This solution is guaranteed to remain within{' '}
          <M math="[0,1]" /> but introduces numerical diffusion at the interface.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Flux correction (Zalesak limiter):</strong> the
          anti-diffusive compressive fluxes are applied as a corrective step, each limited by a
          Zalesak-type limiter (Zalesak, 1979) so the corrected solution introduces no new
          extrema:
          <Equation label="8.5" math="\alpha^{p,**} = \alpha^{p,UD} + \sum_{ip} C_{ip}\,F^{+}_{ip}," />
          where <M math="F^{+}_{ip}" /> are the anti-diffusive flux contributions and{' '}
          <M math="C_{ip}\in[0,1]" /> are the FCT correction factors that limit each flux to the
          largest amount admissible without violating <M math="\alpha^{p}\in[0,1]" />.
        </li>
      </ol>
      <p style={{ color: 'var(--text-dim)' }}>
        The limiters are computed iteratively (&ldquo;corrector MULES&rdquo;) from per-node
        admissible-increase and admissible-decrease bounds <M math="Q^{+}/Q^{-}" />, assembled
        from per-side FCT limiter fields. The result is a strictly bounded volume fraction with a
        sharp, compressive interface: FCT combines the robustness of the upwind scheme with the
        accuracy of the compressive scheme, and is the recommended method for flows with complex
        interface dynamics.
      </p>

      <H2 id="surface-tension" num="8.3">Surface Tension: Balanced-Force CSF</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Surface tension enters the momentum equation as a continuum surface force concentrated at
        the interface. OpenAccel uses a <em>balanced-force</em> formulation (Fran&ccedil;ois et
        al., 2006) built from a capillary potential <M math="\psi" /> rather than the naive
        gradient-of-fraction force, so the discrete surface-tension force and the pressure
        gradient are computed on the same footing and spurious parasitic currents are suppressed.
        The interface curvature is computed per material pair from the fraction field,
      </p>
      <Equation label="8.6" math="\kappa = -\nabla\cdot\hat{\mathbf{n}}," />
      <p style={{ color: 'var(--text-dim)' }}>
        and, because a raw curvature from <M math="\alpha" /> is noisy, is optionally smoothed by
        a configurable number of Laplacian iterations before use.
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        Two practical consequences follow from the algebraic VoF plus explicit free-surface
        physics. First, the MULES advection is stable only up to a Courant number of order{' '}
        <M math="Co\approx0.5" />; beyond it the fraction becomes unbounded and the density
        &mdash; and hence velocity &mdash; diverges. Adaptive time-stepping targeting{' '}
        <M math="Co\lesssim0.3" /> is essential for violent free-surface cases. Second,
        contact-angle (wetting) boundary conditions are not implemented.
      </DocCallout>
    </TheoryLayout>
  );
}
