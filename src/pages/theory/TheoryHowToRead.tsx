import { AlertTriangle, Info } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { KeyBox } from '@/components/KeyBox';
import { SourceBox } from '@/components/SourceBox';
import { DocCallout } from '@/components/DocCallout';
import { H2 } from '../get-started/GsLayout';

export function TheoryHowToRead() {
  useDocumentTitle('How to Read This Guide — Theory Manual');
  return (
    <div>
      <SEO
        title="How to Read This Guide — Theory Manual"
        description="Audience, organisation, and the four callout boxes used throughout the OpenAccel Theory Manual: key result, note, caution, and implementation."
        path="/theory/how-to-read"
      />

      {/* Hero */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--cold)' }}>
            Theory Manual
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-bold mb-1">How to read this guide</h1>
          <div className="gradient-rule w-full mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="docs-content" style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text)', maxWidth: '72ch' }}>

          <p style={{ color: 'var(--text-dim)' }}>
            <strong style={{ color: 'var(--text)' }}>Audience.</strong> This guide is written for the
            engineer or researcher who wants to understand the equations behind an OpenAccel
            simulation, for developers extending the solver, and for reviewers assessing the
            credibility of the numerics.
          </p>

          <p style={{ color: 'var(--text-dim)' }} className="mt-4">
            <strong style={{ color: 'var(--text)' }}>Organisation.</strong> The guide is in five
            parts. <strong style={{ color: 'var(--text)' }}>Part I</strong> fixes notation and the
            mesh preliminaries. <strong style={{ color: 'var(--text)' }}>Part II</strong> presents
            the governing equations and physical models in continuum form.{' '}
            <strong style={{ color: 'var(--text)' }}>Part III</strong> develops the numerical
            discretisation &mdash; the CVFEM spatial scheme, temporal schemes, boundary conditions,
            and non-conformal interfaces. <strong style={{ color: 'var(--text)' }}>Part IV</strong>{' '}
            presents the solution algorithms (velocity&ndash;pressure coupling and linear solvers).{' '}
            <strong style={{ color: 'var(--text)' }}>Part V</strong> documents the implementation,
            post-processing and mesh quality.
          </p>

          <H2 id="conventions">Conventions and callouts</H2>
          <p style={{ color: 'var(--text-dim)' }}>Four highlighted boxes recur:</p>

          <KeyBox>
            A <strong>key-result</strong> box flags the headline equation of a section &mdash; the
            one to remember.
          </KeyBox>

          <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
            A note records a modelling assumption or a limit of validity.
          </DocCallout>

          <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
            A caution marks behaviour that surprises users: an option registered but rejected at run
            time, a hard-coded constant, a label that does not mean what it means in other codes, or a
            silent fallback.
          </DocCallout>

          <SourceBox>
            An <strong>implementation</strong> box maps the theory to the module that carries it, so a
            developer can go straight from an equation to the code that assembles it.
          </SourceBox>

        </div>
      </div>
    </div>
  );
}
