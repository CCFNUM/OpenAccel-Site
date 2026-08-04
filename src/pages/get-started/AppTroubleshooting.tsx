import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { GsLayout, H2, H3, TodoBlock } from './GsLayout';

function TroubleTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto mt-4 mb-8">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: '2px solid var(--hairline)' }}>
            <th className="text-left py-2 pr-6 font-medium" style={{ color: 'var(--text)' }}>Symptom</th>
            <th className="text-left py-2 pr-6 font-medium" style={{ color: 'var(--text)' }}>Likely cause</th>
            <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Remedy</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([symptom, cause, remedy], i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--hairline)' }}>
              <td className="py-3 pr-6 align-top font-mono text-xs" style={{ color: 'var(--hot)' }}>{symptom}</td>
              <td className="py-3 pr-6 align-top text-sm" style={{ color: 'var(--text-dim)' }}>{cause}</td>
              <td className="py-3 align-top text-sm" style={{ color: 'var(--text-dim)' }}>{remedy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AppTroubleshooting() {
  useDocumentTitle('Troubleshooting — User Guide');
  return (
    <GsLayout chNum="A" title="Troubleshooting">
      <SEO title="Troubleshooting — User Guide" description="OpenAccel troubleshooting: parse failures, parallel failures, convergence problems, unexpected results, and known defects." path="/get-started/troubleshooting" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-10 text-lg">
        This appendix covers the most common failure modes grouped by when they occur.
        Tables A.1–A.5 follow the structure of the printed User Guide (Appendix A).
      </p>

      <H2 id="parse-failures">A.1 — Parse Failures</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Problems caught before the solver starts, during YAML parsing and validation.
      </p>
      <TroubleTable rows={[
        ['Unknown key "…"', 'Typo in a YAML key, or key from an older input-file version.', 'Check spelling; see Chapter 4 for the current key list.'],
        ['Required key "…" missing', 'A key with no default was omitted.', 'Add the key. Required keys are marked with "—" in option tables.'],
        ['Type error: expected real, got string', 'A numeric field received a quoted string.', 'Remove quotes. YAML floats must be unquoted: 1.0, not "1.0".'],
        ['Part "…" not found in mesh', 'Boundary condition references a part name that does not exist.', 'Run with --validate to list all part names in the mesh.'],
        ['material_id "…" not defined', 'Domain references a material not in material_library.', 'Add the material to material_library or correct the name.'],
      ]} />

      <H2 id="parallel-failures">A.2 — Parallel Failures</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Problems that appear only in MPI runs, or that differ between serial and parallel.
      </p>
      <TroubleTable rows={[
        ['Segfault on MPI rank > 0 at startup', 'MPI library mismatch between OpenAccel and Trilinos.', 'Rebuild both with the same MPI installation. Spack upstreams can cause this.'],
        ['Residuals differ between 1 and N ranks', 'Non-reproducible floating-point summation order.', 'Expected behaviour for large N. Use --decompose-seed for reproducible decomposition.'],
        ['Deadlock / hang after mesh partition', 'PnetCDF built with a different MPI than the solver.', 'Rebuild PnetCDF inside the Spack environment.'],
        ['Out of memory on rank 0 for large mesh', 'Serial mesh read concentrates the full mesh on rank 0.', 'Enable parallel_read: true in the mesh block (requires PnetCDF).'],
      ]} />

      <H2 id="convergence">A.3 — Convergence Problems</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Problems where the solver starts but residuals stagnate or diverge.
      </p>
      <TroubleTable rows={[
        ['Residuals plateau above 1e-3', 'CFL too high for the mesh or flow regime.', 'Reduce cfl in solver_control. Try starting at 1 and ramping up.'],
        ['Residuals diverge in first 10 iterations', 'Poor initial conditions or extremely skewed elements.', 'Set velocity initialisation close to the expected flow field. Check mesh quality.'],
        ['Pressure residual stuck, velocity converges', 'Pressure solver tolerance too loose, or wrong BC (no pressure reference).', 'Tighten pressure tolerance. Ensure at least one pressure outlet or reference point.'],
        ['Oscillating residuals that never converge', 'Unsteady flow being solved as steady, or under-resolved mesh.', 'Switch solver_control.type to transient, or refine the mesh.'],
        ['Linear solver fails to converge', 'Preconditioner not suitable for the problem size or condition number.', 'Switch backend to hypre (AMG) for pressure; increase max_iterations.'],
      ]} />

      <H2 id="unexpected-results">A.4 — Unexpected Results</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        The solver converges but results are physically wrong.
      </p>
      <TroubleTable rows={[
        ['Velocity magnitudes ~1000× too high', 'Units mismatch — kinematic_viscosity in cSt instead of m²/s.', 'All inputs are in SI. Convert: 1 cSt = 1e-6 m²/s.'],
        ['Free surface flattens instead of evolving', 'VOF interface sharpening disabled or surface tension zero.', 'Check multiphase.flux_limiter and surface_tension settings.'],
        ['FSI structure does not deform', 'Coupling set to one_way_fluid_to_solid but forces not transmitted.', 'Verify interface parts match between fluid and solid domain BCs.'],
        ['Rotating domain not rotating', 'stationary_parts defect — see Known Defects below.', 'Apply the workaround in Table A.5.'],
      ]} />

      <H2 id="known-defects">A.5 — Known Defects (Release v1.0)</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        These defects are documented as observed rather than as intended. They are present in
        Release v1.0 and have not yet been patched.
      </p>
      <div className="overflow-x-auto mt-4 mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--hairline)' }}>
              <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text)' }}>Key</th>
              <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text)' }}>Defect</th>
              <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Workaround</th>
            </tr>
          </thead>
          <tbody>
            {([
              [
                'sliding_mesh › stationary_parts',
                'Read from the wrong path in the input tree — the key is silently ignored.',
                'Specify the stationary parts under the boundary_conditions of the fluid domain instead.',
              ],
              [
                'interfaces › displacement_interpolation_type',
                'Dead key — accepted at parse time but has no effect. RBF interpolation is always used.',
                'No workaround needed; RBF is the correct choice for most FSI cases.',
              ],
              [
                'mesh › search_method',
                'Not validated at parse time — an invalid value is accepted silently and the default is used.',
                'Use only documented values: "kdtree" or "brute_force".',
              ],
              [
                'interpolation_type: "linear_then_nearest" and "nearest_then_linear"',
                'Both values are accepted by the parser but rejected at runtime when the interpolation is first invoked.',
                'Use "linear" or "nearest" only.',
              ],
            ] as [string, string, string][]).map(([key, defect, workaround], i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td className="py-3 pr-4 align-top font-mono text-xs" style={{ color: 'var(--warm)' }}>{key}</td>
                <td className="py-3 pr-4 align-top text-sm" style={{ color: 'var(--text-dim)' }}>{defect}</td>
                <td className="py-3 align-top text-sm" style={{ color: 'var(--text-dim)' }}>{workaround}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3 id="reporting">Reporting New Issues</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Report bugs and unexpected behaviour via{' '}
        <a href="https://github.com/CCFNUM/OpenAccel/issues" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--cold)' }} className="underline underline-offset-4">
          GitHub Issues
        </a>. Include the input file, the full solver output, and the OpenAccel version
        (<code>./build/OpenAccel --version</code>).
      </p>

      <TodoBlock label="Additional troubleshooting entries will be added here as new defects and failure modes are documented." />
    </GsLayout>
  );
}
