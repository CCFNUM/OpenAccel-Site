import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { YamlTree } from '@/components/YamlTree';
import { InputMap } from '@/components/InputMap';
import { Caption } from '@/components/Caption';
import { M } from '@/components/tutorial/Equation';
import { GsLayout, H2, H3, Callout } from './GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;
const tdBorder = { borderBottom: '1px solid var(--table-border)' } as const;

export function Ch10Output() {
  useDocumentTitle('Output, Monitors, and Restart — User Guide');
  return (
    <GsLayout chNum="10" title="Output, Monitors, and Restart">
      <SEO
        title="Output, Monitors, and Restart — User Guide"
        description="Output control, output frequency and fields, post-process monitors, and restart control."
        path="/get-started/output"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        <code>output_control</code> and <code>restart_control</code> are children of{' '}
        <code>solver</code>, siblings of the <code>solver_control</code> block documented in{' '}
        <a href="/get-started/numerics">Chapter 8</a>.
      </p>

      <H2 id="location" num="10.1">Location in the input file</H2>

      <figure className="my-6">
        <InputMap highlight="output" />
        <Caption label="Figure 10.1" className="mt-2">
          Position of <code>output_control</code> and <code>restart_control</code>, both children
          of <code>solver</code>.
        </Caption>
      </figure>

      <H2 id="output-control" num="10.2">Output control</H2>

      <figure className="my-4">
        <Caption label="Table 10.1" className="mb-2">Output control options.</Caption>
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
                ['file_path', '—', 'Required. Path of the Exodus results file.'],
                ['output_fields', 'empty', 'Required. List of fields written to disk.'],
                ['output_frequency', '—', 'Form depends on the analysis type; see below.'],
                ['corrected_boundary_values', 'false', 'Writes corrected rather than raw values on boundaries.'],
                ['match_final_time', 'false', 'Adjusts the last step so output lands exactly on the final time.'],
                ['write_timestep_info', 'false', <>Writes a <code>timestep.dat</code> log.</>],
                ['restart_file_name', 'restart.bin', 'Name of the restart file written.'],
                ['restart_frequency', '25', 'Interval between restart writes.'],
              ].map(([opt, def, desc]) => (
                <tr key={opt as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="output-frequency" num="10.2.1">Output frequency</H3>
      <Callout type="warning">
        <strong style={{ color: 'var(--text)' }}><code>output_frequency</code> changes form with
        the analysis type.</strong> For a steady run it is a plain number; for a transient run it
        must be a map. Supplying the wrong form aborts the run with a type error.
      </Callout>

      <YamlTree
        label="Figure 10.2"
        caption="Output frequency in a steady run: a bare scalar."
        lines={[
          { indent: 0, key: 'solver:' },
          { indent: 1, key: 'output_control:' },
          { indent: 2, text: 'file_path: results.e' },
          { indent: 2, text: 'output_frequency: 10', comment: 'every 10 iterations' },
          { indent: 2, text: 'output_fields: [velocity, pressure]' },
        ]}
      />

      <YamlTree
        label="Figure 10.3"
        caption="Output frequency in a transient run: a map with an option key."
        lines={[
          { indent: 0, key: 'solver:' },
          { indent: 1, key: 'output_control:' },
          { indent: 2, text: 'file_path: results.e' },
          { indent: 2, key: 'output_frequency:' },
          { indent: 3, text: 'option: timestep_interval' },
          { indent: 3, text: 'timestep_interval: 50' },
          { indent: 2, text: 'output_fields: [velocity, pressure]' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 10.2" className="mb-2">Transient output frequency options.</Caption>
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
                ['option', 'timestep_interval', <>Alternative: <code>time_interval</code>.</>],
                ['timestep_interval', '1', 'Steps between writes.'],
                ['time_interval', '1.0', 'Physical time between writes.'],
              ].map(([opt, def, desc]) => (
                <tr key={opt as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="output-fields" num="10.2.2">Output fields</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>output_fields</code> is a plain list naming the fields written to the results file.
        Only fields belonging to an active equation may be requested: asking for{' '}
        <code>turbulent_viscosity</code> in a laminar case, for instance, has nothing to write. The
        table below groups the fields in common use by the physics that produces them.
      </p>

      <figure className="my-4">
        <Caption label="Table 10.3" className="mb-2">
          Commonly requested output fields. The available set depends on which equations are active.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Category</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Fields</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Flow', <><code>velocity</code>, <code>pressure</code>, <code>density</code></>],
                ['Thermal', <><code>temperature</code>, <code>total_temperature</code></>],
                ['Compressible', <><code>mach_number</code>, <code>total_pressure</code></>],
                ['Turbulence', <><code>turbulent_kinetic_energy</code>, <code>turbulent_eddy_frequency</code>, <code>turbulent_viscosity</code></>],
                ['Transition', <><code>turbulent_intermittency</code>, <code>transition_onset_reynolds_number</code></>],
                ['Multiphase', <code>volume_fraction</code>],
                ['Solid', <><code>displacement</code>, <code>stress</code></>],
              ].map(([cat, fields]) => (
                <tr key={cat as string} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{cat}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{fields}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        When running a transition model, always output <code>turbulent_intermittency</code>. It is
        the fastest diagnostic available: if <M math="\gamma" /> stays near unity across the whole surface,
        transition is not being triggered and the model is contributing nothing, regardless of how
        the loading looks.
      </Callout>

      <H2 id="monitors" num="10.3">Monitors</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>post_process</code> is a sequence under <code>output_control</code>. Each entry
        defines one monitor evaluated during the run and written to its own file.
      </p>

      <YamlTree
        label="Figure 10.4"
        caption="The three monitor types, shown with their parent chain."
        lines={[
          { indent: 0, key: 'solver:' },
          { indent: 1, key: 'output_control:' },
          { indent: 2, dots: true },
          { indent: 2, key: 'post_process:' },
          { indent: 2, dash: true, text: 'name: outlet_pressure' },
          { indent: 3, text: 'location: [outlet]' },
          { indent: 3, text: 'frequency: 1' },
          { indent: 3, text: 'write_to_file: true' },
          { indent: 3, text: 'type: reduction' },
          { indent: 3, key: 'options:' },
          { indent: 4, text: 'type: area_average' },
          { indent: 4, text: 'field: pressure' },
          { indent: 2, dash: true, text: 'name: foil_force' },
          { indent: 3, text: 'location: [foil]' },
          { indent: 3, text: 'frequency: 1' },
          { indent: 3, text: 'write_to_file: true' },
          { indent: 3, text: 'type: force' },
          { indent: 3, key: 'options:' },
          { indent: 4, text: 'calculate_moment: true' },
          { indent: 4, text: 'moment_center: [0.25, 0.0]' },
          { indent: 2, dash: true, text: 'name: wake_probe' },
          { indent: 3, text: 'location: [fluid]' },
          { indent: 3, text: 'frequency: 1' },
          { indent: 3, text: 'write_to_file: true' },
          { indent: 3, text: 'type: probe' },
          { indent: 3, key: 'options:' },
          { indent: 4, text: 'probe_location: [2.0, 0.5]' },
          { indent: 4, text: 'field: velocity' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 10.4" className="mb-2">Monitor keys common to all types.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Required</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['name', 'yes', 'Label for the monitor and its output file.'],
                ['location', 'yes', 'Mesh regions over which it is evaluated.'],
                ['frequency', 'yes', 'Evaluation interval.'],
                ['write_to_file', 'yes', 'Whether results are written to disk.'],
                ['type', 'yes', <><code>reduction</code>, <code>force</code> or <code>probe</code>.</>],
                ['options', 'depends', <>Required for <code>reduction</code> and <code>probe</code>; optional for <code>force</code>.</>],
              ].map(([opt, req, desc]) => (
                <tr key={opt as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{req}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 10.5" className="mb-2">Type-specific monitor options.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Type</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={tdBorder}>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }} rowSpan={2}>reduction</td>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>type</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>—</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}><code>sum</code>, <code>average</code>, <code>area_average</code>. Required.</td>
              </tr>
              <tr style={tdBorder}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>field</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>—</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>Field to reduce. Required.</td>
              </tr>
              <tr style={tdBorder}>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }} rowSpan={3}>force</td>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>calculate_moment</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>false</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>Also computes the moment.</td>
              </tr>
              <tr style={tdBorder}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>moment_center</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>zeros</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>Required when <code>calculate_moment: true</code>.</td>
              </tr>
              <tr style={tdBorder}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>total_print</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>true</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>Prints the integrated total.</td>
              </tr>
              <tr style={tdBorder}>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }} rowSpan={2}>probe</td>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>probe_location</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>—</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>Coordinates of the probe point. Required.</td>
              </tr>
              <tr style={tdBorder}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>field</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>—</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>Field sampled. Required.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="restart" num="10.4">Restart</H2>
      <Callout type="warning">
        <strong style={{ color: 'var(--text)' }}>The presence of a <code>restart_control</code>{' '}
        block activates restart mode</strong>, regardless of its contents. To run a case from
        scratch, remove or comment out the block &mdash; emptying it is not sufficient.
      </Callout>

      <figure className="my-4">
        <Caption label="Table 10.6" className="mb-2">Restart control options.</Caption>
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
                ['file_path', '—', 'Required once the block is present. Path to the restart file.'],
                ['time', '0.0', 'Time to restart from. If omitted, the last stored time is used.'],
                ['write_initial', 'false', 'Writes the restarted state before the first step.'],
                ['keep_snapshots', '4', 'Number of restart snapshots retained.'],
                ['interpolation_type', 'closest', <>Only <code>closest</code> is functional.</>],
              ].map(([opt, def, desc]) => (
                <tr key={opt as string} style={tdBorder}>
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
        <code>interpolation_type</code> accepts <code>piecewise_linear</code> and{' '}
        <code>b_spline</code> in the string table, but both are rejected at run time as unsupported.
        Only <code>closest</code> works.
      </Callout>
    </GsLayout>
  );
}
