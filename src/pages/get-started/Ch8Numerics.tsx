import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { YamlTree } from '@/components/YamlTree';
import { InputMap, NodeTree, type TreeNode } from '@/components/InputMap';
import { Caption } from '@/components/Caption';
import { Equation } from '@/components/tutorial/Equation';
import { GsLayout, H2, H3, Callout } from './GsLayout';
import 'katex/dist/katex.min.css';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;
const tdBorder = { borderBottom: '1px solid var(--table-border)' } as const;

const SOLVER_CONTROL_TREE: TreeNode = {
  id: 'solver_control', label: 'solver_control',
  children: [
    { id: 'basic_settings', label: 'basic_settings', note: 'required' },
    { id: 'advanced_options', label: 'advanced_options', note: 'optional' },
    { id: 'expert_parameters', label: 'expert_parameters', note: 'optional' },
  ],
};

const BASIC_SETTINGS_TREE: TreeNode = {
  id: 'basic_settings', label: 'basic_settings',
  children: [
    { id: 'advection_scheme', label: 'advection_scheme' },
    { id: 'turbulence_numerics', label: 'turbulence_numerics' },
    { id: 'transient_scheme', label: 'transient_scheme', note: 'transient runs only' },
    { id: 'convergence_controls', label: 'convergence_controls' },
    { id: 'convergence_criteria', label: 'convergence_criteria' },
    { id: 'interpolation_scheme', label: 'interpolation_scheme' },
  ],
};

const ADVANCED_OPTIONS_TREE: TreeNode = {
  id: 'advanced_options', label: 'advanced_options',
  children: [
    { id: 'pressure_level_information', label: 'pressure_level_information' },
    { id: 'interface_transfer', label: 'interface_transfer' },
    {
      id: 'equation_controls', label: 'equation_controls',
      children: [
        { id: 'sub_iterations', label: 'sub_iterations', conditional: true },
        { id: 'volume_fraction_smoothing', label: 'volume_fraction_smoothing', conditional: true },
        { id: 'mesh_motion', label: 'mesh_motion', conditional: true },
        { id: 'acceleration', label: 'acceleration', conditional: true },
      ],
    },
    {
      id: 'linear_solver_settings', label: 'linear_solver_settings',
      children: [
        { id: 'default', label: 'default', conditional: true },
        { id: 'pressure_correction', label: 'pressure_correction', conditional: true },
      ],
    },
  ],
};

/** The manual's pseudo-timescale bar diagram (Figure 8.4): three zones on a small-to-large scale. */
function PseudoTimescaleBar() {
  return (
    <div className="my-6 rounded-md border overflow-x-auto p-4" style={{ borderColor: 'var(--hairline)', background: 'var(--surface-2)' }}>
      <div className="min-w-max">
        <div className="flex items-center justify-between font-mono text-xs mb-2" style={{ color: 'var(--text-dim)' }}>
          <span>small</span>
          <span>large</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded p-3 text-center text-xs" style={{ border: '1px solid var(--src)', color: 'var(--src)' }}>
            <strong>Over-damped</strong><br />stable but slow
          </div>
          <div className="rounded p-3 text-center text-xs" style={{ border: '1px solid var(--map-highlight)', color: 'var(--map-highlight)' }}>
            <strong>Target range</strong><br /><Equation math="L/3U" display={false} /> to <Equation math="L/U" display={false} />
          </div>
          <div className="rounded p-3 text-center text-xs" style={{ border: '1px solid var(--hairline)', color: 'var(--text-dim)' }}>
            <strong>Under-damped</strong><br />fast, then divergent
          </div>
        </div>
        <p className="text-center mt-2 text-xs" style={{ color: 'var(--text-dim)' }}><Equation math="\Delta t_{ps}" display={false} /></p>
      </div>
    </div>
  );
}

