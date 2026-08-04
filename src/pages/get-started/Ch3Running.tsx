import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { YamlTree } from '@/components/YamlTree';
import { Caption } from '@/components/Caption';
import { M } from '@/components/tutorial/Equation';
import { GsLayout, H2, H3, Callout } from './GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;

export function Ch3Running() {
  useDocumentTitle('Running a Case — User Guide');
  return (
    <GsLayout chNum="3" title="Running a Case">
      <SEO
        title="Running a Case — User Guide"
        description="Case directory layout, serial and parallel execution, mesh decomposition, reading the residual log, restarting, and post-processing."
        path="/get-started/running"
      />

      <H2 id="case-directory" num="3.1">Case directory</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A case consists of two files: the input file and the mesh.
      </p>

      <YamlTree
        label="Figure 3.1"
        caption="Minimum contents of a case directory."
        lines={[
          { indent: 0, key: 'myCase/' },
          { indent: 1, text: 'input.i', comment: 'simulation definition' },
          { indent: 1, text: 'mesh.e', comment: 'Exodus II mesh' },
        ]}
      />

      <p style={{ color: 'var(--text-dim)' }}>
        The mesh file name is not fixed; it is whatever <code>mesh &gt; file_path</code> declares.
        Output files are written to the paths given in <code>output_control</code>, relative to the
        working directory.
      </p>

      <H2 id="serial" num="3.2">Serial execution</H2>
      <CodeBlock lang="bash" code={`./build/openaccel-3D.exe -i input.i`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        Nothing further is required. A serial run reads the mesh directly and needs no preparation.
      </p>

      <H2 id="parallel" num="3.3">Parallel execution</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A parallel run requires the mesh to be partitioned across ranks. Two routes exist:
        partitioning at start-up, or partitioning beforehand.
      </p>

      <H3 id="automatic-decomposition" num="3.3.1">Automatic decomposition</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Set <code>automatic_decomposition_type</code> in the <code>mesh</code> block (
        <a href="/get-started/mesh">Chapter 5</a>) and launch under <code>mpirun</code>. Zoltan2
        partitions the mesh during start-up.
      </p>
      <CodeBlock lang="bash" code={`mpirun -np 8 ./build/openaccel-3D.exe -i input.i`} />

      <figure className="my-4">
        <Caption label="Table 3.1" className="mb-2">
          Decomposition algorithms available through Zoltan2, accepted as values of{' '}
          <code>mesh &gt; automatic_decomposition_type</code>.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Algorithm</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['rcb', 'Recursive coordinate bisection'],
                ['rcb_ignore_z', <>Recursive coordinate bisection, ignoring the <M math="z" /> direction</>],
                ['rib', 'Recursive inertial bisection'],
                ['hsfc', 'Hilbert space-filling curve'],
              ].map(([v, d], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        Automatic decomposition requires a <strong style={{ color: 'var(--text)' }}>serial</strong>{' '}
        input mesh and a Trilinos build with parallel netCDF support. If either condition is unmet
        the run aborts during mesh reading, before the first iteration, with an Exodus error naming
        a per-rank file such as <code>mesh.e.4.0</code> that does not exist. Serial runs of the same
        case succeed, which makes the pattern easy to recognise: every parallel case fails at zero
        iterations while every serial case passes.
      </Callout>

      <H3 id="manual-decomposition" num="3.3.2">Manual decomposition</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The <code>decomp</code> utility distributed with Trilinos partitions the mesh ahead of the
        run, writing one file per rank alongside the original:
      </p>
      <CodeBlock lang="bash" code={`decomp --processors 8 mesh.e --rcb --64 -V`} />

      <H3 id="preparing-mesh" num="3.3.3">Preparing a mesh for decomposition</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Meshes produced by external tools frequently use 64-bit integer storage. The decomposition
        utilities do not handle this reliably: with a 64-bit mesh, <code>nem_slice</code> may skip
        the Zoltan call entirely and produce scattered rather than contiguous partitions.
      </p>

      <Callout type="warning">
        Convert 64-bit meshes to 32-bit <strong style={{ color: 'var(--text)' }}>before
        decomposing</strong>. This step applies only to the decomposition workflow — a serial run
        reads a 64-bit mesh without difficulty.
      </Callout>

      <CodeBlock lang="bash" code={`ncdump <input-mesh> \\
  | sed 's/int64_status.*/int64_status = 0;/' \\
  | sed 's/\\bint64\\b/int/' \\
  | ncgen -5 -o <output-mesh>`} />

      <H2 id="residual-log" num="3.4">Reading the residual log</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Each outer iteration prints one line per active equation. A run has converged when every
        residual has fallen below <code>residual_target</code>. A run that stops at exactly{' '}
        <code>max_iterations</code> has <em>not</em> converged — it has merely exhausted its
        iteration budget, and the final residual should always be checked.
      </p>

      <Callout type="tip">
        <strong style={{ color: 'var(--text)' }}>Iteration counts are not reproducible, and should
        not be compared.</strong> Close to convergence the residual falls very slowly, so the curve
        is almost flat where it crosses the target. A minute change in rounding — caused by a
        different partitioning, a different number of MPI ranks, or a different version of a
        linear-algebra library — shifts that nearly flat curve slightly up or down, and the crossing
        point can move by hundreds of iterations as a result. Two runs of an identical input file
        can therefore report very different iteration counts while converging to the same solution.
        Compare converged results, not iteration counts.
      </Callout>

      <H2 id="restart" num="3.5">Restarting</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A run is restarted by adding a <code>restart_control</code> block; see{' '}
        <a href="/get-started/output">Chapter 10</a>. The presence of the block alone activates
        restart mode, irrespective of its contents.
      </p>

      <H2 id="post-processing" num="3.6">Post-processing</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Output is written in Exodus&nbsp;II format and may be read by ParaView, VisIt, or any
        Exodus-aware tool. The fields written are those listed in <code>output_fields</code>;
        monitors defined under <code>post_process</code> write their own files during the run. Both
        are described in <a href="/get-started/output">Chapter 10</a>.
      </p>
    </GsLayout>
  );
}
