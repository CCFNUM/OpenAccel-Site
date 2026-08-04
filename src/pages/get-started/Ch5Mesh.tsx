import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { YamlTree } from '@/components/YamlTree';
import { InputMap } from '@/components/InputMap';
import { Caption } from '@/components/Caption';
import { M } from '@/components/tutorial/Equation';
import { GsLayout, H2, H3, Callout } from './GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;

export function Ch5Mesh() {
  useDocumentTitle('Mesh — User Guide');
  return (
    <GsLayout chNum="5" title="Mesh">
      <SEO
        title="Mesh — User Guide"
        description="The mesh block: file, decomposition, scaling, quality checking, and what the mesh must provide for the rest of the input file."
        path="/get-started/mesh"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        This chapter covers the top-level <code>mesh</code> block: which mesh file is read, how it
        is partitioned for parallel execution, and what geometric transformation or quality checking
        is applied to it on the way in.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        Boundary conditions are <em>not</em> part of this block. They are declared per domain and
        are documented in <a href="/get-started/physical-analysis">Chapter 6</a>.
      </p>

      <H2 id="location" num="5.1">Location in the input file</H2>

      <figure className="my-6">
        <InputMap highlight="mesh" />
        <Caption label="Figure 5.1" className="mt-2">
          Position of the mesh block. It is a top-level key, a sibling of <code>simulation</code>{' '}
          rather than a child of it.
        </Caption>
      </figure>

      <YamlTree
        label="Figure 5.2"
        caption="Structure of the mesh block."
        lines={[
          { indent: 0, key: 'mesh:' },
          { indent: 1, text: 'file_path: mesh.e' },
          { indent: 1, text: 'automatic_decomposition_type: rcb' },
          { indent: 1, key: 'decomposition_properties:', comment: 'optional; see Section 5.2.1' },
          { indent: 1, dash: true, text: 'name: DECOMP_OMITTED_BLOCK_NAMES' },
          { indent: 2, text: 'value: solid' },
          { indent: 1, key: 'transformation:' },
          { indent: 2, key: 'scale:' },
          { indent: 3, text: 'Sx: 1.0' },
          { indent: 3, text: 'Sy: 1.0' },
          { indent: 3, text: 'Sz: 1.0', comment: '3-D builds only' },
          { indent: 3, text: 'scale_origin: [0, 0, 0]' },
          { indent: 3, text: 'export_original: false' },
          { indent: 1, text: 'check_mesh: false', comment: '3-D builds only' },
          { indent: 1, text: 'enable_correction: false', comment: '3-D builds only' },
        ]}
      />

      <H2 id="file-decomposition" num="5.2">Mesh file and decomposition</H2>

      <figure className="my-4">
        <Caption label="Table 5.1" className="mb-2">Mesh file and partitioning options.</Caption>
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
                ['file_path', '—', 'Required. Path to the Exodus II mesh. Overridden internally when a restart is active.'],
                ['automatic_decomposition_type', 'None', <>Partitioning algorithm applied at start-up. Meaningful only on more than one rank. See <a href="/get-started/running">Chapter 3</a>.</>],
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

      <Callout type="warning">
        Setting <code>automatic_decomposition_type</code> requires the input file to be a{' '}
        <strong style={{ color: 'var(--text)' }}>serial</strong> Exodus mesh, and requires Trilinos
        to have been built with parallel netCDF support. If the mesh has already been decomposed, or
        the Trilinos build lacks that support, every parallel run aborts during mesh reading.{' '}
        <a href="/get-started/running">Chapter 3</a> describes the failure signature and the
        alternative manual route.
      </Callout>

      <H3 id="decomposition-properties" num="5.2.1">Decomposition properties</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        When <code>automatic_decomposition_type</code> is active, additional low-level properties
        may be handed to the mesh I/O layer through the optional{' '}
        <code>decomposition_properties</code> block. It is a sequence of name&ndash;value pairs,
        each forwarded verbatim to the partitioner, and it lets the decomposition be steered rather
        than left to the default balance. The typical use is a conjugate mesh: restricting the
        partitioner to the fluid blocks balances the fluid workload &mdash; which dominates the cost
        &mdash; instead of the raw cell count across all blocks.
      </p>

      <figure className="my-4">
        <Caption label="Table 5.2" className="mb-2">
          Decomposition properties, under <code>mesh &gt; decomposition_properties</code>. Each
          sequence entry is a single name&ndash;value pair.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Key</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Required</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['decomposition_properties', 'no', <>Sequence of maps. Read only when <code>automatic_decomposition_type</code> is set; otherwise ignored.</>],
                ['name', 'per entry', <>Property name passed to the partitioner, e.g. <code>DECOMP_OMITTED_BLOCK_NAMES</code>.</>],
                ['value', 'per entry', 'Property value, as a string.'],
              ].map(([key, req, desc]) => (
                <tr key={key as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{key}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{req}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 5.3"
        caption="Balancing the decomposition onto the fluid blocks of a conjugate mesh by omitting the solid block from the partition weighting."
        lines={[
          { indent: 0, key: 'mesh:' },
          { indent: 1, text: 'file_path: cht.e' },
          { indent: 1, text: 'automatic_decomposition_type: rcb' },
          { indent: 1, key: 'decomposition_properties:' },
          { indent: 1, dash: true, text: 'name: DECOMP_OMITTED_BLOCK_NAMES' },
          { indent: 2, text: 'value: solid' },
        ]}
      />

      <H2 id="transformation" num="5.3">Geometric transformation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The optional <code>transformation &gt; scale</code> block rescales the mesh as it is read.
        The presence of the block alone activates scaling; there is no separate enabling switch.
      </p>

      <figure className="my-4">
        <Caption label="Table 5.3" className="mb-2">Mesh scaling options, under <code>mesh &gt; transformation &gt; scale</code>.</Caption>
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
                ['Sx', '1.0', <>Scale factor in <M math="x" />. Read whenever the block is present.</>],
                ['Sy', '1.0', <>Scale factor in <M math="y" />. Read whenever the block is present.</>],
                ['Sz', '1.0', <>Scale factor in <M math="z" />. Read in three-dimensional builds only.</>],
                ['scale_origin', 'zeros', 'Fixed point of the scaling.'],
                ['export_original', 'false', 'Also writes the unscaled mesh to disk.'],
              ].map(([opt, def, desc], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        Scaling is the cleanest way to reuse a mesh generated in one unit system for a case posed in
        another &mdash; a mesh drawn in millimetres, for instance, scaled by <M math="10^{-3}" /> for
        a case in metres. Rescaling changes the Reynolds number of the case, so the inlet velocity or
        viscosity must be adjusted to match.
      </Callout>

      <H2 id="quality" num="5.4">Mesh quality checking</H2>

      <figure className="my-4">
        <Caption label="Table 5.4" className="mb-2">Mesh quality options. Both are available in three-dimensional builds only.</Caption>
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
                ['check_mesh', 'false', 'Evaluates element quality metrics and reports poor elements.'],
                ['enable_correction', 'false', 'Applies corrective treatment to flat and high-aspect-ratio elements.'],
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

      <Callout type="warning">
        <strong style={{ color: 'var(--text)' }}>Three mesh options exist only in
        three-dimensional builds:</strong> <code>Sz</code>, <code>check_mesh</code> and{' '}
        <code>enable_correction</code>. In a two-dimensional build they are never read, and no error
        or warning is issued &mdash; the keys are silently ignored.
      </Callout>

      <H2 id="requirements" num="5.5">Mesh requirements</H2>

      <figure className="my-4">
        <Caption label="Table 5.5" className="mb-2">What the mesh must provide for the rest of the input file to resolve.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Mesh entity</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Referenced by</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>Element blocks</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>
                  <code>domain &gt; location</code> (<a href="/get-started/physical-analysis">Chapter 6</a>). Every
                  domain names the element blocks it occupies.
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>Sidesets</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>
                  <code>boundaries[] &gt; location</code> (<a href="/get-started/physical-analysis">Chapter 6</a>) and{' '}
                  <code>interface &gt; side1/side2 &gt; region_list</code> (<a href="/get-started/interfaces">Chapter 7</a>).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="note">
        Element block naming follows the conventions of whichever tool produced the mesh. When
        converting from another format, confirm the block and sideset names that were actually
        written before referencing them in the input file &mdash; a name that does not resolve
        produces an error naming the entity but not the block that expected it.
      </Callout>
    </GsLayout>
  );
}
