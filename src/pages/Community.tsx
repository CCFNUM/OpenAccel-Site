import { useDocumentTitle } from '@/hooks/use-document-title';
import { SEO } from '@/components/SEO';
import { communityConfig } from '@/config/community';
import { Megaphone, Github, Users, HelpCircle, Lightbulb, ExternalLink, Tv, Megaphone as MegaphoneIcon } from 'lucide-react';
import { Link } from 'wouter';
import { SpotlightCard } from '@/components/SpotlightCard';

function BugIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/>
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
      <path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/>
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c-2.1.2-3.73 1.9-3.73 4"/>
      <path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
    </svg>
  );
}

const DISCUSSION_CATEGORIES = [
  { icon: HelpCircle,  label: 'Q&A',           desc: 'Ask for help using OpenAccel',    path: 'q-a',           color: 'var(--cold)',   bg: 'var(--callout-cold-bg)' },
  { icon: Lightbulb,   label: 'Ideas',          desc: 'Propose new physics or features', path: 'ideas',         color: 'var(--violet)', bg: 'var(--violet-pill-bg)' },
  { icon: Tv,          label: 'Show &amp; Tell', desc: 'Share your simulation results',   path: 'show-and-tell', color: 'var(--flux)',   bg: 'var(--flux-pill-bg)' },
  { icon: MegaphoneIcon,label: 'Announcements', desc: 'Releases and project news',       path: 'announcements', color: 'var(--warm)',   bg: 'var(--callout-warm-bg)' },
];

const FAQ = [
  {
    q: 'CMake cannot find Trilinos',
    a: 'Ensure the Spack environment is active (`spack env activate tools/spack/openaccel-env`), or set TRILINOS_DIR to your Trilinos installation prefix.',
  },
  {
    q: 'Build fails with MPI errors',
    a: 'Ensure MPICH or OpenMPI is in your PATH. If CMake detects a different MPI than the one used by Trilinos, the build will fail with link-time errors.',
  },
  {
    q: 'Spack install takes too long',
    a: 'Spack builds everything from source by default. Configure a binary mirror (buildcache) for standard packages like GCC, OpenMPI, and CMake to speed this up significantly.',
  },
  {
    q: 'Segfault on decomposition',
    a: 'Check that Zoltan2 was built with the same MPI implementation and that the number of ranks divides the mesh cleanly for your chosen decomposition method.',
  },
  {
    q: 'Residuals stagnate after a few iterations',
    a: 'Check your boundary condition specification in the YAML file. Missing or contradictory BCs are the most common cause of non-convergence in new cases.',
  },
];

