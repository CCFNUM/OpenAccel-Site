import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { CodeBlock } from '@/components/CodeBlock';
import { GsLayout, H2, H3, Callout, TodoBlock } from './GsLayout';

export function Ch4InputFile() {
  useDocumentTitle('Input File Reference — User Guide');
  return (
    <GsLayout chNum="4" title="Input File Reference">
      <SEO title="Input File Reference — User Guide" description="The OpenAccel input file structure: top-level keys, types, defaults, and YAML conventions." path="/get-started/input-file" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-10 text-lg">
        OpenAccel cases are configured entirely through a single YAML file. This chapter describes the
        file structure and conventions. Chapters 5–10 document each block in detail.
      </p>

      <H2 id="structure">Top-Level Structure</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        The input file has two top-level keys. All other configuration is nested within them:
      </p>
      <CodeBlock lang="yaml" code={`mesh:               # Chapter 5 — mesh source and settings
  . . .

simulation:
  physical_analysis: # Chapter 6 — domains, models, boundaries
    . . .
  material_library:  # Chapter 9 — material property definitions
    . . .
  solver:
    solver_control:  # Chapter 8 — time stepping, convergence
      . . .
    output_control:  # Chapter 10 — output files, monitors, restart
      . . .`} />

      <Callout type="note">
        The <code>interfaces</code> block (Chapter 7) is nested inside{' '}
        <code>simulation &gt; physical_analysis</code>, alongside domain definitions.
      </Callout>

      <H2 id="conventions">Conventions</H2>
      <H3 id="types">Types</H3>
      <div className="overflow-x-auto mt-2 mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              <th className="text-left py-2 pr-6 font-mono font-medium" style={{ color: 'var(--text)' }}>YAML type</th>
              <th className="text-left py-2 pr-6 font-medium" style={{ color: 'var(--text)' }}>In this guide</th>
              <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Example</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['string',   'string',  '"exodus", "rcb"'],
              ['float',    'real',    '1.225, 1.0e-5'],
              ['integer',  'integer', '500, 4'],
              ['boolean',  'bool',    'true, false'],
              ['sequence', 'list',    '[1.0, 0.0, 0.0]'],
              ['mapping',  'map',     'nested key: value block'],
            ].map(([y, g, ex]) => (
              <tr key={y} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td className="py-2 pr-6 font-mono text-xs align-top" style={{ color: 'var(--cold)' }}>{y}</td>
                <td className="py-2 pr-6 align-top" style={{ color: 'var(--text-dim)' }}>{g}</td>
                <td className="py-2 font-mono text-xs align-top" style={{ color: 'var(--text-dim)' }}>{ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3 id="units">Units</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        All physical quantities are in <strong style={{ color: 'var(--text)' }}>SI units</strong> unless
        the option description explicitly states otherwise. There is no unit-conversion layer — values
        are passed directly to the solver.
      </p>

      <H3 id="keys">Key Rules</H3>
      <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: 'var(--text-dim)' }}>
        <li>Keys are <strong style={{ color: 'var(--text)' }}>case-sensitive</strong>.</li>
        <li>Unknown keys are rejected at parse time with an explicit error message.</li>
        <li>Required keys with no default are listed with <code>—</code> in the Default column of option tables.</li>
        <li>Boolean values must be lowercase <code>true</code> or <code>false</code>; YAML's <code>yes</code>/<code>no</code> are not accepted.</li>
      </ul>

      <H2 id="validate">Validating Without Running</H2>
      <p style={{ color: 'var(--text-dim)' }} className="mb-4">
        Use <code>--validate</code> to parse and validate the input file without running the solver:
      </p>
      <CodeBlock lang="bash" code={`./build/OpenAccel case.yaml --validate`} />
      <p style={{ color: 'var(--text-dim)' }} className="mt-4">
        This is useful during case setup to catch typos and missing required keys before submitting
        a long job.
      </p>

      <H2 id="full-reference">Full Key Reference</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The{' '}
        <span className="inline-block border border-dashed border-[var(--warm)] rounded px-2 py-0.5 text-sm font-mono"
          style={{ color: 'var(--warm)' }}>
          [TODO: maintainers — reference appendix: complete generated inventory of every accepted key,
          with nesting path, type, default, accepted values and source location]
        </span>{' '}
        is a complete, generated inventory of every accepted key. Where this guide and the appendix
        disagree, the appendix is authoritative.
      </p>

      <TodoBlock label="A field-by-field reference table for every key in the input file will be added here when the reference appendix is compiled. In the meantime, each block is documented in its own chapter (5–10)." />
    </GsLayout>
  );
}
