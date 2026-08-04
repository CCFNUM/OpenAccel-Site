import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { Caption } from '@/components/Caption';
import { M } from '@/components/tutorial/Equation';
import { GsLayout, H2, Callout } from './GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;

export function Ch2Installation() {
  useDocumentTitle('Installation and Build — User Guide');
  return (
    <GsLayout chNum="2" title="Installation and Build">
      <SEO
        title="Installation and Build — User Guide"
        description="Build dependencies, installing them with Spack, cloning and configuring, compilation, and verifying an OpenAccel installation."
        path="/get-started/installation"
      />

      <H2 id="dependencies" num="2.1">Dependencies</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel is built with CMake against a small set of external libraries. The table below
        lists them; only the first five are mandatory, the two linear-solver libraries being
        optional but strongly recommended.
      </p>

      <figure className="my-4">
      <Caption label="Table 2.1" className="mb-2">Build dependencies.</Caption>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 font-medium" style={thStyle}>Dependency</th>
              <th className="text-left py-2 px-3 font-medium" style={thStyle}>Version</th>
              <th className="text-left py-2 px-3 font-medium" style={thStyle}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['C++ toolchain', <>GCC <M math="\ge" /> 12, Clang <M math="\ge" /> 15</>, 'C++20 required'],
              ['CMake', <><M math="\ge" /> 3.18</>, ''],
              ['MPI', '—', 'OpenMPI or MPICH'],
              ['Trilinos', '—', 'STK required; Tpetra, Belos and Ifpack2 enable the Trilinos linear-solver family'],
              ['YAML-cpp', '—', 'input file parsing'],
              ['PETSc', <><M math="\ge" /> 3.18</>, <>optional; enables <code>family: petsc</code></>],
              ['HYPRE', <><M math="\ge" /> 3.0</>, <>optional; enables <code>family: hypre</code></>],
            ].map(([dep, ver, notes], i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{dep}</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{ver}</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </figure>

      <p style={{ color: 'var(--text-dim)' }}>
        Eigen, ExprTk, nanoflann, gplotpp and liblinsolve are bundled as Git submodules and require
        no separate installation.
      </p>

      <Callout type="warning">
        The current release requires Trilinos configured with{' '}
        <code>-DSIERRA_MIGRATION:BOOL=ON</code>. This dependency is being removed and will not be
        required in future releases.
      </Callout>

      <Callout type="warning">
        <strong style={{ color: 'var(--text)' }}>Parallel netCDF is required for automatic
        decomposition.</strong> If Trilinos is built against a serial netCDF,{' '}
        <code>automatic_decomposition_type</code> is unavailable and every parallel run aborts
        during mesh reading. On a Debian or Ubuntu system this means installing{' '}
        <code>libnetcdf-pnetcdf-dev</code> — the ordinary <code>libnetcdf-dev</code> package is not
        sufficient — and pointing Trilinos at it before building.
      </Callout>

      <H2 id="spack" num="2.2">Installing dependencies with Spack</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The recommended route is the Spack environment shipped in <code>tools/spack/</code>:
      </p>
      <CodeBlock lang="bash" code={`spack repo add ./tools/spack/repos/spack_repo/ccfnum/openaccel
spack env create mpich ./tools/spack/mpich.yaml   # or openmpi.yaml
spack env activate mpich
spack install -j<ncores>`} />

      <H2 id="clone" num="2.3">Cloning and configuring</H2>
      <CodeBlock lang="bash" code={`git clone https://github.com/CCFNUM/OpenAccel.git
cd OpenAccel
git submodule update --init --recursive`} />

      <figure className="my-4">
      <Caption label="Table 2.2" className="mb-2">CMake configuration variables for dependencies installed outside Spack.</Caption>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 font-medium" style={thStyle}>Variable</th>
              <th className="text-left py-2 px-3 font-medium" style={thStyle}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['SPATIAL_DIM', <><strong style={{ color: 'var(--text)' }}>2</strong> or <strong style={{ color: 'var(--text)' }}>3</strong>. Compile-time spatial dimension; determines the executable name and which dimension-dependent code paths are compiled.</>],
              ['CMAKE_BUILD_TYPE', <><strong style={{ color: 'var(--text)' }}>Release</strong> or <strong style={{ color: 'var(--text)' }}>Debug</strong>. Several input-value checks are C++ assertions, active only in Debug builds.</>],
              ['Trilinos_DIR', 'Path to the Trilinos CMake configuration directory.'],
              ['YAML_DIR', 'Installation prefix of YAML-cpp.'],
              ['PETSC_DIR', 'Installation prefix of PETSc. Omitting it disables the PETSc linear-solver family.'],
            ].map(([v, purpose]) => (
              <tr key={v as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </figure>

      <Callout type="warning">
        <strong style={{ color: 'var(--text)' }}>Two-dimensional and three-dimensional builds are
        separate.</strong> <code>SPATIAL_DIM</code> is a compile-time constant, so a 2-D case cannot
        be run by a 3-D executable. Both binaries must be built into separate build directories and
        maintained in parallel.
      </Callout>

      <H2 id="compilation" num="2.4">Compilation</H2>
      <CodeBlock lang="bash" code={`# three-dimensional build
cmake -S . -B build    -DSPATIAL_DIM=3 -DCMAKE_BUILD_TYPE=Release
cmake --build build -j<ncores>

# two-dimensional build
cmake -S . -B build-2D -DSPATIAL_DIM=2 -DCMAKE_BUILD_TYPE=Release
cmake --build build-2D -j<ncores>`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        This produces <code>openaccel-3D.exe</code> and <code>openaccel-2D.exe</code> in their
        respective build directories.
      </p>

      <Callout type="tip">
        Template instantiation in the Trilinos-dependent translation units is memory-hungry —
        several gigabytes per compiler process is normal. If the build is killed without an error
        message, the cause is almost always the out-of-memory killer. Reduce <code>-j</code> until
        it completes.
      </Callout>

      <H2 id="verify" num="2.5">Verifying the installation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The configure step reports each optional linear-solver family explicitly:
      </p>
      <CodeBlock lang="text" code={`-- Trilinos linear solver support: ENABLED
-- Found YAML-CPP = /usr
-- PETSC_DIR (...) is provided. PETSc functionalities are enabled.
-- HYPRE found and enabled.`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        A family reported as disabled cannot be selected at run time, and any case requesting it
        will fail. The regression suite in <code>tools/python/regression_tests/</code> provides a
        fuller check.
      </p>
    </GsLayout>
  );
}
