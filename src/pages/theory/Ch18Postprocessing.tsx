import { Info } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { DocCallout } from '@/components/DocCallout';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2 } from '../get-started/GsLayout';

export function Ch18Postprocessing() {
  useDocumentTitle('Post-Processing Quantities — Theory Manual');
  return (
    <TheoryLayout chNum="18" title="Post-Processing Quantities">
      <SEO
        title="Post-Processing Quantities — Theory Manual"
        description="Total pressure/temperature, Mach and Courant numbers, wall shear stress and wall coordinates, forces and moments, and the reduction post-processes."
        path="/theory/postprocessing"
      />

      <H2 id="total-pressure" num="18.1">Total Pressure</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Total pressure <M math="p_0" /> has different formulas depending on the flow model, all
        of which are functions of the static pressure <M math="p" />. For incompressible cases:
      </p>
      <Equation label="18.1" math="p_0 = p + \tfrac12\,\rho v^{2}." />
      <p style={{ color: 'var(--text-dim)' }}>
        For compressible cases, where the ideal-gas law is employed:
      </p>
      <Equation label="18.2" math="p_0 = p\left[1+\left(\frac{\kappa-1}{2}\,M_a^{2}\right)\right]^{\frac{\kappa}{\kappa-1}}." />

      <H2 id="total-temperature" num="18.2">Total Temperature</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Total temperature <M math="T_0" /> likewise depends on the flow model. For incompressible
        cases the total temperature equals the static temperature, since no temperature changes
        take place due to changes in kinetic energy: <M math="T_0 = T" />. For a compressible flow
        employing the ideal-gas law with constant specific heat (a perfect gas),
      </p>
      <Equation label="18.3" math="T_0 = T + \frac{\mathbf{v}\cdot\mathbf{v}}{2c_p}." />
      <p style={{ color: 'var(--text-dim)' }}>
        If <M math="c_p" /> varies with temperature, a different formulation is required. For a
        polynomial-based <M math="c_p(T)" />, the specific total enthalpy is{' '}
        <M math="h_0 = h + \tfrac12\mathbf{v}\cdot\mathbf{v}" />, and using the enthalpy
        expression <M math="h(T)=h_{ref}+\int_{T_{ref}}^{T}c_p(T)\,\mathrm{d}T" /> we can write{' '}
        <M math="h(T_0)=h(T)+\tfrac12\mathbf{v}\cdot\mathbf{v}" />. Substituting the integral
        expressions for both sides and cancelling <M math="h_{ref}" /> gives
      </p>
      <Equation label="18.4" math="\int_{T_{ref}}^{T_0} c_p(T)\,\mathrm{d}T
        = \int_{T_{ref}}^{T} c_p(T)\,\mathrm{d}T + \tfrac12\,\mathbf{v}\cdot\mathbf{v}." />
      <p style={{ color: 'var(--text-dim)' }}>
        Assuming <M math="c_p(T)" /> is expressed as a fourth-order polynomial{' '}
        <M math="c_p(T)=a_0+a_1T+a_2T^{2}+a_3T^{3}+a_4T^{4}" />, the integral evaluates
        analytically, and the total temperature <M math="T_0" /> satisfies
      </p>
      <Equation label="18.5" math="a_0(T_0-T_{ref}) + \frac{a_1}{2}\bigl(T_0^{2}-T_{ref}^{2}\bigr)
        + \frac{a_2}{3}\bigl(T_0^{3}-T_{ref}^{3}\bigr)
        + \frac{a_3}{4}\bigl(T_0^{4}-T_{ref}^{4}\bigr)
        + \frac{a_4}{5}\bigl(T_0^{5}-T_{ref}^{5}\bigr)
        = h(T) - h_{ref} + \tfrac12\,\mathbf{v}\cdot\mathbf{v}," />
      <p style={{ color: 'var(--text-dim)' }}>
        a nonlinear equation that must be solved numerically for <M math="T_0" />, given the
        static temperature <M math="T" /> and the velocity magnitude.
      </p>

      <H2 id="mach-number" num="18.3">Mach Number</H2>
      <KeyBox title="Mach number">
        <Equation math="M_a = \frac{v}{a},
          \qquad
          a = \sqrt{\gamma\,R\,T/M}," />
        where <M math="a" /> is the speed of sound, <M math="\gamma" /> the ratio of specific
        heats (<M math="\gamma = c_p/(c_p-R_s)" /> with <M math="R_s" /> the specific gas
        constant), <M math="R" /> the universal gas constant (0.008314 kJ/(mol&middot;K)) and{' '}
        <M math="M" /> the molar mass.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        The Mach field feeds the shock-sensor damping of <a href="/theory/heat">Chapter 5</a>.
      </p>

      <H2 id="courant-number" num="18.4">Courant Number</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        For transient runs the Courant number is evaluated per sub-control-surface edge and
        reduced to an element and then a global maximum, feeding the adaptive time-step
        controller:
      </p>
      <Equation label="18.6" math="Co_{ip} = \frac{\bigl|\mathbf{v}_{ip}\cdot\Delta\mathbf{x}\bigr|\,\Delta t}
        {\lVert\Delta\mathbf{x}\rVert^{2}},
        \qquad
        Co_e = \max_{ip\in e} Co_{ip},
        \qquad
        Co = \max_{\text{ranks}} Co_e ," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="\Delta\mathbf{x}" /> the edge vector between the two nodes of the edge.
        Time-step adaptation targets <code>max_courant</code> (the alternative{' '}
        <code>rms_courant</code> is registered but rejected, see{' '}
        <a href="/theory/rejected-approaches">Appendix A</a>).
      </p>

      <H2 id="wall-shear" num="18.5">Wall Shear Stress and Wall Coordinates</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The wall shear stress is obtained from the wall-function coefficient and the tangential
        velocity slip:
      </p>
      <Equation label="18.7" math="\boldsymbol{\tau}_w = u_{wall}\,
        \frac{\mathbf{v}_{tan}-\mathbf{v}^{bc}_{tan}}{\lVert\mathbf{A}\rVert}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="u_{wall}" /> ties into the <M math="k" />&ndash;<M math="\varepsilon" />/SST
        wall functions (see <a href="/theory/turbulence">Chapter 4</a>) and <M math="\mathbf{A}" />{' '}
        is the boundary face area vector. The wall-coordinate fields are populated alongside:
      </p>
      <Equation label="18.8" math="u^{+} = \frac{u_{tan}}{u_\tau+\epsilon}," />
      <p style={{ color: 'var(--text-dim)' }}>
        (with <M math="u^{+}" /> set to a large sentinel where <M math="u_\tau" /> vanishes), and
        the wall-law slope <M math="\mathrm{d}u^{+}/\mathrm{d}y^{+}" /> evaluated from a
        Reichardt/Spalding-style single-formula blend of the viscous-sublayer and log-law
        profiles, combining a <M math="y^{+4}/(1+5y^{+})" />-type near-wall term with the{' '}
        <M math="1/(\kappa y^{+})" /> log-layer slope.
      </p>

      <H2 id="forces-moments" num="18.6">Forces and Moments</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Integrating pressure and wall shear over a boundary gives the aerodynamic force and
        moment, accumulated <em>separately</em> for the pressure and viscous parts before being
        reduced across ranks:
      </p>
      <KeyBox title="Boundary force and moment">
        <Equation math="\begin{aligned}
          \mathbf{F}_p &= \sum_{ip} p_{ip}\,\mathbf{A}_{ip}, &
          \mathbf{F}_\nu &= \sum_{ip} \boldsymbol{\tau}_{w,ip}\,\lVert\mathbf{A}_{ip}\rVert, &
          \mathbf{F} &= \mathbf{F}_p + \mathbf{F}_\nu,\\
          \mathbf{M}_p &= \sum_{ip} \mathbf{r}_{ip}\times\mathbf{F}_{p,ip}, &
          \mathbf{M}_\nu &= \sum_{ip} \mathbf{r}_{ip}\times\mathbf{F}_{\nu,ip}, &
          \mathbf{M} &= \mathbf{M}_p + \mathbf{M}_\nu
          \end{aligned}" />
        with <M math="\mathbf{r}=\mathbf{x}-\mathbf{x}_{centre}" /> about a user-specified{' '}
        <code>moment_center</code>.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        These loads feed the rigid-body and FSI couplings of{' '}
        <a href="/theory/rigidbody-fsi">Chapter 10</a>; keeping the parts distinct lets form drag
        and friction drag be reported separately.
      </p>

      <H2 id="reductions" num="18.7">Reductions</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The <code>reduction</code> post-process supports exactly three reduction types over a
        selected region: <code>sum</code>, <code>average</code> and <code>areaAverage</code> (a
        plain sum over a volume-selected region covers the volume-integral case; no separate
        min/max reduction type exists).
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        Quantities <em>not</em> computed anywhere in the source: Nusselt number, wall
        heat-transfer-coefficient output, skin-friction coefficient <M math="C_f" />, and a
        dedicated vorticity/Q-criterion/<M math="\lambda_2" /> output field (vorticity-like terms
        exist only internally inside the transition-SST assemblers). If any of these are needed,
        they must currently be derived externally from the exported primitive fields. The{' '}
        <code>probe</code> post-process is a registered stub (see{' '}
        <a href="/theory/rejected-approaches">Appendix A</a>).
      </DocCallout>
    </TheoryLayout>
  );
}
