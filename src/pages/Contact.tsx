import { useDocumentTitle } from '@/hooks/use-document-title';
import { SEO } from '@/components/SEO';
import { Github, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';

export function Contact() {
  useDocumentTitle('Contact');

  return (
    <div>
      <SEO
        title="Contact"
        description="Get in touch with the OpenAccel team for technical questions, partnerships, and academic collaboration."
        path="/contact"
      />
      {/* Page hero band */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3 text-[var(--cold)]">Get in touch</p>
          <h1 className="font-display text-4xl font-bold mb-3">Contact</h1>
          <p className="text-lg text-[var(--text-dim)]">
            Reach the OpenAccel team for technical questions, partnerships, or academic collaboration.
          </p>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Online Channels — primary contact method */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-2 pb-2 border-b border-[var(--hairline)]">Online Channels</h2>
          <p className="text-sm text-[var(--text-dim)] mb-6">
            All contact goes through GitHub. Choose the channel that fits your enquiry — do not send email.
          </p>
          <div className="space-y-3">
            <a
              href="https://github.com/CCFNUM/OpenAccel/discussions"
              target="_blank"
              rel="noreferrer"
              className="flex items-center p-4 border border-[var(--hairline)] rounded-lg hover:border-[var(--cold)] bg-[var(--surface)] transition-all group"
              style={{ minHeight: 72 }}
            >
              <MessageSquare size={20} className="mr-4 shrink-0" style={{ color: 'var(--cold)' }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">GitHub Discussions</h3>
                <p className="text-sm text-[var(--text-dim)]">General questions, ideas, partnership proposals, show-and-tell</p>
              </div>
              <ExternalLink size={14} className="shrink-0 text-[var(--text-dim)] group-hover:text-[var(--cold)] transition-colors" />
            </a>

            <a
              href="https://github.com/CCFNUM/OpenAccel/issues/new"
              target="_blank"
              rel="noreferrer"
              className="flex items-center p-4 border border-[var(--hairline)] rounded-lg hover:border-[var(--hot)] bg-[var(--surface)] transition-all group"
              style={{ minHeight: 72 }}
            >
              <Github size={20} className="mr-4 shrink-0" style={{ color: 'var(--hot)' }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">GitHub Issues</h3>
                <p className="text-sm text-[var(--text-dim)]">Bug reports and reproducible technical issues</p>
              </div>
              <ExternalLink size={14} className="shrink-0 text-[var(--text-dim)] group-hover:text-[var(--hot)] transition-colors" />
            </a>

            <a
              href="https://github.com/CCFNUM/OpenAccel"
              target="_blank"
              rel="noreferrer"
              className="flex items-center p-4 border border-[var(--hairline)] rounded-lg hover:border-[var(--signal)] bg-[var(--surface)] transition-all group"
              style={{ minHeight: 72 }}
            >
              <Github size={20} className="mr-4 shrink-0" style={{ color: 'var(--signal)' }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">GitHub Repository</h3>
                <p className="text-sm text-[var(--text-dim)]">Source code, releases, and project documentation</p>
              </div>
              <ExternalLink size={14} className="shrink-0 text-[var(--text-dim)] group-hover:text-[var(--signal)] transition-colors" />
            </a>
          </div>
        </section>

        {/* Partnership inquiry */}
        <section>
          <div className="p-8 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg text-center">
            <h2 className="font-display text-xl font-semibold mb-3">Partnership or funding inquiry?</h2>
            <p className="text-[var(--text-dim)] mb-6 max-w-md mx-auto">
              For institutional partnerships, industrial sponsorship, or academic collaborations, see the full range of support tracks.
            </p>
            <a
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-cold-hot text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              style={{ minHeight: 44 }}
            >
              Support options <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
