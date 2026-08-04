import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { YamlTree } from '@/components/YamlTree';
import { Equation } from '@/components/tutorial/Equation';
import { GsLayout, H2, H3, Callout } from './GsLayout';
import 'katex/dist/katex.min.css';

export function Ch1Introduction() {
  useDocumentTitle('Introduction — User Guide');
  return (
    <GsLayout chNum="1" title="Introduction">
      <SEO
        title="Introduction — User Guide"
        description="Scope of OpenAccel, the vertex-centred CVFEM discretisation, the input-file structure, and a minimal complete case."
        path="/get-started/introduction"
      />

      <H2 id="overview" num="1.1">Overview</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel is a parallel, multi-physics CFD solver written in C++20 and built on the Trilinos
        library suite. Within a single framework it handles fluid flow, heat transfer, solid mechanics,
        free-surface multiphase flow, and fluid&ndash;structure interaction. Parallelism is
        distributed-memory through MPI, with mesh management and field storage handled by the Trilinos
        STK infrastructure.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        The distinguishing architectural feature is the multi-domain design. The user defines an
        arbitrary number of computational domains, each with its own material, mesh topology and
        resolution. The framework inspects the physics declared on each domain, identifies equations
        that appear on more than one, and assembles them into a single implicitly coupled linear
        system. Domains sharing no physics remain independent.
      </p>

      <H3 id="governing-equations">Governing equations</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        All conservation laws solved by OpenAccel are written in the generic transport form:
      </p>
      <Equation
        label="1.1"
        math={String.raw`\frac{\partial(\rho \phi)}{\partial t} + \nabla\cdot(\rho\mathbf{v}\phi) = \nabla\cdot(\Gamma^{\phi} \nabla\phi) + S^{\phi}`}
      />
      <p style={{ color: 'var(--text-dim)' }}>
        where <Equation math="\phi" display={false} /> is the conserved quantity,{' '}
        <Equation math="\Gamma^{\phi}" display={false} /> its diffusivity, and{' '}
        <Equation math="S^{\phi}" display={false} /> a volumetric source. Specialisations of this
        equation produce the continuity, momentum, energy, turbulence, volume-fraction, and
        structural-displacement equations. The full set, together with constitutive relations, is
        documented in the <a href="/theory">Solver Theory Guide</a>.
      </p>

      <H2 id="spatial-discretisation" num="1.2">Spatial discretisation</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The discretisation is the vertex-centred Control-Volume Finite-Element Method (CVFEM). Unknowns
        are stored at mesh vertices; control volumes are median-dual cells built around each node.
        Fluxes at sub-control surfaces are evaluated using isoparametric shape-function interpolation.
        The method retains strict finite-volume conservation while accepting mixed element topologies
        &mdash; hexahedra, tetrahedra, wedges and pyramids &mdash; uniformly.
      </p>

      <H2 id="input-file" num="1.3">The input file</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        A simulation is defined by one YAML file, conventionally named <code>input.i</code>, together
        with a mesh in Exodus&nbsp;II format.
      </p>

      <YamlTree
        label="Figure 1.1"
        caption="The two top-level blocks of input.i. Note that mesh is a sibling of simulation, not a child of it."
        lines={[
          { indent: 0, key: 'mesh:', comment: 'Chapter 5' },
          { indent: 1, text: 'file_path: mesh.e' },
          { indent: 1, dots: true },
          { indent: 0, key: 'simulation:' },
          { indent: 1, key: 'physical_analysis:' },
          { indent: 2, comment: 'what is solved – Chapters 6 and 7' },
          { indent: 1, key: 'solver:' },
          { indent: 2, comment: 'how it is solved – Chapters 8 and 10' },
          { indent: 1, key: 'material_library:' },
          { indent: 2, comment: 'material properties – Chapter 9' },
        ]}
      />

      <p style={{ color: 'var(--text-dim)' }}>
        <a href="/get-started/input-file">Chapter 4</a> describes this structure in full; chapters{' '}
        <a href="/get-started/mesh">5</a> to <a href="/get-started/output">10</a> then document each
        branch in turn, following the file from top to bottom.
      </p>

      <H2 id="minimal-case" num="1.4">A minimal case</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The following is a complete, runnable input file for steady laminar flow through a
        two-dimensional channel. It exercises every block a simulation requires and nothing more.
      </p>

      <CodeBlock
        lang="yaml"
        label="Listing 1.1"
        caption="A minimal complete input file. Every block shown is mandatory."
        code={`mesh:
    file_path: mesh.e
simulation:
    physical_analysis:
        analysis_type:
            option: steady_state
        domains:
        - name: fluid
          location: [fluid]
          materials: [air]
          type: fluid
          fluid_models:
            turbulence:
                option: laminar
          boundaries:
          - name: inlet
            type: inlet
            location: [inlet]
            boundary_details:
                mass_and_momentum:
                    option: velocity_components
                    u: 1.0
                    v: 0.0
          - name: outlet
            type: outlet
            location: [outlet]
            boundary_details:
                mass_and_momentum:
                    option: static_pressure
                    relative_pressure: 0
          - name: walls
            type: wall
            location: [walls]
          initialization:
            velocity:
                option: value
                velocity: [0, 0]
            pressure:
                option: value
                pressure: 0
    solver:
        solver_control:
            basic_settings:
                advection_scheme: upwind
                convergence_controls:
                    min_iterations: 1
                    max_iterations: 500
                    physical_timescale: 1.0
                    relaxation_parameters:
                        velocity_relaxation_factor: 0.7
                        pressure_relaxation_factor: 0.3
                convergence_criteria:
                    residual_type: RMS
                    residual_target: 1e-6
        output_control:
            file_path: results.e
            output_frequency: 10
            output_fields: [velocity, pressure]
    material_library:
    - name: air
      thermodynamic_properties:
        equation_of_state:
            option: value
            density: 1.185
      transport_properties:
        dynamic_viscosity:
            option: value
            dynamic_viscosity: 1.831e-5`}
      />

      <Callout type="note">
        Omitting <code>convergence_controls</code>, <code>convergence_criteria</code>,{' '}
        <code>output_control</code>, <code>boundaries</code> or <code>initialization</code> aborts the
        run at parse time with an explanatory message.
      </Callout>
    </GsLayout>
  );
}
