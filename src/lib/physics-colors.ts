/** Maps physics category names to CSS custom-property color tokens. */
export const PHYSICS_COLORS: Record<string, string> = {
  incompressible:  'var(--cold)',
  compressible:    'var(--violet)',
  turbulence:      'var(--violet)',
  multiphase:      'var(--flux)',
  fsi:             'var(--hot)',
  'heat-transfer': 'var(--warm)',
  'solid-mechanics':'var(--signal)',
};

/** Returns the CSS color string for a given physics tag. Falls back to --text-dim. */
export function physicsColor(tag: string): string {
  return PHYSICS_COLORS[tag] ?? 'var(--text-dim)';
}

/** Returns the Tailwind utility class for a physics pill badge. */
export function physicsTagClass(tag: string): string {
  const map: Record<string, string> = {
    incompressible:  'tag-incompressible',
    compressible:    'tag-compressible',
    turbulence:      'tag-turbulence',
    multiphase:      'tag-multiphase',
    fsi:             'tag-fsi',
    'heat-transfer': 'tag-heat-transfer',
    'solid-mechanics':'tag-solid-mechanics',
  };
  return map[tag] ?? 'tag-default';
}
