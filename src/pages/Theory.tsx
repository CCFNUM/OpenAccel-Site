import { useDocumentTitle } from '@/hooks/use-document-title';
import { SEO } from '@/components/SEO';
import { HardHat } from 'lucide-react';

export function Theory() {
  useDocumentTitle('Theory Manual');
  return (
    <div>
      <SEO
        title="Theory Manual"
        description="OpenAccel Theory Manual — coming soon."
        path="/theory"
      />

      {/* Hero */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--cold)' }}>Theory Manual</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">Theory Manual</h1>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      {/* Under Construction */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--warm) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--warm) 30%, transparent)' }}>
          <HardHat size={36} style={{ color: 'var(--warm)' }} />
        </div>
        <h2 className="font-display text-3xl font-semibold">Under Construction</h2>
        <p className="text-[var(--text-dim)] text-lg max-w-md">
          The Theory Manual is being prepared and will be available here soon.
        </p>
      </div>
    </div>
  );
}
