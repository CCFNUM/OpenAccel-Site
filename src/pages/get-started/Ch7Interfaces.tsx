import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { YamlTree } from '@/components/YamlTree';
import { InputMap } from '@/components/InputMap';
import { Caption } from '@/components/Caption';
import { GsLayout, H2, Callout } from './GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;

export function Ch7Interfaces() {
  useDocumentTitle('Interfaces and Coupling — User Guide');
  return (
    <GsLayout chNum="7" title="Interfaces and Coupling">
      <SEO
        title="Interfaces and Coupling — User Guide"
        description="Interface connection types, structural keys, geometric matching, non-conformal treatment, conjugate heat transfer, and fluid-structure interaction."
        path="/get-started/interfaces"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        Interfaces connect one domain to another, or connect a domain to itself across a periodic
        boundary. They are declared as a sequence under{' '}
        <code>simulation &gt; physical_analysis &gt; interfaces</code>, and require a build with
        interface support compiled in.
      </p>

      <H2 id="location" num="7.1">Location in the input file</H2>

      <figure className="my-6">
        <InputMap highlight="interfaces" />
        <Caption label="Figure 7.1" className="mt-2">
          Position of the interfaces block, a sibling of <code>domains</code> within{' '}
          <code>physical_analysis</code>.
        </Caption>
      </figure>

      <YamlTree
        label="Figure 7.2"
        caption="An interface entry, shown with its parent chain."
        lines={[
          { indent: 0, key: 'simulation:' },
          { indent: 1, key: 'physical_analysis:' },
          { indent: 2, dots: true },
          { indent: 2, key: 'interfaces:' },
          { indent: 2, dash: true, text: 'name: interface1' },
          { indent: 3, text: 'option: general_connection' },
          { indent: 3, text: 'type: fluid_solid' },
          { indent: 3, text: 'search_tolerance: 1.0e-4' },
          { indent: 3, key: 'side1:' },
          { indent: 4, text: 'domain: fluid', comment: 'a domain name' },
          { indent: 4, text: 'region_list: [intf]', comment: 'mesh sidesets' },
          { indent: 3, key: 'side2:' },
          { indent: 4, text: 'domain: solid' },
          { indent: 4, text: 'region_list: [ints]' },
        ]}
      />

      <H2 id="connection-type" num="7.2">Connection type</H2>

      <figure className="my-4">
        <Caption label="Table 7.1" className="mb-2">Interface connection types, selected by <code>option</code>.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Purpose</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Extra keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['general_connection', 'Joins two distinct regions. Used for conjugate heat transfer, fluid–structure interaction, and sliding meshes.', '—'],
                ['translational_periodicity', 'Maps one boundary onto another offset by a translation.', '—'],
                ['rotational_periodicity', 'Maps one boundary onto another offset by a rotation.', <><code>rotation_axis</code>, <code>axis_location</code></>],
              ].map(([v, purpose, extra]) => (
                <tr key={v as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{purpose}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{extra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 7.2" className="mb-2">Interface structural keys.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['option', '—', <>Required. See Table 7.1.</>],
                ['type', 'fluid_fluid', <><code>fluid_fluid</code>, <code>solid_solid</code> or <code>fluid_solid</code>.</>],
                ['side1 > domain', '—', 'Required. Must match a declared domain name.'],
                ['side1 > region_list', '—', 'Required. Mesh sidesets on that side.'],
                ['side2 > domain', '—', 'Required.'],
                ['side2 > region_list', '—', 'Required.'],
                ['rotation_axis', '—', 'Required for rotational_periodicity.'],
                ['axis_location', '—', 'Required for rotational_periodicity.'],
              ].map(([opt, def, desc]) => (
                <tr key={opt as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="geometric-matching" num="7.3">Geometric matching</H2>

      <figure className="my-4">
        <Caption label="Table 7.3" className="mb-2">Options controlling how the two sides are geometrically paired.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['conformality_check_tolerance', '1e-6', 'Tolerance below which the two sides are treated as node-matched.'],
                ['overlap_check_tolerance', '1e-3', 'Tolerance for detecting overlapping faces.'],
                ['force_nonconformal_treatment', 'true', 'Forces the non-conformal path even for matching meshes.'],
                ['slip_non_overlap', 'true', 'Applies a slip condition on the portion of each side that has no counterpart.'],
                ['penalty_factor', '1.0', 'Penalty coefficient at the interface. Smaller values produce smoother coefficients.'],
              ].map(([opt, def, effect]) => (
                <tr key={opt as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        For <code>type: fluid_solid</code>, <code>force_nonconformal_treatment</code> is always
        forced true. Supplying it produces a warning and the value is ignored.
      </Callout>

      <H2 id="non-conformal" num="7.4">Non-conformal treatment</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Non-matching meshes are handled by a discontinuous Galerkin treatment. The two sides are
        paired by a geometric point search, and the transported quantities are exchanged through the
        paired integration points. The options governing that search are listed in the table below;
        the search tolerance is the one most often adjusted, because a mesh whose two sides were
        generated independently rarely matches to the default precision.
      </p>

      <figure className="my-4">
        <Caption label="Table 7.4" className="mb-2">Options controlling the non-conformal interface treatment.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['search_tolerance', '0.01', 'Geometric tolerance for the point search.'],
                ['expand_box_percentage', '0.0', 'Percentage growth of the search bounding box.'],
                ['clip_isoparametric_coordinates', 'false', 'Clips isoparametric coordinates to the element, preventing extrapolation.'],
                ['activate_dynamic_search_algorithm', 'false', 'Repeats the search as the mesh moves.'],
                ['gauss_lobatto_quadrature', 'false', 'Uses shifted Gauss–Lobatto integration points on the interface.'],
                ['search_method', 'stk_kdtree', 'Only stk_kdtree is supported.'],
              ].map(([opt, def, effect]) => (
                <tr key={opt as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        <code>search_method</code> is not validated when the file is read. An unsupported value is
        accepted at parse time and causes an abrupt exit later, during the solve, without a
        diagnostic message.
      </Callout>

      <H2 id="cht" num="7.5">Conjugate heat transfer</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A conjugate problem requires no dedicated coupling option. Declare a fluid domain and a solid
        domain, give both an active <code>heat_transfer</code> model, and join them with a{' '}
        <code>general_connection</code> interface of <code>type: fluid_solid</code>. The energy
        equation is then assembled across both domains as one implicitly coupled system.
      </p>

      <YamlTree
        label="Figure 7.3"
        caption="Minimal conjugate heat transfer coupling."
        lines={[
          { indent: 0, key: 'interfaces:' },
          { indent: 0, dash: true, text: 'name: interface' },
          { indent: 1, text: 'option: general_connection' },
          { indent: 1, text: 'type: fluid_solid' },
          { indent: 1, text: 'search_tolerance: 1.0e-4' },
          { indent: 1, text: 'gauss_lobatto_quadrature: false' },
          { indent: 1, key: 'side1:' },
          { indent: 2, text: 'domain: fluid' },
          { indent: 2, text: 'region_list: [intf]' },
          { indent: 1, key: 'side2:' },
          { indent: 2, text: 'domain: solid' },
          { indent: 2, text: 'region_list: [ints]' },
        ]}
      />

      <H2 id="fsi" num="7.6">Fluid–structure interaction</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        An FSI simulation combines four elements, each documented in its own place:
      </p>
      <ol className="list-decimal pl-5 space-y-2 mt-4" style={{ color: 'var(--text-dim)' }}>
        <li>a fluid domain and a solid domain with an active <code>solid_mechanics</code> model
          (<a href="/get-started/physical-analysis">Chapter 6</a>);</li>
        <li>a <code>general_connection</code> interface of <code>type: fluid_solid</code> joining
          them;</li>
        <li><code>mesh_deformation</code> on the fluid domain so the mesh follows the structure
          (<a href="/get-started/physical-analysis">Chapter 6</a>);</li>
        <li>convergence control on the coupling itself, through <code>physics_convergence</code>{' '}
          (<a href="/get-started/numerics">Chapter 8</a>), and optionally convergence acceleration on
          the coupled equations (<a href="/get-started/numerics">Chapter 8</a>).</li>
      </ol>

      <Callout type="tip">
        FSI convergence is judged on physical quantities, not algebraic residuals alone. Enable{' '}
        <code>physics_convergence</code> with the <code>fsi_interface_residual</code> and{' '}
        <code>fsi_force_residual</code> criteria so that the coupling itself must converge before the
        time step advances.
      </Callout>
    </GsLayout>
  );
}
