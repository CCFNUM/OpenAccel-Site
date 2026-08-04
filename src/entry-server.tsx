/**
 * entry-server.tsx
 * Server-side rendering entry point for static prerendering.
 * Used by scripts/prerender.mjs — not imported by the client bundle.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router as WouterRouter, Route, Switch } from 'wouter';
import { Layout } from './components/Layout';

// Pages imported eagerly for SSR (no React.lazy in the server bundle)
import { Home }         from './pages/Home';
import { GetStarted }   from './pages/GetStarted';
import { Theory }       from './pages/Theory';
import { Docs }         from './pages/Docs';          // legacy — now redirects
import { Tutorials }    from './pages/Tutorials';
import { TutorialDetail } from './pages/TutorialDetail';
import { Publications } from './pages/Publications';
import { Develop }      from './pages/Develop';
import { Community }    from './pages/Community';
import { Contributors } from './pages/Contributors';
import { Support }      from './pages/Support';
import { Cite }         from './pages/Cite';
import { License }      from './pages/License';
import { Contact }      from './pages/Contact';
import NotFound         from './pages/not-found';

function createStaticHook(path: string) {
  return (): [string, (to: string) => void] => [path, () => {}];
}

export interface RenderResult {
  html: string;
  helmet: Record<string, any> | null;
}

export function render(url: string): RenderResult {
  const helmetContext: Record<string, any> = {};
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <WouterRouter hook={createStaticHook(url)}>
          <Layout>
            <Switch>
              <Route path="/"                        component={Home} />
              <Route path="/get-started"             component={GetStarted} />
              <Route path="/theory"                  component={Theory} />
              <Route path="/docs"                    component={Theory} />
              <Route path="/tutorials"               component={Tutorials} />
              <Route path="/tutorials/:slug"         component={TutorialDetail} />
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
          </Layout>
        </WouterRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet ?? null };
}
