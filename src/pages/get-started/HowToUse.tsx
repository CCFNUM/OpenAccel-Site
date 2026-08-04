import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { GsLayout, H2, Callout } from './GsLayout';

export function HowToUse() {
  useDocumentTitle('How to Use This Guide — User Guide');
  return (
    <GsLayout chNum="" title="How to Use This Guide">
      <SEO
        title="How to Use This Guide — User Guide"
        description="Who this guide is for, how each chapter is structured, and the warning, tip, and note boxes used throughout the OpenAccel User Guide."
        path="/get-started/how-to-use"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        This guide is intended for users setting up OpenAccel simulations, for developers who need to
        know the existing option vocabulary before adding to it, and for reviewers assessing the
        configurability of the code.
      </p>

      <H2 id="structure">Structure of a chapter</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Each of those chapters opens with a location map of the whole input file, with the branch
        under discussion highlighted in maroon, so it is always clear where the options being
        described belong. Option tables follow, one per block, giving each option&rsquo;s default,
        accepted values and effect. Annotated YAML skeletons show how blocks nest; within them, the
        symbol <code style={{ color: 'var(--text-dim)' }}>. . .</code> marks omitted intermediate
        content.
      </p>

      <H2 id="conventions">Conventions</H2>
      <p style={{ color: 'var(--text-dim)' }}>Three kinds of highlighted box appear throughout:</p>

      <Callout type="warning">
        A <strong style={{ color: 'var(--text)' }}>warning</strong> marks behaviour that commonly
        causes incorrect results or failed runs: silent fallbacks, misleading defaults, and options
        accepted by the parser but rejected later.
      </Callout>

      <Callout type="tip">
        A <strong style={{ color: 'var(--text)' }}>tip</strong> gives practical guidance on choosing a
        value.
      </Callout>

      <Callout type="note">
        A <strong style={{ color: 'var(--text)' }}>note</strong> records supporting detail that is
        useful but not essential on a first reading.
      </Callout>
    </GsLayout>
  );
}
