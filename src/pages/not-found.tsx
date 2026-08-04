import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { BookOpen, MessageSquare } from 'lucide-react';

export default function NotFound() {
  useDocumentTitle('404 Not Found');

  return (
    <div>
      <SEO title="404 Not Found" description="The requested page was not found on the OpenAccel website." path="/404" />
      {/* Page hero band */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3 text-[var(--hot)]">Error</p>
          <h1 className="font-display text-5xl font-bold mb-3">404</h1>
          <div className="gradient-rule w-full mt-4" />
        </div>
      </div>

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center py-20">
        <p className="text-xl font-medium mb-2">Page not found</p>
        <p className="text-[var(--text-dim)] max-w-md mb-12">
          The requested URL doesn't match any page in the OpenAccel documentation or community site.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <Link
            href="/docs"
            className="flex flex-col items-center justify-center p-6 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg hover:border-[var(--cold)] transition-all group"
            style={{ minHeight: 100 }}
          >
            <BookOpen className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" style={{ color: 'var(--cold)' }} />
            <span className="font-medium">Read the Docs</span>
          </Link>
          <Link
            href="/community"
            className="flex flex-col items-center justify-center p-6 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg hover:border-[var(--hot)] transition-all group"
            style={{ minHeight: 100 }}
          >
            <MessageSquare className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" style={{ color: 'var(--hot)' }} />
            <span className="font-medium">Ask the Community</span>
          </Link>
        </div>

        <Link
          href="/"
          className="mt-12 text-sm text-[var(--text-dim)] hover:text-white underline underline-offset-4 decoration-[var(--hairline)] transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
