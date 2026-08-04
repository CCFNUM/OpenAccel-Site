import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, H3, Callout, TodoBlock } from './GsLayout';

export function Ch10Output() {
  useDocumentTitle('Output, Monitors & Restart — User Guide');
  return (
    <GsLayout chNum="10" title="Output, Monitors & Restart">
      <SEO title="Output, Monitors & Restart — User Guide" description="Configuring output_control: field output, surface monitors, volume monitors, and checkpoint/restart in OpenAccel." path="/get-started/output" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-6 text-lg">
        The <code>output_control</code> block controls when and what OpenAccel writes to disk —
        field results, surface force monitors, volume-averaged quantities, and restart checkpoints.
      </p>

      <H2 id="location">Location in input file</H2>
      <CodeBlock lang="yaml" code={`simulation:
  solver:
    output_control:   # ← this chapter
      output_dir: results/
      write_interval: 100
      . . .\n`} />

      <H2 id="field-output">Field Output</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Results are written in Exodus II format by default. The output directory and write
        interval are the primary controls:
      </p>
      <CodeBlock lang="yaml" code={`output_control:
  output_dir: results/
  write_interval: 50      # write every 50 iterations / time steps
  fields:
    - velocity
    - pressure
    - turbulent_kinetic_energy
    - wall_shear_stress`} />
      <TodoBlock label="Full option table for field output — available field names, output format (Exodus/VTK), write_interval, and per-field precision settings — will be added here from Chapter 10 of the User Guide." />

      <H2 id="monitors">Monitors</H2>
      <H3 id="surface-monitors">Surface Monitors</H3>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Surface monitors compute integrated quantities (force, moment, heat flux) on named
        boundary parts at every iteration:
      </p>
      <CodeBlock lang="yaml" code={`output_control:
  surface_monitors:
    - name: drag_force
      parts: [cylinder_surface]
      quantity: force
      direction: [1.0, 0.0, 0.0]
    - name: lift_force
      parts: [cylinder_surface]
      quantity: force
      direction: [0.0, 1.0, 0.0]`} />
      <TodoBlock label="Option table for surface_monitors — quantity types (force, moment, heat_flux, mass_flow, average_pressure), reference values for coefficient computation, and output file format — will be added here from Chapter 10." />

      <H3 id="volume-monitors">Volume Monitors</H3>
      <CodeBlock lang="yaml" code={`output_control:
  volume_monitors:
    - name: mean_tke
      domain_id: fluid
      quantity: turbulent_kinetic_energy
      operation: volume_average`} />
      <TodoBlock label="Option table for volume_monitors — quantity types, domain scope, and operation types (volume_average, volume_integral, max, min) — will be added here from Chapter 10." />

      <H2 id="residuals">Residual Output</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Control how often residuals are printed to stdout and whether they are also written to
        a file:
      </p>
      <CodeBlock lang="yaml" code={`output_control:
  residual_interval: 1       # print every iteration
  residual_file: residuals.csv`} />
      <Callout type="tip">
        Setting <code>residual_file</code> writes a CSV that can be plotted directly to track
        convergence history. Each column is one field; rows are iterations.
      </Callout>

      <H2 id="restart">Checkpoint & Restart</H2>
      <CodeBlock lang="yaml" code={`output_control:
  checkpoint_interval: 500   # write checkpoint every 500 iterations
  checkpoint_dir: checkpoints/
  max_checkpoints: 3         # keep only the last 3 (0 = keep all)`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        To restart from a checkpoint, see{' '}
        <a href="/get-started/running#restart" style={{ color: 'var(--cold)' }} className="underline underline-offset-4">
          Chapter 3 — Restart
        </a>.
      </p>
      <Callout type="warning">
        Checkpoint files are not portable between different MPI decompositions. If you change
        the number of ranks, start from scratch or use <code>--interpolate-restart</code> (experimental).
      </Callout>
      <TodoBlock label="Full option table for output_control — all keys with types, defaults, and descriptions — will be added here from Chapter 10 of the User Guide." />
    </GsLayout>
  );
}
