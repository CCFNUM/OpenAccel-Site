import { AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { DocCallout } from '@/components/DocCallout';
import { Caption } from '@/components/Caption';
import { TheoryLayout } from './TheoryLayout';

const thStyle = { color: 'var(--table-header-fg)', background: 'var(--table-header-bg)' } as const;

export function AppRejected() {
  useDocumentTitle('Registered-but-Rejected Options — Theory Manual');
  return (
    <TheoryLayout chNum="A" title="Registered-but-Rejected Options">
      <SEO
        title="Registered-but-Rejected Options — Theory Manual"
        description="Options accepted by the input parser but rejected or unreachable at run time, collected in one place for quick diagnosis."
        path="/theory/rejected-approaches"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        Several options are present in the parser string tables but are rejected or unreachable at
        run time. They are collected here so a configuration that &ldquo;should&rdquo; work but
        does not can be diagnosed quickly; this reflects the state of the source at the release on
        the title page.
      </p>

      <figure className="my-4">
        <Caption label="Table A.1" className="mb-2">
          Options accepted by the parser but rejected or unreachable at run time.
        </Caption>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Option</th>
                <th className="text-left py-2 px-3 font-medium" style={thStyle}>Behaviour</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['updated_lagrangian', <>Rejected: &ldquo;not implemented yet&rdquo;. Only <code>total_lagrangian</code> works.</>],
                ['lumped_mass: false', <>Rejected: the consistent mass matrix is not implemented; solid dynamics uses lumped mass (see <a href="/theory/solid">Chapter 9</a>).</>],
                ['rms_courant (timestep adaptation)', <>Rejected; only <code>max_courant</code> functions.</>],
                ['probe (post-processing)', <>Constructor stub; <code>reduction</code> and <code>force</code> are implemented.</>],
                ['piecewise_linear (restart interpolation)', <>Rejected in the restart context; silently falls back to linear.</>],
                ['homogeneous: false (inhomogeneous multiphase)', <>Rejected: not supported.</>],
                ['wall_function: standard', <>Unreachable: <em>k</em>&ndash;<em>&epsilon;</em> is forced to <code>scalable</code> and SST to <code>automatic</code>, so <code>standard</code> is never selected.</>],
                ['signed_distance_function (wall distance)', <>Every lifecycle method throws &ldquo;not implemented yet&rdquo; unconditionally; only <code>poisson</code> and <code>mesh_wave</code> function (see <a href="/theory/turbulence">Chapter 4</a>).</>],
              ].map(([opt, behaviour]) => (
                <tr key={opt as string} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="py-2 px-3 align-top font-mono text-xs" style={{ color: 'var(--cold)' }}>{opt}</td>
                  <td className="py-2 px-3 align-top" style={{ color: 'var(--text-dim)' }}>{behaviour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        One further criterion deserves repeating here although it is nominally
        &ldquo;implemented&rdquo;: the FSI convergence criterion <code>fsi_force_residual</code>{' '}
        is registered and parses, but its residual is never computed and its check
        unconditionally reports not-converged &mdash; a simulation using only this criterion
        never converges (see <a href="/theory/rigidbody-fsi">Chapter 10</a>).
      </DocCallout>
    </TheoryLayout>
  );
}
