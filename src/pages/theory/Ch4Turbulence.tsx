import { Info, AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { SourceBox } from '@/components/SourceBox';
import { DocCallout } from '@/components/DocCallout';
import { CodeBlock } from '@/components/CodeBlock';
import { Algorithm } from '@/components/theory/Algorithm';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch4Turbulence() {
  useDocumentTitle('Turbulence Modelling — Theory Manual');
  return (
    <TheoryLayout chNum="4" title="Turbulence Modelling">
      <SEO
        title="Turbulence Modelling — Theory Manual"
        description="RANS turbulence closures in OpenAccel: k-epsilon, k-omega SST, laminar-turbulent transition, and wall-distance computation."
        path="/theory/turbulence"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        To close the system of <a href="/theory/flow">Chapter 3</a>, the turbulent viscosity{' '}
        <M math="\mu_t" /> is calculated through a turbulence model. OpenAccel registers three
        RANS closures &mdash; laminar (no model), <M math="k" />&ndash;<M math="\varepsilon" />,
        and <M math="k" />&ndash;<M math="\omega" /> SST &mdash; and two laminar&ndash;turbulent
        transition extensions of the SST model. Wall distance, which the SST family requires, is
        described in <a href="#wall-distance">Section 4.4</a>.
      </p>

      <SourceBox>
        The closure is chosen by <code>turbulence &gt; option</code> (<code>laminar</code>,{' '}
        <code>k_epsilon</code>, <code>shear_stress_transport</code>). Spalart&ndash;Allmaras,
        standard <M math="k" />&ndash;<M math="\omega" />, and LES/DES/Smagorinsky closures are{' '}
        <em>not</em> implemented. Turbulence transport equations may also use a different
        advection scheme from the mean flow through <code>turbulence_numerics</code> (see the
        advection-scheme section of <a href="/theory/cvfem">Chapter 11</a>).
      </SourceBox>

      <H2 id="k-epsilon" num="4.1">The <M math="k" />&ndash;<M math="\varepsilon" /> Model</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The standard <M math="k" />&ndash;<M math="\varepsilon" /> model (Launder &amp; Spalding,
        1974) is a two-equation turbulence model that introduces transport equations for the
        turbulent kinetic energy <M math="k" /> and its dissipation rate <M math="\varepsilon" />:
      </p>
      <Equation label="4.1" math="\frac{\partial\rho k}{\partial t} + \nabla\cdot(\rho\mathbf{v}k)
        = P_k - \rho\varepsilon
        + \nabla\cdot\!\left[\left(\mu+\frac{\mu_t}{\sigma_k}\right)\nabla k\right]" />
      <Equation label="4.2" math="\frac{\partial\rho\varepsilon}{\partial t} + \nabla\cdot(\rho\mathbf{v}\varepsilon)
        = C_{\varepsilon1}\frac{\varepsilon}{k}P_k
         - C_{\varepsilon2}\frac{\rho\varepsilon^{2}}{k}
        + \nabla\cdot\!\left[\left(\mu+\frac{\mu_t}{\sigma_\varepsilon}\right)\nabla\varepsilon\right]" />
      <p style={{ color: 'var(--text-dim)' }}>
        The turbulence production <M math="P_k" /> is defined as
      </p>
      <Equation label="4.3" math="P_k = \overline{\tau}_{ij}\,\nabla\mathbf{v}
          = \mu_t\bigl(\nabla\mathbf{v}+\nabla\mathbf{v}^{T}\bigr):\nabla\mathbf{v}." />

      <KeyBox title="Eddy viscosity (k–ε)">
        <Equation math="\mu_t = \rho\,C_\mu\,\frac{k^{2}}{\varepsilon}," />
        applied with an under-relaxation blend{' '}
        <M math="\mu_t^{\,\text{new}} = 0.75\,\mu_t^{\,\text{computed}} + 0.25\,\mu_t^{\,\text{old}}" />,
        which damps the strong nonlinear feedback between <M math="\mu_t" /> and the mean field.
      </KeyBox>

      <p style={{ color: 'var(--text-dim)' }}>The implemented model constants are</p>
      <Equation label="4.4" math="C_\mu = 0.09,\quad C_{\varepsilon1} = 1.45,\quad C_{\varepsilon2} = 1.9,\quad
        \sigma_k = 1.0,\quad \sigma_\varepsilon = 1.3," />
      <p style={{ color: 'var(--text-dim)' }}>
        the Launder&ndash;Spalding values. To keep the closure well posed when a transported
        variable strays negative during iteration, <M math="k" /> and <M math="\varepsilon" /> are
        reconstructed from one another rather than merely clipped: if <M math="\varepsilon" />{' '}
        turns non-positive it is rebuilt as <M math="\varepsilon = C_\mu\rho k^{2}/\mu_t" />, and
        if <M math="k" /> turns non-positive it is rebuilt as{' '}
        <M math="k=\sqrt{\mu_t\varepsilon/(\rho C_\mu)}" />.
      </p>

      <H3 id="scalable-wall-function" num="4.1.1">Scalable wall function</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        With <M math="k" />&ndash;<M math="\varepsilon" /> the near-wall treatment is forced to
        the <em>scalable</em> wall function of Grotjans &amp; Menter (1998). The near-wall
        coordinate is floored at the intersection of the viscous-sublayer and log-law profiles,
      </p>
      <Equation label="4.5" math="y^{*} = \frac{\rho\,u^{*}\,y_{\text{wall}}}{\mu},
        \qquad
        \tilde{y}^{*} = \max(y^{*},\,11.06),
        \qquad
        \varepsilon_{\text{wall}} = \frac{\rho\,u^{*}}{\tilde{y}^{*}\mu}\,
        \frac{C_\mu^{0.75}}{\kappa}\,k^{1.5}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="\kappa=0.41" /> the von K&aacute;rm&aacute;n constant. The floor at{' '}
        <M math="\tilde{y}^{*}=11.06" /> is what makes the treatment <em>scalable</em>: refining
        the mesh below the log layer does not corrupt the wall flux.
      </p>

      <H2 id="sst" num="4.2">The <M math="k" />&ndash;<M math="\omega" /> SST Model</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The SST <M math="k" />&ndash;<M math="\omega" /> model adopted in OpenAccel aligns with
        Menter (1994) (2003 revision) and requires solving the following two conservation
        equations:
      </p>
      <Equation label="4.6" math="\begin{aligned}
        \frac{\partial\rho k}{\partial t} + \nabla\cdot(\rho\mathbf{v}k)
        &= \overline{\tau}_{ij}\nabla\mathbf{v} - \beta^{*}\rho\omega k
         + \nabla\cdot\bigl[(\mu+\sigma_k\mu_t)\nabla k\bigr]
        \end{aligned}" />
      <Equation label="4.7" math="\begin{split}
        \frac{\partial\rho\omega}{\partial t} + \nabla\cdot(\rho\mathbf{v}\omega)
        &= \frac{\rho\gamma\,\overline{\tau}_{ij}\nabla\mathbf{v}}{\mu_t}
         - \beta\rho\omega^{2}
         + \nabla\cdot\bigl[(\mu+\sigma_\omega\mu_t)\nabla\omega\bigr]\\
        &\quad + 2(1-F_1)\frac{\rho\sigma_{\omega2}}{\omega}\,\nabla k\cdot\nabla\omega
        \end{split}" />

      <KeyBox title="Eddy viscosity (SST) and production limiter">
        <Equation math="\mu_t = \frac{a_1\,\rho\,k}{\max\!\bigl(a_1\,\omega,\ S\,F_2\bigr)},
          \qquad
          P_k = \min\!\bigl(P_k^{\text{raw}},\ c_{\text{lim}}\,\beta^{*}\rho\,\omega k\bigr)," />
        with <M math="a_1=0.31" />, <M math="S" /> the strain-rate magnitude, <M math="F_2" /> the
        second blending function, and the production-limiter ratio <M math="c_{\text{lim}}=10" />.
        The <M math="SF_2" /> term caps <M math="\mu_t" /> in adverse-pressure-gradient boundary
        layers; the production limiter prevents spurious turbulence build-up at stagnation points.
        The <M math="\mu_t" /> update is under-relaxed as in <M math="k" />&ndash;
        <M math="\varepsilon" />.
      </KeyBox>

      <H3 id="f1-f2" num="4.2.1">The <M math="F_1" /> and <M math="F_2" /> blending functions</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The blending functions are the defining feature of SST: <M math="F_1" /> selects the{' '}
        <M math="k" />&ndash;<M math="\omega" /> formulation near walls (<M math="F_1\to1" />) and
        the <M math="k" />&ndash;<M math="\varepsilon" /> formulation in the free stream (
        <M math="F_1\to0" />), while <M math="F_2" /> bounds the eddy-viscosity limiter. With wall
        distance <M math="y" />, the implemented (2003 Menter) form is
      </p>
      <Equation label="4.8" math="\mathrm{CD}_{k\omega} = \max\!\left(\frac{2\rho\sigma_{\omega2}}{\omega}\,\nabla k\cdot\nabla\omega,\ 10^{-10}\right)," />
      <Equation label="4.9" math="\begin{aligned}
        \Gamma_{\text{trb}} = \frac{\sqrt{k}}{\beta^{*}\omega y}, &\qquad
        \Gamma_{\text{lam}} = \frac{500\,\mu}{\rho\,\omega\,y^{2}}
        \end{aligned}" />
      <Equation label="4.10" math="\begin{aligned}
        \mathrm{arg}_1 = \min\!\left(\max(\Gamma_{\text{trb}},\Gamma_{\text{lam}}),\
        \frac{4\rho\sigma_{\omega2}k}{\mathrm{CD}_{k\omega}\,y^{2}}\right),
        &\qquad F_1 = \tanh\!\bigl(\mathrm{arg}_1^{4}\bigr)
        \end{aligned}" />
      <Equation label="4.11" math="\begin{aligned}
        \mathrm{arg}_2 = \max\!\bigl(2\Gamma_{\text{trb}},\ \Gamma_{\text{lam}}\bigr),
        &\qquad F_2 = \tanh\!\bigl(\mathrm{arg}_2^{2}\bigr)
        \end{aligned}" />
      <p style={{ color: 'var(--text-dim)' }}>
        Every constant is blended between the inner and outer sets as{' '}
        <M math="\phi = F_1\phi_1 + (1-F_1)\phi_2" /> with the implemented values
      </p>
      <Equation label="4.12" math="\begin{gathered}
        \sigma_{k1}=0.85,\quad \sigma_{k2}=1.0,\quad \sigma_{\omega1}=0.5,\quad
        \sigma_{\omega2}=0.856,\\
        \beta_1=0.075,\quad \beta_2=0.0828,\quad \gamma_1=0.5532,\quad \gamma_2=0.4403,\quad
        \beta^{*}=0.09
        \end{gathered}" />
      <p style={{ color: 'var(--text-dim)' }}>
        the exact Menter (2003) constants &mdash; no deviation exists anywhere in the constant
        set.
      </p>

      <H3 id="automatic-wall-function" num="4.2.2">Automatic wall function</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        With SST the near-wall treatment is forced to the <em>automatic</em> wall function, a
        sum-of-squares blend between the viscous-sublayer and log-law values of{' '}
        <M math="\omega" />,
      </p>
      <Equation label="4.13" math="\omega_{\text{vis}} = \frac{6\,(\mu/\rho)}{\beta_1\,y^{2}},
        \qquad
        \omega_{\text{log}} = \frac{u^{*2}\rho}{\kappa\,\mu\,y^{+}\sqrt{C_\mu}},
        \qquad
        \omega_{\text{wall}} = \sqrt{\omega_{\text{vis}}^{2}+\omega_{\text{log}}^{2}}," />
      <p style={{ color: 'var(--text-dim)' }}>
        which is correct regardless of whether the first node lands in the sublayer or the log
        layer &mdash; hence <em>automatic</em>: no user judgement about <M math="y^{+}" /> is
        required.
      </p>

      <H2 id="transition" num="4.3">Laminar&ndash;Turbulent Transition</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Two transition extensions of the SST model are available, both activated by{' '}
        <code>transitional_turbulence: true</code> and distinguished by the{' '}
        <code>correlation_based</code> flag.
      </p>

      <H3 id="langtry-menter" num="4.3.1">
        The <M math="\gamma" />&ndash;<M math="\widetilde{Re}_{\theta t}" /> model (Langtry&ndash;Menter)
      </H3>
      <p style={{ color: 'var(--text-dim)' }}>
        With <code>correlation_based: false</code> the full transition model (Menter et al., 2006;
        Langtry &amp; Menter, 2009) extends SST with two additional transport equations: one for
        the intermittency <M math="\gamma" /> and one for the transition-onset momentum-thickness
        Reynolds number <M math="\widetilde{Re}_{\theta t}" />. The intermittency equation is
      </p>
      <Equation label="4.14" math="\frac{\partial\rho\gamma}{\partial t} + \nabla\cdot(\rho\mathbf{v}\gamma)
        = P_\gamma - E_\gamma
        + \nabla\cdot\!\left[\left(\mu+\frac{\mu_t}{\sigma_f}\right)\nabla\gamma\right]," />
      <p style={{ color: 'var(--text-dim)' }}>
        and the transition-onset momentum-thickness Reynolds number equation is
      </p>
      <Equation label="4.15" math="\frac{\partial\rho\widetilde{Re}_{\theta t}}{\partial t}
        + \nabla\cdot(\rho\mathbf{v}\widetilde{Re}_{\theta t})
        = P_{\theta t}
        + \nabla\cdot\!\bigl[\sigma_{\theta t}(\mu+\mu_t)\nabla\widetilde{Re}_{\theta t}\bigr]." />

      <KeyBox title="Intermittency production and destruction">
        <Equation math="P_\gamma = F_{length}\,c_{a1}\,\rho\,S\,\sqrt{\gamma\,F_{onset}}\,(1-c_{e1}\gamma),
          \qquad
          E_\gamma = c_{a2}\,\rho\,\Omega\,\gamma\,F_{turb}\,(c_{e2}\gamma-1)," />
        with <M math="S=\sqrt{2S_{ij}S_{ij}}" /> the strain-rate magnitude,{' '}
        <M math="\Omega=\sqrt{2W_{ij}W_{ij}}" /> the vorticity magnitude, and the implemented
        constants <M math="c_{a1}=2.0" />, <M math="c_{a2}=0.06" />, <M math="c_{e1}=1.0" />,{' '}
        <M math="c_{e2}=50" /> &mdash; the exact published Langtry&ndash;Menter (2009) values.
      </KeyBox>

      <p style={{ color: 'var(--text-dim)' }}>
        The onset and turbulence-damping functions are, with{' '}
        <M math="Re_v=\rho S y^{2}/\mu" /> and <M math="R_t = \rho k/(\mu\omega)" />,
      </p>
      <Equation label="4.16" math="\begin{aligned}
        F_{onset1} = \frac{Re_v}{2.193\,Re_{\theta c}}, &\qquad
        F_{onset2} = \min\!\bigl(\max(F_{onset1},F_{onset1}^{4}),\,2\bigr)
        \end{aligned}" />
      <Equation label="4.17" math="\begin{aligned}
        F_{onset3} = \max\!\Bigl(1-\bigl(\tfrac{R_t}{2.5}\bigr)^{3},\,0\Bigr), &\qquad
        F_{onset} = \max\!\bigl(F_{onset2}-F_{onset3},\,0\bigr)
        \end{aligned}" />
      <Equation label="4.18" math="F_{turb} = e^{-(R_t/4)^{4}}." />
      <p style={{ color: 'var(--text-dim)' }}>
        The transition-length function blends an empirical correlation with a sublayer value;
        writing <M math="R\equiv\widetilde{Re}_{\theta t}" /> for brevity and with{' '}
        <M math="Re_\omega=\rho\omega y^{2}/\mu" />,
      </p>
      <Equation label="4.19" math="F_{length1}(R) =
        \begin{cases}
          39.8189 - 0.011927\,R - 1.32567\times10^{-4}\,R^{2} & R < 400\\[2pt]
          263.404 - 1.23939R + 1.94548{\times}10^{-3}R^{2} - 1.01695{\times}10^{-6}R^{3} & 400 \le R < 596\\[2pt]
          0.5 - 3\times10^{-4}\,(R-596) & 596 \le R < 1200\\[2pt]
          0.3188 & R \ge 1200
        \end{cases}" />
      <Equation label="4.20" math="F_{sublayer} = e^{-(Re_\omega/200)^{2}},
        \qquad
        F_{length} = F_{length1}\,(1-F_{sublayer}) + 40\,F_{sublayer}." />
      <p style={{ color: 'var(--text-dim)' }}>The critical Reynolds number correlation is</p>
      <Equation label="4.21" math="\begin{aligned}
        Re_{\theta c} &= -3.96035 + 1.0120656\,\widetilde{Re}_{\theta t}
          - 8.6823\times10^{-4}\,\widetilde{Re}_{\theta t}^{2} \\
        &\quad + 6.96506\times10^{-7}\,\widetilde{Re}_{\theta t}^{3}
          - 1.74105\times10^{-10}\,\widetilde{Re}_{\theta t}^{4},
          \qquad \widetilde{Re}_{\theta t} \le 1870
        \end{aligned}" />
      <Equation label="4.22" math="\begin{aligned}
        Re_{\theta c} &= \widetilde{Re}_{\theta t}
          - \bigl(593.11 + 0.482\,(\widetilde{Re}_{\theta t}-1870)\bigr),
          \qquad \widetilde{Re}_{\theta t} > 1870
        \end{aligned}" />
      <p style={{ color: 'var(--text-dim)' }}>
        The source term for <M math="\widetilde{Re}_{\theta t}" /> is
      </p>
      <Equation label="4.23" math="P_{\theta t} = c_{\theta t}\,\frac{\rho}{t}\,
        \bigl(Re_{\theta t}-\widetilde{Re}_{\theta t}\bigr)\,(1-F_{\theta t}),
        \qquad
        t = \frac{500\,\mu}{\rho\,U^{2}}," />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="F_{\theta t}" /> is a blending function (built from a wake function and an
        exponential <M math="(y/\delta)^{4}" /> decay) that prevents the source from acting inside
        the boundary layer. The free-stream correlation <M math="Re_{\theta t}" /> depends on the
        turbulence intensity <M math="Tu" /> and the pressure-gradient parameter{' '}
        <M math="\lambda" />,
      </p>
      <Equation label="4.24" math="\begin{aligned}
        Tu = \max\!\left(\frac{100\,\sqrt{2k/3}}{|\mathbf{v}|},\,0.027\right)
        \end{aligned}" />
      <Equation label="4.25" math="F(Tu) =
        \begin{cases}
          331.5\,(Tu-0.5658)^{-0.671} & Tu > 1.3\\
          1173.51 - 589.428\,Tu + 0.2196/Tu^{2} & Tu \le 1.3
        \end{cases}" />
      <Equation label="4.26" math="Re_{\theta t} =
        \begin{cases}
          F(Tu)\bigl[1+0.275\,(1-e^{-35\lambda})\,e^{-2Tu}\bigr] & \lambda > 0\\
          F(Tu)\bigl[1+(12.986\lambda+123.66\lambda^{2}+405.689\lambda^{3})\,e^{-(Tu/1.5)^{1.5}}\bigr] & \lambda \le 0
        \end{cases}" />
      <p style={{ color: 'var(--text-dim)' }}>
        floored at <M math="Re_{\theta t}\ge20" />, with{' '}
        <M math="\lambda = \mathrm{clamp}\bigl(Re_{\theta t}^{2}\,\mu\,(\mathrm{d}U/\mathrm{d}s)/|\mathbf{v}|^{2},\,-0.1,\,0.1\bigr)" />.
        Since <M math="\lambda" /> depends on <M math="Re_{\theta t}" /> and vice versa, the pair
        is solved by a fixed-point iteration (tolerance <M math="10^{-12}" />, at most 150
        iterations). All numeric coefficients match the published Langtry&ndash;Menter
        correlations exactly.
      </p>

      <p style={{ color: 'var(--text-dim)' }}>
        The intermittency modifies the production and destruction terms of the <M math="k" />{' '}
        equation of the underlying SST model:
      </p>
      <Equation label="4.27" math="\begin{aligned}
        \widetilde{P}_k = \gamma_{eff}\,P_k, &\qquad
        \widetilde{D}_k = \min\!\bigl(\max(\gamma_{eff},\,0.1),\,1.0\bigr)\,\rho\beta^{*}\omega k
        \end{aligned}" />
      <p style={{ color: 'var(--text-dim)' }}>
        where <M math="\gamma_{eff}=\max(\gamma,\gamma_{sep})" /> is the effective intermittency,
        combining free-stream transition with separation-induced transition.
      </p>

      <H3 id="correlation-based" num="4.3.2">Correlation-based model (one equation)</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        With <code>correlation_based: true</code> the more recent one-equation model (Menter et
        al., 2015) is used: it transports <em>only</em> <M math="\gamma" /> and replaces the
        transported <M math="\widetilde{Re}_{\theta t}" /> by a built-in local correlation. It is
        cheaper (one extra equation rather than two) and Galilean invariant, at some loss of
        generality for strongly history-dependent transition.
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        The distinction matters in practice: the full model carries two extra transport equations
        (<M math="\gamma" />, <M math="\widetilde{Re}_{\theta t}" />); the correlation-based model
        carries one (<M math="\gamma" />). Both reduce to the underlying SST model where{' '}
        <M math="\gamma_{eff}\to1" />.
      </DocCallout>

      <H2 id="wall-distance" num="4.4">Wall-Distance Computation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The SST family and the wall functions need the distance from each node to the nearest
        wall, <M math="y_{min}" />. Two working methods populate the same wall-distance field.
      </p>

      <H3 id="poisson-method" num="4.4.1">Poisson method</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        A Poisson-type diffusion equation is solved for a scalar <M math="\varphi" /> with{' '}
        <M math="\nabla^{2}\varphi=-1" /> and <M math="\varphi=0" /> at walls, and the distance is
        recovered by the standard formula:
      </p>
      <KeyBox title="Poisson wall-distance recovery">
        <Equation math="y = \max\!\Bigl(-\sqrt{|\nabla\varphi|^{2}}
          + \sqrt{|\nabla\varphi|^{2} + 2\varphi},\ 0\Bigr)." />
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        This is smooth and robust on distorted meshes, at the cost of one scalar solve.
      </p>

      <H3 id="mesh-wave" num="4.4.2">Nearest-wall-node (&ldquo;mesh-wave&rdquo;) method</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The second method computes the geometric distance to the nearest wall node directly. Every
        wall node's coordinates are gathered from all MPI ranks into one global list, and each
        interior node takes the minimum straight-line Euclidean distance to that list:
      </p>
      <KeyBox title="Nearest-wall-node distance">
        <Equation math="y_i = \min_{w\in\mathcal{W}}\ \lVert \mathbf{x}_i - \mathbf{x}_w \rVert_2 ," />
        where <M math="\mathcal{W}" /> is the set of all wall nodes across the whole (partitioned)
        mesh.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        Listing 4.1 summarises the pass. Because it compares every interior node against every
        wall node, its cost is{' '}
        <M math="O(N_{\text{interior}}\times N_{\text{wall}})" />; it returns the exact geometric
        nearest-node distance with no equation to solve, which makes it a robust reference on
        moderate meshes but expensive on very large ones, where the Poisson method is preferable.
      </p>

      <Algorithm
        number="1"
        caption="Nearest-wall-node distance (mesh_wave)"
        lines={[
          { text: "gather all wall-node coordinates $\\{\\mathbf{x}_w\\}$ from every rank into a global list $W$" },
          { text: "**for** each interior node $i$ (on this rank) **do**" },
          { text: "$y_i \\leftarrow \\infty$", indent: 1 },
          { text: "**for** each wall node $w$ in $W$ **do**", indent: 1 },
          { text: "$y_i \\leftarrow \\min\\bigl(y_i,\\ \\lVert \\mathbf{x}_i - \\mathbf{x}_w \\rVert_2\\bigr)$", indent: 2 },
          { text: "**end for**", indent: 1 },
          { text: "**end for**" },
        ]}
      />

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        The name is a historical misnomer: despite &ldquo;wave&rdquo;, the method is <em>not</em> a
        front-propagation (Eikonal/BFS) distance transform &mdash; there is no marching front and
        no mesh-connectivity traversal, only the brute-force all-pairs search above. The third
        registered method, <code>signed_distance_function</code>, is rejected at run time (see{' '}
        <a href="/theory/rejected-approaches">Appendix A</a>).
      </DocCallout>
    </TheoryLayout>
  );
}