export function Ch8Numerics() {
  useDocumentTitle('Numerics and Solver Control — User Guide');
  return (
    <GsLayout chNum="8" title="Numerics and Solver Control">
      <SEO
        title="Numerics and Solver Control — User Guide"
        description="solver_control: discretisation schemes, the pseudo-timescale, convergence machinery, advanced options, expert parameters, and linear solvers."
        path="/get-started/numerics"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        This chapter covers <code>solver_control</code>: the discretisation schemes, the
        convergence machinery, and the linear solvers. Output and restart, which are siblings of{' '}
        <code>solver_control</code> under <code>solver</code>, are documented separately in{' '}
        <a href="/get-started/output">Chapter 10</a>.
      </p>

      <H2 id="location" num="8.1">Location in the input file</H2>

      <figure className="my-6">
        <InputMap highlight="solver" />
        <Caption label="Figure 8.1" className="mt-2">
          Position of the solver block. This chapter covers <code>solver_control</code>;{' '}
          <code>output_control</code> and <code>restart_control</code> are covered in{' '}
          <a href="/get-started/output">Chapter 10</a>.
        </Caption>
      </figure>

      <figure className="my-6">
        <NodeTree root={SOLVER_CONTROL_TREE} highlightId="solver_control" />
        <Caption label="Figure 8.2" className="mt-2">The three children of solver_control.</Caption>
      </figure>

      <H2 id="quick-reference" num="8.2">Quick reference</H2>

      <figure className="my-4">
        <Caption label="Table 8.1" className="mb-2">Options that require attention in almost every case.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Reason to change</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['advection_scheme', 'upwind', 'default is stable but diffusive'],
                ['max_iterations', '100', 'rarely enough for a steady run'],
                ['residual_target', '1e-4', <>loose; tighten to <Equation math="10^{-6}" display={false} /> or below</>],
                ['physical_timescale', '1.0', 'must be scaled to the domain'],
                ['velocity_relaxation_factor', '1.0', '1.0 means no relaxation at all'],
                ['pressure_relaxation_factor', '1.0', 'as above, unless SIMPLEC is enabled'],
                ['transient_scheme', '—', 'required for every transient run'],
              ].map(([opt, def, reason], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="basic-settings" num="8.3">Basic settings</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>basic_settings</code> is mandatory, and has five children.
      </p>

      <figure className="my-6">
        <NodeTree root={BASIC_SETTINGS_TREE} highlightId="basic_settings" />
        <Caption label="Figure 8.3" className="mt-2">Children of basic_settings, with the section documenting each.</Caption>
      </figure>

      <H3 id="advection-schemes" num="8.3.1">Advection schemes</H3>

      <figure className="my-4">
        <Caption label="Table 8.2" className="mb-2">Advection scheme for the mean-flow equations: momentum, energy and volume fraction.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of advection_scheme</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['upwind', '✓', 'First order. Unconditionally bounded; introduces numerical diffusion proportional to the cell size.'],
                ['high_resolution', '', 'Second order in smooth regions, reverting toward first order near extrema through the Barth–Jespersen limiter.'],
              ].map(([v, d, desc]) => (
                <tr key={v} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top text-center" style={{ color: 'var(--text-dim)' }}>{d}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 8.3" className="mb-2">
          Advection scheme for the turbulence transport equations: <Equation math="k" display={false} />,{' '}
          <Equation math="\omega" display={false} />, <Equation math="\varepsilon" display={false} />,{' '}
          <Equation math="\gamma" display={false} /> and <Equation math="Re_{\theta t}" display={false} />.
          The same two values apply.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of turbulence_numerics</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['upwind', '✓', 'First order, bounded, diffusive.'],
                ['high_resolution', '', 'Second order with limiter.'],
              ].map(([v, d, desc]) => (
                <tr key={v} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top text-center" style={{ color: 'var(--text-dim)' }}>{d}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        <strong style={{ color: 'var(--text)' }}>General practice.</strong> First-order upwind is
        unconditionally bounded but adds diffusion scaling with the mesh size; a second-order scheme
        is required for results reported quantitatively. The common workflow is to start a difficult
        case on <code>upwind</code> for robustness and switch to <code>high_resolution</code> once
        the solution is established. Leaving the turbulence equations on <code>upwind</code> while
        the mean flow uses <code>high_resolution</code> is a standard and defensible combination.
      </Callout>
      <Callout type="warning">
        The two schemes converge to <strong style={{ color: 'var(--text)' }}>different
        solutions</strong> on the same mesh &mdash; this is not a difference in convergence path.
        Always record which scheme produced a reported result.
      </Callout>

      <H3 id="time-integration" num="8.3.2">Time integration</H3>

      <figure className="my-4">
        <Caption label="Table 8.4" className="mb-2">Time integration scheme. Read only for transient analyses.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of transient_scheme</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['first_order_backward_euler', '✓', 'Unconditionally stable, strongly damping. Recommended for a first run.'],
                ['second_order_backward_euler', '', 'More accurate, less damping; may oscillate if the time step is too large.'],
              ].map(([v, d, desc]) => (
                <tr key={v} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top text-center" style={{ color: 'var(--text-dim)' }}>{d}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        Although this option has a documented default, the parser <strong style={{ color: 'var(--text)' }}>requires</strong>{' '}
        it for transient analyses and aborts if it is absent. It is ignored for steady-state
        analyses.
      </Callout>

      <H3 id="convergence-controls" num="8.3.3">Convergence controls</H3>

      <figure className="my-4">
        <Caption label="Table 8.5" className="mb-2">Iteration limits and pseudo-time step, under convergence_controls.</Caption>
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
                ['min_iterations', '1', 'Minimum outer iterations before convergence is accepted.'],
                ['max_iterations', '100', 'Steady: total outer iteration cap. Transient: cap per time step.'],
                ['physical_timescale', '1.0', <>Pseudo-time step, steady analyses only; see <a href="#pseudo-timescale">The pseudo-timescale</a> below.</>],
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

      <Callout type="note">
        A steady run that stops at exactly <code>max_iterations</code> has not converged &mdash; it
        has exhausted its budget. Always check the final residual.
      </Callout>

      <H3 id="under-relaxation">Under-relaxation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        All factors sit under <code>convergence_controls &gt; relaxation_parameters</code>. All are
        optional and all default to <code>1.0</code>.
      </p>

      <figure className="my-4">
        <Caption label="Table 8.6" className="mb-2">Under-relaxation factors.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Typical</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Applies to</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['velocity_relaxation_factor', '1.0', '0.7', 'Momentum equations'],
                ['pressure_relaxation_factor', '1.0', '0.3', 'Pressure correction'],
                ['energy_relaxation_factor', '1.0', '0.9', 'Energy equation'],
                ['turbulence_relaxation_factor', '1.0', '0.7', 'Turbulence transport'],
                ['solid_displacement_relaxation_factor', '1.0', '0.8', 'Solid mechanics'],
                ['relax_mass', '1.0', '1.0', 'Mass source'],
                ['wall_scale_relaxation_factor', '1.0', '1.0', 'Wall-distance field'],
              ].map(([opt, def, typ, applies]) => (
                <tr key={opt} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top text-center" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top text-center" style={{ color: 'var(--text-dim)' }}>{typ}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{applies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        <strong style={{ color: 'var(--text)' }}>Every factor defaults to 1.0, which is no
        relaxation whatsoever.</strong> An input file that omits <code>relaxation_parameters</code>{' '}
        is not falling back on safe defaults; it is running fully unrelaxed. Values above 1.0 are
        rejected only in debug builds &mdash; a release build accepts them silently and will very
        likely diverge.
      </Callout>
      <Callout type="note">
        When SIMPLEC is enabled (see <a href="#pv-coupling">Pressure–velocity coupling</a> below),
        pressure under-relaxation is not required and <code>pressure_relaxation_factor</code> is
        normally left at 1.0.
      </Callout>

      <H3 id="convergence-criteria" num="8.3.4">Convergence criteria</H3>

      <figure className="my-4">
        <Caption label="Table 8.7" className="mb-2">Residual convergence criteria, under convergence_criteria.</Caption>
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
                ['residual_type', 'RMS', 'Root-mean-square norm; currently the only accepted value.'],
                ['residual_target', '1e-4', <>Convergence threshold. <Equation math="10^{-6}" display={false} /> is a practical minimum; validation work typically uses <Equation math="10^{-8}" display={false} /> or tighter.</>],
              ].map(([opt, def, desc], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 8.8" className="mb-2">
          Optional physics-based convergence tests for fluid–structure interaction, under{' '}
          <code>convergence_criteria &gt; physics_convergence</code>.
        </Caption>
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
                ['enabled', 'false', 'Master switch for the block.'],
                ['write_residuals', 'false', 'Report physics residuals in the run log.'],
                ['criteria', 'empty', <>Active tests: <code>fsi_interface_residual</code>, <code>fsi_force_residual</code>.</>],
                ['fsi_interface_residual', '1e-3', <>Under <code>targets</code>; tolerance on interface displacement.</>],
                ['fsi_force_residual', '1e-3', <>Under <code>targets</code>; tolerance on interface force.</>],
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

      <Callout type="tip">
        <strong style={{ color: 'var(--text)' }}>Iteration counts are not reproducible.</strong> Two
        runs of an identical input file can differ by hundreds of iterations, because domain
        decomposition, MPI rank count and linear-algebra library version all perturb rounding near a
        tight target, where the residual curve is nearly flat. Compare converged{' '}
        <em>results</em>, never iteration counts.
      </Callout>

      <H3 id="interpolation-schemes" num="8.3.5">Interpolation schemes</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The optional <code>interpolation_scheme</code> block controls how nodal values are
        reconstructed at the sub-control-surface integration points.
      </p>

      <figure className="my-4">
        <Caption label="Table 8.9" className="mb-2">Comparison of the two interpolation schemes.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Property</th>
                <th className="text-left py-2 px-3 font-mono font-medium" style={thStyle}>trilinear</th>
                <th className="text-left py-2 px-3 font-mono font-medium" style={thStyle}>linear_linear</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Stencil', 'Full element support (Q1 shape functions)', 'Compact, shifted integration point'],
                ['Accuracy', 'Higher', 'Lower'],
                ['Damping', 'Lower', 'Higher'],
                ['Diagonal dominance', 'Weaker', 'Stronger'],
                ['Typical use', 'Accuracy-driven runs', 'Suppressing checkerboard pressure modes'],
              ].map(([prop, tri, lin]) => (
                <tr key={prop} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{prop}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{tri}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{lin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <p style={{ color: 'var(--text-dim)' }}>All keys follow one naming pattern:</p>
      <div className="my-4 text-center font-mono text-sm" style={{ color: 'var(--text-dim)' }}>
        <code>&lt;field&gt;_interpolation_type</code>
        <br className="sm:hidden" />
        <span className="hidden sm:inline">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <code>&lt;field&gt;_gradient_interpolation_type</code>
      </div>
      <p style={{ color: 'var(--text-dim)' }}>where the field is one of:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2" style={{ color: 'var(--text-dim)' }}>
        <li><code>velocity</code>, <code>pressure</code>, <code>temperature</code></li>
        <li><code>turbulent_kinetic_energy</code>, <code>turbulent_eddy_frequency</code>, <code>turbulent_dissipation_rate</code></li>
        <li><code>turbulent_intermittency</code>, <code>transition_onset_reynolds_number</code></li>
        <li><code>wall_scale</code>, <code>volume_fraction</code></li>
        <li><code>displacement</code> (gradient form only)</li>
      </ul>

      <Callout type="warning">
        <strong style={{ color: 'var(--text)' }}>Velocity is the single exception to the
        default.</strong> Every interpolation key defaults to <code>linear_linear</code> except{' '}
        <code>velocity_interpolation_type</code>, which defaults to <code>trilinear</code>. A case
        setting it to <code>linear_linear</code> is deliberately requesting the damped, compact
        stencil &mdash; removing that line alters the mass fluxes and therefore the solution.
      </Callout>
      <Callout type="note">
        Element geometry and Jacobians always use standard trilinear shape functions. These options
        affect field reconstruction only, never the mesh mapping.
      </Callout>

      <H2 id="pseudo-timescale" num="8.4">The pseudo-timescale</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A steady analysis has no time derivative. The solver introduces a fictitious transient term
        that is driven to zero as the solution converges:
      </p>

      <Equation
        label="8.1"
        math={String.raw`\frac{\rho V}{\Delta t_{ps}}\left(\phi^{\,n}-\phi^{\,n-1}\right) + \mathcal{L}\!\left[\phi^{\,n}\right] = S`}
      />

      <p style={{ color: 'var(--text-dim)' }}>
        The term adds <Equation math="\rho V/\Delta t_{ps}" display={false} /> to the diagonal of
        every cell equation. It changes how quickly the solution converges, never what it converges
        to.
      </p>

      <figure className="my-6">
        <PseudoTimescaleBar />
        <Caption label="Figure 8.4" className="mt-2">Effect of the pseudo-timescale on convergence behaviour.</Caption>
      </figure>

      <figure className="my-4">
        <Caption label="Table 8.10" className="mb-2">Selecting a pseudo-timescale.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Problem type</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Scale to</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Justification</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Advection dominated', <Equation math="L/U" display={false} />, <>Domain residence time; <Equation math="L" display={false} /> is the streamwise length and <Equation math="U" display={false} /> a representative velocity.</>],
                ['Diffusion dominated', <Equation math="L^{2}/\alpha" display={false} />, <>Diffusive time, <Equation math="\alpha=\lambda/\rho c_p" display={false} />.</>],
                ['Conjugate or multi-domain', 'slowest of the above', 'Convergence is gated by the slowest physical process present.'],
              ].map(([type, scale, just], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{type}</td>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{scale}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{just}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 8.11" className="mb-2">Diagnosing an incorrect pseudo-timescale from the residual history.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Residual behaviour</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Smooth, monotone, but very slow decay', <>Increase <Equation math="\Delta t_{ps}" display={false} /> by a factor of 2 to 5.</>],
                ['Plateau, oscillation, or upward spikes', <>Decrease <Equation math="\Delta t_{ps}" display={false} />.</>],
              ].map(([behaviour, action], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{behaviour}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="advanced-options" num="8.5">Advanced options</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>advanced_options</code> has four children. Two are plain option blocks; the other two
        are containers.
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-2" style={{ color: 'var(--text-dim)' }}>
        <li><code>equation_controls</code> groups settings acting on individual transport equations:
          how many inner passes each takes, how the volume fraction is smoothed, how the
          mesh-motion equation is solved, and how the coupling between equations is accelerated.</li>
        <li><code>linear_solver_settings</code> assigns a linear solver configuration to each
          equation by name.</li>
      </ul>

      <figure className="my-6">
        <NodeTree root={ADVANCED_OPTIONS_TREE} highlightId="advanced_options" />
        <Caption label="Figure 8.5" className="mt-2">
          Structure of advanced_options. equation_controls and linear_solver_settings are siblings;
          the named solver blocks sit inside linear_solver_settings, keyed by equation name.
        </Caption>
      </figure>

      <YamlTree
        label="Figure 8.6"
        caption="Skeleton of advanced_options, one representative option per block."
        lines={[
          { indent: 0, key: 'advanced_options:' },
          { indent: 1, key: 'pressure_level_information:' },
          { indent: 2, text: 'option: automatic' },
          { indent: 2, dots: true },
          { indent: 1, key: 'interface_transfer:' },
          { indent: 2, text: 'search_tolerance: 1.0e-4' },
          { indent: 2, dots: true },
          { indent: 1, key: 'equation_controls:' },
          { indent: 2, key: 'sub_iterations:' },
          { indent: 3, text: 'pressure_correction: 1' },
          { indent: 3, dots: true },
          { indent: 2, key: 'volume_fraction_smoothing:' },
          { indent: 3, text: 'smooth_volume_fraction: false' },
          { indent: 3, dots: true },
          { indent: 2, key: 'mesh_motion:' },
          { indent: 3, text: 'freeze_per_timestep: true' },
          { indent: 3, dots: true },
          { indent: 2, key: 'acceleration:' },
          { indent: 3, key: 'solid_displacement:' },
          { indent: 4, text: 'option: iqn_ils' },
          { indent: 4, dots: true },
          { indent: 1, key: 'linear_solver_settings:' },
          { indent: 2, key: 'default:' },
          { indent: 3, text: 'family: PETSc' },
          { indent: 3, dots: true },
          { indent: 2, key: 'pressure_correction:' },
          { indent: 3, text: 'family: HYPRE' },
          { indent: 3, dots: true },
        ]}
      />

      <H3 id="pressure-level" num="8.5.1">Pressure level</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        In a domain with no pressure boundary &mdash; one bounded entirely by walls and velocity
        inlets &mdash; the pressure is determined only up to an additive constant, and the solver
        must pin it somewhere. The table below lists the options governing where that datum is
        placed and what value is imposed there.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.12" className="mb-2">pressure_level_information — pins the pressure datum in closed domains.</Caption>
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
                ['option', 'automatic', <>Alternative: <code>cartesian_coordinates</code>, which pins the datum at a given point.</>],
                ['cartesian_coordinates', 'zeros', <>Pin location. Required when <code>option</code> is <code>cartesian_coordinates</code>.</>],
                ['relative_pressure_level', '0.0', 'Pressure value imposed at the pin.'],
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

      <H3 id="interface-transfer" num="8.5.2">Interface transfer</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Before an interface can transfer data, the faces on its two sides must be paired
        geometrically. The table below lists the options controlling that search. The tolerance is
        the one most often adjusted, because a mesh whose two sides were generated independently
        rarely matches to the default precision.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.13" className="mb-2">interface_transfer — the geometric search pairing non-conformal interface sides.</Caption>
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
                ['search_tolerance', '1e-4', 'Geometric tolerance for pairing. Increase if pairing fails on an imperfect mesh.'],
                ['search_expansion_factor', '1.5', 'Bounding-box growth during the search.'],
                ['force_research', 'false', 'Repeats the search every time step rather than reusing the previous pairing.'],
                ['conservative_flux_transfer', 'false', 'Enforces strict conservation across the interface, at the cost of interpolation smoothness.'],
                ['verbose', '0', 'Diagnostic output level.'],
              ].map(([opt, def, desc], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="equation-controls" num="8.5.3">Equation controls</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>equation_controls</code> groups settings that act on individual transport equations
        rather than on the solution as a whole. It has four children: sub-iteration counts,
        volume-fraction smoothing, mesh-motion controls and convergence acceleration.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        Sub-iterations repeat one equation several times within a single outer iteration. Raising
        the count for a particular equation is a targeted alternative to lowering its relaxation
        factor: it buys stability in the equation that needs it without slowing the rest of the
        solve.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.14" className="mb-2">equation_controls &gt; sub_iterations — inner passes per outer iteration.</Caption>
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
                ['pressure_correction', '1', 'Extra passes stabilise strongly coupled pressure fields.'],
                ['solid_displacement', '1', 'Extra passes assist stiff solid mechanics.'],
                ['segregated_flow', '1', 'Repeats the whole momentum–pressure sequence.'],
                ['volume_fraction', '1', 'Extra passes sharpen the free-surface interface.'],
              ].map(([opt, def, desc], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 8.15" className="mb-2">equation_controls &gt; volume_fraction_smoothing — free-surface runs only.</Caption>
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
                ['smooth_volume_fraction', 'false', 'Master switch.'],
                ['smoothing_iterations', '3', 'Smoothing passes applied to the volume fraction.'],
                ['fourier_number', '0.25', 'Diffusion number controlling smoothing strength per pass.'],
                ['curvature_smoothing_iterations', '40', 'Passes applied to the interface curvature used by surface tension.'],
                ['curvature_smoothing_method', 'box_average', <>Alternative: <code>laplacian</code>.</>],
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
        <code>curvature_smoothing_method</code> is compared literally against the text{' '}
        <code>laplacian</code>. Any other value &mdash; including a misspelling &mdash; silently
        selects box-average smoothing. No warning is issued.
      </Callout>

      <figure className="my-4">
        <Caption label="Table 8.16" className="mb-2">equation_controls &gt; mesh_motion — deforming-mesh runs only.</Caption>
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
                ['freeze_per_timestep', 'true', 'Solves the mesh motion once per time step rather than every outer iteration.'],
                ['max_smoothing_iters', '5', 'Smoothing passes applied to the deformed mesh.'],
              ].map(([opt, def, desc], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="convergence-acceleration">Convergence acceleration</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>equation_controls &gt; acceleration</code> applies a convergence accelerator to one or
        more equations, keyed by the equation&rsquo;s canonical name &mdash; the same vocabulary used
        by <code>linear_solver_settings</code>. Two accelerators are available: Aitken&rsquo;s
        dynamic relaxation, and the interface quasi-Newton method with an inverse-Jacobian from a
        least-squares model (IQN-ILS). Both act on the fixed-point iteration between coupled
        equations, and both are most useful on the strongly coupled sub-problems &mdash; the
        pressure&ndash;velocity system, and, above all, the displacement equation in a
        fluid&ndash;structure interaction.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        The block is silently skipped in its entirety if it is absent, if the named equation is
        absent, or if that equation&rsquo;s <code>option</code> is absent or set to{' '}
        <code>none</code>. Acceleration therefore has to be requested explicitly; there is no
        default accelerator on any equation.
      </p>

      <figure className="my-4">
        <Caption label="Table 8.17" className="mb-2">
          Convergence acceleration options, under{' '}
          <code>equation_controls &gt; acceleration &gt; &lt;equation&gt;</code>. Grouped by the
          accelerator that uses them.
        </Caption>
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
              <tr style={{ background: 'var(--surface-2)' }}>
                <td colSpan={3} className="py-1.5 px-3 text-xs font-semibold italic" style={{ color: 'var(--text-dim)' }}>
                  Common — both aitken and iqn_ils
                </td>
              </tr>
              {[
                ['option', 'none', <><code>none</code>, <code>aitken</code> or <code>iqn_ils</code>. Required to activate the block; <code>none</code> makes it a no-op.</>],
                ['initial_omega', '1.0', 'Relaxation factor applied on the first coupling iteration of each step, before either accelerator has history to work from.'],
              ].map(([opt, def, desc]) => (
                <tr key={opt as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
              <tr style={{ background: 'var(--surface-2)' }}>
                <td colSpan={3} className="py-1.5 px-3 text-xs font-semibold italic" style={{ color: 'var(--text-dim)' }}>Aitken only</td>
              </tr>
              {[
                ['omega_min', '0.1', 'Lower bound on the dynamically computed Aitken relaxation factor.'],
                ['omega_max', '1.0', 'Upper bound on the dynamically computed Aitken relaxation factor.'],
              ].map(([opt, def, desc], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
              <tr style={{ background: 'var(--surface-2)' }}>
                <td colSpan={3} className="py-1.5 px-3 text-xs font-semibold italic" style={{ color: 'var(--text-dim)' }}>IQN-ILS only</td>
              </tr>
              {[
                ['iqn_ils_window', '5', 'Number of past coupling iterations retained in the least-squares model.'],
                ['iqn_ils_filter_threshold', '1e-10', 'Threshold below which near-parallel columns are filtered from the model.'],
                ['iqn_ils_reuse_across_timesteps', 'false', 'Carries the model from one time step into the next rather than rebuilding it.'],
              ].map(([opt, def, desc], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 8.7"
        caption="IQN-ILS acceleration applied to the solid-displacement equation of an FSI coupling."
        lines={[
          { indent: 0, key: 'advanced_options:' },
          { indent: 1, key: 'equation_controls:' },
          { indent: 2, key: 'acceleration:' },
          { indent: 3, key: 'solid_displacement:' },
          { indent: 4, text: 'option: iqn_ils' },
          { indent: 4, text: 'initial_omega: 0.5' },
          { indent: 4, text: 'iqn_ils_window: 5' },
          { indent: 4, text: 'iqn_ils_filter_threshold: 1.0e-10' },
          { indent: 4, text: 'iqn_ils_reuse_across_timesteps: false' },
        ]}
      />

      <Callout type="tip">
        For a partitioned FSI coupling, IQN-ILS is the accelerator to reach for first: on a
        well-posed interface it converges in a handful of coupling iterations, where fixed-point
        relaxation would need dozens. Aitken is the lighter fallback &mdash; no history to store,
        robust, but slower. During a violent impact, keep <code>omega_min</code> from dropping too
        far (below roughly <Equation math="0.1" display={false} />): if the relaxation collapses in the noisy phase, the structure stops
        responding to the fluid load and the coupling stalls.
      </Callout>

      <H3 id="linear-solver-assignment" num="8.5.4">Linear solver assignment</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>linear_solver_settings</code> holds one named block per equation; the full set of
        linear-solver options is documented in{' '}
        <a href="#linear-solvers">Linear solvers</a> below.
      </p>

      <H2 id="expert-parameters" num="8.6">Expert parameters</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        These options change the algorithm rather than tuning it. The defaults are the recommended
        settings for general use.
      </p>

      <H3 id="pv-coupling" num="8.6.1">Pressure–velocity coupling</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Three algorithms are available for coupling the momentum and continuity equations, selected
        by the two mutually exclusive flags in the table below. Setting neither gives standard
        SIMPLE, which is the default and the appropriate choice for most cases.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.18" className="mb-2">Pressure–velocity coupling algorithm.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Algorithm</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['SIMPLE', '(neither set)', '—', 'Standard segregated coupling.'],
                ['SIMPLEC', 'consistent', 'false', <>Retains neighbour terms in the velocity correction; permits{' '}
                  <Equation math="\lambda^{p}\approx 1" display={false} />.</>],
                ['Fractional step', 'fractional_step_method', 'false', 'Projection method in place of the pressure-correction sequence.'],
              ].map(([alg, opt, def, effect], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{alg}</td>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        <code>consistent</code> and <code>fractional_step_method</code> are mutually exclusive.
        Setting both <code>true</code> is a parse-time error.
      </Callout>

      <p style={{ color: 'var(--text-dim)' }}>
        SIMPLEC differs from SIMPLE in one coefficient. Standard SIMPLE forms the velocity-correction
        coefficient as <Equation math="d = A/a_P" display={false} />, discarding the neighbour
        contributions; SIMPLEC retains them, giving{' '}
        <Equation math="\tilde{d} = A/\left(a_P - \sum a_{nb}\right)" display={false} />. The larger{' '}
        <Equation math="\tilde{d}" display={false} /> is applied to the left-hand side, where it
        strengthens the pressure-correction operator, while the right-hand side keeps the standard{' '}
        <Equation math="d" display={false} /> so the converged mass balance stays exact. Both
        formulations share the same solution; SIMPLEC reaches it in fewer iterations.
      </p>

      <H3 id="gradient-treatment" num="8.6.2">Gradient treatment</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Gradient reconstruction is the noisiest step in a finite-volume assembly. On skewed cells, or
        near a discontinuity, the computed gradient can swing substantially between outer iterations
        even while the field itself is settling, and that noise propagates into the advection scheme
        and the pressure&ndash;velocity coupling. The four options in the table below control how
        the reconstruction is damped and limited.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.19" className="mb-2">Gradient reconstruction options.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['relax_gradients', 'true', 'Blends the new gradient with the previous outer iteration, damping reconstruction noise. Disabling forces fully un-relaxed gradients.'],
                ['limit_gradients', 'false', 'Applies a limiter to the reconstructed gradient, preventing overshoot near discontinuities.'],
                ['correct_gradients', 'false', 'Applies a non-orthogonality correction on skewed meshes.'],
                ['incremental_gradient_change', 'true', 'Updates the gradient incrementally rather than recomputing it from scratch each iteration.'],
              ].map(([opt, def, effect]) => (
                <tr key={opt} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        Gradient relaxation is <strong style={{ color: 'var(--text)' }}>enabled</strong> by default.
        A case containing <code>relax_gradients: false</code> is disabling damping that is normally
        active. If such a case becomes unstable after mesh refinement, removing that line is the
        cheapest remedy to try.
      </Callout>

      <H3 id="stabilisation" num="8.6.3">Stabilisation and source terms</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The options in the table below add or remove individual terms in the assembled equations.
        Most exist to stabilise a specific class of problem &mdash; compressible flow, free
        surfaces, rotating frames &mdash; and the defaults are correct for general use. Change one
        only when the physics of the case calls for it.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.20" className="mb-2">Stabilisation, source-term and equation-level options.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['nonlinear_stabilisation', 'false', 'Enables non-linear stabilisation, adding a fourth-order dissipation term that suppresses high-frequency oscillation.'],
                ['nso_fourth_order_factor', '1.0', 'Scales that dissipation term. Effective only when the option above is enabled.'],
                ['disable_momentum_predictor', 'false', 'Skips the momentum predictor step, taking the pressure gradient from the previous iteration.'],
                ['false_mass_accumulation', 'true', 'Retains the transient mass-imbalance term in the pressure equation, improving robustness on compressible and free-surface problems.'],
                ['body_force_redistribution', 'true', 'Redistributes body forces so they balance the pressure gradient discretely, preventing spurious currents.'],
                ['high_speed_blend_damping', 'false', 'Adds damping to the high-speed (compressible) advection blending. Expert stabilisation switch; applied only when set, and off is correct for general use.'],
                ['coriolis_production_turbulence', 'false', 'Adds the Coriolis contribution to turbulence production in rotating frames.'],
                ['volume_fraction_compressive_beta_max', '2.0', 'Upper limit on the interface-compression coefficient.'],
                ['strong_dirichlet_wall_scale', 'false', 'Imposes the wall-distance boundary condition strongly rather than through a source term.'],
              ].map(([opt, def, effect]) => (
                <tr key={opt} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="wall-distance" num="8.6.4">Wall distance</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Distance to the nearest wall is not a user input but a field the solver computes, and it
        feeds both the SST blending functions and the transition model. The method used to compute
        it, and whether it is recomputed as the mesh moves, are set by the two options in the table
        below.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.21" className="mb-2">
          Wall-distance computation. The resulting field feeds the SST blending functions and the
          transition model.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['wall_distance_method', 'poisson', <>Solves a Poisson equation for the wall distance; robust on general meshes. Alternatives: <code>mesh_wave</code>, <code>signed_distance_function</code>.</>],
                ['force_wall_distance_calculation', 'false', 'Recomputes the wall distance every time step. Required when boundaries move.'],
              ].map(([opt, def, effect]) => (
                <tr key={opt as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="expert-interfaces" num="8.6.5">Interfaces</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Non-conformal interfaces are handled by the discontinuous Galerkin treatment documented in{' '}
        <a href="/get-started/interfaces">Chapter 7</a>. The single expert parameter in the table
        below names that treatment; it is read once and applied to every interface in the
        simulation.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.22" className="mb-2">Non-conformal interface treatment. This setting is global.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              <tr style={tdBorder}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>non_conformal_method</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>discontinuous_galerkin</td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>
                  Treatment applied at every non-conformal interface. Discontinuous Galerkin is the
                  supported treatment; its options are documented in{' '}
                  <a href="/get-started/interfaces">Chapter 7</a>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        This option is read once and applied to <strong style={{ color: 'var(--text)' }}>every</strong>{' '}
        interface. It cannot be configured per interface, even though each interface has its own
        block in the input file.
      </Callout>

      <H3 id="performance-diagnostics" num="8.6.6">Performance and diagnostics</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The switches in the table below do not change the physics. Two are performance-related and
        the rest exist to isolate a problem during debugging by suspending part of the solve, which
        is often the quickest way to determine whether a failure originates in the mesh, the
        interfaces, or the physics.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.23" className="mb-2">Performance tuning and diagnostic switches.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['bandwidth_reduction', 'true', 'Reorders the matrix to reduce bandwidth, improving cache locality and preconditioner quality.'],
                ['force_full_node_graph', 'false', 'Builds the full node-connectivity graph rather than the reduced one. Applied only when set; a diagnostic and compatibility switch.'],
                ['freeze_flow', 'false', 'Holds velocity and pressure fixed while other equations continue to solve. Useful for isolating a scalar or turbulence problem.'],
                ['freeze_pressure', 'false', 'Holds the pressure field fixed while the remaining equations continue to solve. Applied only when set.'],
                ['disable_physics', 'false', 'Suppresses assembly of the physics equation queue entirely. Used to test mesh reading, decomposition and interface pairing in isolation.'],
                ['print_momentum_interface_imbalance', 'false', 'Reports the momentum imbalance across each interface.'],
              ].map(([opt, def, effect]) => (
                <tr key={opt} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="linear-solvers" num="8.7">Linear solvers</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Linear solver configurations are named blocks under{' '}
        <code>advanced_options &gt; linear_solver_settings</code> (Figure 8.5). Each block is keyed
        by the name of the equation it serves; any equation without its own block falls back to the
        block named <code>default</code>.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.24" className="mb-2">Options common to every linear solver family.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['family', 'required', 'Solver library; see Table 8.25.'],
                ['min_iterations', '0', 'Minimum inner iterations per solve.'],
                ['max_iterations', '20', 'Maximum inner iterations per solve.'],
                ['rtol', '1e-6', 'Relative convergence tolerance.'],
                ['atol', '1e-16', 'Absolute convergence tolerance.'],
                ['verbose', '0', 'Solver diagnostic output level.'],
              ].map(([opt, def, effect]) => (
                <tr key={opt} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        The condition number of the pressure-correction operator scales approximately as{' '}
        <Equation math="h^{-2}" display={false} />. Halving
        the mesh spacing makes the linear system about four times harder to solve. If a refined mesh
        diverges, raise <code>max_iterations</code> and tighten <code>rtol</code> before touching
        anything else.
      </Callout>

      <H3 id="solver-libraries" num="8.7.1">Solver libraries</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>family</code> selects which external library performs the linear solve. The table
        below lists the five accepted values and the status of each in this source tree.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.25" className="mb-2">The five accepted family values.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>family</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['petsc', 'Built in; configured below.'],
                ['hypre', 'Built in; configured below.'],
                ['trilinos', 'Built in; configured below.'],
                ['amgsolver', 'Independent family, requiring an external library not present in this source tree.'],
                ['gmres', 'Independent family, requiring an external library not present in this source tree.'],
              ].map(([fam, status]) => (
                <tr key={fam} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{fam}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="note">
        PETSc, HYPRE and Trilinos are the three families built directly into this source tree, and
        are the families used throughout the validated case set. <code>amgsolver</code> and{' '}
        <code>gmres</code> are separate families in their own right, not sub-options of the other
        three, but their implementation is loaded from an external shared library that is not part
        of the repository. Unless that library has been built and linked separately, use PETSc,
        HYPRE or Trilinos.
      </Callout>

      <H3 id="petsc">PETSc</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        An <code>options</code> map is forwarded directly as PETSc command-line options: each{' '}
        <code>key: value</code> pair becomes <code>-key value</code>.
      </p>

      <H3 id="hypre">HYPRE</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        HYPRE is configured through a nested <code>options</code> block containing a{' '}
        <code>solver</code> sub-block and, optionally, a <code>precond</code> sub-block. The
        accepted types for each are listed in the table below. If <code>options</code> is omitted
        entirely, a bare GMRES solve with no preconditioner is used.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.26" className="mb-2">
          HYPRE solver and preconditioner types, under <code>options &gt; solver &gt; type</code>{' '}
          and <code>options &gt; precond &gt; type</code>.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Role</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Accepted values</th>
              </tr>
            </thead>
            <tbody>
              <tr style={tdBorder}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>solver &gt; type <span style={{ color: 'var(--text-dim)' }}>(required)</span></td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}><code>gmres</code>, <code>flexgmres</code>, <code>boomeramg</code>, <code>mgr</code></td>
              </tr>
              <tr style={tdBorder}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>precond &gt; type <span style={{ color: 'var(--text-dim)' }}>(optional)</span></td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}><code>boomeramg</code>, <code>mgr</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>
      <p style={{ color: 'var(--text-dim)' }}>Parameters not explicitly set take the HYPRE library defaults.</p>

      <H3 id="trilinos-solvers">Trilinos</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Trilinos exposes its Belos solvers and Ifpack2 preconditioners through the two keys in the
        table below. Both accept a plain string, and both fall back to a default if the string is
        not recognised &mdash; a behaviour worth knowing about, as the warning below explains.
      </p>
      <figure className="my-4">
        <Caption label="Table 8.27" className="mb-2">Trilinos solver and preconditioner options.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Accepted values</th>
              </tr>
            </thead>
            <tbody>
              <tr style={tdBorder}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>belos_solver <span style={{ color: 'var(--text-dim)' }}>(default: gmres)</span></td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}><code>cg</code>, <code>bicgstab</code>, <code>tfqmr</code>, <code>lsqr</code>, <code>gmres</code></td>
              </tr>
              <tr style={tdBorder}>
                <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>preconditioner <span style={{ color: 'var(--text-dim)' }}>(default: none)</span></td>
                <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}><code>ilu</code>, <code>rilu</code>, <code>riluk</code>, <code>jacobi</code>, <code>relaxation</code>, <code>chebyshev</code>, <code>none</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        The Trilinos selectors fail <strong style={{ color: 'var(--text)' }}>silently</strong>. An
        unrecognised <code>belos_solver</code> falls back to GMRES, and an unrecognised{' '}
        <code>preconditioner</code> falls back to relaxation &mdash; in both cases without any error
        or warning. A misspelled value produces a working but different solver.
      </Callout>
    </GsLayout>
  );
}
