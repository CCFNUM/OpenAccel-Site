import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { YamlTree } from '@/components/YamlTree';
import { Caption } from '@/components/Caption';
import { TutorialFigure } from '@/components/tutorial/TutorialFigure';
import { M } from '@/components/tutorial/Equation';
import { Link } from 'wouter';
import { GsLayout, H2, H3, Callout } from './GsLayout';
import { ArrowRight } from 'lucide-react';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;
const tdBorder = { borderBottom: '1px solid var(--table-border)' } as const;

export function Ch12WorkedExample() {
  useDocumentTitle('A Complete Worked Example — User Guide');
  return (
    <GsLayout chNum="12" title="A Complete Worked Example">
      <SEO
        title="A Complete Worked Example — User Guide"
        description="Assembling the lid-driven cavity case from nothing: mesh, analysis type, domain, boundaries, initialisation, solver control, output, and materials."
        path="/get-started/worked-example"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        The preceding chapters document each block of the input file in isolation. This chapter
        assembles one case from nothing, in the order a case is actually built, and cross-references
        the chapter documenting each option as it appears.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        The case is the lid-driven cavity: a square box of stationary fluid whose upper wall slides
        at constant velocity, driving a single recirculating vortex. It is chosen because it
        exercises the complete workflow &mdash; mesh, domain, boundaries, numerics, output &mdash;
        while requiring the smallest possible input file. Every option used here is either mandatory
        or has a documented reason.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        The same case appears as VC001 in the Verification and Validation Manual, where it is
        compared against the reference centreline profiles of Ghia et al. This chapter is concerned
        with <em>how the case is driven</em>; the V&amp;V Manual is concerned with how accurate the
        answer is.
      </p>

      <Link href="/tutorials/cavity"
        className="group flex items-center gap-4 p-5 rounded-xl border border-[var(--cold)]/40 bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors my-8">
        <div className="flex-grow min-w-0">
          <p className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--cold)' }}>Related tutorial</p>
          <p className="font-display font-semibold leading-snug group-hover:text-white transition-colors">
            VC001 &mdash; Lid-Driven Cavity Flow
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
            Benchmark results and comparison with the reference profiles of Ghia et al.
          </p>
        </div>
        <ArrowRight size={16} className="shrink-0 text-[var(--cold)] opacity-70 group-hover:opacity-100 transition-opacity" />
      </Link>

      <H2 id="problem" num="12.1">The problem</H2>

      <TutorialFigure
        src="/figures/cavity_schematic.png"
        alt="The lid-driven cavity: a square domain with three stationary walls and one translating lid"
        caption={<><strong style={{ color: 'var(--text)' }}>Figure 12.1.</strong> The lid-driven cavity. Three walls are stationary and no-slip; the fourth translates at constant velocity, driving a primary vortex.</>}
      />

      <figure className="my-4">
        <Caption label="Table 12.1" className="mb-2">Case definition. The properties are chosen so that the Reynolds number is exactly 100.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Quantity</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Domain', '1 m square', 'Two-dimensional'],
                [<>Lid velocity <M math="U" /></>, '1 m/s', <>In <M math="+x" />, along the upper wall</>],
                [<>Density <M math="\rho" /></>, '1 kg/m³', 'Synthetic; see the tip below'],
                [<>Dynamic viscosity <M math="\mu" /></>, '0.01 Pa·s', 'Synthetic'],
                ['Reynolds number', <M math="Re = \rho U L / \mu = 100" />, 'Laminar and steady'],
                ['Analysis', 'Steady state', <>No time dependence at this <M math="Re" /></>],
              ].map(([q, v, n], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{q}</td>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{v}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        The properties are deliberately synthetic. Choosing <M math="\rho = 1" /> and{' '}
        <M math="\mu = 0.01" /> with a unit box and unit lid velocity makes <M math="Re" /> exactly{' '}
        <M math="100" />, which is one of the Reynolds numbers for which reference data exists.
        Naming such a material <code>air</code> would be misleading;{' '}
        <a href="/get-started/materials">Chapter 9</a> discusses why synthetic materials should be
        named for what they are.
      </Callout>

      <H2 id="mesh-prep" num="12.2">Preparing the mesh</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The case needs a structured mesh of the unit square in Exodus&nbsp;II format, with one
        element block and named sidesets for the boundaries. The names chosen here are{' '}
        <code>fluid</code> for the element block, <code>top</code> for the lid, and{' '}
        <code>sides</code> for the three stationary walls.
      </p>

      <figure className="my-4">
        <Caption label="Table 12.2" className="mb-2">Mesh entities required by this case, and the input-file key that references each.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Entity</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Name</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Referenced by</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Element block', 'fluid', 'domain > location'],
                ['Sideset', 'top', 'boundaries[] > location'],
                ['Sideset', 'sides', 'boundaries[] > location'],
              ].map(([e, n, r]) => (
                <tr key={n} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{e}</td>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{n}</td>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--text-dim)' }}>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="warning">
        Confirm the block and sideset names that were actually written by the meshing tool before
        referencing them. A name that does not resolve produces an error naming the entity, but not
        the block of the input file that expected it.
      </Callout>

      <p style={{ color: 'var(--text-dim)' }}>
        This case will be run in serial, so no decomposition is required and the 32-bit conversion
        described in <a href="/get-started/running">Chapter 3</a> can be skipped. It becomes
        necessary only when partitioning a mesh for parallel execution.
      </p>

      <H2 id="building" num="12.3">Building the input file</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The file is assembled in the order it is read: mesh, then what is solved, then how it is
        solved, then what is written out, then the material properties.
      </p>

      <H3 id="mesh-block" num="12.3.1">The mesh block</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>mesh</code> is a top-level key, a sibling of <code>simulation</code> rather than a
        child of it &mdash; the single most common structural mistake in a first input file. Nothing
        beyond the file path is needed here: no scaling, and no decomposition for a serial run. See{' '}
        <a href="/get-started/mesh">Chapter 5</a>.
      </p>
      <YamlTree
        label="Figure 12.2"
        caption="The mesh block. mesh and simulation are the only two top-level keys."
        lines={[
          { indent: 0, key: 'mesh:' },
          { indent: 1, text: 'file_path: mesh.e' },
        ]}
      />

      <H3 id="analysis-type" num="12.3.2">The analysis type</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        At <M math="Re = 100" /> the cavity flow reaches a genuine steady state, so a steady analysis is
        appropriate and no <code>time_steps</code> block is required. Declaring this as steady also
        determines which options are read later: it activates <code>physical_timescale</code> and
        suppresses <code>transient_scheme</code>. See <a href="/get-started/physical-analysis">Chapter 6</a>.
      </p>
      <YamlTree
        label="Figure 12.3"
        caption="A steady analysis needs only the option key."
        lines={[
          { indent: 0, key: 'simulation:' },
          { indent: 1, key: 'physical_analysis:' },
          { indent: 2, key: 'analysis_type:' },
          { indent: 3, text: 'option: steady_state' },
        ]}
      />

      <H3 id="domain" num="12.3.3">The domain</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        One domain covers the whole mesh. It is a fluid domain, occupies the <code>fluid</code>{' '}
        element block, and uses a single material named <code>cavity_fluid</code>, which will be
        defined at the end of the file. Because only one material is listed, no{' '}
        <code>multiphase</code> block is needed.
      </p>
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        At <M math="Re = 100" /> the flow is laminar, so <code>fluid_models</code> carries only a
        turbulence block set to <code>laminar</code>. No heat transfer, no buoyancy, no domain
        motion. See <a href="/get-started/physical-analysis">Chapter 6</a>.
      </p>
      <YamlTree
        label="Figure 12.4"
        caption="The domain entry. Note that the sequence dash aligns with domains, and name aligns with its sibling keys."
        lines={[
          { indent: 2, key: 'domains:' },
          { indent: 2, dash: true, key: 'name:', text: 'cavity' },
          { indent: 3, text: 'type: fluid' },
          { indent: 3, text: 'location: [fluid]' },
          { indent: 3, text: 'materials: [cavity_fluid]' },
          { indent: 3, key: 'fluid_models:' },
          { indent: 4, key: 'turbulence:' },
          { indent: 5, text: 'option: laminar' },
        ]}
      />

      <H3 id="boundaries" num="12.3.4">The boundaries</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Two boundary entries cover all four walls. The lid is a wall with a prescribed constant
        velocity; the remaining three are ordinary stationary no-slip walls and therefore need no{' '}
        <code>boundary_details</code> at all &mdash; an omitted details block on a wall means
        stationary and no-slip. See <a href="/get-started/physical-analysis">Chapter 6</a>.
      </p>
      <YamlTree
        label="Figure 12.5"
        caption="The boundaries. Only the moving lid requires boundary_details."
        lines={[
          { indent: 3, key: 'boundaries:' },
          { indent: 3, dash: true, key: 'name:', text: 'top' },
          { indent: 4, text: 'type: wall' },
          { indent: 4, text: 'location: [top]' },
          { indent: 4, key: 'boundary_details:' },
          { indent: 5, key: 'mass_and_momentum:' },
          { indent: 6, key: 'wall_velocity:' },
          { indent: 7, text: 'option: cartesian_components' },
          { indent: 7, text: 'wall_velocity: [1, 0]' },
          { indent: 3, dash: true, key: 'name:', text: 'sides' },
          { indent: 4, text: 'type: wall' },
          { indent: 4, text: 'location: [sides]' },
        ]}
      />
      <Callout type="note">
        The lid velocity is given as a constant vector here. Setting <code>option: expression</code>{' '}
        instead would allow the same wall to be driven by an analytic function of position and time
        &mdash; useful for ramping the lid up smoothly rather than starting it impulsively.
      </Callout>

      <H3 id="initialisation" num="12.3.5">Initialisation</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Every domain requires an <code>initialization</code> block. Starting from rest is correct
        for this case: the lid alone drives the flow, and the steady solution does not depend on the
        initial guess. See <a href="/get-started/physical-analysis">Chapter 6</a>.
      </p>
      <YamlTree
        label="Figure 12.6"
        caption="Initialisation from rest."
        lines={[
          { indent: 3, key: 'initialization:' },
          { indent: 4, key: 'velocity:' },
          { indent: 5, text: 'option: value' },
          { indent: 5, text: 'velocity: [0, 0]' },
          { indent: 4, key: 'pressure:' },
          { indent: 5, text: 'option: value' },
          { indent: 5, text: 'pressure: 0' },
        ]}
      />
      <Callout type="tip">
        Starting from rest is safe here because the cavity vortex is a stable attractor. It would
        not be safe for a case whose solution must grow from a perturbation &mdash;{' '}
        <a href="/get-started/physical-analysis">Chapter 6</a> explains why such cases need a
        seeded initial field.
      </Callout>

      <H3 id="solver-control" num="12.3.6">Solver control</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Four decisions are made here, and each is a deliberate choice rather than a default.
      </p>

      <figure className="my-4">
        <Caption label="Table 12.3" className="mb-2">Numerical settings for this case, and the reason for each.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Value</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['advection_scheme', 'high_resolution', 'The flow is smooth and the result will be compared quantitatively, so second order is warranted.'],
                ['physical_timescale', '1.0', <>The domain residence time <M math="L/U = 1/1 = 1" />&nbsp;s.</>],
                ['velocity_relaxation_factor', '0.7', <>The default of <M math="1.0" /> is no relaxation at all.</>],
                ['pressure_relaxation_factor', '0.3', 'As above.'],
                ['residual_target', '1e-8', <>The default of <M math="10^{-4}" /> is too loose to compare against reference data.</>],
                ['max_iterations', '1000', 'The default of 100 will not converge this case.'],
              ].map(([opt, val, reason], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{val}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <YamlTree
        label="Figure 12.7"
        caption="Solver control. Every value here overrides a default that would otherwise be inappropriate for this case."
        lines={[
          { indent: 1, key: 'solver:' },
          { indent: 2, key: 'solver_control:' },
          { indent: 3, key: 'basic_settings:' },
          { indent: 4, text: 'advection_scheme: high_resolution' },
          { indent: 4, key: 'convergence_controls:' },
          { indent: 5, text: 'min_iterations: 1' },
          { indent: 5, text: 'max_iterations: 1000' },
          { indent: 5, text: 'physical_timescale: 1.0' },
          { indent: 5, key: 'relaxation_parameters:' },
          { indent: 6, text: 'velocity_relaxation_factor: 0.7' },
          { indent: 6, text: 'pressure_relaxation_factor: 0.3' },
          { indent: 4, key: 'convergence_criteria:' },
          { indent: 5, text: 'residual_type: RMS' },
          { indent: 5, text: 'residual_target: 1e-8' },
        ]}
      />
      <Callout type="warning">
        Omitting <code>relaxation_parameters</code> entirely is not the same as accepting sensible
        defaults. Every relaxation factor defaults to <M math="1.0" />, which means no relaxation, and
        a case run that way will very likely diverge. See <a href="/get-started/numerics">Chapter 8</a>.
      </Callout>

      <H3 id="output" num="12.3.7">Output</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Only velocity and pressure are needed. The domain is closed apart from the moving lid, so
        there is no pressure boundary anywhere and the solver pins the pressure datum automatically;
        nothing further need be declared. See <a href="/get-started/output">Chapter 10</a>.
      </p>
      <YamlTree
        label="Figure 12.8"
        caption="Output control. For a steady run, output_frequency is a plain number."
        lines={[
          { indent: 2, key: 'output_control:' },
          { indent: 3, text: 'file_path: results.e' },
          { indent: 3, text: 'output_frequency: 50' },
          { indent: 3, text: 'output_fields: [velocity, pressure]' },
        ]}
      />

      <H3 id="material" num="12.3.8">The material</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        One material, with constant properties chosen to give Re&nbsp;=&nbsp;100. Specific heat and
        thermal conductivity are omitted because no energy equation is solved. See{' '}
        <a href="/get-started/materials">Chapter 9</a>.
      </p>
      <YamlTree
        label="Figure 12.9"
        caption="The material definition."
        lines={[
          { indent: 1, key: 'material_library:' },
          { indent: 1, dash: true, key: 'name:', text: 'cavity_fluid' },
          { indent: 2, key: 'thermodynamic_properties:' },
          { indent: 3, key: 'equation_of_state:' },
          { indent: 4, text: 'option: value' },
          { indent: 4, text: 'density: 1.0' },
          { indent: 2, key: 'transport_properties:' },
          { indent: 3, key: 'dynamic_viscosity:' },
          { indent: 4, text: 'option: value' },
          { indent: 4, text: 'dynamic_viscosity: 0.01' },
        ]}
      />

      <H2 id="complete-file" num="12.4">The complete input file</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Assembled, the fragments above give the following file. Nothing has been added: every block
        present is either mandatory or justified in Table 12.3.
      </p>

      <CodeBlock
        lang="yaml"
        label="Listing 12.1"
        caption="The complete input file for the lid-driven cavity at Re = 100."
        code={`mesh:
    file_path: mesh.e

simulation:
    physical_analysis:
        analysis_type:
            option: steady_state
        domains:
        - name: cavity
          type: fluid
          location: [fluid]
          materials: [cavity_fluid]
          fluid_models:
            turbulence:
                option: laminar
          boundaries:
          - name: top
            type: wall
            location: [top]
            boundary_details:
                mass_and_momentum:
                    wall_velocity:
                        option: cartesian_components
                        wall_velocity: [1, 0]
          - name: sides
            type: wall
            location: [sides]
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
                advection_scheme: high_resolution
                convergence_controls:
                    min_iterations: 1
                    max_iterations: 1000
                    physical_timescale: 1.0
                    relaxation_parameters:
                        velocity_relaxation_factor: 0.7
                        pressure_relaxation_factor: 0.3
                convergence_criteria:
                    residual_type: RMS
                    residual_target: 1e-8
        output_control:
            file_path: results.e
            output_frequency: 50
            output_fields: [velocity, pressure]

    material_library:
    - name: cavity_fluid
      thermodynamic_properties:
        equation_of_state:
            option: value
            density: 1.0
      transport_properties:
        dynamic_viscosity:
            option: value
            dynamic_viscosity: 0.01`}
      />

      <H2 id="running" num="12.5">Running the case</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        This is a two-dimensional case, so it must be run with the two-dimensional binary. A
        three-dimensional executable will not read it.
      </p>
      <CodeBlock lang="bash" code={`cd cavity
/path/to/OpenAccel/build-2D/openaccel-2D.exe -i input.i`} />
      <Callout type="warning">
        <code>SPATIAL_DIM</code> is fixed at compile time, so the 2-D and 3-D binaries are genuinely
        separate programs. Running a two-dimensional case with <code>openaccel-3D.exe</code> fails
        at mesh reading. See <a href="/get-started/installation">Chapter 2</a>.
      </Callout>

      <H2 id="residuals" num="12.6">Reading the residuals</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The run prints one line per outer iteration, with a residual for each active equation.
        Three behaviours are worth recognising, and are summarised in the table below.
      </p>

      <figure className="my-4">
        <Caption label="Table 12.4" className="mb-2">Interpreting the residual history.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Behaviour</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Meaning</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                [<>Smooth monotone decay to <M math="10^{-8}" /></>, 'Converged.', 'None. Proceed to post-processing.'],
                ['Decay stalls on a plateau', 'The pseudo-timescale is too large, or relaxation is too weak.', <>Reduce <code>physical_timescale</code>; see <a href="/get-started/numerics">Chapter 8</a>.</>],
                ['Stops at exactly iteration 1000', 'Not converged — the iteration budget was exhausted.', <>Raise <code>max_iterations</code> and check the final residual.</>],
              ].map(([behaviour, meaning, action], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{behaviour}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{meaning}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        The number of iterations this case takes is not reproducible between machines or between
        rank counts, and should not be used as a measure of anything. Near a tight target the
        residual curve is almost flat, so a minute change in rounding moves the crossing point
        substantially. Compare converged results, never iteration counts.
      </Callout>

      <H2 id="checking" num="12.7">Checking the answer</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        <code>results.e</code> opens in ParaView, VisIt, or any Exodus-aware tool. Three checks
        establish that the run is correct, in increasing order of rigour.
      </p>

      <figure className="my-4">
        <Caption label="Table 12.5" className="mb-2">Verifying the solution.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Check</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>What to look for</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Qualitative', 'A single primary vortex, its centre displaced above and to the right of the box centre. Two weak counter-rotating corner eddies in the lower corners.'],
                ['Boundary conditions', <>Velocity exactly <M math="(1,0)" /> along the lid and exactly zero on the other three walls. A non-zero value on a stationary wall means the sideset was not resolved.</>],
                ['Quantitative', <>Extract <M math="u" /> along the vertical centreline and <M math="v" /> along the horizontal centreline, and compare against the reference profiles of Ghia et al. reproduced in the V&amp;V Manual.</>],
              ].map(([check, look], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{check}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{look}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <Callout type="tip">
        The quantitative check is the one that matters. A plausible-looking vortex can be produced
        by a case with the wrong Reynolds number, the wrong lid velocity, or an under-resolved mesh;
        only the centreline profiles distinguish a correct solution from a merely believable one.
      </Callout>

      <H2 id="extending" num="12.8">Extending the case</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        With a working case in hand, each of the following changes introduces one new part of the
        solver. The table below lists them in increasing order of difficulty, with the chapter
        documenting each.
      </p>

      <figure className="my-4">
        <Caption label="Table 12.6" className="mb-2">Suggested extensions to this case.</Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Change</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>What it introduces</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Chapter</th>
              </tr>
            </thead>
            <tbody>
              {[
                [<>Reduce <M math="\mu" /> to 1e-3, giving <M math="Re = 1000" /></>, 'A stronger vortex and a more demanding solve; relaxation will need loosening.', '/get-started/numerics', '8'],
                ['Drive the lid by an expression rather than a constant', 'Time-dependent boundary conditions, and a transient analysis.', '/get-started/physical-analysis', '6'],
                ['Heat the lower wall and enable thermal energy', 'The energy equation and a thermal boundary condition.', '/get-started/physical-analysis', '6'],
                ['Add buoyancy with gravity and a reference temperature', 'Coupling between the momentum and energy equations.', '/get-started/physical-analysis', '6'],
                ['Replace the lower wall with a solid domain and a fluid–solid interface', 'Multi-domain coupling and conjugate heat transfer.', '/get-started/interfaces', '7'],
                ['Make the lower wall a flexible solid', 'Solid mechanics, mesh deformation, and fluid–structure interaction.', '/get-started/interfaces', '7'],
              ].map(([change, intro, href, ch], i) => (
                <tr key={i} style={tdBorder}>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text)' }}>{change}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{intro}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}><a href={href as string}>{ch}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </GsLayout>
  );
}
