import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { SourceBox } from '@/components/SourceBox';
import { Caption } from '@/components/Caption';
import { Equation, M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2 } from '../get-started/GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;

function Codes({ items }: { items: string[] }) {
  return (
    <>
      {items.map((c, i) => (
        <span key={c}>
          <code>{c}</code>
          {i < items.length - 1 ? ', ' : ''}
        </span>
      ))}
    </>
  );
}

export function Ch13BoundaryConditions() {
  useDocumentTitle('Boundary Conditions — Theory Manual');
  return (
    <TheoryLayout chNum="13" title="Boundary Conditions">
      <SEO
        title="Boundary Conditions — Theory Manual"
        description="The boundary-condition catalogue, pressure boundary condition theory (total-pressure inlet, average static pressure, opening), turbulence inlet conditions, and wall/symmetry conditions."
        path="/theory/boundary-conditions"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        The discrete equations of <a href="/theory/cvfem">Chapter 11</a> are closed at the domain
        edge by boundary conditions. Most are direct Dirichlet or Neumann constraints; a few
        &mdash; notably the pressure conditions at open boundaries &mdash; carry non-trivial
        theory and are derived in full below. Wall turbulence conditions are covered with the
        turbulence models (see <a href="/theory/turbulence">Chapter 4</a>) and the wall shear
        stress with post-processing (see <a href="/theory/postprocessing">Chapter 18</a>).
      </p>

      <H2 id="catalogue" num="13.1">Catalogue</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Table 13.1 lists the boundary-condition types grouped by the field they apply to. Velocity
        and temperature conditions are direct value/flux constraints; the pressure and turbulence
        conditions are detailed in the following sections.
      </p>

      <figure className="my-4">
        <Caption label="Table 13.1" className="mb-2">Boundary-condition types by field.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Field / group</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Types</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Generic (any field)', ['specified_value', 'specified_flux', 'zero_gradient', 'symmetry', 'mixed']],
                ['Velocity', ['no_slip', 'slip', 'normal_speed', 'mass_flow_rate', 'specified_direction']],
                ['Pressure', ['static_pressure', 'average_static_pressure', 'total_pressure']],
                ['Temperature / enthalpy', ['static_temperature', 'total_temperature']],
                ['Turbulence (k, ω, ε)', ['intensity_and_length_scale', 'intensity_and_eddy_viscosity_ratio']],
                ['Displacement', ['periodic_displacement', 'rigid_body_solution']],
              ].map(([field, types]) => (
                <tr key={field as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{field as string}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>
                    <Codes items={types as string[]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="pressure-bc" num="13.2">Pressure Boundary Conditions</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Several boundary conditions impose a pressure derived from a total (stagnation) value or
        from a target average; these are the boundary conditions with real theory, since a
        velocity or temperature condition is simply an imposed value.
      </p>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Total-pressure inlet.</strong>{' '}
        Given a total pressure <M math="p_0" /> the static pressure follows Bernoulli
        (incompressible) or the isentropic relation (ideal gas),
      </p>
      <KeyBox title="Total-pressure inlet">
        <Equation math="\begin{aligned}
          p &= \min\!\bigl(p_0 - \tfrac12\rho\lVert\mathbf{v}\rVert^{2} d^{2},\ p_0\bigr)
          && \text{(incompressible)},\\
          p &= \min\!\Bigl(p_0\bigl(1+\tfrac{\kappa-1}{2}M^{2}\bigr)^{-\frac{\kappa}{\kappa-1}},\ p_0\Bigr) - p_{ref}
          && \text{(ideal gas)}
          \end{aligned}" />
        where <M math="d^{2}" /> is the squared cosine between the velocity and the boundary
        normal.
      </KeyBox>
      <p style={{ color: 'var(--text-dim)' }}>
        The <M math="\min" /> prevents a non-physical static pressure above the total pressure.
      </p>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Average static pressure.</strong>{' '}
        This condition drives the <em>area-weighted average</em> of the boundary pressure to a
        target while preserving the local variation,
      </p>
      <Equation label="13.1" math="p_{bc} = p_{avg}^{target} + (1-\beta)\bigl(p_{local}-\bar{p}_{estimate}\bigr)," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="\bar{p}_{estimate}" /> the current area-weighted average and{' '}
        <M math="\beta" /> a blend factor.
      </p>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Opening (bidirectional).</strong>{' '}
        An opening switches per integration point on the sign of the local mass flux: where fluid
        leaves (<M math="\dot{m}>0" />) the user-specified opening pressure is imposed; where
        fluid enters (<M math="\dot{m}\le0" />) the same total-pressure inflow relation as the
        inlet is used. It is thus a per-point switch, not a separate formulation.
      </p>

      <SourceBox>
        At a pressure boundary the Rhie&ndash;Chow correction uses the current <em>solved</em>{' '}
        face pressure rather than the imposed boundary value; the imposed value enters through the
        pressure field itself. Mass-flow and specified-velocity inlets bypass the Rhie&ndash;Chow
        correction entirely, since the velocity there is a hard Dirichlet constraint.
      </SourceBox>

      <H2 id="turbulence-inlet" num="13.3">Turbulence Inlet Conditions</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Inlet turbulence is specified indirectly through engineering quantities. Given a
        turbulence intensity <M math="I" /> and either a length scale <M math="\ell" /> or an
        eddy-viscosity ratio <M math="\mu_t/\mu" />, the inlet <M math="k" /> and its dissipation
        follow
      </p>
      <Equation label="13.2" math="k = \tfrac32\,(I\,\lVert\mathbf{v}\rVert)^{2},
        \qquad
        \omega = \frac{\sqrt{k}}{C_\mu^{1/4}\,\ell}
        \quad\text{or}\quad
        \omega = \frac{\rho k}{\mu\,(\mu_t/\mu)}," />
      <p style={{ color: 'var(--text-dim)' }}>
        with <M math="\varepsilon = C_\mu\rho k^{2}/\mu_t" /> recovered for the{' '}
        <M math="k" />&ndash;<M math="\varepsilon" /> model. These map the user's
        intensity/length-scale input onto the transported turbulence variables at the inlet.
      </p>

      <H2 id="wall-symmetry" num="13.4">Wall and Symmetry Conditions</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A no-slip wall imposes <M math="\mathbf{v}=\mathbf{v}_{wall}" />; the wall shear stress and
        the near-wall turbulence treatment then follow the wall functions of{' '}
        <a href="/theory/turbulence">Chapter 4</a>, and the resulting wall shear feeds the force
        integration of <a href="/theory/postprocessing">Chapter 18</a>. A symmetry plane imposes
        zero normal flux and the tangential-gradient projection of{' '}
        <a href="/theory/preliminaries">Chapter 2</a>. A slip wall imposes zero normal velocity
        with no tangential constraint.
      </p>
    </TheoryLayout>
  );
}
