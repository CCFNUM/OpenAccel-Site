import { Info } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { SourceBox } from '@/components/SourceBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch3Flow() {
  useDocumentTitle('Flow and Transport Equations — Theory Manual');
  return (
    <TheoryLayout chNum="3" title="Flow and Transport Equations">
      <SEO
        title="Flow and Transport Equations — Theory Manual"
        description="The general scalar transport equation, continuity and momentum conservation, and the incompressible/compressible stress tensor."
        path="/theory/flow"
      />

      <H2 id="general-transport" num="3.1">General Transport Equation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The general transport equation of a scalar quantity <M math="\phi" /> is as follows:
      </p>
      <KeyBox title="General transport equation">
        <Equation math="\underbrace{\frac{\partial\rho\phi}{\partial t}}_{\text{transient}}
          + \underbrace{\nabla\cdot(\rho\mathbf{v}\phi)}_{\text{advection}}
          = \underbrace{\nabla\cdot(\Gamma^{\phi}\nabla\phi)}_{\text{diffusion}}
          + \underbrace{S^{\phi}}_{\text{source}}" />
        All conservation equations have this same form; recognising this shared structure is what
        lets a single assembly kernel serve momentum, energy, turbulence and volume-fraction
        transport alike.
      </KeyBox>
      <Equation label="3.1" math="\frac{\partial\rho\phi}{\partial t} + \nabla\cdot(\rho\mathbf{v}\phi)
        = \nabla\cdot(\Gamma^{\phi}\nabla\phi) + S^{\phi}" />

      <H2 id="fundamental-flow" num="3.2">Fundamental Flow Equations</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The fundamental equations governing a single-phase flow are the continuity and momentum
        conservation equations given by
      </p>
      <Equation label="3.2" math="\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\mathbf{v}) = 0" />
      <Equation label="3.3" math="\frac{\partial\rho\mathbf{v}}{\partial t} + \nabla\cdot(\rho\mathbf{v}\mathbf{v})
        = \nabla\cdot\boldsymbol{\tau} - \nabla p + \mathbf{F}" />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\boldsymbol{\tau}" /> in Equation 3.3 is the full stress tensor that
        combines laminar and turbulent stresses. Adopting a Boussinesq eddy-viscosity assumption,
        which is the basis for all two-equation turbulence models, <M math="\boldsymbol{\tau}" />{' '}
        for an incompressible flow is expressed as
      </p>
      <Equation label="3.4" math="\boldsymbol{\tau} = \mu_{eff}\bigl(\nabla\mathbf{v}+\nabla\mathbf{v}^{T}\bigr)," />
      <p style={{ color: 'var(--text-dim)' }}>
        while for a compressible flow, additional terms related to bulk viscosity and kinetic
        energy are involved:
      </p>
      <Equation label="3.5" math="\boldsymbol{\tau} = \mu_{eff}\bigl(\nabla\mathbf{v}+\nabla\mathbf{v}^{T}\bigr)
        - \frac{2}{3}\mu_{eff}(\nabla\cdot\mathbf{v})\,\mathbf{I}
        - \frac{2}{3}\rho k\,\mathbf{I}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\mu_{eff}" /> is the effective viscosity defined as
      </p>
      <Equation label="3.6" math="\mu_{eff} = \mu + \mu_t ," />
      <p style={{ color: 'var(--text-dim)' }}>
        <M math="k" /> is the turbulent kinetic energy predicted by a turbulence model and{' '}
        <M math="\mathbf{F}" /> is any body-force term, like the gravitational force.
      </p>

      <H3 id="compressible-stress-correction" num="3.2.1">Assembled compressible stress correction</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        In the discrete momentum assembly the bulk-viscosity (dilatation) correction is formed
        explicitly at each integration point,
      </p>
      <Equation label="3.7" math="\nabla\cdot\mathbf{v}\big|_{ip} = \sum_{k} \mathbf{v}_k\cdot\nabla N_k^{ip},
        \qquad
        \bigl(\tfrac{2}{3}\,\mu_{eff}\,\nabla\cdot\mathbf{v}\bigr)\,\mathbf{S}_{ip}\cdot\hat{\mathbf{e}}_i\;
        \text{gated by } comp," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="comp=1" /> for a compressible material and <M math="comp=0" /> otherwise
        &mdash; the same single material-compressibility switch that also selects the harmonic
        pressure-gradient face interpolation of{' '}
        <a href="/theory/pv-coupling">Velocity&ndash;Pressure Coupling</a>.
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        The turbulent trace term <M math="-\tfrac{2}{3}\rho k\,\mathbf{I}" /> of Equation 3.5 is{' '}
        <em>not</em> assembled explicitly: the momentum assembler never gathers <M math="k" />. In
        a segregated pressure-correction solver this term is absorbed into the solved pressure
        field, which is then implicitly the modified pressure{' '}
        <M math="p^{*}=p+\tfrac{2}{3}\rho k" /> &mdash; standard practice in this class of solver,
        not an omission.
      </DocCallout>

      <SourceBox>
        No generic user-specifiable momentum-source key exists in the input vocabulary; body
        forces enter exclusively through the buoyancy and body-force mechanism of{' '}
        <a href="/theory/buoyancy-pressure">Chapter 6</a>, optionally smoothed by the
        redistribution pass described there.
      </SourceBox>
    </TheoryLayout>
  );
}
