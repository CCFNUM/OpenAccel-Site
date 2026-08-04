import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { GsLayout, H2, ContributeButton } from './GsLayout';

export function Ch11Suite() {
  useDocumentTitle('The OpenAccel Suite — User Guide');
  return (
    <GsLayout chNum="11" title="The OpenAccel Suite" inProgress>
      <SEO title="The OpenAccel Suite — User Guide" description="The OpenAccel Suite graphical interface — chapter pending screenshots and workflow captures." path="/get-started/suite" />

      <p style={{ color: 'var(--text-dim)' }} className="mb-8 text-lg">
        This chapter documents the OpenAccel Suite — the graphical front-end for case setup,
        job submission, and results visualisation.
      </p>

      <div className="p-6 rounded-xl border border-[var(--warm)]/40 bg-[var(--surface)] mb-10"
        style={{ borderStyle: 'dashed' }}>
        <p className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--warm)' }}>
          Chapter pending
        </p>
        <p style={{ color: 'var(--text-dim)' }} className="text-sm leading-relaxed">
          This chapter is pending. It requires screenshots and workflow captures from a working
          Suite installation. The section headings below reflect the planned structure.
        </p>
        <ContributeButton />
      </div>

      <H2 id="overview">Overview</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The OpenAccel Suite is a desktop application that wraps the command-line solver with
        a graphical interface for case configuration, mesh preview, solver monitoring, and
        post-processing.
      </p>

      <H2 id="installation">Suite Installation</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="case-setup">Case Setup</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="mesh-preview">Mesh Preview</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="job-submission">Job Submission</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="monitoring">Solver Monitoring</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>

      <H2 id="post-processing">Post-Processing</H2>
      <p style={{ color: 'var(--text-dim)' }}>Content pending.</p>
    </GsLayout>
  );
}
