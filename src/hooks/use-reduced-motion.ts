/**
 * useReducedMotion — reads/writes the user's motion preference.
 *
 * Contract (mirrors use-theme):
 *   - Default: follows the OS `prefers-reduced-motion` setting on first visit.
 *   - Persisted in localStorage under "openaccel-motion" ("true" | "false").
 *   - Setting: writes data-reduce-motion on <html> + localStorage.
 *   - The blocking inline script in index.html sets the attribute before first
 *     paint (from saved choice, else OS setting) so animations don't flash on.
 *
 * All animated components (CSS and canvas) gate on html[data-reduce-motion="true"]
 * so this manual toggle freezes motion exactly like the OS setting does.
 */
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'openaccel-motion';

function readReduced(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute('data-reduce-motion') === 'true';
}

export function useReducedMotion() {
  const [reduced, setReducedState] = useState<boolean>(readReduced);

  const setReduced = useCallback((r: boolean) => {
    document.documentElement.setAttribute('data-reduce-motion', r ? 'true' : 'false');
    setReducedState(r);
    try { localStorage.setItem(STORAGE_KEY, r ? 'true' : 'false'); } catch {}
  }, []);

  const toggle = useCallback(() => {
    setReduced(!readReduced());
  }, [setReduced]);

  return { reduced, setReduced, toggle };
}
