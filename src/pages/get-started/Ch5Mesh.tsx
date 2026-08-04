import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, H3, Callout, TodoBlock } from './GsLayout';

export function Ch5Mesh() {
  useDocumentTitle('Mesh — User Guide');
  return (
    <GsLayout chNum="5" title="Mesh">
      <SEO title="Mesh — User Guide" description="Configuring the mesh block in the OpenAccel input file: format, path, scaling, and partitioning options." path="/get-started/mesh" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-6 text-lg">
        The <code>mesh</code> block specifies the mesh source file and controls how it is read,
        scaled, and partitioned at runtime.
      </p>

      <H2 id="location">Location in input file</H2>
      <CodeBlock lang="yaml" code={`mesh:           # ← this chapter
  type: exodus
  path: mesh/domain.exo
  . . .

simulation:
  . . .`} />

      <H2 id="formats">Supported Formats</H2>
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
              ['exodus', 'Exodus II (.exo) — the primary format. Supports all element types, boundary part names, and nodal fields for restart.'],
              ['gmsh',   'Gmsh .msh format (v2 and v4). Part names are taken from physical group labels.'],
            ].map(([t, d]) => (
              <tr key={t} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td className="py-2 pr-6 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{t}</td>
                <td className="py-2 align-top" style={{ color: 'var(--text-dim)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="options">mesh options</H2>
      <TodoBlock label="Option tables for the mesh block (approximately 8 keys covering path, type, scale_factor, rotate, translate, part_filter, and parallel read options) will be added here from Chapter 5 of the User Guide." />

      <H3 id="scaling">Scaling and transformation</H3>
      <TodoBlock label="Documentation for mesh.scale_factor, mesh.rotate, and mesh.translate — with types, defaults, and units — will be added here from Chapter 5." />

      <H2 id="parts">Boundary Parts</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Boundary conditions reference mesh parts by name (Exodus sideset name or Gmsh physical
        surface label). Part names are case-sensitive. The solver will error at parse time if a
        boundary condition references a part that does not exist in the mesh.
      </p>
      <Callout type="tip">
        Run <code>./build/OpenAccel case.yaml --validate</code> to list all part names
        found in the mesh without running the solver.
      </Callout>

      <H2 id="parallel">Parallel Mesh Reading</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        For large meshes (&gt; 50 M cells), enable parallel Exodus reading to avoid a memory
        bottleneck on rank 0:
      </p>
      <CodeBlock lang="yaml" code={`mesh:
  type: exodus
  path: mesh/large_domain.exo
  parallel_read: true`} />
      <Callout type="warning">
        Parallel Exodus reading requires the mesh file to be accessible from all MPI ranks
        (shared filesystem or pre-distributed file). It also requires PnetCDF to be present
        in the Spack environment at build time.
      </Callout>
    </GsLayout>
  );
}
