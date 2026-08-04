import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, H3, Callout } from './GsLayout';

export function Ch2Installation() {
  useDocumentTitle('Installation — User Guide');
  return (
    <GsLayout chNum="2" title="Installation">
      <SEO title="Installation — User Guide" description="Install OpenAccel: dependencies, Spack environment, CMake build, and verifying the build." path="/get-started/installation" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-10 text-lg">
        OpenAccel is a C++20 code built from source. This chapter covers obtaining the source,
        installing dependencies with Spack, and building with CMake and Ninja.
      </p>

      <H2 id="dependencies">Dependencies</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        The following must be available before configuring the build:
      </p>
      <ul className="list-disc pl-5 space-y-2 mb-6" style={{ color: 'var(--text-dim)' }}>
        <li><strong style={{ color: 'var(--text)' }}>Compiler:</strong> GCC ≥ 11 (GCC 11 and 13 are tested in CI)</li>
        <li><strong style={{ color: 'var(--text)' }}>Build system:</strong> CMake ≥ 3.18, Ninja</li>
        <li><strong style={{ color: 'var(--text)' }}>Parallelism:</strong> MPI — MPICH or OpenMPI</li>
        <li><strong style={{ color: 'var(--text)' }}>Package manager:</strong> Spack (strongly recommended for Trilinos)</li>
        <li><strong style={{ color: 'var(--text)' }}>Trilinos:</strong> Built with STK + Exodus + Zoltan2 + Belos + Ifpack2</li>
        <li><strong style={{ color: 'var(--text)' }}>Optional:</strong> PETSc ≥ 3.18, HYPRE ≥ 3.0</li>
      </ul>

      <Callout type="warning">
        <strong>Trilinos build flags:</strong> Trilinos must be built with STK and the Exodus interface
        enabled. If PnetCDF is present in the Spack environment, ensure it is built with a compatible
        MPI. Mismatched MPI libraries cause silent link failures.
      </Callout>
      <Callout type="warning">
        <strong>64-bit mesh indices:</strong> For meshes with more than ~2 × 10⁹ cells, configure
        Trilinos with <code>-DTRILINOS_ENABLE_64BIT_GLOBAL_IDS=ON</code>. This flag cannot be changed
        after Trilinos is built.
      </Callout>

      <H2 id="spack">Spack Environment</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        A pre-configured Spack environment lives at <code>tools/spack/openaccel-env</code>. Activate
        and install it to pull in Trilinos, STK, PETSc, HYPRE, and all other heavy dependencies:
      </p>
      <CodeBlock lang="bash" code={`spack env activate tools/spack/openaccel-env\nspack install`} />
      <Callout type="tip">
        The first <code>spack install</code> can take 30–90 minutes depending on your machine.
        Subsequent installs are cached. On a shared cluster, ask your sysadmin whether a compatible
        Trilinos build already exists in a system Spack instance — you can chain it with{' '}
        <code>spack.yaml: upstreams</code>.
      </Callout>

      <H2 id="clone">Clone</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        OpenAccel uses Git submodules for lightweight external dependencies (Eigen, nanoflann, …).
        Clone recursively:
      </p>
      <CodeBlock lang="bash" code={`git clone --recurse-submodules https://github.com/CCFNUM/OpenAccel\ncd OpenAccel`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        If you already cloned without <code>--recurse-submodules</code>:
      </p>
      <CodeBlock lang="bash" code={`git submodule update --init --recursive`} />

      <H2 id="build">Build with CMake</H2>
      <H3 id="release-build">Release build</H3>
      <CodeBlock lang="bash" code={`cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DPETSC=ON\nninja -C build`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        The resulting binary is <code>build/OpenAccel</code>.
      </p>

      <H3 id="debug-build">Debug build with sanitizers</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        For development, enable address and undefined-behaviour sanitizers:
      </p>
      <CodeBlock lang="bash" code={`cmake -B build-debug -G Ninja -DCMAKE_BUILD_TYPE=Debug -DSANITIZE=ON\nninja -C build-debug`} />

      <H3 id="cmake-options">CMake options</H3>
      <div className="overflow-x-auto mt-4 mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              <th className="text-left py-2 pr-6 font-mono font-medium" style={{ color: 'var(--text)' }}>Option</th>
              <th className="text-left py-2 pr-6 font-medium" style={{ color: 'var(--text)' }}>Default</th>
              <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['-DPETSC=ON', 'OFF', 'Link against PETSc for additional Krylov solvers'],
              ['-DHYPRE=ON', 'OFF', 'Link against HYPRE (AMG preconditioners)'],
              ['-DSANITIZE=ON', 'OFF', 'Enable ASAN + UBSAN (Debug builds only)'],
              ['-DCMAKE_BUILD_TYPE=Release', 'Debug', 'Release enables -O3 and disables assertions'],
            ].map(([opt, def, desc]) => (
              <tr key={opt as string} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td className="py-2 pr-6 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                <td className="py-2 pr-6 font-mono text-xs align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                <td className="py-2 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="verify">Verifying the Build</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Run the cavity benchmark to confirm the build is working:
      </p>
      <CodeBlock lang="bash" code={`./build/OpenAccel examples/cavity/cavity.yaml`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        Expect to see pressure and velocity residuals printed at each iteration, converging
        below 10⁻⁶ within 50–100 iterations. Then run the regression suite:
      </p>
      <CodeBlock lang="bash" code={`cd examples && ./run_all.sh`} />
      <Callout type="note">
        CI runs the regression suite on GCC 11 and GCC 13 with both MPICH and OpenMPI.
        A passing local suite is a reliable indicator of CI success.
      </Callout>
    </GsLayout>
  );
}
