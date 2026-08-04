import { lazy, Suspense } from 'react';
import { useRoute, Link } from 'wouter';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { SEO } from '@/components/SEO';
import { tutorials, displayTime } from '@/content/tutorials';
import { ArrowLeft, Clock, Box, Github, Download, ExternalLink, AlertTriangle } from 'lucide-react';
import NotFound from './not-found';

// Lazy-loaded case content modules — one file per case
const CASE_CONTENT: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
  cavity:           lazy(() => import('@/content/cases/cavity').then(m => ({ default: m.CavityContent }))),
  pitzDaily:        lazy(() => import('@/content/cases/pitzDaily').then(m => ({ default: m.PitzDailyContent }))),
  t106a:            lazy(() => import('@/content/cases/t106a').then(m => ({ default: m.T106AContent }))),
  airfoil:          lazy(() => import('@/content/cases/airfoil').then(m => ({ default: m.AirfoilContent }))),
  t3a:              lazy(() => import('@/content/cases/t3a').then(m => ({ default: m.T3AContent }))),
  T3A:              lazy(() => import('@/content/cases/t3a').then(m => ({ default: m.T3AContent }))),
  circularArc:      lazy(() => import('@/content/cases/circularArc').then(m => ({ default: m.CircularArcContent }))),
  flexibleDamBreak: lazy(() => import('@/content/cases/flexibleDamBreak').then(m => ({ default: m.FlexibleDamBreakContent }))),
  damBreak:         lazy(() => import('@/content/cases/damBreak').then(m => ({ default: m.DamBreakContent }))),
  perpendicularFlap: lazy(() => import('@/content/cases/perpendicularFlap').then(m => ({ default: m.PerpendicularFlapContent }))),
  staticDroplet:    lazy(() => import('@/content/cases/staticDroplet').then(m => ({ default: m.StaticDropletContent }))),
  benardCells:      lazy(() => import('@/content/cases/benardCells').then(m => ({ default: m.BenardCellsContent }))),
  slab:             lazy(() => import('@/content/cases/slab').then(m => ({ default: m.SlabContent }))),
  taylorCouette:    lazy(() => import('@/content/cases/taylorCouette').then(m => ({ default: m.TaylorCouetteContent }))),
  plateHole:        lazy(() => import('@/content/cases/plateHole').then(m => ({ default: m.PlateHoleContent }))),
  forwardStep:      lazy(() => import('@/content/cases/forwardStep').then(m => ({ default: m.ForwardStepContent }))),
  flange:           lazy(() => import('@/content/cases/flange').then(m => ({ default: m.FlangeContent }))),
  elbow:            lazy(() => import('@/content/cases/elbow').then(m => ({ default: m.ElbowContent }))),
  oscillatingBox:   lazy(() => import('@/content/cases/oscillatingBox').then(m => ({ default: m.OscillatingBoxContent }))),
  rotatingCylinder: lazy(() => import('@/content/cases/rotatingCylinder').then(m => ({ default: m.RotatingCylinderContent }))),
  risingBubble:     lazy(() => import('@/content/cases/risingBubble').then(m => ({ default: m.RisingBubbleContent }))),
  bump2D:           lazy(() => import('@/content/cases/bumpSST').then(m => ({ default: m.BumpSSTContent }))),
  oscillatingCylinder: lazy(() => import('@/content/cases/oscillatingCylinder').then(m => ({ default: m.OscillatingCylinderContent }))),
  pressurizedCylinder: lazy(() => import('@/content/cases/pressurizedCylinder').then(m => ({ default: m.PressurizedCylinderContent }))),
  flexibleBottomCavity: lazy(() => import('@/content/cases/flexibleBottomCavity').then(m => ({ default: m.FlexibleBottomCavityContent }))),
};

/** Format an ISO date string as "DD Month YYYY" */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** GitHub URL for a tutorial case directory, with non-ASCII encoded. */
function githubCaseUrl(githubFolder: string): string {
  return `https://github.com/CCFNUM/OpenAccel/tree/main/examples/${encodeURIComponent(githubFolder)}`;
}

function ContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-6 bg-[var(--surface-2)] rounded w-1/3" />
          <div className="h-4 bg-[var(--surface-2)] rounded w-full" />
          <div className="h-4 bg-[var(--surface-2)] rounded w-4/5" />
          <div className="h-48 bg-[var(--surface-2)] rounded w-full mt-4" />
        </div>
      ))}
    </div>
  );
}

function DefaultContent() {
  return (
    <div className="py-12 px-6 border border-[var(--hairline)] border-dashed rounded-lg bg-[var(--surface)] text-center">
      <h2 className="text-xl font-display mb-2 text-[var(--text)]">Documentation coming soon</h2>
      <p className="text-[var(--text-dim)]">
        The detailed write-up for this tutorial is in progress. Browse the case files directly on GitHub.
      </p>
    </div>
  );
}

function InProgressBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase px-2.5 py-1 rounded-full border border-[var(--warm)] text-[var(--warm)] bg-[var(--callout-warm-bg)]">
      <AlertTriangle size={11} /> In Progress
    </span>
  );
}

