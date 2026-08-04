import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, Callout, TodoBlock } from './GsLayout';

export function Ch7Interfaces() {
  useDocumentTitle('Interfaces — User Guide');
  return (
    <GsLayout chNum="7" title="Interfaces">
      <SEO title="Interfaces — User Guide" description="Configuring domain interfaces for FSI, ALE, and sliding mesh in the OpenAccel input file." path="/get-started/interfaces" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-6 text-lg">
        The <code>interfaces</code> block defines coupling between domains — FSI interfaces between
        fluid and solid regions, ALE moving-mesh boundaries, and sliding mesh connections for
        rotating-frame simulations.
      </p>

      <H2 id="location">Location in input file</H2>
      <CodeBlock lang="yaml" code={`simulation:
  physical_analysis:
    - domain_id: fluid
      type: incompressible_flow
      interfaces:       # ← this chapter
        - type: fsi
          . . .
      . . .\n`} />
      <p style={{ color: 'var(--text-dim)' }}>
        <code>interfaces</code> is nested inside each domain that participates in the coupling,
        not at the top level of <code>physical_analysis</code>.
      </p>

      <H2 id="types">Interface Types</H2>
      <div className="overflow-x-auto mt-2 mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              <th className="text-left py-2 pr-6 font-mono font-medium" style={{ color: 'var(--text)' }}>type</th>
              <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['fsi',          'Fluid–structure interaction. Exchanges forces and displacements between fluid and solid domains.'],
              ['ale_boundary', 'ALE moving-mesh boundary. Mesh motion is prescribed or driven by an FSI coupling.'],
              ['sliding_mesh', 'Non-conforming interface between a rotating sub-domain and the stationary exterior.'],
            ].map(([t, d]) => (
              <tr key={t} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td className="py-2 pr-6 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{t}</td>
                <td className="py-2 align-top" style={{ color: 'var(--text-dim)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="fsi">FSI Interface</H2>
      <CodeBlock lang="yaml" code={`interfaces:
  - type: fsi
    fluid_parts: [fluid_wall]
    solid_parts: [solid_surface]
    coupling: two_way          # or: one_way_fluid_to_solid
    displacement_interpolation_type: rbf`} />
      <Callout type="warning">
        <code>displacement_interpolation_type</code> is a known defect in Release v1.0 — the key is
        accepted at parse time but has no effect; the solver uses RBF interpolation unconditionally.
        See <a href="/get-started/troubleshooting#known-defects" style={{ color: 'var(--cold)' }}
          className="underline underline-offset-4">Appendix A — Known Defects</a>.
      </Callout>
      <TodoBlock label="Full option table for the FSI interface block — covering coupling scheme, relaxation factor, convergence tolerance, and interpolation method — will be added here from Chapter 7 of the User Guide." />

      <H2 id="ale">ALE Moving-Mesh Boundary</H2>
      <CodeBlock lang="yaml" code={`interfaces:
  - type: ale_boundary
    parts: [moving_wall]
    motion:
      type: prescribed
      velocity: [0.0, 0.1, 0.0]   # m/s`} />
      <TodoBlock label="Option tables for ale_boundary motion types (prescribed, fsi_driven, user_function) and mesh diffusion settings will be added here from Chapter 7." />

      <H2 id="sliding">Sliding Mesh</H2>
      <CodeBlock lang="yaml" code={`interfaces:
  - type: sliding_mesh
    rotating_parts: [rotor_boundary]
    stationary_parts: [stator_boundary]
    axis: [0.0, 0.0, 1.0]
    angular_velocity: 10.0   # rad/s`} />
      <Callout type="warning">
        <code>stationary_parts</code> is a known defect in Release v1.0 — the key is read from the
        wrong path in the input tree. Use the workaround documented in{' '}
        <a href="/get-started/troubleshooting#known-defects" style={{ color: 'var(--cold)' }}
          className="underline underline-offset-4">Appendix A — Known Defects</a>.
      </Callout>
      <TodoBlock label="Full option table for the sliding_mesh interface — axis, angular_velocity, rotation_origin, and interpolation method — will be added here from Chapter 7." />
    </GsLayout>
  );
}
