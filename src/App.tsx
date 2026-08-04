import { lazy, Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Layout } from '@/components/Layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60 * 60 * 1000 },
  },
});

// Route-level code splitting: each page is loaded only when first visited.
const Home         = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const GetStarted   = lazy(() => import('@/pages/GetStarted').then(m => ({ default: m.GetStarted })));
const GsHowTo = lazy(() => import('@/pages/get-started/HowToUse').then(m => ({ default: m.HowToUse })));
const GsCh1  = lazy(() => import('@/pages/get-started/Ch1Introduction').then(m => ({ default: m.Ch1Introduction })));
const GsCh2  = lazy(() => import('@/pages/get-started/Ch2Installation').then(m => ({ default: m.Ch2Installation })));
const GsCh3  = lazy(() => import('@/pages/get-started/Ch3Running').then(m => ({ default: m.Ch3Running })));
const GsCh4  = lazy(() => import('@/pages/get-started/Ch4InputFile').then(m => ({ default: m.Ch4InputFile })));
const GsCh5  = lazy(() => import('@/pages/get-started/Ch5Mesh').then(m => ({ default: m.Ch5Mesh })));
const GsCh6  = lazy(() => import('@/pages/get-started/Ch6PhysicalAnalysis').then(m => ({ default: m.Ch6PhysicalAnalysis })));
const GsCh7  = lazy(() => import('@/pages/get-started/Ch7Interfaces').then(m => ({ default: m.Ch7Interfaces })));
const GsCh8  = lazy(() => import('@/pages/get-started/Ch8Numerics').then(m => ({ default: m.Ch8Numerics })));
const GsCh9  = lazy(() => import('@/pages/get-started/Ch9Materials').then(m => ({ default: m.Ch9Materials })));
const GsCh10 = lazy(() => import('@/pages/get-started/Ch10Output').then(m => ({ default: m.Ch10Output })));
const GsCh11 = lazy(() => import('@/pages/get-started/Ch11Suite').then(m => ({ default: m.Ch11Suite })));
const GsCh12 = lazy(() => import('@/pages/get-started/Ch12WorkedExample').then(m => ({ default: m.Ch12WorkedExample })));
const GsApp  = lazy(() => import('@/pages/get-started/AppTroubleshooting').then(m => ({ default: m.AppTroubleshooting })));
const Theory       = lazy(() => import('@/pages/Theory').then(m => ({ default: m.Theory })));
const TheoryHowToRead = lazy(() => import('@/pages/theory/TheoryHowToRead').then(m => ({ default: m.TheoryHowToRead })));
const ThCh1  = lazy(() => import('@/pages/theory/Ch1Overview').then(m => ({ default: m.Ch1Overview })));
const ThCh2  = lazy(() => import('@/pages/theory/Ch2Preliminaries').then(m => ({ default: m.Ch2Preliminaries })));
const Tutorials    = lazy(() => import('@/pages/Tutorials').then(m => ({ default: m.Tutorials })));
const TutorialDetail = lazy(() => import('@/pages/TutorialDetail').then(m => ({ default: m.TutorialDetail })));
const Publications = lazy(() => import('@/pages/Publications').then(m => ({ default: m.Publications })));
const Develop      = lazy(() => import('@/pages/Develop').then(m => ({ default: m.Develop })));
const Community    = lazy(() => import('@/pages/Community').then(m => ({ default: m.Community })));
const Contributors = lazy(() => import('@/pages/Contributors').then(m => ({ default: m.Contributors })));
const Support      = lazy(() => import('@/pages/Support').then(m => ({ default: m.Support })));
const Cite         = lazy(() => import('@/pages/Cite').then(m => ({ default: m.Cite })));
const License      = lazy(() => import('@/pages/License').then(m => ({ default: m.License })));
const Contact      = lazy(() => import('@/pages/Contact').then(m => ({ default: m.Contact })));
const NotFound     = lazy(() => import('@/pages/not-found'));

/** Redirect /gallery* → /tutorials (gallery removed) */
function GalleryRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation('/tutorials'); }, [setLocation]);
  return null;
}

/** Redirect /docs* → /theory (Documentation renamed to Theory Manual) */
function DocsRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation('/theory'); }, [setLocation]);
  return null;
}

/** Minimal skeleton shown while a lazy chunk is loading */
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--ink)] animate-pulse">
      <div className="h-48 bg-[var(--surface)] border-b border-[var(--hairline)]" />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Suspense fallback={<PageSkeleton />}>
        <Switch>
          <Route path="/"                        component={Home} />
          <Route path="/get-started"                        component={GetStarted} />
          <Route path="/get-started/how-to-use"            component={GsHowTo} />
          <Route path="/get-started/introduction"         component={GsCh1} />
          <Route path="/get-started/installation"         component={GsCh2} />
          <Route path="/get-started/running"              component={GsCh3} />
          <Route path="/get-started/input-file"           component={GsCh4} />
          <Route path="/get-started/mesh"                 component={GsCh5} />
          <Route path="/get-started/physical-analysis"    component={GsCh6} />
          <Route path="/get-started/interfaces"           component={GsCh7} />
          <Route path="/get-started/numerics"             component={GsCh8} />
          <Route path="/get-started/materials"            component={GsCh9} />
          <Route path="/get-started/output"               component={GsCh10} />
          <Route path="/get-started/suite"                component={GsCh11} />
          <Route path="/get-started/worked-example"       component={GsCh12} />
          <Route path="/get-started/troubleshooting"      component={GsApp} />
          <Route path="/theory"                           component={Theory} />
          <Route path="/theory/how-to-read"               component={TheoryHowToRead} />
          <Route path="/theory/overview"                  component={ThCh1} />
          <Route path="/theory/preliminaries"              component={ThCh2} />
          {/* /docs and /docs/* permanently redirect to /theory */}
          <Route path="/docs">{() => <DocsRedirect />}</Route>
          <Route path="/docs/:rest*">{() => <DocsRedirect />}</Route>
          <Route path="/tutorials"               component={Tutorials} />
          <Route path="/tutorials/:slug"         component={TutorialDetail} />
          {/* Gallery removed — redirect to Tutorials */}
          <Route path="/gallery">{() => <GalleryRedirect />}</Route>
          <Route path="/gallery/:rest*">{() => <GalleryRedirect />}</Route>
          <Route path="/publications"            component={Publications} />
          <Route path="/develop"                 component={Develop} />
          <Route path="/community"               component={Community} />
          <Route path="/community/contributors"  component={Contributors} />
          <Route path="/support"                 component={Support} />
          <Route path="/cite"                    component={Cite} />
          <Route path="/license"                 component={License} />
          <Route path="/contact"                 component={Contact} />
          <Route                                 component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
