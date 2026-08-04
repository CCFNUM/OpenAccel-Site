import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { YamlTree } from '@/components/YamlTree';
import { InputMap } from '@/components/InputMap';
import { Caption } from '@/components/Caption';
import { GsLayout, H2, Callout } from './GsLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;

export function Ch9Materials() {
  useDocumentTitle('Materials — User Guide');
  return (
    <GsLayout chNum="9" title="Materials">
      <SEO
        title="Materials — User Guide"
        description="The material_library block: equation of state, specific heat capacity, dynamic viscosity, thermal conductivity, and buoyancy and mechanical properties."
        path="/get-started/materials"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        <code>material_library</code> is a top-level child of <code>simulation</code>, holding a
        flat sequence of named material definitions. Domains reference materials by name through
        their <code>materials</code> list (<a href="/get-started/physical-analysis">Chapter 6</a>).
      </p>

      <H2 id="location" num="9.1">Location in the input file</H2>

      <figure className="my-6">
        <InputMap highlight="materials" />
        <Caption label="Figure 9.1" className="mt-2">Position of the material_library block.</Caption>
      </figure>

      <YamlTree
        label="Figure 9.2"
        caption="Structure of a material entry."
        lines={[
          { indent: 0, key: 'simulation:' },
          { indent: 1, dots: true },
          { indent: 1, key: 'material_library:' },
          { indent: 1, dash: true, key: 'name:', text: 'air' },
          { indent: 2, key: 'thermodynamic_properties:' },
          { indent: 3, text: 'equation_of_state:' },
          { indent: 3, text: 'specific_heat_capacity:' },
          { indent: 2, key: 'transport_properties:' },
          { indent: 3, text: 'dynamic_viscosity:', comment: 'fluid domains only' },
          { indent: 3, text: 'thermal_conductivity:' },
          { indent: 2, key: 'buoyancy_properties:' },
          { indent: 3, text: 'thermal_expansivity:' },
          { indent: 2, key: 'mechanical_properties:', comment: 'solids' },
          { indent: 3, text: 'young_modulus:' },
          { indent: 3, text: 'poisson_ratio:' },
        ]}
      />

      <p style={{ color: 'var(--text-dim)' }}>
        Every property block follows the same pattern: an <code>option</code> key selecting how the
        property is evaluated, followed by the parameters that option requires.
      </p>

      <H2 id="eos" num="9.2">Equation of state</H2>

      <figure className="my-4">
        <Caption label="Table 9.1" className="mb-2">Equation of state, under <code>thermodynamic_properties &gt; equation_of_state</code>.</Caption>
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
                ['option', 'value', <><code>value</code> for constant density; <code>ideal_gas</code> for a compressible gas.</>],
                ['density', '—', <>Constant density, when <code>option: value</code>.</>],
                ['molar_mass', '1', <>Molar mass, when <code>option: ideal_gas</code>.</>],
              ].map(([opt, def, desc]) => (
                <tr key={opt as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
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
        Solid materials must use <code>option: value</code>. This is enforced by a debug-only
        assertion, so a release build will not report the error.
      </Callout>

      <H2 id="cp" num="9.3">Specific heat capacity</H2>

      <figure className="my-4">
        <Caption label="Table 9.2" className="mb-2">Specific heat capacity, under <code>thermodynamic_properties &gt; specific_heat_capacity</code>.</Caption>
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
                ['option', 'value', <><code>value</code> or <code>zero_pressure_polynomial</code>.</>],
                ['specific_heat_capacity', '—', <>Constant value, when <code>option: value</code>.</>],
                ['a1 … a5', '0.0', <>Polynomial coefficients. All five are required when <code>option: zero_pressure_polynomial</code>.</>],
                ['a6, a7, a8', '0.0', 'Optional higher-order coefficients, read in sequence: each is consulted only if the previous one was supplied.'],
              ].map(([opt, def, desc]) => (
                <tr key={opt as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="viscosity" num="9.4">Dynamic viscosity</H2>

      <figure className="my-4">
        <Caption label="Table 9.3" className="mb-2">
          Dynamic viscosity, under <code>transport_properties &gt; dynamic_viscosity</code>. Read on
          fluid domains only; silently skipped for solids.
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
                ['option', 'value', <><code>value</code> or <code>sutherlands_formula</code>.</>],
                ['dynamic_viscosity', '—', <>Constant value, when <code>option: value</code>.</>],
                ['reference_temperature', '273.0', 'Sutherland reference temperature.'],
                ['reference_viscosity', '0.0', 'Sutherland reference viscosity.'],
                ['sutherlands_constant', '0.0', 'Sutherland constant S.'],
                ['temperature_exponent', '0.0', 'Exponent in the Sutherland expression.'],
              ].map(([opt, def, desc]) => (
                <tr key={opt as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="conductivity" num="9.5">Thermal conductivity</H2>

      <figure className="my-4">
        <Caption label="Table 9.4" className="mb-2">
          Thermal conductivity, under <code>transport_properties &gt; thermal_conductivity</code>.
          Read on both fluid and solid domains.
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
                ['option', 'value', <><code>value</code>, <code>sutherlands_formula</code> or <code>kinetic_theory_model</code>.</>],
                ['thermal_conductivity', '—', <>Constant value, when <code>option: value</code>.</>],
                ['reference_temperature', '273.0', 'Sutherland form.'],
                ['reference_thermal_conductivity', '0.0', 'Sutherland form.'],
                ['sutherlands_constant', '0.0', 'Sutherland form.'],
                ['temperature_exponent', '0.0', 'Sutherland form.'],
                ['c1, c2', '0.0', 'Both required for kinetic_theory_model.'],
              ].map(([opt, def, desc]) => (
                <tr key={opt as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{def}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <H2 id="buoyancy-mechanical" num="9.6">Buoyancy and mechanical properties</H2>

      <figure className="my-4">
        <Caption label="Table 9.5" className="mb-2">
          Thermal expansivity and mechanical properties. Each takes <code>option: value</code>{' '}
          followed by the property value.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Block</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Accepted</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Required for</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['buoyancy_properties > thermal_expansivity', 'value', <>Boussinesq buoyancy (<a href="/get-started/physical-analysis">Chapter 6</a>).</>],
                ['mechanical_properties > young_modulus', 'value', 'Any solid mechanics model.'],
                ['mechanical_properties > poisson_ratio', 'value', 'Any solid mechanics model.'],
              ].map(([block, acc, req]) => (
                <tr key={block as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{block}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{acc}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{req}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="note">
        Both <code>young_modulus</code> and <code>poisson_ratio</code> are read unconditionally once
        <code> mechanical_properties</code> is present. Declaring the block with only one of them
        aborts.
      </Callout>

      <H2 id="worked-examples" num="9.7">Worked examples</H2>

      <CodeBlock
        lang="yaml"
        label="Listing 9.1"
        caption="Constant-property air and a compressible ideal gas."
        code={`material_library:
- name: air
  thermodynamic_properties:
    equation_of_state:
        option: value
        density: 1.185
    specific_heat_capacity:
        option: value
        specific_heat_capacity: 1006.43
  transport_properties:
    dynamic_viscosity:
        option: value
        dynamic_viscosity: 1.831e-5
    thermal_conductivity:
        option: value
        thermal_conductivity: 0.0261

- name: air_ideal_gas
  thermodynamic_properties:
    equation_of_state:
        option: ideal_gas
        molar_mass: 28.96
    specific_heat_capacity:
        option: value
        specific_heat_capacity: 1004.4
  transport_properties:
    dynamic_viscosity:
        option: value
        dynamic_viscosity: 1.831e-5
    thermal_conductivity:
        option: value
        thermal_conductivity: 2.61e-2`}
      />

      <Callout type="tip">
        Verification cases often use deliberately synthetic properties chosen so that a
        dimensionless group takes an exact value &mdash; a Prandtl number of unity, or a
        solid-to-fluid conductivity ratio of one. Such a material is not air, and naming it{' '}
        <code>air</code> invites the values to be silently &ldquo;corrected&rdquo; later. Name
        synthetic materials for what they are.
      </Callout>
    </GsLayout>
  );
}
