import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, H3, Callout } from './GsLayout';

export function Ch3Running() {
  useDocumentTitle('Running Cases — User Guide');
  return (
    <GsLayout chNum="3" title="Running Cases">
      <SEO title="Running Cases — User Guide" description="Run OpenAccel in serial and parallel, decompose meshes, read residual logs, and restart from checkpoints." path="/get-started/running" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-10 text-lg">
        OpenAccel is a single binary that takes an input YAML file as its only required argument.
        This chapter covers serial and parallel execution, mesh decomposition, reading residual output,
        and restarting from a checkpoint.
      </p>

      <H2 id="serial">Serial Execution</H2>
      <CodeBlock lang="bash" code={`./build/OpenAccel path/to/case.yaml`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        The solver prints a header with the build configuration, then begins iterating. Residuals
        are printed to stdout at the interval configured by <code>output_control.residual_interval</code>
        (default: every iteration).
      </p>

      <H2 id="parallel">Parallel Execution (MPI)</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        OpenAccel uses Zoltan2 for runtime mesh partitioning — no pre-partitioned mesh is required.
        Launch with <code>mpirun</code> or <code>srun</code>:
      </p>
      <CodeBlock lang="bash" code={`mpirun -np 4 ./build/OpenAccel path/to/case.yaml --decompose rcb`} />

      <H3 id="decompose">Decomposition methods</H3>
      <div className="overflow-x-auto mt-2 mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              <th className="text-left py-2 pr-6 font-mono font-medium" style={{ color: 'var(--text)' }}>Value</th>
              <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['rcb',          'Recursive Coordinate Bisection — default, good for most cases'],
              ['rib',          'Recursive Inertial Bisection — better aspect ratios on elongated domains'],
              ['hsfc',         'Hilbert Space-Filling Curve — low surface-to-volume ratio, good cache locality'],
              ['rcb_ignore_z', 'RCB restricted to x–y plane; use for 2D extruded meshes'],
            ].map(([v, d]) => (
              <tr key={v} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td className="py-2 pr-6 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                <td className="py-2 align-top" style={{ color: 'var(--text-dim)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="tip">
        For repeatable decompositions, set <code>--decompose-seed &lt;integer&gt;</code>. Without it the
        seed is taken from the system clock.
      </Callout>

      <H2 id="residuals">Reading the Residual Log</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        A typical residual line looks like:
      </p>
      <CodeBlock lang="text" code={`Iter   10 | p 3.21e-03 | U 8.74e-04 | cont 1.12e-05 | wall 0.42s`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        Fields: iteration counter, pressure residual, velocity residual, continuity residual, and
        wall-clock time for that iteration. For steady runs, convergence is declared when all
        residuals fall below the tolerances set in <code>solver_control</code>.
      </p>
      <Callout type="note">
        A stagnating residual that plateaus above 10⁻³ usually indicates an MPI or mesh problem —
        see <a href="/get-started/troubleshooting" style={{ color: 'var(--cold)' }} className="underline underline-offset-4">Appendix A — Troubleshooting</a>.
      </Callout>

      <H2 id="restart">Restart</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        OpenAccel writes checkpoint files at the interval set by <code>output_control.checkpoint_interval</code>.
        To restart from the latest checkpoint:
      </p>
      <CodeBlock lang="bash" code={`./build/OpenAccel case.yaml --restart`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        To restart from a specific checkpoint by iteration number:
      </p>
      <CodeBlock lang="bash" code={`./build/OpenAccel case.yaml --restart-from 500`} />
      <Callout type="warning">
        Checkpoint files are written in Exodus format and are not portable between different
        mesh decompositions. If you change the number of MPI ranks, start from scratch or
        re-interpolate using the <code>--interpolate-restart</code> flag (experimental).
      </Callout>

      <H2 id="flags">Command-Line Flags</H2>
      <div className="overflow-x-auto mt-2 mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              <th className="text-left py-2 pr-6 font-mono font-medium" style={{ color: 'var(--text)' }}>Flag</th>
              <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['--decompose <method>', 'Mesh partitioning algorithm (default: rcb)'],
              ['--decompose-seed <n>', 'RNG seed for decomposition'],
              ['--restart',            'Resume from the latest checkpoint'],
              ['--restart-from <iter>','Resume from checkpoint at iteration <iter>'],
              ['--validate',           'Parse and validate the input file, then exit without running'],
              ['--verbose',            'Print extra diagnostic output'],
            ].map(([f, d]) => (
              <tr key={f} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td className="py-2 pr-6 font-mono text-xs align-top whitespace-nowrap" style={{ color: 'var(--cold)' }}>{f}</td>
                <td className="py-2 align-top" style={{ color: 'var(--text-dim)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GsLayout>
  );
}
