import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Github, Menu, X, Sun, Moon } from 'lucide-react';
import { getRepoStats } from '@/lib/github';
import { BackToTop } from '@/components/BackToTop';
import { useTheme } from '@/hooks/use-theme';

// Nav order: Get Started · Tutorials · Theory Manual · Develop · Publications · Community · Support
const NAV_LINKS = [
  { href: '/get-started',  label: 'Get Started' },
  { href: '/tutorials',    label: 'Tutorials' },
  { href: '/theory',       label: 'Theory Manual' },
  { href: '/develop',      label: 'Develop' },
  { href: '/publications', label: 'Publications' },
  { href: '/community',    label: 'Community' },
  { href: '/support',      label: 'Support' },
];

/** Returns true if the current location matches a nav link's prefix. */
function isActive(location: string, href: string): boolean {
  if (href === '/') return location === '/';
  return location === href || location.startsWith(href + '/');
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    getRepoStats().then(stats => {
      if (stats?.stars) setStarCount(stats.stars);
    });
  }, []);

  // Close drawer and scroll to top on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  // Body scroll lock while drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Escape key closes drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const isDark = theme === 'dark';
  const toggleLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--ink)] text-[var(--text)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-[var(--cold)] focus:text-white z-50"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-[var(--ink)]/90 backdrop-blur border-b border-[var(--hairline)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Wordmark */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-display font-bold text-xl tracking-tight group">
                OpenAccel
                <div className="h-[2px] w-full mt-0.5 bg-gradient-cold-hot scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            </div>

            {/* Desktop nav (≥1024px) */}
            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-6">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[var(--cold)] relative whitespace-nowrap ${
                    isActive(location, link.href) ? 'text-[var(--text)]' : 'text-[var(--text-dim)]'
                  }`}
                >
                  {link.label}
                  {isActive(location, link.href) && (
                    <span className="absolute -bottom-5 left-0 w-full h-[2px] bg-[var(--cold)]" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop right controls */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Theme toggle — 44×44 tap target, left of GitHub icon */}
              <button
                onClick={toggle}
                aria-label={toggleLabel}
                className="flex items-center justify-center rounded-md text-[var(--text-dim)] hover:text-[var(--text)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cold)]"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <a
                href="https://github.com/CCFNUM/OpenAccel"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors flex items-center gap-2 group"
                aria-label="OpenAccel on GitHub"
                style={{ minHeight: 44, padding: '0 6px' }}
              >
                <Github size={20} />
                {starCount !== null && (
                  <span className="text-sm font-mono opacity-80 group-hover:opacity-100">{starCount}</span>
                )}
              </a>
            </div>

            {/* Hamburger (< 1024px) — 44×44 tap target */}
            <button
              onClick={() => setIsMobileMenuOpen(v => !v)}
              className="lg:hidden flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cold)]"
              style={{ minWidth: 44, minHeight: 44 }}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col"
          style={{ background: 'var(--ink)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--hairline)] shrink-0">
            <span className="font-display font-bold text-xl">OpenAccel</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cold)]"
              style={{ minWidth: 44, minHeight: 44 }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Drawer links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-2 py-4 text-lg font-medium border-b border-[var(--hairline)] transition-colors ${
                  isActive(location, link.href)
                    ? 'text-[var(--cold)]'
                    : 'text-[var(--text)] hover:text-[var(--cold)]'
                }`}
                style={{ minHeight: 44 }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/CCFNUM/OpenAccel"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-2 py-4 text-lg font-medium text-[var(--text)] hover:text-[var(--cold)] transition-colors border-b border-[var(--hairline)]"
              style={{ minHeight: 44 }}
            >
              <Github size={20} />
              GitHub
              {starCount !== null && (
                <span className="font-mono text-sm text-[var(--text-dim)]">{starCount} ★</span>
              )}
            </a>

            {/* Theme toggle row — in mobile drawer */}
            <button
              onClick={toggle}
              aria-label={toggleLabel}
              className="flex items-center justify-between w-full px-2 py-4 text-lg font-medium text-[var(--text)] hover:text-[var(--cold)] transition-colors border-b border-[var(--hairline)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cold)] focus-visible:ring-inset"
              style={{ minHeight: 44 }}
            >
              <span>{isDark ? 'Light theme' : 'Dark theme'}</span>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
        </div>
      )}

      <main id="main-content" className="flex-grow min-w-0">
        {children}
      </main>

      <footer className="border-t border-[var(--hairline)] bg-[var(--surface)] mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <span className="font-display font-bold text-lg">OpenAccel</span>
              <p className="mt-2 font-display text-sm text-[var(--text-dim)] italic">
                Multiphysics CFD, built in the open.
              </p>
              <div className="gradient-rule mt-3 w-24" />
            </div>

            {/* Learn */}
            <div>
              <h3 className="font-semibold text-xs font-mono tracking-wider uppercase text-[var(--text-dim)]">Learn</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/get-started" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">Get Started</Link></li>
                <li><Link href="/tutorials" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">Tutorials</Link></li>
                <li><Link href="/theory" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">Theory Manual</Link></li>
                <li><Link href="/publications" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">Publications</Link></li>
              </ul>
            </div>

            {/* Engage */}
            <div>
              <h3 className="font-semibold text-xs font-mono tracking-wider uppercase text-[var(--text-dim)]">Engage</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/develop" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">Develop</Link></li>
                <li><Link href="/community" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">Community</Link></li>
                <li><Link href="/support" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">Support</Link></li>
                <li><a href="https://github.com/CCFNUM/OpenAccel" target="_blank" rel="noreferrer" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">GitHub</a></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="font-semibold text-xs font-mono tracking-wider uppercase text-[var(--text-dim)]">About</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/cite" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">Cite OpenAccel</Link></li>
                <li><Link href="/license" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">License (BSD 3-Clause)</Link></li>
                <li><Link href="/contact" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--hairline)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--text-dim)] text-center md:text-left font-mono">
              Under Active Development — v0.2.0 · BSD 3-Clause
            </p>
            <Link href="/cite" className="text-sm text-[var(--text-dim)] hover:text-[var(--cold)] transition-colors">
              Cite OpenAccel
            </Link>
          </div>
        </div>
      </footer>

      {/* Global back-to-top button */}
      <BackToTop />
    </div>
  );
}
