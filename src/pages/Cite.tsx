import { useDocumentTitle } from '@/hooks/use-document-title';
import { SEO } from '@/components/SEO';
import { Link } from 'wouter';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function Cite() {
  useDocumentTitle('Cite OpenAccel');
  const [copied, setCopied] = useState(false);

  const bibtex = `@misc{openaccel2024,
  title  = {{OpenAccel}: An open-source vertex-based {CVFEM} solver for multiphysics {CFD}},
  author = {Mangani, Luca and Hanimann, Lucian},
  year   = {2024},
  url    = {https://github.com/CCFNUM/OpenAccel},
  note   = {v0.2.0, BSD 3-Clause}
}`;

  const copyText = () => {
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title="Cite OpenAccel"
        description="How to cite OpenAccel in academic publications. BibTeX entry and recommended citation format for the open-source vertex-based CVFEM multiphysics CFD solver."
        path="/cite"
      />
      <h1 className="font-display text-4xl font-bold mb-6">Cite OpenAccel</h1>
      <p className="text-[var(--text-dim)] mb-8">
        If you use OpenAccel for a publication, please cite the project repository to help us track impact and secure future funding.
      </p>

      <div className="mb-12 relative group rounded bg-[var(--surface)] border border-[var(--hairline)] overflow-hidden">
        <div className="bg-[var(--surface-2)] border-b border-[var(--hairline)] px-4 py-2 text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider">
          BibTeX
        </div>
        <pre className="p-6 text-sm font-mono text-[var(--text)] overflow-x-auto leading-relaxed">
          {bibtex}
        </pre>
        <button
          onClick={copyText}
          className="absolute top-12 right-4 p-2 rounded-md bg-[var(--surface-2)] border border-[var(--hairline)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--ink)] transition-all"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-mono uppercase text-[var(--text-dim)] mb-2 tracking-wider">IEEE Format</h3>
          <p className="font-serif text-[var(--text)]">L. Mangani and L. Hanimann, "OpenAccel: An open-source vertex-based CVFEM solver for multiphysics CFD," 2024. [Online]. Available: https://github.com/CCFNUM/OpenAccel.</p>
        </div>
        <div>
          <h3 className="text-sm font-mono uppercase text-[var(--text-dim)] mb-2 tracking-wider">APA Format</h3>
          <p className="font-serif text-[var(--text)]">Mangani, L., & Hanimann, L. (2024). <i>OpenAccel: An open-source vertex-based CVFEM solver for multiphysics CFD</i> (v0.2.0) [Computer software]. https://github.com/CCFNUM/OpenAccel</p>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-[var(--hairline)] text-center">
        <Link href="/publications" className="text-[var(--cold)] hover:underline">View publications using OpenAccel →</Link>
      </div>
    </div>
  );
}