/**
 * useTheme — reads/writes the active colour theme.
 *
 * Contract:
 *   - Default: "dark" (matches index.html blocking script default).
 *   - Persisted in localStorage under "openaccel-theme".
 *   - Setting a theme: sets data-theme on <html>, writes localStorage.
 *   - During the switch: adds data-theme-transitioning to <html> for 200ms
 *     so CSS can apply a short transition. Under prefers-reduced-motion the
 *     CSS rule turns off all transitions anyway.
 */
import { useState, useCallback } from 'react';

export type Theme = 'dark' | 'light';
const STORAGE_KEY = 'openaccel-theme';
const TRANSITION_MS = 200;

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark';
}

export function useTheme() {
  // Initialise from the data-theme already set by the blocking inline script.
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const setTheme = useCallback((t: Theme) => {
    const html = document.documentElement;

    // Enable transition window
    html.setAttribute('data-theme-transitioning', '');
    html.setAttribute('data-theme', t);
    setThemeState(t);

    try { localStorage.setItem(STORAGE_KEY, t); } catch {}

    // Remove transition class after the animation completes
    const timer = setTimeout(() => html.removeAttribute('data-theme-transitioning'), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, []);

  const toggle = useCallback(() => {
    setTheme(readTheme() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return { theme, setTheme, toggle };
}
