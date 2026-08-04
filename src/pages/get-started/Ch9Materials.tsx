import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, H3, Callout, TodoBlock } from './GsLayout';

export function Ch9Materials() {
  useDocumentTitle('Materials — User Guide');
  return (
    <GsLayout chNum="9" title="Materials">
      <SEO title="Materials — User Guide" description="Configuring simulation > material_library: defining fluid and solid material properties in OpenAccel." path="/get-started/materials" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-6 text-lg">
        The <code>material_library</code> block defines named material property sets that are
        referenced by domain definitions in <code>physical_analysis</code>.
      </p>

      <H2 id="location">Location in input file</H2>
      <CodeBlock lang="yaml" code={`simulation:
  material_library:   # ← this chapter
    - name: water
      . . .
    - name: steel
      . . .
  physical_analysis:
    - domain_id: fluid
      material_id: water
      . . .\n`} />

      <H2 id="fluid-materials">Fluid Materials</H2>
      <CodeBlock lang="yaml" code={`material_library:
  - name: air
    type: fluid
    density: 1.225              # kg/m³
    dynamic_viscosity: 1.81e-5  # Pa·s
    specific_heat: 1005.0       # J/(kg·K)
    thermal_conductivity: 0.026 # W/(m·K)`} />
      <Callout type="note">
        For incompressible flows, <code>density</code> may also be specified directly in the
        <code> fluid_model</code> block of the domain. If both are present, <code>material_library</code>
        takes precedence.
      </Callout>
      <TodoBlock label="Full option table for fluid material properties — covering density, dynamic_viscosity, kinematic_viscosity, specific_heat, thermal_conductivity, and temperature-dependent property functions — will be added here from Chapter 9." />

      <H2 id="solid-materials">Solid Materials</H2>
      <CodeBlock lang="yaml" code={`material_library:
  - name: steel
    type: solid
    density: 7850.0          # kg/m³
    youngs_modulus: 200.0e9  # Pa
    poissons_ratio: 0.3
    thermal_expansion: 12.0e-6  # 1/K (optional)`} />
      <TodoBlock label="Full option table for solid material properties — density, Young's modulus, Poisson's ratio, yield strength (for nonlinear models), and thermal expansion — will be added here from Chapter 9." />

      <H3 id="nonlinear">Nonlinear Material Models</H3>
      <TodoBlock label="Documentation for nonlinear solid material models (neo-Hookean, Mooney–Rivlin) and their additional parameters will be added here from Chapter 9." />

      <H2 id="referencing">Referencing a Material</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Domains reference materials by name via <code>material_id</code>:
      </p>
      <CodeBlock lang="yaml" code={`physical_analysis:
  - domain_id: structural_wall
    type: solid_mechanics
    material_id: steel   # must match a name in material_library`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        The solver errors at parse time if <code>material_id</code> does not match any entry in
        <code> material_library</code>.
      </p>
    </GsLayout>
  );
}
