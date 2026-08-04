import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, H3, Callout } from './GsLayout';

export function Ch1Introduction() {
  useDocumentTitle('Introduction — User Guide');
  return (
    <GsLayout chNum="1" title="Introduction">
      <SEO title="Introduction — User Guide" description="Scope of the OpenAccel User Guide. CVFEM method overview, input file structure, and minimal working case." path="/get-started/introduction" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-10 text-lg">
        This guide documents the options available in the OpenAccel input file. It covers what each option
        does. For why — the governing equations, discretisation, and algorithms behind each setting — see
        the companion Solver Theory Guide.
      </p>

      <H2 id="scope">Scope</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel is a finite-volume CFD and CSM solver for incompressible and compressible flows,
        fluid–structure interaction, conjugate heat transfer, and solid mechanics. It is built in C++20
        and parallelised with MPI via the Trilinos/STK mesh infrastructure.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        This guide covers Chapters 1–12 of the User Guide (Release v1.0, 89 pp.). Anything not listed
        here or in the{' '}
        <span className="inline-block border border-dashed border-[var(--warm)] rounded px-2 py-0.5 text-sm font-mono"
          style={{ color: 'var(--warm)' }}>
          [TODO: maintainers — reference appendix: complete generated inventory of every accepted key,
          with nesting path, type, default, accepted values and source location]
        </span>{' '}
        is not a valid key.
      </p>

      <H2 id="cvfem">The CVFEM Method</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel uses a <strong style={{ color: 'var(--text)' }}>Control-Volume Finite Element Method (CVFEM)</strong> on
        unstructured meshes. The computational domain is partitioned into non-overlapping control volumes
        constructed around mesh nodes. Fluxes are integrated over the control-volume faces, which cut
        through the interior of mesh elements. This gives the method the geometric flexibility of FEM
        with the conservation properties of FVM.
      </p>
      <Callout type="note">
        The full derivation of the CVFEM discretisation — including the edge-based flux assembly, the
        pressure-velocity coupling algorithm, and the linear-solver interface — is in the Solver Theory Guide.
      </Callout>

      <H2 id="input-file">The Input File</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel is configured entirely through a single YAML file passed on the command line.
        The file has five top-level keys:
      </p>
      <CodeBlock lang="yaml" code={`mesh:          # Chapter 5
  . . .

simulation:
  physical_analysis:   # Chapter 6
    . . .
  material_library:    # Chapter 9
    . . .
  solver:
    solver_control:    # Chapter 8
      . . .
    output_control:    # Chapter 10
      . . .\n`} />
      <p style={{ color: 'var(--text-dim)' }}>
        Chapters 5–10 each document one branch of this tree. Chapter 7 (Interfaces) documents the
        <code> interfaces</code> sub-block within <code>physical_analysis</code>.
      </p>

      <H2 id="minimal-case">Minimal Case</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The smallest valid input file specifies a mesh, one physical analysis domain, and solver settings.
        The lid-driven cavity (VC001) is the canonical minimal case:
      </p>
      <CodeBlock lang="yaml" code={`mesh:
  type: exodus
  path: mesh/cavity.exo

simulation:
  physical_analysis:
    - domain_id: fluid
      type: incompressible_flow
      fluid_model:
        kinematic_viscosity: 0.01
  solver:
    solver_control:
      type: steady
      max_outer_iterations: 500`} />
      <Callout type="tip">
        The worked example in{' '}
        <a href="/get-started/worked-example" style={{ color: 'var(--cold)' }} className="underline underline-offset-4">
          Chapter 12
        </a>{' '}
        walks through this exact case end-to-end, including mesh generation and result interpretation.
        The same case appears as VC001 in the Validation Manual.
      </Callout>

      <H2 id="key-rules">Key Rules</H2>
      <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: 'var(--text-dim)' }}>
        <li>YAML keys are <strong style={{ color: 'var(--text)' }}>case-sensitive</strong>. <code>Mesh</code> is not the same as <code>mesh</code>.</li>
        <li>Unknown keys are rejected at parse time with an explicit error message naming the offending key and its location in the file.</li>
        <li>All physical quantities are in <strong style={{ color: 'var(--text)' }}>SI units</strong> unless the option description states otherwise.</li>
        <li>Boolean options accept <code>true</code> / <code>false</code> (lowercase).</li>
      </ul>

      <H3 id="broken-refs">Note on Cross-References</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The printed User Guide cites a reference appendix — a complete, generated inventory of every
        accepted key — in three places. That appendix was not included in Release v1.0. The sentences
        that reference it are preserved on this site with visible placeholders.
      </p>
    </GsLayout>
  );
}
