import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, H3, Callout, TodoBlock } from './GsLayout';

export function Ch6PhysicalAnalysis() {
  useDocumentTitle('Physical Analysis — User Guide');
  return (
    <GsLayout chNum="6" title="Physical Analysis">
      <SEO title="Physical Analysis — User Guide" description="Configuring simulation > physical_analysis: analysis type, domains, fluid models, multiphase, solid models, sources, initialisation, and boundaries." path="/get-started/physical-analysis" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-6 text-lg">
        The <code>physical_analysis</code> block is the largest section of the input file.
        It defines every domain in the simulation, the physics model active in each domain,
        boundary conditions, source terms, and initial conditions.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mb-10">
        This chapter is split into nine sections. Use the navigation on the left to jump to
        the relevant sub-topic.
      </p>

      <H2 id="location">Location in input file</H2>
      <CodeBlock lang="yaml" code={`simulation:
  physical_analysis:  # ← this chapter
    - domain_id: fluid
      type: incompressible_flow
      . . .
    - domain_id: solid
      type: solid_mechanics
      . . .\n`} />
      <p style={{ color: 'var(--text-dim)' }}>
        <code>physical_analysis</code> is a YAML sequence. Each item is one domain.
        Multi-domain cases (FSI, CHT) have two or more items.
      </p>

      <H2 id="analysis-type">Analysis Type</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Each domain has a required <code>type</code> key that selects the governing equations:
      </p>
      <div className="overflow-x-auto mt-2 mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              <th className="text-left py-2 pr-6 font-mono font-medium" style={{ color: 'var(--text)' }}>type</th>
              <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Physics</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['incompressible_flow',  'Incompressible Navier–Stokes (laminar or RANS)'],
              ['compressible_flow',    'Compressible Navier–Stokes (density-based)'],
              ['solid_mechanics',      'Linear or nonlinear structural mechanics'],
              ['heat_conduction',      'Solid heat conduction (no flow)'],
            ].map(([t, d]) => (
              <tr key={t} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td className="py-2 pr-6 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{t}</td>
                <td className="py-2 align-top" style={{ color: 'var(--text-dim)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TodoBlock label="Full option table for analysis-type-level keys (domain_id, type, reference_frame, gravity, and buoyancy) will be added here from Chapter 6 of the User Guide." />

      <H2 id="fluid-models">Fluid Models</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The <code>fluid_model</code> sub-block specifies fluid properties for incompressible
        and compressible domains.
      </p>
      <CodeBlock lang="yaml" code={`type: incompressible_flow
fluid_model:
  kinematic_viscosity: 1.0e-6  # m²/s
  density: 1000.0              # kg/m³ (incompressible only)`} />
      <TodoBlock label="Option tables for fluid_model — covering kinematic_viscosity, density, dynamic_viscosity, specific_heat, thermal_conductivity, and equation of state options for compressible flows — will be added here from Chapter 6." />

      <H2 id="turbulence">Turbulence Models</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Activate RANS turbulence modelling via the <code>turbulence_model</code> sub-block:
      </p>
      <CodeBlock lang="yaml" code={`turbulence_model:
  type: k_omega_sst   # or: k_epsilon, spalart_allmaras
  wall_treatment: automatic`} />
      <TodoBlock label="Option tables for turbulence_model — covering type, wall_treatment, inlet turbulence intensity, and model constants — will be added here from Chapter 6." />

      <H2 id="multiphase">Multiphase</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The VOF (Volume of Fluid) method with FCT/cMULES interface sharpening is activated
        via the <code>multiphase</code> sub-block within an incompressible domain:
      </p>
      <CodeBlock lang="yaml" code={`multiphase:
  type: vof
  phases:
    - name: water
      density: 1000.0
      kinematic_viscosity: 1.0e-6
    - name: air
      density: 1.225
      kinematic_viscosity: 1.5e-5`} />
      <TodoBlock label="Option tables for the multiphase block — covering VOF flux limiter, surface tension, FCT/cMULES parameters, and initial phase distribution — will be added here from Chapter 6." />

      <H2 id="solid-models">Solid Models</H2>
      <TodoBlock label="Documentation for solid_mechanics domain options — covering material_id, formulation (linear/nonlinear), and large-deformation settings — will be added here from Chapter 6." />

      <H2 id="sources">Source Terms</H2>
      <TodoBlock label="Option tables for momentum, energy, and scalar source terms will be added here from Chapter 6." />

      <H2 id="initialisation">Initialisation</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Initial conditions are set in the <code>initialisation</code> sub-block:
      </p>
      <CodeBlock lang="yaml" code={`initialisation:
  velocity: [0.0, 0.0, 0.0]
  pressure: 0.0
  turbulence_intensity: 0.05
  turbulent_length_scale: 0.01`} />
      <TodoBlock label="Full option table for initialisation — including field-by-field defaults and patch-based initialisation — will be added here from Chapter 6." />

      <H2 id="boundaries">Boundary Conditions</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Boundary conditions are listed under <code>boundary_conditions</code> within each domain.
        Each entry targets one or more mesh parts by name:
      </p>
      <CodeBlock lang="yaml" code={`boundary_conditions:
  - type: inlet
    parts: [inlet_patch]
    velocity: [1.0, 0.0, 0.0]
    turbulence_intensity: 0.05
  - type: outlet
    parts: [outlet_patch]
  - type: wall
    parts: [top_wall, bottom_wall, side_walls]`} />
      <TodoBlock label="Option tables for all boundary condition types — inlet, outlet, wall, symmetry, periodic, moving_wall, pressure_inlet, pressure_outlet, and FSI interface — will be added here from Chapter 6 of the User Guide." />
      <Callout type="note">
        FSI coupling interfaces between fluid and solid domains are documented in{' '}
        <a href="/get-started/interfaces" style={{ color: 'var(--cold)' }} className="underline underline-offset-4">
          Chapter 7 — Interfaces
        </a>.
      </Callout>
    </GsLayout>
  );
}
