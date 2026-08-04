import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { YamlTree } from '@/components/YamlTree';
import { InputMap } from '@/components/InputMap';
import { Caption } from '@/components/Caption';
import { GsLayout, H2, Callout } from './GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;

export function Ch4InputFile() {
  useDocumentTitle('Input File Structure — User Guide');
  return (
    <GsLayout chNum="4" title="Input File Structure">
      <SEO
        title="Input File Structure — User Guide"
        description="The two top-level blocks of an OpenAccel input file, the full structural tree, cross-references between blocks, required blocks, and simulation-level keys."
        path="/get-started/input-file"
      />

      <H2 id="top-level" num="4.1">Two top-level blocks</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        An OpenAccel input file has exactly two top-level keys.
      </p>

      <Callout type="warning">
        <code>mesh</code> is a <strong style={{ color: 'var(--text)' }}>sibling</strong> of{' '}
        <code>simulation</code>, not a child of it. Nesting the mesh block inside{' '}
        <code>simulation</code> causes the mesh path to be reported as missing.
      </Callout>

      <figure className="my-6">
        <InputMap />
        <Caption label="Figure 4.1" className="mt-2">
          Complete structural map of an OpenAccel input file. This map reappears at the start of
          chapters <a href="/get-started/mesh">5</a> to <a href="/get-started/output">10</a>, with
          the branch under discussion highlighted.
        </Caption>
      </figure>

      <H2 id="full-tree" num="4.2">The full tree</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The following shows the complete skeleton of an input file with a chapter reference against
        each branch. Reading it top to bottom is the same order in which a case is normally
        assembled: mesh first, then the physics, then the numerics, then what is written out.
      </p>

      <YamlTree
        label="Figure 4.2"
        caption="Structural skeleton of input.i, with chapter cross-references. Vertical rules mark nesting levels."
        lines={[
          { indent: 0, key: 'mesh:', comment: 'Chapter 5' },
          { indent: 1, text: 'file_path: mesh.e' },
          { indent: 1, text: 'automatic_decomposition_type: rcb' },
          { indent: 1, dots: true },
          { indent: 0 },
          { indent: 0, key: 'simulation:' },
          { indent: 1, text: 'verbose: 0', comment: 'optional; Section 4.6' },
          { indent: 1, key: 'physical_analysis:' },
          { indent: 2, key: 'analysis_type:' },
          { indent: 3, text: 'option: steady_state' },
          { indent: 2, key: 'domains:', comment: 'Chapter 6' },
          { indent: 2, dash: true, text: 'name: fluid' },
          { indent: 3, text: 'type: fluid' },
          { indent: 3, text: 'location: [fluid]' },
          { indent: 3, text: 'materials: [air]' },
          { indent: 3, dots: true },
          { indent: 2, key: 'interfaces:', comment: 'Chapter 7' },
          { indent: 2, key: 'rigid_bodies:', comment: 'Chapter 6' },
          { indent: 1, key: 'solver:' },
          { indent: 2, key: 'solver_control:', comment: 'Chapter 8' },
          { indent: 2, key: 'output_control:', comment: 'Chapter 10' },
          { indent: 2, key: 'restart_control:', comment: 'Chapter 10' },
          { indent: 1, key: 'material_library:', comment: 'Chapter 9' },
          { indent: 1, dash: true, text: 'name: air' },
          { indent: 2, dots: true },
        ]}
      />

      <H2 id="cross-references" num="4.3">Cross-references between blocks</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Four kinds of name are resolved across blocks. An error in any of them names the missing
        entity but not always the block that should have declared it.
      </p>

      <figure className="my-4">
        <Caption label="Table 4.1" className="mb-2">Names resolved between blocks.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Referenced from</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Must match</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['domain > materials', 'material_library[] > name', 'A material may not be listed twice on one domain.'],
                ['domain > location', 'mesh element blocks', 'Each entry must resolve to a mesh part.'],
                ['boundaries[] > location', 'mesh sidesets', 'Each entry must resolve to a sideset.'],
                ['interface > side1/side2 > domain', 'domain > name', 'Domain names must be unique.'],
                ['mesh_motion > rigid_body', 'rigid_bodies[] > name', <>A boundary driven by a rigid-body solution must name a declared body (see <a href="/get-started/physical-analysis">Chapter 6</a>).</>],
              ].map(([from, must, notes]) => (
                <tr key={from as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{from}</td>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--text-dim)' }}>{must}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="required" num="4.4">Required blocks</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Most blocks are optional and fall back on documented defaults. The blocks in the table below
        are not: omitting any of them aborts the run at parse time, before the mesh is read.
      </p>

      <figure className="my-4">
        <Caption label="Table 4.2" className="mb-2">Mandatory blocks and the condition under which each is required.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Block</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Required when</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['mesh', 'always'],
                ['physical_analysis', 'always'],
                ['analysis_type', 'always'],
                ['domains', 'always'],
                ['solver', 'always'],
                ['solver_control > basic_settings', 'always'],
                ['convergence_controls', 'always'],
                ['convergence_criteria', 'always'],
                ['output_control', 'always'],
                ['domain > location', 'for every domain'],
                ['domain > boundaries', 'for every domain'],
                ['domain > initialization', 'for every domain, unless a shared default is given'],
                ['domain > fluid_models', <>when <code>type: fluid</code></>],
                ['domain > solid_models', <>when <code>type: solid</code></>],
                ['total_time, time_steps, transient_scheme', 'when the analysis is transient'],
              ].map(([block, cond]) => (
                <tr key={block as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{block}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{cond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="note">
        Two error messages in the current release name the wrong key. The absence of{' '}
        <code>convergence_criteria</code> is reported as a missing <code>convergence_controls</code>{' '}
        block, and the absence of <code>boundaries</code> is reported with an example referring to a
        non-existent <code>boundary_conditions</code> key. The logic in both cases is correct; only
        the message text is misleading.
      </Callout>

      <H2 id="where-documented" num="4.5">Where each block is documented</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The table below lists the chapter covering each branch. The analysis type, which governs
        whether the run is steady or transient, is documented with the rest of{' '}
        <code>physical_analysis</code> in <a href="/get-started/physical-analysis">Chapter 6</a>.
      </p>

      <figure className="my-4">
        <Caption label="Table 4.3" className="mb-2">Chapter covering each block of the input file.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Block</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Contents</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Chapter</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['mesh', 'Mesh file, decomposition, scaling', '/get-started/mesh', '5'],
                ['physical_analysis > analysis_type', 'Steady or transient, time stepping', '/get-started/physical-analysis', '6'],
                ['physical_analysis > domains', 'Physics, materials, boundaries', '/get-started/physical-analysis', '6'],
                ['physical_analysis > rigid_bodies', 'Six-degree-of-freedom rigid bodies', '/get-started/physical-analysis', '6'],
                ['physical_analysis > interfaces', 'Domain coupling, periodicity', '/get-started/interfaces', '7'],
                ['solver > solver_control', 'Numerics, convergence, linear solvers', '/get-started/numerics', '8'],
                ['material_library', 'Fluid and solid properties', '/get-started/materials', '9'],
                ['solver > output_control', 'Output fields, monitors, restart', '/get-started/output', '10'],
              ].map(([block, contents, href, ch]) => (
                <tr key={block as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{block}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{contents}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}><a href={href as string}>{ch}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="simulation-keys" num="4.6">Simulation-level keys</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A small number of keys sit directly under <code>simulation</code>, outside any of its major
        child blocks. Only one is in routine use.
      </p>

      <figure className="my-4">
        <Caption label="Table 4.4" className="mb-2">Keys read directly from the simulation root.</Caption>
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
              <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>verbose</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>0</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>
                  Start-up verbosity. When greater than zero, the master rank prints the build&rsquo;s
                  git hash and <code>git describe</code> string before the run begins. Left at zero
                  for normal use.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        Recording the build identity in the run log is worth the one line when a result is destined
        for a report or a regression baseline. Set <code>simulation &gt; verbose: 1</code> and the
        exact commit that produced the data is captured at the top of the log, removing any later
        doubt about which build was used.
      </Callout>
    </GsLayout>
  );
}
