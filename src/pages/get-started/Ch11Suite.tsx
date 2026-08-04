import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { GsLayout, H2, Callout, ContributeButton } from './GsLayout';

export function Ch11Suite() {
  useDocumentTitle('The OpenAccel Suite — User Guide');
  return (
    <GsLayout chNum="11" title="The OpenAccel Suite" inProgress>
      <SEO
        title="The OpenAccel Suite — User Guide"
        description="The OpenAccel Suite — chapter pending screenshots and workflow captures from a working Suite installation."
        path="/get-started/suite"
      />

      <Callout type="note">
        <em>This chapter is pending. It requires screenshots and workflow captures from a working
        Suite installation.</em>
      </Callout>
      <ContributeButton />

      <H2 id="installation-launch">Installation and launch</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="importing-geometry">Importing geometry</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="creating-geometry">Creating geometry</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="meshing">Meshing</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="case-setup">Case setup</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="running-solver">Running the solver</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="post-processing">Post-processing</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>
    </GsLayout>
  );
}
