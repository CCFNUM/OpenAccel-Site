import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { YamlTree } from '@/components/YamlTree';
import { InputMap, NodeTree, type TreeNode } from '@/components/InputMap';
import { Caption } from '@/components/Caption';
import { GsLayout, H2, H3, Callout } from './GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;
const tdBorder = { borderBottom: '1px solid var(--table-border)' } as const;

const PA_CHILDREN_TREE: TreeNode = {
  id: 'physical_analysis', label: 'physical_analysis',
  children: [
    { id: 'analysis_type', label: 'analysis_type' },
    { id: 'domains', label: 'domains[]' },
    { id: 'rigid_bodies', label: 'rigid_bodies[]' },
    { id: 'interfaces', label: 'interfaces[]', href: '/get-started/interfaces' },
  ],
};

const DOMAIN_CHILDREN_TREE: TreeNode = {
  id: 'domain_entry', label: '- name:',
  children: [
    { id: 'type', label: 'type' },
    { id: 'location', label: 'location' },
    { id: 'materials', label: 'materials' },
    { id: 'fluid_models', label: 'fluid_models', note: 'fluid only', conditional: true },
    { id: 'solid_models', label: 'solid_models', note: 'solid only', conditional: true },
    { id: 'fluid_pair_models', label: 'fluid_pair_models', note: 'fluid, multiphase only', conditional: true },
    { id: 'domain_models', label: 'domain_models', note: 'fluid only', conditional: true },
    { id: 'sources', label: 'sources' },
    { id: 'boundaries', label: 'boundaries' },
    { id: 'initialization', label: 'initialization' },
  ],
};

