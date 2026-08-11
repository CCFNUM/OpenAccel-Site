import { useDocumentTitle } from '@/hooks/use-document-title';
import { SEO } from '@/components/SEO';
import { Building2, Briefcase, Server, GraduationCap, Heart, ExternalLink, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { SpotlightCard } from '@/components/SpotlightCard';

const TRACKS = [
  {
    id: 'institutional',
    icon: Building2,
    accent: 'var(--cold)',
    title: 'Institutional Partnership',
    desc: 'Co-authored proposals and joint project execution on a multi-year horizon.',
  },
  {
    id: 'industrial',
    icon: Briefcase,
    accent: 'var(--hot)',
    title: 'Industrial Sponsorship',
    desc: 'Priority feature development, dedicated support, and private training for your engineering team.',
  },
  {
    id: 'inkind',
    icon: Server,
    accent: 'var(--flux)',
    title: 'In-kind Contribution',
    desc: 'HPC time allocations, validation meshes, test data sharing, or CI hardware provision.',
  },
  {
    id: 'academic',
    icon: GraduationCap,
    accent: 'var(--violet)',
    title: 'Academic Collaboration',
    desc: 'Supervise a student on an OpenAccel topic or contribute a thesis project back to upstream.',
  },
  {
    id: 'individual',
    icon: Heart,
    accent: 'var(--signal)',
    title: 'Individual',
    desc: 'GitHub Sponsors or Open Collective for developers who want to support the project.',
  },
];

export function Support() {
  useDocumentTitle('Support');

  return (
    <div>
      <SEO
        title="Support OpenAccel"
        description="Support OpenAccel development through institutional partnerships, industrial sponsorship, in-kind HPC contributions, or academic collaboration."
        path="/support"
      />
      {/* Page hero band */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3 text-[var(--warm)]">Funding</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">Support OpenAccel</h1>
          <p className="text-lg text-[var(--text-dim)] max-w-3xl leading-relaxed">
            Open-source scientific software relies on institutional and industrial backing.
            Sustaining OpenAccel requires developer FTEs for feature maintenance, HPC allocations for validation campaigns,
            and dedicated time for release engineering.
          </p>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Support Tracks */}
          <div>
            <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]">Support Tracks</h2>
            <div className="space-y-4">
              {TRACKS.map(track => (
                <SpotlightCard
                  key={track.id}
                  accent={track.accent}
                  className="p-5 rounded-lg bg-[var(--surface)]"
                  style={{ borderTopColor: track.accent, borderTopWidth: 2 }}
                >
                  <div className="flex items-start gap-4">
                    <track.icon className="w-6 h-6 mt-0.5 shrink-0" style={{ color: track.accent }} />
                    <div>
                      <h3 className="font-medium text-lg mb-1" style={{ color: 'var(--text)' }}>{track.title}</h3>
                      <p className="text-sm text-[var(--text-dim)]">{track.desc}</p>
                      {track.id === 'individual' && (
                        <div className="mt-3 text-xs font-mono text-[var(--text-dim)] italic">
                          [TODO: maintainers — add GitHub Sponsors link here]
                        </div>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Get in touch */}
          <div>
            <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]">Get in touch</h2>
            <div className="p-8 border border-[var(--hairline)] bg-[var(--surface)] rounded-lg space-y-6">
              <p className="text-[var(--text-dim)] leading-relaxed">
                For general questions and partnership discussions, start a GitHub Discussion.
                For project-specific enquiries, use the contact page.
              </p>

              <a
                href="https://github.com/CCFNUM/OpenAccel/discussions/new?category=ideas"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 border border-[var(--hairline)] rounded-lg hover:border-[var(--cold)] transition-colors group"
              >
                <MessageSquare size={22} style={{ color: 'var(--cold)' }} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium" style={{ color: 'var(--text)' }}>GitHub Discussions</h3>
                  <p className="text-sm text-[var(--text-dim)]">Partnership and collaboration proposals</p>
                </div>
                <ExternalLink size={14} className="shrink-0 text-[var(--text-dim)] group-hover:text-[var(--cold)] transition-colors" />
              </a>

              <Link
                href="/contact"
                className="flex items-center gap-4 p-4 border border-[var(--hairline)] rounded-lg hover:border-[var(--cold)] transition-colors group"
              >
                <ArrowRight size={22} style={{ color: 'var(--cold)' }} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium" style={{ color: 'var(--text)' }}>Contact the team</h3>
                  <p className="text-sm text-[var(--text-dim)]">Direct inquiry via the contact page</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Current Funders */}
        <div className="border-t border-[var(--hairline)] pt-16">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-dim)] mb-12 text-center">Current Sustaining Partners</p>

          {/* Funding */}
          <div className="mb-12">
            <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-dim)] mb-6 border-b border-[var(--hairline)] pb-3">Funding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] flex flex-col gap-3">
                <div className="rounded-lg bg-white border border-[var(--hairline)] shrink-0 p-2 inline-flex"><img src={`${import.meta.env.BASE_URL}figures/snsf_logo.png`} alt="SNSF logo" className="h-16 w-auto object-contain" /></div>
                <div>
                  <div className="font-display font-semibold leading-snug">Swiss National Science Foundation</div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--cold)' }}>Grant no. 215627</div>
                  <div className="text-sm text-[var(--text-dim)] mt-2 leading-relaxed italic">
                    "Immersed Methods for Fluid-Structure-Contact-Interaction Simulations and Complex Geometries"
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] flex flex-col gap-3">
                <div className="rounded-lg bg-white border border-[var(--hairline)] shrink-0 p-2 inline-flex"><img src={`${import.meta.env.BASE_URL}figures/pasc_logo.jpg`} alt="PASC logo" className="h-16 w-auto object-contain" /></div>
                <div>
                  <div className="font-display font-semibold leading-snug">Platform for Advanced Scientific Computing</div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--cold)' }}>XSES-FSI</div>
                  <div className="text-sm text-[var(--text-dim)] mt-2 leading-relaxed italic">
                    "XSES-FSI: towards eXtreme Scale Semi-Structured discretizations for Fluid-Structure Interaction"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contributing Institutions */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-dim)] mb-6 border-b border-[var(--hairline)] pb-3">Contributing Institutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] flex flex-col gap-3">
                <div className="rounded-lg bg-white border border-[var(--hairline)] shrink-0 p-2 inline-flex"><img src={`${import.meta.env.BASE_URL}figures/hslu_logo.png`} alt="HSLU logo" className="h-16 w-auto object-contain" /></div>
                <div>
                  <div className="font-display font-semibold leading-snug">Lucerne University of Applied Sciences and Arts</div>
                  <div className="text-xs text-[var(--text-dim)] font-mono uppercase tracking-wider mt-1">Host Institution</div>
                </div>
              </div>
              <div className="p-6 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] flex flex-col gap-3">
                <div className="rounded-lg bg-white border border-[var(--hairline)] shrink-0 p-2 inline-flex"><img src={`${import.meta.env.BASE_URL}figures/aub_logo.png`} alt="AUB logo" className="h-16 w-auto object-contain" /></div>
                <div>
                  <div className="font-display font-semibold leading-snug">American University of Beirut</div>
                  <div className="text-xs text-[var(--text-dim)] font-mono uppercase tracking-wider mt-1">Supporting Institution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
