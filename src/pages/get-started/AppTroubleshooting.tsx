import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { Caption } from '@/components/Caption';
import { GsLayout, H2 } from './GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;
const tdBorder = { borderBottom: '1px solid var(--table-border)' } as const;

function SymptomCauseTable({ label, caption, rows }: { label: string; caption: string; rows: [React.ReactNode, React.ReactNode][] }) {
  return (
    <figure className="my-4">
      <Caption label={label} className="mb-2">{caption}</Caption>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 font-medium" style={thStyle}>Symptom</th>
              <th className="text-left py-2 px-3 font-medium" style={thStyle}>Cause</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([symptom, cause], i) => (
              <tr key={i} style={tdBorder}>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{symptom}</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{cause}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export function AppTroubleshooting() {
  useDocumentTitle('Troubleshooting — User Guide');
  return (
    <GsLayout chNum="A" title="Troubleshooting">
      <SEO
        title="Troubleshooting — User Guide"
        description="Parse and start-up failures, parallel failures, convergence and divergence, unexpected results, and known source defects."
        path="/get-started/troubleshooting"
      />

      <H2 id="parse-failures" num="A.1">Parse and start-up failures</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        These failures occur while the input file and mesh are being read, before the first
        iteration. In several cases the message text names the wrong key, so the table below gives
        the actual cause alongside the reported symptom.
      </p>
      <SymptomCauseTable
        label="Table A.1"
        caption="Failures occurring before the first iteration."
        rows={[
          [<>Mesh path reported missing although <code>mesh</code> is present</>, <><code>mesh</code> nested inside <code>simulation</code>. It is a sibling, not a child.</>],
          ['Parse error on a transient run', <><code>transient_scheme</code> missing; required for transient analyses despite having a documented default.</>],
          [<>Error names <code>convergence_controls</code> although that block is present</>, <>The missing block is actually <code>convergence_criteria</code>; the message text is wrong.</>],
          [<>Error refers to a <code>boundary_conditions</code> key</>, <>The required key is <code>boundaries</code>; the hint text is stale.</>],
          [<>Error names a missing reference <em>density</em> in a Boussinesq case</>, <>The missing key is <code>buoyancy_reference_temperature</code>; the message text is wrong.</>],
          [<>Type error on <code>output_frequency</code></>, 'A map was given for a steady run, or a scalar for a transient run.'],
        ]}
      />

      <H2 id="parallel-failures" num="A.2">Parallel failures</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The failures in the table below affect parallel runs only; the same case run on a single
        rank completes normally. That asymmetry is itself the clearest diagnostic, and points to
        mesh decomposition rather than to the physics.
      </p>
      <SymptomCauseTable
        label="Table A.2"
        caption="Failures affecting parallel runs only."
        rows={[
          ['Every parallel case aborts at zero iterations; serial cases pass', 'Automatic decomposition unavailable. Either the mesh is already decomposed, or Trilinos was built against a serial netCDF.'],
          [<>Exodus error naming a per-rank file such as <code>mesh.e.4.0</code></>, 'The solver fell back to looking for a pre-decomposed mesh because runtime decomposition was refused.'],
          ['Scattered rather than contiguous partitions', 'A 64-bit mesh was decomposed without the 32-bit conversion.'],
        ]}
      />

      <H2 id="convergence" num="A.3">Convergence and divergence</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The table below covers runs that start correctly but fail to reach a solution. Most such
        failures trace back to a stability limit that was satisfied on the original configuration
        and violated after a change of mesh or time step.
      </p>
      <SymptomCauseTable
        label="Table A.3"
        caption="Failures during the solve."
        rows={[
          ['Diverges within a few iterations', 'Relaxation factors omitted; every factor defaults to 1.0, which is no relaxation at all.'],
          ['Diverges after mesh refinement', 'Pseudo-timescale or time step no longer matched to the cell size, or the pressure solve is now under-resolved.'],
          [<>Run stops at exactly <code>max_iterations</code></>, 'Not converged; the iteration budget was exhausted. Check the final residual.'],
          ['Free-surface case explodes after a violent event', 'Courant number exceeded the MULES stability limit. Use adaptive time stepping with a target of 0.3 or lower.'],
          ['Instability never develops from a quiescent field', 'The motionless state is itself a valid fixed point. Seed the initial field with a small perturbation.'],
        ]}
      />

      <H2 id="unexpected-results" num="A.4">Unexpected results</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The hardest failures are those that produce a converged but incorrect answer. The table
        below lists the settings that most often change a result without any accompanying warning.
      </p>
      <SymptomCauseTable
        label="Table A.4"
        caption="Runs that complete but produce the wrong answer."
        rows={[
          ['Solution changed after an apparently unrelated edit', <>Check <code>advection_scheme</code> and <code>velocity_interpolation_type</code>. Both change the converged solution, not merely the path to it.</>],
          ['Iteration count differs between identical runs', 'Expected behaviour. Decomposition, rank count and library version all perturb rounding. Compare results, not counts.'],
          ['A setting appears to be ignored', <>Check for a silent fallback: <code>curvature_smoothing_method</code>, <code>belos_solver</code> and <code>preconditioner</code> all accept invalid values without complaint.</>],
          ['Transition model produces no laminar region', <><code>transitional_turbulence</code> not set to <code>true</code>; the case is running fully turbulent SST.</>],
          ['Interface option appears to have no effect', <>The option belongs to the inactive non-conformal method. Check <code>expert_parameters &gt; non_conformal_method</code>.</>],
          ['Per-interface non-conformal setting ignored', 'The method is global and cannot be set per interface.'],
        ]}
      />

      <H2 id="known-defects" num="A.5">Known source defects</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The table below records defects present in the current release, documented as observed
        rather than as intended. Each has a workaround; all are expected to be corrected in a
        future release.
      </p>
      <figure className="my-4">
        <Caption label="Table A.5" className="mb-2">Defects present in the current release, documented as observed.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Key</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Defect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['stationary_parts', <>Presence is checked under <code>mesh_deformation</code> but the value is read from <code>domain_motion</code>. Declare it under <code>domain_motion</code>.</>],
                ['displacement_interpolation_type', 'Dead key. The struct field and enum map exist but no parser ever reads it. Use the gradient variant.'],
                ['search_method', 'Not validated at parse time. An unsupported value causes an abrupt exit during the solve.'],
                ['interpolation_type', <><code>piecewise_linear</code> and <code>b_spline</code> are accepted by the string table but rejected at run time.</>],
              ].map(([key, defect]) => (
                <tr key={key as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{key}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{defect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </GsLayout>
  );
}