export function Ch6PhysicalAnalysis() {
  useDocumentTitle('Physical Analysis — User Guide');
  return (
    <GsLayout chNum="6" title="Physical Analysis">
      <SEO
        title="Physical Analysis — User Guide"
        description="physical_analysis: analysis type, domains (fluid models, domain models, solid models, sources, initialisation, boundaries), and rigid bodies."
        path="/get-started/physical-analysis"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        <code>physical_analysis</code> declares <em>what</em> is being solved: whether the analysis
        is steady or transient, which regions of the mesh are computed, which physics applies to
        each, and any rigid bodies moving through the domain. It is the largest branch of the input
        file.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        Interfaces, which are also declared here, are covered separately in{' '}
        <a href="/get-started/interfaces">Chapter 7</a>.
      </p>

      <H2 id="location" num="6.1">Location in the input file</H2>

      <figure className="my-6">
        <InputMap highlight="physical_analysis" />
        <Caption label="Figure 6.1" className="mt-2">
          Position of the physical_analysis block. This chapter covers <code>analysis_type</code>,{' '}
          <code>domains</code> and <code>rigid_bodies</code>; <code>interfaces</code> is covered in{' '}
          <a href="/get-started/interfaces">Chapter 7</a>.
        </Caption>
      </figure>

      <p style={{ color: 'var(--text-dim)' }}>
        The block has four children. Figure 6.2 shows them together with the section documenting
        each.
      </p>

      <figure className="my-6">
        <NodeTree root={PA_CHILDREN_TREE} highlightId="physical_analysis" />
        <Caption label="Figure 6.2" className="mt-2">Children of physical_analysis, with the section documenting each.</Caption>
      </figure>

      <H2 id="analysis-type" num="6.2">Analysis type</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>analysis_type</code> declares whether the simulation marches in time or seeks a steady
        solution. The choice governs which options are read elsewhere in the file, as listed in
        Table 6.1, so it is the first thing to settle when building a case.
      </p>

      <YamlTree
        label="Figure 6.3"
        caption="A steady analysis (left) needs only the option key; a transient analysis additionally requires total_time and a time_steps block."
        lines={[
          { indent: 0, key: 'physical_analysis:' },
          { indent: 1, key: 'analysis_type:' },
          { indent: 2, text: 'option: steady_state' },
          { indent: 0 },
          { indent: 0, key: 'physical_analysis:', comment: 'transient alternative' },
          { indent: 1, key: 'analysis_type:' },
          { indent: 2, text: 'option: transient' },
          { indent: 2, text: 'total_time: 10.0' },
          { indent: 2, key: 'time_steps:' },
          { indent: 3, text: 'option: constant' },
          { indent: 3, text: 'timestep: 0.001' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.1" className="mb-2">Options whose availability depends on the analysis type.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Read when</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['physical_timescale', 'steady only', <>Pseudo-time step; see <a href="/get-started/numerics#pseudo-timescale">Chapter 8</a>.</>],
                ['transient_scheme', 'transient only', 'Required despite having a default.'],
                ['total_time', 'transient only', 'Required.'],
                ['time_steps', 'transient only', 'Required.'],
                ['output_frequency', 'both', 'A map for transient runs, a bare scalar for steady runs.'],
              ].map(([opt, when, notes]) => (
                <tr key={opt as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{when}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="time-step-control" num="6.2.1">Time step control</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        For a transient analysis, <code>time_steps &gt; option</code> selects how the step size is
        determined. Table 6.2 lists the four modes and the keys each requires; a constant step is
        the default and is adequate for most cases.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.2" className="mb-2">Time-stepping modes, under analysis_type &gt; time_steps.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Mode</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['constant (default)', <><code>timestep</code> (required)</>],
                ['specified_interval', <><code>initial_timestep</code>, <code>start_time</code>, <code>interval_length</code>, <code>interval_timestep</code>, <code>period</code></>],
                ['periodic_interval', 'as specified_interval'],
                ['adaptive', <><code>initial_timestep</code> (must exceed zero), <code>timestep_update_frequency</code>, and the <code>timestep_adaptation</code> block</>],
              ].map(([mode, keys]) => (
                <tr key={mode as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{mode}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <p style={{ color: 'var(--text-dim)' }}>
        Adaptive stepping adjusts the step during the run to hold a target Courant number. The
        controls governing how aggressively it adapts are given in Table 6.3.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.3" className="mb-2">Adaptive time-stepping controls, under time_steps &gt; timestep_adaptation.</Caption>
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
                ['option', 'max_courant', <>Criterion driving adaptation. Alternative: <code>rms_courant</code>.</>],
                ['courant_number', '5.0', 'Target Courant number.'],
                ['min_timestep', '0.0', 'Lower bound on the step.'],
                ['max_timestep', 'very large', 'Upper bound on the step.'],
                ['timestep_decrease_factor', '0.8', 'Multiplier applied when the criterion is exceeded.'],
                ['timestep_increase_factor', '1.06', 'Multiplier applied when there is margin.'],
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

      <Callout type="tip">
        For violent free-surface problems a fixed time step is rarely adequate. The MULES
        volume-fraction advection becomes unbounded above a Courant number of roughly 0.5, and an
        unbounded volume fraction produces an unphysical density and then a velocity explosion.
        Adaptive stepping with a target of 0.3 or lower is the reliable configuration.
      </Callout>

      <H2 id="domains" num="6.3">Domains</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A domain is one region of the mesh together with the physics solved on it. Domains are
        declared as a sequence, and a simulation may have any number of them.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        Every domain declares the same four identifying keys, listed in Table 6.4. What follows them
        depends on <code>type</code>: a fluid domain carries <code>fluid_models</code>, a solid
        domain carries <code>solid_models</code>, and only fluid domains may carry{' '}
        <code>fluid_pair_models</code> or <code>domain_models</code>. Figure 6.4 shows the full set.
      </p>

      <figure className="my-6">
        <NodeTree root={DOMAIN_CHILDREN_TREE} highlightId="domain_entry" />
        <Caption label="Figure 6.4" className="mt-2">
          Children of a single domain entry. Grey blocks are conditional on the domain type; white
          blocks apply to every domain.
        </Caption>
      </figure>

      <figure className="my-4">
        <Caption label="Table 6.4" className="mb-2">Identifying keys, required on every domain.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['name', <>Must be unique across all domains. Referenced by interfaces (<a href="/get-started/interfaces">Chapter 7</a>).</>],
                ['type', <><code>fluid</code> or <code>solid</code>. Determines which model block is required.</>],
                ['location', 'Mesh element blocks belonging to this domain.'],
                ['materials', <>Names drawn from <code>material_library</code> (<a href="/get-started/materials">Chapter 9</a>). More than one entry requires a <code>multiphase</code> block.</>],
              ].map(([opt, desc]) => (
                <tr key={opt as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="note">
        A solid domain carries the same identifying keys as a fluid domain, together with{' '}
        <code>boundaries</code> and <code>initialization</code>. It does <em>not</em> carry{' '}
        <code>fluid_models</code>, <code>fluid_pair_models</code> or <code>domain_models</code>;
        those three are fluid-only.
      </Callout>

      <H3 id="fluid-models" num="6.3.1">Fluid models</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>fluid_models</code> is required on every fluid domain and holds the turbulence, heat
        transfer and multiphase models. Figure 6.5 shows where it sits within a domain entry.
      </p>

      <YamlTree
        label="Figure 6.5"
        caption="Position of fluid_models within a domain entry. Note that the sequence dash aligns with domains, and name aligns with its sibling keys."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, text: 'location: [fluid]' },
          { indent: 1, text: 'materials: [air]' },
          { indent: 1, text: 'type: fluid' },
          { indent: 1, key: 'fluid_models:' },
          { indent: 2, key: 'turbulence:', comment: 'Section 6.3.1.1' },
          { indent: 2, key: 'heat_transfer:', comment: 'Section 6.3.1.2' },
          { indent: 2, key: 'multiphase:', comment: 'Section 6.3.1.3' },
        ]}
      />

      <H3 id="turbulence">Turbulence</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The <code>turbulence</code> block selects the closure applied to the momentum equations. Its
        options are listed in Table 6.5; the default is laminar, so a turbulent case must set{' '}
        <code>option</code> explicitly.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.5" className="mb-2">Turbulence model selection, under fluid_models &gt; turbulence.</Caption>
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
                ['option', 'laminar', <><code>laminar</code>, <code>k_epsilon</code> or <code>shear_stress_transport</code>. Required once the block is present.</>],
                ['wall_function', 'model-dependent', 'See Table 6.6.'],
                ['transitional_turbulence', 'false', <>Activates transition modelling. Meaningful only with <code>shear_stress_transport</code>.</>],
                ['correlation_based', 'false', 'Selects which transition model is used. See Table 6.7.'],
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

      <p style={{ color: 'var(--text-dim)' }}>
        Wall treatment is not freely selectable: each turbulence model accepts exactly one wall
        function, as shown in Table 6.6. Supplying any other value aborts the run rather than
        falling back silently.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.6" className="mb-2">Wall function compatibility.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Turbulence model</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Accepted</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>If omitted</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['k_epsilon', 'scalable', <>falls back to <code>scalable</code></>],
                ['shear_stress_transport', 'automatic', <>falls back to <code>automatic</code></>],
              ].map(([model, acc, fallback]) => (
                <tr key={model as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{model}</td>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--text-dim)' }}>{acc}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{fallback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <p style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)' }}>Transition modelling.</strong> Transition is not a
        separate value of <code>option</code>; it is a modifier applied on top of the SST model,
        selected by the two booleans in Table 6.7. Figure 6.6 shows the resulting block.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.7" className="mb-2">
          Selecting a transition model. Both keys sit inside the turbulence block alongside{' '}
          <code>option: shear_stress_transport</code>.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-mono font-medium" style={thStyle}>transitional_turbulence</th>
                <th className="text-left py-2 px-3 font-mono font-medium" style={thStyle}>correlation_based</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Model activated</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['false (default)', '—', 'Standard SST; no transition modelling.'],
                ['true', 'false (or omitted)', 'Full Langtry–Menter γ–Reθt model. Solves transport equations for both intermittency and transition-onset Reynolds number.'],
                ['true', 'true', 'Correlation-based model. Solves only the intermittency equation; the onset Reynolds number comes from local correlations.'],
              ].map(([tt, cb, model], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{tt}</td>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{cb}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 6.6"
        caption="Activating the full transition model."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, dots: true },
          { indent: 1, key: 'fluid_models:' },
          { indent: 2, key: 'turbulence:' },
          { indent: 3, text: 'option: shear_stress_transport' },
          { indent: 3, text: 'transitional_turbulence: true' },
          { indent: 3, text: 'correlation_based: false' },
        ]}
      />

      <Callout type="warning">
        There is no <code>transition_sst</code> value for <code>option</code>. A case setting{' '}
        <code>option: shear_stress_transport</code> without{' '}
        <code>transitional_turbulence: true</code> runs fully turbulent, and will not reproduce a
        laminar separation bubble regardless of mesh resolution.
      </Callout>

      <p style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)' }}>Turbulent heat flux.</strong> When turbulence and
        heat transfer are both active, the turbulent contribution to the heat flux requires its own
        closure. It is configured under{' '}
        <code>turbulence &gt; turbulent_flux_closure_for_heat_transfer</code>, with the options in
        Table 6.8.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.8" className="mb-2">Turbulent heat flux closure.</Caption>
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
                ['option', 'eddy_diffusivity', 'Currently the only accepted value.'],
                ['turbulent_prandtl_number', '0.9', 'Turbulent Prandtl number.'],
              ].map(([opt, def, desc]) => (
                <tr key={opt} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="heat-transfer">Heat transfer</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The <code>heat_transfer</code> block decides whether an energy equation is solved and, if
        so, in which form. It appears under both <code>fluid_models</code> and{' '}
        <code>solid_models</code> with the same <code>option</code> values, listed in Table 6.9, but
        with a reduced key set on solids.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.9" className="mb-2">Heat transfer model selection.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['none (default)', 'No energy equation is solved.'],
                ['isothermal', <>Temperature held at <code>fluid_temperature</code> (default <code>300</code>); no transport equation.</>],
                ['thermal_energy', 'Solves the thermal energy equation. The usual choice for incompressible and low-speed flow.'],
                ['total_energy', 'Solves the total energy equation including kinetic energy. Required for compressible flow.'],
              ].map(([v, effect]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <p style={{ color: 'var(--text-dim)' }}>
        Three further switches, listed in Table 6.10, control which additional terms are retained
        in the fluid energy equation. All default to <code>true</code>, and are read on fluid
        domains only.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.10" className="mb-2">Additional energy-equation terms, fluid domains only.</Caption>
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
                ['include_viscous_work', 'true', 'Retains viscous dissipation.'],
                ['include_pressure_work', 'true', 'Retains pressure work.'],
                ['include_low_speed_compressibility', 'true', 'Retains compressibility terms significant at low Mach number.'],
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
        For a benchmark whose reference solution assumes a purely conductive&ndash;convective energy
        balance, set <code>include_viscous_work: false</code>. Viscous dissipation adds a source
        term that does not scale with the imposed temperature difference, which breaks the linearity
        making such a case independent of the chosen &Delta;T.
      </Callout>

      <H3 id="multiphase-free-surface">Multiphase and free-surface flow</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        A domain listing more than one material is a multiphase domain and must declare a{' '}
        <code>multiphase</code> block. Figure 6.7 shows the arrangement and Table 6.11 the available
        options.
      </p>

      <YamlTree
        label="Figure 6.7"
        caption="Free-surface configuration within a fluid domain."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, text: 'materials: [water, air]' },
          { indent: 1, dots: true },
          { indent: 1, key: 'fluid_models:' },
          { indent: 2, key: 'multiphase:' },
          { indent: 3, text: 'homogeneous: true' },
          { indent: 3, key: 'free_surface_model:' },
          { indent: 4, text: 'option: standard' },
          { indent: 4, text: 'interface_compression_level: 0' },
          { indent: 4, text: 'flux_corrected_transport: false' },
          { indent: 4, text: 'n_alpha_corrections: 1' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.11" className="mb-2">Multiphase and free-surface options.</Caption>
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
                ['homogeneous', 'true', <>Inhomogeneous multiphase is not implemented; setting <code>false</code> aborts.</>],
                ['option', 'none', <>Must be set to <code>standard</code>. Any other value, including the default, aborts once the block is present.</>],
                ['interface_compression_level', '0', 'Sharpening applied to the interface.'],
                ['flux_corrected_transport', 'false', 'Enables FCT limiting of the volume-fraction flux.'],
                ['n_alpha_corrections', '1', 'Corrector passes on the volume fraction.'],
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

      <H3 id="fluid-pair-models" num="6.3.2">Fluid pair models</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>fluid_pair_models</code> declares properties belonging to a <em>pair</em> of materials
        rather than to one. It applies only to multiphase fluid domains and currently carries a
        single model, surface tension, whose options are given in Table 6.12.
      </p>

      <YamlTree
        label="Figure 6.8"
        caption="Surface tension between two materials. fluid_pair_models is a sibling of fluid_models, not a child of it."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, text: 'materials: [water, air]' },
          { indent: 1, dots: true },
          { indent: 1, key: 'fluid_pair_models:' },
          { indent: 1, dash: true, text: 'pair: [water, air]' },
          { indent: 2, key: 'surface_tension:' },
          { indent: 3, text: 'option: continuum_surface_force' },
          { indent: 3, text: 'surface_tension_coefficient: 0.0728' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.12" className="mb-2">Surface tension options.</Caption>
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
                ['pair', '—', "Exactly two material names, both already listed in the domain's materials. Duplicate pairs are rejected regardless of order."],
                ['option', 'none', <>Alternative: <code>continuum_surface_force</code>.</>],
                ['surface_tension_coefficient', '0.0', 'Coefficient σ, in N/m.'],
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

      <H3 id="domain-models" num="6.3.3">Domain models</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>domain_models</code> holds properties of the domain as a whole rather than of the
        physics solved on it: its pressure datum, whether it is buoyant, and whether it moves or
        deforms. It applies to fluid domains only, and its four children are shown in Figure 6.9.
      </p>

      <YamlTree
        label="Figure 6.9"
        caption="The four children of domain_models."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, dots: true },
          { indent: 1, key: 'domain_models:' },
          { indent: 2, text: 'reference_pressure: 101325', comment: 'Section 6.3.3.1' },
          { indent: 2, key: 'buoyancy_model:', comment: 'Section 6.3.3.2' },
          { indent: 2, key: 'domain_motion:', comment: 'Section 6.3.3.3' },
          { indent: 2, key: 'mesh_deformation:', comment: 'Section 6.3.3.4' },
        ]}
      />

      <p style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)' }}>Reference pressure.</strong>{' '}
        <code>reference_pressure</code> (default <code>0.0</code>) sets the absolute pressure
        against which the relative pressure field is measured. Every pressure reported in the
        results and every pressure boundary condition is understood relative to this datum. It is
        read on fluid domains only; supplying it on a solid domain aborts.
      </p>

      <H3 id="buoyancy">Buoyancy</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Buoyancy couples the momentum equation to the temperature or density field. Enabling it
        requires a gravity vector and one reference quantity, as set out in Table 6.13. Figure 6.10
        shows a Boussinesq configuration.
      </p>

      <YamlTree
        label="Figure 6.10"
        caption="Boussinesq buoyancy."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, dots: true },
          { indent: 1, key: 'domain_models:' },
          { indent: 2, key: 'buoyancy_model:' },
          { indent: 3, text: 'option: buoyant' },
          { indent: 3, text: 'gravity: [0, -9.81, 0]' },
          { indent: 3, text: 'buoyancy_reference_temperature: 300' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.13" className="mb-2">Buoyancy model options.</Caption>
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
                ['option', 'non_buoyant', <>Alternative: <code>buoyant</code>. Absence silently keeps the default.</>],
                ['gravity', 'zeros', <>Gravity vector. Required when <code>option: buoyant</code>.</>],
                ['buoyancy_reference_temperature', '0.0', 'Required in the Boussinesq case. Heat transfer must be active.'],
                ['buoyancy_reference_density', '0.0', 'Required in the full-buoyancy case.'],
                ['reference_location', 'zeros', 'Reference point, full-buoyancy case only.'],
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
        <strong style={{ color: 'var(--text)' }}>Boussinesq versus full buoyancy is not a user
        choice.</strong> The solver derives it: if the domain has more than one material, or its
        material is compressible, the full model is used and{' '}
        <code>buoyancy_reference_density</code> becomes required; otherwise the Boussinesq
        approximation is used and <code>buoyancy_reference_temperature</code> becomes required
        instead. Supplying the wrong one of the pair produces an error naming the key the solver
        expected.
      </Callout>
      <Callout type="note">
        In the current release the error raised when <code>buoyancy_reference_temperature</code> is
        missing reports a missing <em>density</em> key. The check is correct; the message text is
        not.
      </Callout>

      <H3 id="domain-motion">Domain motion</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>domain_motion</code> moves the domain rigidly, as a rotating frame or a translating
        region. The mesh itself is not distorted &mdash; only the frame in which the equations are
        posed. Figure 6.11 shows a rotating frame and Table 6.14 lists which keys each motion type
        requires.
      </p>

      <YamlTree
        label="Figure 6.11"
        caption="A rotating frame in three dimensions. In two dimensions the axis key is omitted, rotation being implicitly about the out-of-plane direction."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'rotor' },
          { indent: 1, dots: true },
          { indent: 1, key: 'domain_models:' },
          { indent: 2, key: 'domain_motion:' },
          { indent: 3, text: 'option: rotating' },
          { indent: 3, text: 'origin: [0, 0, 0]' },
          { indent: 3, text: 'angular_velocity: 104.72' },
          { indent: 3, text: 'axis: [0, 0, 1]', comment: '3-D builds only' },
          { indent: 3, text: 'stationary_parts: [hub]' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.14" className="mb-2">Domain motion options.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Required for</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['option', 'always', <><code>stationary</code>, <code>translating</code> or <code>rotating</code>.</>],
                ['velocity', 'translating', 'Translation velocity vector.'],
                ['origin', 'rotating', 'Point on the rotation axis.'],
                ['angular_velocity', 'rotating', 'Rotation rate.'],
                ['axis', 'rotating, 3-D only', 'Rotation axis.'],
                ['stationary_parts', 'optional', "Mesh parts within the domain that do not move. Each must also appear in the domain's location."],
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

      <Callout type="warning">
        <code>translating</code> requires a transient analysis and aborts in a steady run. In
        two-dimensional builds a user-supplied <code>axis</code> key is silently ignored rather than
        reported as an error.
      </Callout>

      <H3 id="mesh-deformation">Mesh deformation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Where <code>domain_motion</code> moves the domain rigidly, <code>mesh_deformation</code>{' '}
        allows the mesh itself to distort, solving a displacement-diffusion equation that propagates
        boundary motion into the interior. This is the mechanism underlying fluid&ndash;structure
        interaction and prescribed-motion cases. Figure 6.12 shows a typical configuration.
      </p>

      <YamlTree
        label="Figure 6.12"
        caption="Mesh deformation configuration."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, dots: true },
          { indent: 1, key: 'domain_models:' },
          { indent: 2, key: 'mesh_deformation:' },
          { indent: 3, text: 'option: regions_of_motion_specified' },
          { indent: 3, text: 'displacement_relative_to: previous_mesh' },
          { indent: 3, key: 'mesh_motion_model:' },
          { indent: 4, text: 'option: displacement_diffusion' },
          { indent: 4, key: 'mesh_stiffness:' },
          { indent: 5, text: 'option: increase_near_small_volumes' },
          { indent: 5, text: 'model_exponent: 2.0' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.15" className="mb-2">Mesh deformation options.</Caption>
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
                ['option', 'none', <><code>regions_of_motion_specified</code> or <code>inherent</code>. Required.</>],
                ['displacement_relative_to', 'previous_mesh', <>Alternative: <code>initial_mesh</code>. Any other value aborts.</>],
                ['mesh_motion_model > option', 'displacement_diffusion', 'Currently the only accepted value.'],
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

      <p style={{ color: 'var(--text-dim)' }}>
        The stiffness distribution decides which cells absorb the deformation. Four models are
        available, listed in Table 6.16, and each draws its parameters from Table 6.17.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.16" className="mb-2">Mesh stiffness models, under mesh_motion_model &gt; mesh_stiffness.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Behaviour</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['value (default)', 'Uniform stiffness throughout the domain.'],
                ['increase_near_small_volumes', 'Stiffens small cells, so that deformation is absorbed by larger ones.'],
                ['increase_near_boundaries', 'Stiffens cells near walls, preserving boundary-layer resolution.'],
                ['blended_distance_and_small_volumes', 'Weighted combination of the two preceding models.'],
              ].map(([v, behaviour]) => (
                <tr key={v} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{behaviour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 6.17" className="mb-2">Mesh stiffness parameters, and the stiffness model each belongs to.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Parameter</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Belongs to</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['value', '1.0', <><code>value</code>. Required.</>],
                ['model_exponent', '2.0', <><code>increase_near_small_volumes</code> and <code>increase_near_boundaries</code>. Required for both.</>],
                ['reference_length_scale', '1.0', <><code>increase_near_boundaries</code>.</>],
                ['volume_weight', '0.5', <><code>blended_distance_and_small_volumes</code>.</>],
                ['distance_weight', '0.5', <><code>blended_distance_and_small_volumes</code>.</>],
                ['volume_exponent', '2.0', <><code>blended_distance_and_small_volumes</code>.</>],
                ['distance_exponent', '2.0', <><code>blended_distance_and_small_volumes</code>.</>],
              ].map(([param, def, belongs]) => (
                <tr key={param as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{param}</td>
                  <td className="py-2 px-3 align-top text-center" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{belongs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        Mesh deformation requires a transient analysis. A steady run declaring a deformation
        specification other than <code>none</code> aborts.
      </Callout>
      <Callout type="warning">
        <strong style={{ color: 'var(--text)' }}>Known defect.</strong>{' '}
        <code>stationary_parts</code> under <code>mesh_deformation</code> is checked for presence at
        that path but its value is read from <code>domain_motion &gt; stationary_parts</code>. Until
        this is corrected, declare stationary parts under <code>domain_motion</code>.
      </Callout>

      <H3 id="solid-models" num="6.3.4">Solid models</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>solid_models</code> is required on every solid domain and holds the heat transfer and
        solid mechanics models. Figure 6.13 shows a complete solid domain; Table 6.18 lists the
        available constitutive models and Table 6.19 the remaining configuration.
      </p>

      <YamlTree
        label="Figure 6.13"
        caption="A complete solid domain, from the domains block down to the constitutive model."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'solid' },
          { indent: 1, text: 'location: [solid]' },
          { indent: 1, text: 'materials: [copper]' },
          { indent: 1, text: 'type: solid' },
          { indent: 1, key: 'solid_models:' },
          { indent: 2, key: 'heat_transfer:' },
          { indent: 3, text: 'option: thermal_energy' },
          { indent: 2, key: 'solid_mechanics:' },
          { indent: 3, text: 'option: linear_elastic' },
          { indent: 3, text: 'formulation: total_lagrangian' },
          { indent: 3, text: 'plane_stress: false' },
          { indent: 1, key: 'boundaries:', comment: 'Section 6.3.7' },
          { indent: 1, key: 'initialization:', comment: 'Section 6.3.6' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.18" className="mb-2">Constitutive models, under solid_models &gt; solid_mechanics &gt; option.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['none (default)', 'No structural equation is solved.'],
                ['linear_elastic', 'Small-strain linear elasticity.'],
                ['simplified_neo_hookean', 'Reduced neo-Hookean hyperelastic model.'],
                ['neo_hookean', 'Full neo-Hookean hyperelastic model.'],
                ['st_venant_kirchhoff', 'Saint Venant–Kirchhoff hyperelastic model.'],
              ].map(([v, desc]) => (
                <tr key={v} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 6.19" className="mb-2">Solid mechanics configuration.</Caption>
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
                ['formulation', 'total_lagrangian', <><code>updated_lagrangian</code> is not yet implemented and aborts if selected.</>],
                ['plane_stress', 'false', 'Selects plane stress over plane strain in two dimensions.'],
                ['lumped_mass', 'true', <>Only functional value; <code>false</code> aborts, the consistent-mass approach not being implemented.</>],
                ['damping_coeff', '0.0', 'Mass-proportional structural damping. Must be non-negative.'],
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

      <H3 id="source-terms" num="6.3.5">Source terms</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>sources</code> adds volumetric source terms to the energy and momentum equations
        &mdash; a distributed heat input, or a body force such as a porous resistance. Figure 6.14
        shows both, and Table 6.20 lists the options.
      </p>

      <YamlTree
        label="Figure 6.14"
        caption="Volumetric source terms."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, dots: true },
          { indent: 1, key: 'sources:' },
          { indent: 2, key: 'energy:' },
          { indent: 3, text: 'option: source' },
          { indent: 3, text: 'source: 1000.0' },
          { indent: 2, key: 'momentum:' },
          { indent: 3, text: 'source: [0.0, -10.0, 0.0]' },
          { indent: 3, text: 'redistribute_in_rhie_chow: false' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.20" className="mb-2">Source term options, under domain &gt; sources.</Caption>
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
                ['energy > option', 'source', <><code>source</code> gives a volumetric rate; <code>total_source</code> gives an integrated total.</>],
                ['energy > source', '0.0', <>Value used when <code>option: source</code>.</>],
                ['energy > total_source', '0.0', <>Value used when <code>option: total_source</code>.</>],
                ['momentum > source', 'zeros', 'Momentum source vector. Fluid domains only.'],
                ['momentum > redistribute_in_rhie_chow', 'false', 'Includes the source in the Rhie–Chow interpolation, preventing pressure–velocity decoupling for strong sources.'],
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

      <H3 id="initialisation" num="6.3.6">Initialisation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>initialization</code> assigns the starting value of every solved field. Key names
        match the fields themselves; each takes an <code>option</code> followed, for{' '}
        <code>option: value</code>, by the value itself, as shown in Figure 6.15. Every domain
        requires this block unless a shared default is supplied.
      </p>

      <YamlTree
        label="Figure 6.15"
        caption="Field initialisation."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, dots: true },
          { indent: 1, key: 'initialization:' },
          { indent: 2, key: 'velocity:' },
          { indent: 3, text: 'option: value' },
          { indent: 3, text: 'velocity: [1.0, 0.0, 0.0]' },
          { indent: 2, key: 'pressure:' },
          { indent: 3, text: 'option: value' },
          { indent: 3, text: 'pressure: 0' },
          { indent: 2, key: 'temperature:' },
          { indent: 3, text: 'option: value' },
          { indent: 3, text: 'temperature: 300' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.21" className="mb-2">Initialisation option, per field, under initialization &gt; &lt;field&gt;.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['value', <>The field is set to the value that follows, given under a key of the field&rsquo;s own name. The value obeys the <code>input_type</code> mechanism of <a href="#specifying-values">Specifying values</a>, so it may be a constant, an expression, or a file-backed profile.</>],
                ['automatic', 'The field is initialised from a solver-defined default appropriate to the physics.'],
                ['null', 'No initial value is imposed for the field.'],
              ].map(([v, effect]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        An instability that must grow from a perturbation &mdash; Rayleigh&ndash;B&eacute;nard
        convection being the canonical example &mdash; will not develop from a perfectly quiescent
        initial field, because the motionless conductive state is itself a valid fixed point. Seed
        the velocity with a small non-zero value so the instability can nucleate.
      </Callout>

      <H3 id="multiphase-initialisation">Multiphase initialisation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        In a multiphase domain some fields belong to a specific phase &mdash; most importantly the
        volume fraction, but any per-phase field &mdash; and their initial values are set in a{' '}
        <code>fluid_specific_initialization</code> block, a sibling of the ordinary per-field keys.
        It is a map keyed by material name; under each material, the field keys follow the same
        schema as the top-level initialisation (Table 6.21). Figure 6.16 initialises a water layer
        beneath air.
      </p>

      <YamlTree
        label="Figure 6.16"
        caption="Multiphase initialisation: a body of water occupying the lower part of the domain, with air above."
        lines={[
          { indent: 0, key: 'initialization:' },
          { indent: 1, key: 'fluid_specific_initialization:' },
          { indent: 2, key: 'water:' },
          { indent: 3, key: 'volume_fraction:' },
          { indent: 4, text: 'option: value' },
          { indent: 4, text: 'input_type: expression' },
          { indent: 4, text: 'volume_fraction: "if (y<=0.5, 1, 0)"' },
          { indent: 2, key: 'air:' },
          { indent: 3, key: 'volume_fraction:' },
          { indent: 4, text: 'option: value' },
          { indent: 4, text: 'input_type: expression' },
          { indent: 4, text: 'volume_fraction: "if (y<=0.5, 0, 1)"' },
        ]}
      />

      <H3 id="boundaries" num="6.3.7">Boundaries</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Boundaries are declared per domain, as a sequence under <code>boundaries</code>. Every
        domain must have one, fluid or solid. Each entry names a set of mesh sidesets, declares what
        kind of boundary they form, and &mdash; for most types &mdash; supplies the values imposed
        there under <code>boundary_details</code>.
      </p>

      <YamlTree
        label="Figure 6.17"
        caption="A boundary entry, shown with its full parent chain. Note the dash alignment: the sequence dash sits under boundaries, and name aligns with type, location and boundary_details."
        lines={[
          { indent: 0, key: 'domains:' },
          { indent: 0, dash: true, key: 'name:', text: 'default_domain' },
          { indent: 1, text: 'type: fluid' },
          { indent: 1, dots: true },
          { indent: 1, key: 'boundaries:' },
          { indent: 1, dash: true, key: 'name:', text: 'inlet' },
          { indent: 2, text: 'type: inlet' },
          { indent: 2, text: 'location: [inlet]' },
          { indent: 2, key: 'boundary_details:' },
          { indent: 3, key: 'mass_and_momentum:' },
          { indent: 4, text: 'option: velocity_components' },
          { indent: 4, text: 'u: 1.0' },
          { indent: 4, text: 'v: 0.0' },
          { indent: 1, dash: true, key: 'name:', text: 'walls' },
          { indent: 2, text: 'type: wall' },
          { indent: 2, text: 'location: [walls]' },
        ]}
      />

      <figure className="my-4">
        <Caption label="Table 6.22" className="mb-2">Boundary structural keys, common to every type.</Caption>
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
                ['name', 'yes', 'Label used in output and diagnostics.'],
                ['type', 'yes', 'See Table 6.23.'],
                ['location', 'yes', 'Mesh sidesets forming this boundary.'],
                ['boundary_details', 'depends', <>Values imposed. Not required for <code>symmetry</code>, nor for a stationary no-slip <code>wall</code>.</>],
                ['frame_type', 'no', <>Reference frame. Read only on domains that have a <code>domain_motion</code> block.</>],
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
        <Caption label="Table 6.23" className="mb-2">Boundary types, with the section documenting each.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of type</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Section</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['inlet', 'Flow enters; velocity, pressure or mass flow specified.', '#inlet'],
                ['outlet', 'Flow leaves; pressure or extrapolation specified.', '#outlet'],
                ['opening', 'Flow may enter or leave, direction determined by the solution.', '#opening'],
                ['wall', 'Solid surface, stationary or moving.', '#wall'],
                ['symmetry', 'Mirror plane; zero normal gradient and zero normal velocity.', '#symmetry'],
              ].map(([v, desc, href]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                  <td className="py-2 px-3 align-top"><a href={href as string}>{(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="note">
        <code>type</code> defaults internally to <code>symmetry</code>, but the key is read
        unconditionally and should always be given explicitly.
      </Callout>
      <Callout type="note">
        The value blocks inside <code>boundary_details</code> &mdash;{' '}
        <code>mass_and_momentum</code>, <code>heat_transfer</code>, <code>turbulence</code>,{' '}
        <code>mesh_motion</code>, <code>solid_mechanics</code> &mdash; are parsed field by field,
        each active only when its equation is being solved. The sections below cover the options in
        routine use for each; <a href="#specifying-values">Specifying values</a> describes how any
        value is specified.
      </Callout>

      <H3 id="specifying-values">Specifying values</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Every value imposed at a boundary &mdash; a velocity, a pressure, a temperature, a
        turbulence quantity &mdash; may be supplied in one of four forms, chosen by the{' '}
        <code>input_type</code> key placed alongside the value. The same mechanism serves the
        initialisation values of <a href="#initialisation">Initialisation</a>, so it is set out once
        here and referred to wherever a value leaf appears.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.24" className="mb-2">The four value forms, selected by input_type.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of input_type</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['constant (default)', 'The value is a plain number, or a vector of numbers.'],
                ['expression', <>The value is an analytic expression string &mdash; one string per component for a vector &mdash; in the variables <code>x</code>, <code>y</code>, <code>z</code> and <code>t</code>.</>],
                ['time_table', 'The value is read from a time series in an HDF5 file and interpolated to the current time.'],
                ['profile_data', 'The value is read from a spatial scatter of points in an HDF5 file and interpolated to each boundary point by inverse-distance weighting.'],
              ].map(([v, meaning]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <p style={{ color: 'var(--text-dim)' }}>
        The two file-backed forms read their data from an HDF5 file. Their additional keys are
        collected in Table 6.25; for <code>profile_data</code> the interpolation parameters are
        grouped under an <code>interpolation_options</code> map.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.25" className="mb-2">Additional keys for the file-backed value forms.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Key</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>For</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Default</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['file_path', 'both', '—', 'Path to the HDF5 file. Required.'],
                ['hdf5_group', 'time_table', 'dataset', 'Group holding the time series.'],
                ['interpolation_type', 'time_table', 'b_spline', <><code>closest</code>, <code>piecewise_linear</code> or <code>b_spline</code>.</>],
                ['interpolation_order', 'time_table', '2', <>Spline order, for <code>b_spline</code>.</>],
                ['coords_dataset', 'profile_data', '—', 'Dataset of scatter-point coordinates. Required.'],
                ['field_dataset', 'profile_data', '—', 'Dataset of scatter-point values. Required.'],
                ['donor_points_count', 'profile_data', '4', <>Neighbours used in the inverse-distance interpolation. Under <code>interpolation_options</code>.</>],
                ['distance_power_parameter', 'profile_data', '2.0', <>Distance exponent in the inverse-distance weighting. Under <code>interpolation_options</code>.</>],
              ].map(([key, forWhat, def, meaning]) => (
                <tr key={key as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{key}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{forWhat}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="inlet">Inlet</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        An inlet imposes the incoming flow. Table 6.26 lists the available specifications. The
        velocity forms fix the velocity vector directly; the pressure and mass-flow forms fix a
        scalar and take the direction of the entering flow from a separate{' '}
        <code>flow_direction</code> block (Table 6.27). Any value may be given as a constant or,
        through <code>input_type</code>, as an expression or profile (
        <a href="#specifying-values">Specifying values</a>) &mdash; which is how a non-uniform or
        time-varying inlet is prescribed.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.26" className="mb-2">Inlet mass and momentum specifications, under boundary_details &gt; mass_and_momentum.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['velocity_components', <><code>u</code>, <code>v</code>, <code>w</code> as scalars; or <code>velocity</code> as a vector when <code>input_type: expression</code>.</>],
                ['normal_speed', <><code>normal_speed</code>: a scalar magnitude directed along the inward face normal.</>],
                ['mass_flow_rate', <><code>mass_flow_rate</code>: a scalar; plus a <code>flow_direction</code> block.</>],
                ['static_pressure', <><code>relative_pressure</code>; plus a <code>flow_direction</code> block.</>],
                ['total_pressure', <><code>relative_pressure</code>; plus a <code>flow_direction</code> block.</>],
                ['velocity_components_and_static_pressure', <><code>u</code>, <code>v</code>, <code>w</code> plus <code>relative_pressure</code>. For supersonic inlets, where every quantity is specified.</>],
              ].map(([v, keys]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 6.27" className="mb-2">
          The flow_direction block, a sibling of mass_and_momentum required by the pressure- and
          mass-flow-driven inlets and by openings.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['normal_to_boundary_condition', 'None. The flow enters along the inward face normal.'],
                ['cartesian_components', <><code>flow_direction</code> as a vector, or <code>x</code>, <code>y</code>, <code>z</code> components. The vector need not be normalised.</>],
                ['cylindrical_components (3-D only)', <><code>r</code>, <code>theta</code>, <code>z</code> components plus <code>rotation_axis</code>.</>],
              ].map(([v, keys]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 6.18"
        caption="A uniform inlet with constant components."
        lines={[
          { indent: 0, key: 'boundaries:' },
          { indent: 0, dash: true, key: 'name:', text: 'inlet' },
          { indent: 1, text: 'type: inlet' },
          { indent: 1, text: 'location: [inlet]' },
          { indent: 1, key: 'boundary_details:' },
          { indent: 2, key: 'mass_and_momentum:' },
          { indent: 3, text: 'option: velocity_components' },
          { indent: 3, text: 'u: 2.806' },
          { indent: 3, text: 'v: 2.856' },
          { indent: 3, text: 'w: 0' },
        ]}
      />

      <YamlTree
        label="Figure 6.19"
        caption="The same inlet with a parabolic profile supplied as an expression. One string is given per velocity component."
        lines={[
          { indent: 0, key: 'boundaries:' },
          { indent: 0, dash: true, key: 'name:', text: 'inlet' },
          { indent: 1, text: 'type: inlet' },
          { indent: 1, text: 'location: [inlet]' },
          { indent: 1, key: 'boundary_details:' },
          { indent: 2, key: 'mass_and_momentum:' },
          { indent: 3, text: 'option: velocity_components' },
          { indent: 3, text: 'input_type: expression' },
          { indent: 3, text: 'velocity: ["6.0*y*(1.0 - y)", "0.0"]' },
        ]}
      />

      <Callout type="tip">
        Expressions are evaluated at every boundary integration point, so they may depend on
        position, on time, or on both. A smooth ramp such as{' '}
        <code>"U*(1 - exp(-t/tau))"</code> is often a more robust way to start an impulsive case
        than imposing the full velocity from the first step.
      </Callout>

      <H3 id="outlet">Outlet</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        An outlet lets flow leave the domain. In almost every case the appropriate condition is a
        specified static pressure, which fixes the pressure datum for the whole solution; the
        velocity is then extrapolated. Table 6.28 lists the options.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.28" className="mb-2">Outlet specifications, under boundary_details &gt; mass_and_momentum.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['static_pressure', <><code>relative_pressure</code>: pressure imposed, relative to the domain&rsquo;s <code>reference_pressure</code>.</>],
                ['average_static_pressure', <><code>relative_pressure</code>, plus <code>pressure_profile_blend</code>: blends between a uniform and a profiled pressure across the outlet.</>],
                ['mass_flow_rate', <><code>mass_flow_rate</code>: a scalar; plus a <code>flow_direction</code> block (Table 6.27).</>],
                ['supersonic', 'None. All quantities are extrapolated from the interior, as appropriate where the outflow is supersonic.'],
              ].map(([v, keys]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 6.20"
        caption="A standard pressure outlet."
        lines={[
          { indent: 0, key: 'boundaries:' },
          { indent: 0, dash: true, key: 'name:', text: 'outlet' },
          { indent: 1, text: 'type: outlet' },
          { indent: 1, text: 'location: [outlet]' },
          { indent: 1, key: 'boundary_details:' },
          { indent: 2, key: 'mass_and_momentum:' },
          { indent: 3, text: 'option: static_pressure' },
          { indent: 3, text: 'relative_pressure: 0' },
        ]}
      />

      <H3 id="opening">Opening</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        An opening permits flow in either direction, the solution deciding locally whether fluid
        enters or leaves. It is the correct choice for a free surface exposed to the atmosphere, or
        for any boundary where recirculation through the face is expected and an outlet would be
        unstable. Because inflow may occur, a direction must be supplied for the entering fluid
        through a <code>flow_direction</code> block (Table 6.27).
      </p>

      <figure className="my-4">
        <Caption label="Table 6.29" className="mb-2">Opening specifications, under boundary_details &gt; mass_and_momentum.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Meaning and additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['opening_pressure', <>Imposes a total pressure on inflow and a static pressure on outflow. <code>relative_pressure</code> plus a <code>flow_direction</code> block.</>],
                ['static_pressure', <>Imposes a static pressure in both directions. <code>relative_pressure</code> plus a <code>flow_direction</code> block.</>],
              ].map(([v, m]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 6.21"
        caption="An opening at the top of a free-surface domain, with entering fluid directed downwards."
        lines={[
          { indent: 0, key: 'boundaries:' },
          { indent: 0, dash: true, key: 'name:', text: 'walls' },
          { indent: 1, text: 'type: wall' },
          { indent: 1, text: 'location: [f_bot, f_left, f_right]' },
          { indent: 0, dash: true, key: 'name:', text: 'top' },
          { indent: 1, text: 'type: opening' },
          { indent: 1, text: 'location: [f_top]' },
          { indent: 1, key: 'boundary_details:' },
          { indent: 2, key: 'mass_and_momentum:' },
          { indent: 3, text: 'option: opening_pressure' },
          { indent: 3, text: 'relative_pressure: 0' },
          { indent: 2, key: 'flow_direction:' },
          { indent: 3, text: 'option: cartesian_components' },
          { indent: 3, text: 'x: 0' },
          { indent: 3, text: 'y: -1' },
        ]}
      />

      <H3 id="wall">Wall</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        A wall is a solid surface. Declared with no <code>boundary_details</code> it is a stationary
        no-slip wall, which is the common case and requires nothing further. The options in Table
        6.30 cover free-slip surfaces and walls in motion.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.30" className="mb-2">Wall specifications, under boundary_details &gt; mass_and_momentum.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['no_slip_wall (default)', <>Stationary no-slip wall. Assumed when <code>mass_and_momentum</code> is omitted.</>],
                ['free_slip_wall', 'Zero normal velocity, no tangential shear.'],
              ].map(([v, m]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <p style={{ color: 'var(--text-dim)' }}>
        A moving wall is declared through a nested <code>wall_velocity</code> block, whose options
        are listed in Table 6.31.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.31" className="mb-2">Moving-wall specifications, under mass_and_momentum &gt; wall_velocity.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['cartesian_components (default)', <><code>wall_velocity</code>: a constant velocity vector, or the component keys <code>wall_u</code>, <code>wall_v</code>, <code>wall_w</code>.</>],
                ['rotating_wall', <><code>angular_velocity</code>, <code>rotation_axis</code> and <code>origin</code>.</>],
                ['counter_rotating_wall', 'As rotating_wall. Used for a wall held stationary in the laboratory frame within a rotating domain.'],
                ['expression', <><code>wall_velocity</code>: one expression string per component, in <code>x</code>, <code>y</code>, <code>z</code> and <code>t</code>.</>],
              ].map(([v, keys]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 6.22"
        caption="The lid of a driven cavity: a wall translating at constant velocity, with the remaining walls stationary."
        lines={[
          { indent: 0, key: 'boundaries:' },
          { indent: 0, dash: true, key: 'name:', text: 'top' },
          { indent: 1, text: 'type: wall' },
          { indent: 1, text: 'location: [top]' },
          { indent: 1, key: 'boundary_details:' },
          { indent: 2, key: 'mass_and_momentum:' },
          { indent: 3, key: 'wall_velocity:' },
          { indent: 4, text: 'option: cartesian_components' },
          { indent: 4, text: 'wall_velocity: [1, 0]' },
          { indent: 0, dash: true, key: 'name:', text: 'sides' },
          { indent: 1, text: 'type: wall' },
          { indent: 1, text: 'location: [sides]' },
        ]}
      />

      <YamlTree
        label="Figure 6.23"
        caption="An oscillating wall, prescribed as an expression in time."
        lines={[
          { indent: 0, key: 'boundaries:' },
          { indent: 0, dash: true, key: 'name:', text: 'cylinder' },
          { indent: 1, text: 'type: wall' },
          { indent: 1, text: 'location: [cylinder]' },
          { indent: 1, key: 'boundary_details:' },
          { indent: 2, key: 'mass_and_momentum:' },
          { indent: 3, key: 'wall_velocity:' },
          { indent: 4, text: 'option: expression' },
          { indent: 4, text: 'wall_velocity: ["-0.377*cos(2*pi*0.2*t)", "0.0"]' },
        ]}
      />

      <Callout type="note">
        On a domain carrying a <code>domain_motion</code> block, the additional key{' '}
        <code>frame_type</code> decides whether a wall velocity is interpreted in the absolute frame
        or relative to the moving frame; and{' '}
        <code>mass_and_momentum &gt; wall_velocity_relative_to</code> may be set to{' '}
        <code>mesh_motion</code> to tie the wall velocity to the mesh motion. Both are ignored on
        stationary domains; <code>mesh_motion</code> is currently the only implemented value of{' '}
        <code>wall_velocity_relative_to</code>.
      </Callout>

      <H3 id="symmetry">Symmetry</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        A symmetry plane imposes zero normal velocity and zero normal gradient on every transported
        quantity. It takes no <code>boundary_details</code> &mdash; the condition is fully
        determined by the face geometry &mdash; so the entry consists of the three structural keys
        alone, as in Figure 6.24.
      </p>

      <YamlTree
        label="Figure 6.24"
        caption="A symmetry boundary. In a two-dimensional case run with a three-dimensional build, the front and back planes are declared this way."
        lines={[
          { indent: 0, key: 'boundaries:' },
          { indent: 0, dash: true, key: 'name:', text: 'symmetry' },
          { indent: 1, text: 'type: symmetry' },
          { indent: 1, text: 'location: [front, back]' },
        ]}
      />

      <H3 id="thermal-conditions">Thermal conditions</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Where an energy equation is active, the boundary entry carries a <code>heat_transfer</code>{' '}
        block alongside <code>mass_and_momentum</code>. The available specifications, which differ
        by boundary type, are listed in Table 6.32. At a wall the default is adiabatic, so a heated
        or cooled wall must be stated explicitly.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.32" className="mb-2">Thermal boundary specifications, under boundary_details &gt; heat_transfer.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Boundary</th>
                <th className="text-left py-2 px-3 font-mono font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['inlet', 'static_temperature', <><code>static_temperature</code></>],
                ['inlet', 'total_temperature', <><code>total_temperature</code> (subsonic only)</>],
                ['opening', 'static_temperature', <><code>static_temperature</code></>],
                ['opening', 'opening_temperature', <><code>opening_temperature</code></>],
                ['wall', 'adiabatic (default)', 'none'],
                ['wall', 'temperature', <><code>fixed_temperature</code></>],
                ['wall', 'heat_flux', <><code>heat_flux_in</code></>],
                ['wall', 'heat_transfer_coefficient', <><code>outside_temperature</code>, <code>heat_transfer_coefficient</code> (Robin condition)</>],
              ].map(([b, v, keys], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{b}</td>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 6.25"
        caption="A heated wall combining a thermal condition with the default no-slip momentum condition."
        lines={[
          { indent: 0, key: 'boundaries:' },
          { indent: 0, dash: true, key: 'name:', text: 'hot_wall' },
          { indent: 1, text: 'type: wall' },
          { indent: 1, text: 'location: [solidbottom]' },
          { indent: 1, key: 'boundary_details:' },
          { indent: 2, key: 'heat_transfer:' },
          { indent: 3, text: 'option: temperature' },
          { indent: 3, text: 'fixed_temperature: 310' },
        ]}
      />

      <H3 id="turbulence-conditions">Turbulence conditions</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        At an inlet or opening the turbulence quantities of an active RANS model must be specified.
        The <code>turbulence</code> block does this, offering four equivalent ways to state the same
        information, listed in Table 6.33. The same block serves the k, &omega; and &epsilon;
        fields.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.33" className="mb-2">Turbulence boundary specifications, under boundary_details &gt; turbulence.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['k_and_omega', <><code>k</code>, <code>omega</code>.</>],
                ['k_and_epsilon', <><code>k</code>, <code>epsilon</code>.</>],
                ['intensity_and_length_scale', <><code>fractional_intensity</code>, <code>eddy_length_scale</code>.</>],
                ['intensity_and_eddy_viscosity_ratio', <><code>fractional_intensity</code>, <code>eddy_viscosity_ratio</code>.</>],
              ].map(([v, keys]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="note">
        At a subsonic inlet all four forms are accepted. At a supersonic inlet only the explicit
        forms <code>k_and_omega</code> and <code>k_and_epsilon</code> are available.
      </Callout>

      <YamlTree
        label="Figure 6.26"
        caption="Inlet turbulence set from intensity and eddy-viscosity ratio."
        lines={[
          { indent: 0, key: 'boundary_details:' },
          { indent: 1, key: 'turbulence:' },
          { indent: 2, text: 'option: intensity_and_eddy_viscosity_ratio' },
          { indent: 2, text: 'fractional_intensity: 0.05' },
          { indent: 2, text: 'eddy_viscosity_ratio: 10' },
        ]}
      />

      <H3 id="mesh-motion-conditions">Mesh motion conditions</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        On a deforming mesh a boundary&rsquo;s displacement is set by a <code>mesh_motion</code>{' '}
        block inside <code>boundary_details</code>. Table 6.34 lists the three options. If the block
        is omitted, the boundary keeps zero specified displacement.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.34" className="mb-2">Mesh-motion boundary specifications, under boundary_details &gt; mesh_motion.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['specified_displacement', <>A <code>displacement</code> block with <code>option: cartesian_components</code> and a <code>value</code> vector, or the component keys <code>x_component</code>, <code>y_component</code>, <code>z_component</code>.</>],
                ['periodic_displacement', <>A <code>displacement</code> block with <code>frequency</code> and <code>value</code>; the boundary oscillates.</>],
                ['rigid_body_solution', <><code>rigid_body</code>: the name of a rigid body (<a href="#rigid-bodies">Rigid bodies</a>) whose computed motion drives this boundary.</>],
              ].map(([v, keys]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 6.27"
        caption="A boundary given a prescribed constant displacement."
        lines={[
          { indent: 0, key: 'boundary_details:' },
          { indent: 1, key: 'mesh_motion:' },
          { indent: 2, text: 'option: specified_displacement' },
          { indent: 2, key: 'displacement:' },
          { indent: 3, text: 'option: cartesian_components' },
          { indent: 3, text: 'value: [0.0, 0.01, 0.0]' },
        ]}
      />

      <H3 id="structural-conditions">Structural conditions</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        On a solid domain, a wall boundary carries a <code>solid_mechanics</code> block setting the
        structural condition. Table 6.35 lists the five options. Absence of the block leaves the
        surface traction-free.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.35" className="mb-2">Structural boundary specifications, under boundary_details &gt; solid_mechanics.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Additional keys</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['fixed', 'None. All displacement components held at zero.'],
                ['prescribed', <><code>displacement</code>: the imposed displacement vector; optional <code>fixed_directions</code>, a subset of <code>x</code>, <code>y</code>, <code>z</code>, restricting which components are held. If <code>fixed_directions</code> is omitted, all directions are fixed.</>],
                ['roller', <><code>direction</code>: the constrained directions, a subset of <code>x</code>, <code>y</code>, <code>z</code> (required); optional <code>displacement</code>.</>],
                ['traction', <><code>pressure</code> (scalar) and <code>shear</code> (vector).</>],
                ['mixed', <><code>x_specification</code>, <code>y_specification</code> and (3-D) <code>z_specification</code>: one map per component, each detailed in Table 6.36.</>],
              ].map(([v, keys]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 6.36" className="mb-2">
          Per-component specification for option: mixed, under x_specification, y_specification and
          z_specification.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value of option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['fixed', <><code>value</code>: the imposed displacement component.</>],
                ['fixed_flux', <><code>value</code>: the imposed traction component.</>],
                ['zero_flux', 'None. Traction-free in that direction.'],
              ].map(([v, m]) => (
                <tr key={v as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        A free surface in a solid mechanics case is not the same as an unspecified boundary. Declare
        it explicitly with <code>option: traction</code> and zero pressure and shear, so that the
        traction-free condition is imposed rather than inferred.
      </Callout>

      <H3 id="multiphase-volume-fraction">Multiphase volume fraction</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        In a multiphase domain, an inlet or opening must state how much of each phase enters. This
        is done in a <code>fluid_values</code> block, a top-level key of the boundary entry &mdash;
        separate from <code>boundary_details</code> &mdash; keyed by material name. Table 6.37 lists
        its contents.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.37" className="mb-2">Per-boundary phase specification, under boundaries[] &gt; fluid_values.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Key</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Required</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['fluid_values', 'at a multiphase inlet', 'Map keyed by material name.'],
                ['volume_fraction > option', 'yes', <>Only <code>value</code> is implemented.</>],
                ['volume_fraction > volume_fraction', <>for <code>option: value</code></>, <>The phase fraction between 0 and 1, as a constant or an <code>input_type</code> value (<a href="#specifying-values">Specifying values</a>).</>],
              ].map(([key, req, meaning]) => (
                <tr key={key as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{key}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{req}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 6.28"
        caption="A multiphase inlet admitting pure water."
        lines={[
          { indent: 0, key: 'boundaries:' },
          { indent: 0, dash: true, key: 'name:', text: 'inlet' },
          { indent: 1, text: 'type: inlet' },
          { indent: 1, text: 'location: [inlet]' },
          { indent: 1, key: 'boundary_details:' },
          { indent: 2, key: 'mass_and_momentum:' },
          { indent: 3, text: 'option: velocity_components' },
          { indent: 3, text: 'u: 1.0' },
          { indent: 3, text: 'v: 0.0' },
          { indent: 1, key: 'fluid_values:' },
          { indent: 2, key: 'water:' },
          { indent: 3, key: 'volume_fraction:' },
          { indent: 4, text: 'option: value' },
          { indent: 4, text: 'volume_fraction: 1.0' },
          { indent: 2, key: 'air:' },
          { indent: 3, key: 'volume_fraction:' },
          { indent: 4, text: 'option: value' },
          { indent: 4, text: 'volume_fraction: 0.0' },
        ]}
      />

      <Callout type="warning">
        A multiphase inlet with no <code>fluid_values</code> block aborts: the phase specification
        at an inlet is required.
      </Callout>

      <H2 id="rigid-bodies" num="6.4">Rigid bodies</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A rigid body is a six-degree-of-freedom mass whose motion is integrated from the forces and
        moments acting on it. Rigid bodies are declared as a sequence under{' '}
        <code>physical_analysis</code>, a sibling of <code>domains</code>, and are the mechanism
        behind free-floating and constrained-motion cases: a body released to fall under gravity, or
        a cylinder free to rotate under fluid torque. A boundary is tied to a body through the{' '}
        <code>rigid_body_solution</code> mesh-motion option (
        <a href="#mesh-motion-conditions">Mesh motion conditions</a>), so that the mesh follows the
        body&rsquo;s computed motion.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        Each body has four blocks &mdash; <code>name</code>, <code>basic_settings</code>,{' '}
        <code>dynamics</code> and <code>initial_conditions</code> &mdash; laid out in Figure 6.29.
      </p>

      <YamlTree
        label="Figure 6.29"
        caption="A rigid body: a cylinder free to rotate about the out-of-plane axis under the moment exerted by the flow."
        lines={[
          { indent: 0, key: 'physical_analysis:' },
          { indent: 1, dots: true },
          { indent: 1, key: 'rigid_bodies:' },
          { indent: 1, dash: true, key: 'name:', text: 'cylinder' },
          { indent: 2, key: 'basic_settings:' },
          { indent: 3, text: 'location: [cylinder]' },
          { indent: 3, text: 'mass: 1.0' },
          { indent: 3, key: 'mass_moment_of_inertia:' },
          { indent: 4, text: 'xx: 0.1' },
          { indent: 4, text: 'yy: 0.1' },
          { indent: 4, text: 'xy: 0.0' },
          { indent: 2, key: 'dynamics:' },
          { indent: 3, key: 'degrees_of_freedom:' },
          { indent: 4, key: 'rotational_degrees_of_freedom:' },
          { indent: 5, text: 'option: z_axis' },
          { indent: 2, key: 'initial_conditions:' },
          { indent: 3, text: 'angular_velocity: [0, 0, 0]' },
        ]}
      />

      <H3 id="rb-basic-settings" num="6.4.1">Basic settings</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>basic_settings</code> gives the body its mass, its inertia and the mesh parts it
        occupies. All three keys are required.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.38" className="mb-2">rigid_bodies[] &gt; basic_settings.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Key</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['location', 'Mesh parts making up the body.'],
                ['mass', 'Total mass of the body.'],
                ['mass_moment_of_inertia', 'The inertia tensor components; see Table 6.39.'],
              ].map(([key, desc]) => (
                <tr key={key} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{key}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 6.39" className="mb-2">Inertia tensor components, under basic_settings &gt; mass_moment_of_inertia.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Component</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Required</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['xx, yy, xy', 'yes', 'In-plane components; required in every build.'],
                ['zz, xz, yz', '3-D only', 'Out-of-plane components; read in three-dimensional builds only.'],
              ].map(([comp, req, notes]) => (
                <tr key={comp} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{comp}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{req}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H3 id="rb-dynamics" num="6.4.2">Dynamics</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>dynamics</code> declares the external loading on the body and which of its degrees of
        freedom are free to move. External forces and moments are optional and accumulate: any
        number of <code>external_force_definitions</code> or <code>external_moment_definitions</code>{' '}
        entries may be given, each a map with a <code>value</code> vector, and the entries are
        summed. The degrees of freedom are set by a translational and a rotational{' '}
        <code>option</code>, both drawn from the same vocabulary (Table 6.41).
      </p>

      <figure className="my-4">
        <Caption label="Table 6.40" className="mb-2">rigid_bodies[] &gt; dynamics.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Key</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Required</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['external_force_definitions', 'no', <>Sequence of maps, each with a <code>value</code> vector; summed into the external force.</>],
                ['external_moment_definitions', 'no', <>Sequence of maps, each with a <code>value</code> vector; summed into the external moment.</>],
                ['degrees_of_freedom > translational_degrees_of_freedom > option', 'no', 'Which translations are free. See Table 6.41.'],
                ['degrees_of_freedom > rotational_degrees_of_freedom > option', 'no', 'Which rotations are free. See Table 6.41.'],
              ].map(([key, req, desc]) => (
                <tr key={key as string} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{key}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{req}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <figure className="my-4">
        <Caption label="Table 6.41" className="mb-2">Accepted values for both degree-of-freedom option keys.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Axes freed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['none', 'None; the body is fully constrained in that mode.'],
                ['x_axis, y_axis', 'The single named axis.'],
                ['z_axis', 'The z axis. Three-dimensional builds only.'],
                ['x_and_y_axes', 'Both in-plane axes.'],
                ['y_and_z_axes, x_and_z_axes', 'Two axes including z. Three-dimensional builds only.'],
                ['x_y_and_z_axes', 'All three axes. Three-dimensional builds only.'],
              ].map(([v, axes]) => (
                <tr key={v} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{axes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        The degree-of-freedom <code>option</code> is matched literally. An unrecognised value
        &mdash; including a misspelling, or a three-dimensional value such as <code>z_axis</code>{' '}
        used in a two-dimensional build &mdash; silently leaves all degrees of freedom disabled,
        with no error. The body then does not move; verify the string when a body unexpectedly stays
        fixed.
      </Callout>

      <H3 id="rb-initial-conditions" num="6.4.3">Initial conditions</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>initial_conditions</code> sets the body&rsquo;s state at the start of the run. All
        four keys are optional and default to a zero vector.
      </p>

      <figure className="my-4">
        <Caption label="Table 6.42" className="mb-2">rigid_bodies[] &gt; initial_conditions. All default to zero.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Key</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['linear_velocity', 'Initial translational velocity.'],
                ['linear_acceleration', 'Initial translational acceleration.'],
                ['angular_velocity', 'Initial angular velocity.'],
                ['angular_acceleration', 'Initial angular acceleration.'],
              ].map(([key, desc]) => (
                <tr key={key} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{key}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="note">
        <code>mass</code> and <code>mass_moment_of_inertia</code> are read unconditionally: a body
        declaring <code>basic_settings</code> but omitting either aborts. The degrees of freedom, by
        contrast, default to fully constrained, so a body with no <code>degrees_of_freedom</code>{' '}
        block simply does not move.
      </Callout>
    </GsLayout>
  );
}