export function Community() {
  useDocumentTitle('Community');

  return (
    <div>
      <SEO
        title="Community"
        description="Join the OpenAccel community: GitHub Discussions, bug reports, case submissions, and FAQ & troubleshooting for the open-source CFD solver."
        path="/community"
      />
      {/* Page hero band */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3 text-[var(--violet)]">Community</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">Community</h1>
          <p className="text-lg text-[var(--text-dim)] max-w-3xl">
            Connect with OpenAccel maintainers and users, ask questions, share results, and follow project news.
          </p>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="md:col-span-2 space-y-12">

            {/* Discussions */}
            <section>
              <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                <Github size={22} style={{ color: 'var(--cold)' }} /> GitHub Discussions
              </h2>
              <p className="text-[var(--text-dim)] mb-6 leading-relaxed">
                GitHub Discussions is our primary forum for Q&amp;A, ideas, show-and-tell, and announcements.
                Questions go here — bugs go to GitHub Issues (see below).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {DISCUSSION_CATEGORIES.map(cat => (
                  <SpotlightCard key={cat.path}
                    external
                    href={`https://github.com/${communityConfig.githubOrg}/${communityConfig.githubRepo}/discussions/categories/${cat.path}`}
                    accent={cat.color}
                    className="p-4 bg-[var(--ink)] rounded group"
                  >
                    <cat.icon size={20} className="mb-2 transition-transform group-hover:scale-110" style={{ color: cat.color }} />
                    <h3 className="font-medium mb-0.5" style={{ color: 'var(--text)' }} dangerouslySetInnerHTML={{ __html: cat.label }} />
                    <p className="text-xs text-[var(--text-dim)]">{cat.desc}</p>
                  </SpotlightCard>
                ))}
              </div>
              <a href={`https://github.com/${communityConfig.githubOrg}/${communityConfig.githubRepo}/discussions/new`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-[var(--cold)] text-white font-medium rounded hover:opacity-90 transition-opacity gap-2"
                style={{ minHeight: 44 }}>
                Start a Discussion <ExternalLink size={14} />
              </a>
            </section>

            {/* Bug Reports */}
            <section>
              <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                <BugIcon style={{ color: 'var(--hot)' }} /> Report a Bug
              </h2>
              <div className="prose prose-invert max-w-none text-[var(--text-dim)] text-sm">
                <p>Bugs go to GitHub Issues, not Discussions. A good bug report includes:</p>
                <ul className="space-y-1 mt-3 mb-4">
                  {[
                    'The exact version or commit hash (`./build/OpenAccel --version`)',
                    'Your CMake configuration flags',
                    'The number of MPI ranks used',
                    'The input YAML file (or relevant sections)',
                    'The residual history output leading up to the crash/divergence',
                  ].map(item => <li key={item}>{item}</li>)}
                </ul>
                <a href={`https://github.com/${communityConfig.githubOrg}/${communityConfig.githubRepo}/issues/new`}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium transition-colors"
                  style={{ color: 'var(--hot)', textDecoration: 'none' }}>
                  Open an Issue Template <ExternalLink size={13} />
                </a>
              </div>
            </section>

            {/* Submit Your Case */}
            <section>
              <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                <Megaphone size={22} style={{ color: 'var(--flux)' }} /> Submit Your Case
              </h2>
              <div className="p-6 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg">
                <p className="text-[var(--text-dim)] mb-6 leading-relaxed">
                  Have simulation results to share? Open a GitHub Discussion in Show &amp; Tell with your case description,
                  mesh details, physics setup, and result images. Accepted cases can be added to the tutorial pages.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href={`https://github.com/${communityConfig.githubOrg}/${communityConfig.githubRepo}/discussions/new?category=show-and-tell`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--surface-2)] border border-[var(--hairline)] rounded text-sm hover:border-[var(--flux)] hover:text-white transition-colors"
                    style={{ minHeight: 44 }}>
                    Post in Show &amp; Tell <ExternalLink size={14} />
                  </a>
                  <a href={`https://github.com/${communityConfig.githubOrg}/${communityConfig.githubRepo}/issues/new`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--hairline)] rounded text-sm text-[var(--text-dim)] hover:text-white hover:border-[var(--text-dim)] transition-colors"
                    style={{ minHeight: 44 }}>
                    Open an Issue <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </section>

            {/* FAQ & Troubleshooting — moved from old Documentation page */}
            <section id="faq" className="scroll-mt-24">
              <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                <HelpCircle size={22} style={{ color: 'var(--signal)' }} /> FAQ &amp; Troubleshooting
              </h2>
              <div className="space-y-6">
                {FAQ.map(({ q, a }) => (
                  <div key={q} className="border-b border-[var(--hairline)] pb-6 last:border-b-0 last:pb-0">
                    <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>{q}</h4>
                    <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{a}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <p className="text-sm text-[var(--text-dim)]">
                  Not finding the answer? <a
                    href={`https://github.com/${communityConfig.githubOrg}/${communityConfig.githubRepo}/discussions/categories/q-a`}
                    target="_blank" rel="noreferrer"
                    className="underline underline-offset-4 hover:text-[var(--cold)] transition-colors"
                    style={{ color: 'var(--cold)' }}>
                    Ask in GitHub Discussions → Q&A
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Events & News — releases only */}
            <div className="p-6 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Megaphone size={18} style={{ color: 'var(--warm)' }} /> Events &amp; News
              </h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <span className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: 'var(--hot)' }}>Release</span>
                  <span className="font-medium" style={{ color: 'var(--text)' }}>v0.2.0 Released</span>
                  <p className="text-[var(--text-dim)] mt-1">Added support for partitioned ALE FSI.</p>
                </li>
              </ul>
            </div>

            {/* People of OpenAccel */}
            <div className="p-6 border border-[var(--hairline)] bg-[var(--surface-2)] rounded-lg text-center">
              <Users size={28} className="mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
              <h3 className="font-display font-semibold mb-2">People of OpenAccel</h3>
              <p className="text-sm text-[var(--text-dim)] mb-4">Meet the maintainers and contributors building the solver.</p>
              <Link href="/community/contributors"
                className="text-sm hover:text-white underline underline-offset-4 transition-all"
                style={{ color: 'var(--text)', textDecorationColor: 'var(--hairline)' }}>
                View Contributors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
