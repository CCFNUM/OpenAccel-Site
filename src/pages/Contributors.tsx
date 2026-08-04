import { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { getContributors } from '@/lib/github';
import { Github, Globe, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  'Project Coordinator': { color: 'var(--cold)',   bg: 'var(--cold-pill-bg)'   },
  'Project Maintainer':  { color: 'var(--violet)', bg: 'var(--violet-pill-bg)' },
  'Contributor':         { color: 'var(--signal)', bg: 'var(--signal-pill-bg)' },
};

function RolePill({ role }: { role: string }) {
  const cfg = ROLE_COLORS[role] ?? { color: 'var(--text-dim)', bg: 'var(--dim-pill-bg)' };
  return (
    <span
      className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {role}
    </span>
  );
}

const MAINTAINERS = [
  {
    name: 'Luca Mangani',
    role: 'Project Coordinator',
    institution: 'Lucerne University of Applied Sciences and Arts (HSLU)',
    github: 'https://github.com/manganiLuca',
    orcid: null,
    scholar: null,
    site: null,
  },
  {
    name: 'Lucian Hanimann',
    role: 'Project Maintainer',
    institution: 'Lucerne University of Applied Sciences and Arts (HSLU)',
    github: 'https://github.com/lucianHanimann',
    orcid: null,
    scholar: null,
    site: null,
  },
];

export function Contributors() {
  useDocumentTitle('Contributors');
  const [ghContributors, setGhContributors] = useState<any[] | null>(null);

  useEffect(() => {
    getContributors().then(setGhContributors);
  }, []);

  return (
    <div>
      <SEO
        title="Contributors"
        description="The people and institutions behind OpenAccel — project maintainers, code contributors, and sustaining funders of the open-source multiphysics CFD solver."
        path="/community/contributors"
      />
      {/* Page hero band */}
      <div className="border-b border-[var(--hairline)] bg-[var(--ink)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.1em] mb-3 text-[var(--signal)]">People</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">Contributors</h1>
          <p className="text-lg text-[var(--text-dim)] max-w-2xl">
            The people and institutions building OpenAccel.
          </p>
          <div className="gradient-rule w-full mt-6" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/community"
          className="inline-flex items-center text-sm font-mono text-[var(--text-dim)] hover:text-white mb-10 transition-colors gap-1.5"
        >
          <ArrowLeft size={13} /> Back to Community
        </Link>

        {/* Maintainers */}
        <section className="mb-20">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]"
            style={{ color: 'var(--signal)' }}>
            Project Maintainers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MAINTAINERS.map(person => (
              <div
                key={person.name}
                className="p-6 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg flex flex-col sm:flex-row gap-5"
              >
                <div
                  className="w-20 h-20 rounded bg-[var(--surface-2)] shrink-0 border border-[var(--hairline)] flex items-center justify-center overflow-hidden"
                  aria-label="Photo placeholder"
                >
                  <span className="text-[10px] text-[var(--text-dim)] font-mono text-center px-1">[TODO: photo]</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-display font-medium mb-1">{person.name}</h3>
                  <div className="mb-3">
                    <RolePill role={person.role} />
                  </div>
                  <p className="text-sm text-[var(--text-dim)] mb-4 leading-snug">{person.institution}</p>

                  <div className="flex flex-wrap gap-3 text-sm">
                    {person.github && (
                      <a
                        href={person.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[var(--text-dim)] hover:text-white transition-colors font-mono text-xs"
                        style={{ minHeight: 44 }}
                      >
                        <Github size={14} /> GitHub
                      </a>
                    )}
                    {person.orcid && (
                      <a
                        href={person.orcid}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[var(--text-dim)] hover:text-white transition-colors font-mono text-xs"
                      >
                        <Globe size={14} /> ORCID
                      </a>
                    )}
                    {person.scholar && (
                      <a
                        href={person.scholar}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[var(--text-dim)] hover:text-white transition-colors font-mono text-xs"
                      >
                        <BookOpen size={14} /> Google Scholar
                      </a>
                    )}
                    {person.site && (
                      <a
                        href={person.site}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[var(--text-dim)] hover:text-white transition-colors font-mono text-xs"
                      >
                        <Globe size={14} /> Personal site
                      </a>
                    )}
                    {!person.orcid && (
                      <span className="text-[10px] font-mono text-[var(--text-dim)] italic self-center">
                        [TODO: maintainers — ORCID / Scholar link]
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub code contributors */}
        <section className="mb-20">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)] flex items-center gap-2">
            <Github size={22} /> Code Contributors
          </h2>

          {ghContributors ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {ghContributors.map(c => (
                <a
                  key={c.login}
                  href={c.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg flex flex-col items-center text-center hover:bg-[var(--surface-2)] transition-colors group"
                  style={{ minHeight: 44 }}
                >
                  <img
                    src={c.avatarUrl}
                    alt={c.login}
                    className="w-14 h-14 rounded-full mb-3 border border-[var(--hairline)] group-hover:border-[var(--cold)] transition-colors"
                  />
                  <span className="text-sm font-medium truncate w-full">{c.login}</span>
                  <span className="text-xs text-[var(--text-dim)] font-mono">{c.contributions} commits</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--text-dim)] border border-[var(--hairline)] border-dashed rounded bg-[var(--surface)]">
              Loading contributors from GitHub…
            </div>
          )}
        </section>

        {/* Non-code contributors */}
        <section className="mb-20">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]">Non-Code Contributors</h2>
          <div className="p-6 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg text-center font-mono text-[var(--text-dim)]">
            [TODO: maintainers — add names of documentation, tutorial, mesh, and validation contributors here]
          </div>
        </section>

        {/* Institutions & Funders */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-semibold mb-6 pb-2 border-b border-[var(--hairline)]" style={{ color: 'var(--hot)' }}>
            Institutions &amp; Funders
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { abbr: 'HSLU', name: 'Lucerne University of Applied Sciences and Arts', role: 'Host Institution',     accent: 'var(--cold)'   },
              { abbr: 'AUB',  name: 'American University of Beirut',                   role: 'Supporting Institution', accent: 'var(--violet)' },
              { abbr: 'SNSF', name: 'Swiss National Science Foundation',               role: 'Funding · Grant 215627', accent: 'var(--cold)'   },
              { abbr: 'PASC', name: 'Platform for Advanced Scientific Computing',       role: 'Funding · XSES-FSI',     accent: 'var(--warm)'   },
            ].map(inst => (
              <div
                key={inst.abbr}
                className="p-4 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 bg-[var(--surface-2)] rounded border shrink-0 flex items-center justify-center text-xs font-mono font-bold"
                  style={{ borderColor: inst.accent, color: inst.accent }}
                >
                  {inst.abbr}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm leading-snug">{inst.name}</div>
                  <div className="text-xs text-[var(--text-dim)] font-mono mt-0.5">{inst.role}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[var(--text-dim)] mt-6">
            Code contributors appear automatically via GitHub. Non-code contributors can be added via PR to the website repo.
          </p>
        </section>
      </div>
    </div>
  );
}