export function TutorialDetail() {
  const [match, params] = useRoute('/tutorials/:slug');
  const slug = params?.slug;
  const tutorial = tutorials.find(t => t.slug === slug);

  useDocumentTitle(tutorial ? `Tutorial: ${tutorial.displayTitle}` : 'Tutorial Not Found');

  if (!match || !tutorial) {
    return <NotFound />;
  }

  const isInProgress = tutorial.status === 'in-progress';
  const hasGithub = tutorial.githubDisabled !== true;
  const ContentComponent = CASE_CONTENT[tutorial.slug] ?? null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title={`Tutorial: ${tutorial.displayTitle}`}
        description={tutorial.description}
        path={`/tutorials/${tutorial.slug}`}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm font-mono text-[var(--text-dim)] mb-8">
        <Link href="/tutorials" className="hover:text-[var(--cold)] transition-colors flex items-center">
          <ArrowLeft size={14} className="mr-1" /> Tutorials
        </Link>
        <span className="mx-2 text-[var(--hairline)]">/</span>
        <span className="text-[var(--text)]">{tutorial.displayTitle}</span>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <div className="flex gap-2 mb-4 flex-wrap">
          {tutorial.physics.map(p => (
            <span key={p} className="text-xs font-mono uppercase px-2 py-1 rounded border border-[var(--hairline)] text-[var(--text-dim)] bg-[var(--surface)]">
              {p}
            </span>
          ))}
          <span className={`text-xs font-mono uppercase px-2 py-1 rounded border border-[var(--hairline)] bg-[var(--surface)] ${
            tutorial.difficulty === 'beginner'     ? 'text-[var(--signal)]' :
            tutorial.difficulty === 'intermediate' ? 'text-[var(--cold)]'   : 'text-[var(--hot)]'
          }`}>
            {tutorial.difficulty}
          </span>
          <span className="text-xs font-mono uppercase px-2 py-1 rounded border border-[var(--hairline)] text-[var(--text-dim)] bg-[var(--surface)]">
            {tutorial.dim}
          </span>
          {isInProgress && <InProgressBadge />}
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
          {tutorial.displayTitle}
          {isInProgress && <span className="text-[var(--text-dim)] font-normal"> (incomplete)</span>}
        </h1>

        {/* Case ID + repo identifier */}
        <div className="font-mono text-sm text-[var(--text-dim)] mb-4 flex items-center gap-3">
          <code className="text-[var(--warm)]">{tutorial.caseId}</code>
          <span className="text-[var(--hairline)]">·</span>
          <code className="text-[var(--cold)]">{tutorial.githubFolder || '—'}</code>
        </div>

        <p className="text-lg text-[var(--text-dim)] leading-relaxed mb-6">{tutorial.description}</p>

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-dim)] border-t border-[var(--hairline)] pt-4 mb-6">
          <span className="flex items-center gap-1.5">
            <Clock size={15} /> {displayTime(tutorial.estimatedTime)}
          </span>
          {tutorial.buildFlags && tutorial.buildFlags.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Box size={15} /> <code className="text-xs">{tutorial.buildFlags.join(' ')}</code>
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pb-6 border-b border-[var(--hairline)]">
          {tutorial.meshUrl ? (
            <a href={tutorial.meshUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--hairline)] text-sm font-mono bg-[var(--surface)] text-[var(--cold)] hover:bg-[var(--surface-2)] transition-colors"
              style={{ minHeight: 38 }}>
              <Download size={14} /> Download Mesh <ExternalLink size={12} />
            </a>
          ) : (
            <button disabled title="Mesh download coming soon"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--hairline)] text-sm font-mono bg-[var(--surface)] text-[var(--text-dim)] opacity-40 cursor-not-allowed">
              <Download size={14} /> Download Mesh
              <span className="text-[10px] opacity-70 font-sans normal-case ml-1">coming soon</span>
            </button>
          )}

          {tutorial.inputUrl ? (
            <a href={tutorial.inputUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--hairline)] text-sm font-mono bg-[var(--surface)] text-[var(--cold)] hover:bg-[var(--surface-2)] transition-colors"
              style={{ minHeight: 38 }}>
              <Download size={14} /> Download Input <ExternalLink size={12} />
            </a>
          ) : (
            <button disabled title="Input file download coming soon"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--hairline)] text-sm font-mono bg-[var(--surface)] text-[var(--text-dim)] opacity-40 cursor-not-allowed">
              <Download size={14} /> Download Input
              <span className="text-[10px] opacity-70 font-sans normal-case ml-1">coming soon</span>
            </button>
          )}

          {hasGithub ? (
            <a href={tutorial.githubUrl ?? githubCaseUrl(tutorial.githubFolder!)} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--hairline)] text-sm font-mono bg-[var(--surface)] text-[var(--cold)] hover:bg-[var(--surface-2)] transition-colors"
              style={{ minHeight: 38 }}>
              <Github size={14} /> Open in GitHub <ExternalLink size={12} />
            </a>
          ) : (
            <button disabled title="Repository folder not yet available"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--hairline)] text-sm font-mono bg-[var(--surface)] text-[var(--text-dim)] opacity-40 cursor-not-allowed">
              <Github size={14} /> Open in GitHub
            </button>
          )}

          {isInProgress && (
            <a href="https://github.com/CCFNUM/OpenAccel/issues" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--warm)] text-sm font-mono bg-[var(--callout-warm-bg)] text-[var(--warm)] hover:opacity-80 transition-opacity">
              <AlertTriangle size={14} /> Contribute to this case <ExternalLink size={12} />
            </a>
          )}
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-invert max-w-none text-[var(--text)]">
        {ContentComponent ? (
          <Suspense fallback={<ContentSkeleton />}>
            <ContentComponent />
          </Suspense>
        ) : (
          <DefaultContent />
        )}
      </article>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-[var(--hairline)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/tutorials" className="flex items-center text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to all tutorials
        </Link>
        <p className="text-xs font-mono text-[var(--text-dim)]">
          Last updated: {formatDate(tutorial.lastUpdated)}
        </p>
      </div>
    </div>
  );
}
