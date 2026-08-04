export type TutorialGroup =
  | 'Incompressible Flows'
  | 'Compressible Flows'
  | 'Heat Transfer and Buoyancy'
  | 'Free-Surface and Multi-Physics'
  | 'Rotating Frames'
  | 'Solid Mechanics';

export type TutorialStatus = 'complete' | 'in-progress';

export interface Tutorial {
  caseId: string;           // VC001 … VC024
  slug: string;             // URL slug  /tutorials/:slug
  displayTitle: string;
  title: string;            // legacy compat
  group: TutorialGroup;
  /** exact folder name in repo examples/ — undefined if no folder exists yet */
  githubFolder?: string;
  /** true when the GitHub button should be disabled */
  githubDisabled?: boolean;
  /** direct URL to the GitHub case-folder (auto-derived from githubFolder when absent) */
  githubUrl?: string;
  /** URL to download / browse the mesh files for this case */
  meshUrl?: string;
  /** URL to download / browse the solver input files for this case */
  inputUrl?: string;
  lastUpdated: string;      // ISO date
  physics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dim: string;
  description: string;
  tags: string[];
  buildFlags: string[];
  estimatedTime: string;
  status: TutorialStatus;
}

export const tutorials: Tutorial[] = [

  // ── 1. Incompressible Flows ─────────────────────────────────────────────
  {
    caseId: 'VC001', slug: 'cavity', displayTitle: 'Lid-Driven Cavity Flow', title: 'Lid-driven cavity',
    group: 'Incompressible Flows', githubFolder: 'cavity', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/cavity',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/cavity/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/cavity',
    physics: ['incompressible'], difficulty: 'beginner', dim: '2D', status: 'complete',
    description: 'Classic entry test for any incompressible solver. A moving lid drives a primary central vortex and corner eddies; validated against Ghia et al. (1982) centreline profiles at Re = 100.',
    tags: ['incompressible', 'laminar', 'benchmark'], buildFlags: [], estimatedTime: '< 1 min',
  },
  {
    caseId: 'VC002', slug: 'pitzDaily', displayTitle: 'Pitz–Daily Backward-Facing Step', title: 'Backward-facing step (Pitz-Daily)',
    group: 'Incompressible Flows', githubFolder: 'pitzDaily', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/pitzDaily',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/pitzDaily/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/pitzDaily',
    physics: ['turbulence'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Workhorse benchmark for separated turbulent shear flows. Validates k–ω SST and k–ε closures; reattachment length and velocity profiles compared with Ruck & Makiola (1993).',
    tags: ['turbulence', 'RANS', 'k-omega SST', 'k-epsilon', 'separation'], buildFlags: [], estimatedTime: '2–10 min',
  },
  {
    caseId: 'VC003', slug: 't106a', displayTitle: 'T106A Low-Pressure Turbine Cascade', title: 'T106A turbine cascade',
    group: 'Incompressible Flows', githubFolder: 't106a', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/t106a',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/t106a/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/t106a',
    physics: ['turbulence', 'incompressible'], difficulty: 'advanced', dim: '2D', status: 'complete',
    description: 'Turbine cascade with γ–Re_θt Transition SST model and translational periodic BCs. Long suction-side separation bubble validated against Stadtmüller (2001) and Wissink DNS (2003).',
    tags: ['turbulence', 'transition', 'periodic', 'turbomachinery'], buildFlags: [], estimatedTime: '5–30 min',
  },
  {
    caseId: 'VC004', slug: 'airfoil', displayTitle: 'Airfoil Near-Wake (Nakayama)', title: 'Airfoil near-wake (Nakayama)',
    group: 'Incompressible Flows', githubFolder: 'airfoil', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/airfoil',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/airfoil/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/airfoil',
    physics: ['turbulence', 'incompressible'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Attached external aerodynamic flow at Re = 1.2 × 10⁶. Surface C_p validated against NASA-TMR CFL3D; near-wake profiles against Nakayama (1985) experiments.',
    tags: ['turbulence', 'aerodynamics', 'k-omega SST', 'near-wake'], buildFlags: [], estimatedTime: '2–10 min',
  },
  {
    caseId: 'VC005', slug: 'T3A', displayTitle: 'ERCOFTAC T3A Flat Plate', title: 'ERCOFTAC T3A flat plate',
    group: 'Incompressible Flows', githubFolder: 'T3A', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/T3A',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/T3A/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/T3A',
    physics: ['turbulence', 'incompressible'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Canonical bypass-transition benchmark. γ–Re_θt model reproduces laminar Blasius, transition rise, and White turbulent C_f on a zero-pressure-gradient flat plate at Tu = 3.3%.',
    tags: ['turbulence', 'transition', 'bypass transition', 'flat plate'], buildFlags: [], estimatedTime: '2–10 min',
  },
  {
    caseId: 'VC017', slug: 'elbow', displayTitle: 'Elbow (Two-Inlet Laminar Mixing)', title: 'Pipe elbow',
    group: 'Incompressible Flows', githubFolder: 'elbow', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/elbow',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/elbow/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/elbow',
    physics: ['incompressible'], difficulty: 'beginner', dim: '2D', status: 'complete',
    description: 'Laminar mixing in a two-inlet elbow. Demonstrates non-trivial geometry handling with wedge mesh.',
    tags: ['incompressible', 'laminar', 'mixing'], buildFlags: [], estimatedTime: '< 1 min',
  },
  {
    caseId: 'VC021', slug: 'bump2D', displayTitle: '2D Bump-in-Channel (NASA TMR SST)', title: '2D bump-in-channel',
    group: 'Incompressible Flows', githubFolder: 'bump2D', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/bump2D',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/bump2D/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/bump2D',
    physics: ['turbulence', 'incompressible'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'NASA TMR verification case for k–ω SST on a smooth wall bump. C_f and pressure distributions compared with CFL3D.',
    tags: ['turbulence', 'k-omega SST', 'NASA TMR', 'verification'], buildFlags: [], estimatedTime: '2–10 min',
  },

  // ── 2. Compressible Flows ───────────────────────────────────────────────
  {
    caseId: 'VC006', slug: 'circularArc', displayTitle: 'Subsonic / Transonic Bump', title: 'Subsonic/transonic bump',
    group: 'Compressible Flows', githubFolder: 'circularArc', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/circularArc',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/circularArc/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/circularArc',
    physics: ['compressible'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'One case, two variants: subsonic and transonic inviscid flow over a circular-arc bump. Tests the compressible pressure-based solver and shock-capturing.',
    tags: ['compressible', 'inviscid', 'transonic', 'subsonic', 'shock'], buildFlags: ['-DSPATIAL_DIM=2'], estimatedTime: '1–5 min',
  },
  {
    caseId: 'VC015', slug: 'forwardStep', displayTitle: 'Supersonic Forward-Facing Step', title: 'Supersonic forward-facing step',
    group: 'Compressible Flows', githubFolder: 'forwardStep', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/forwardStep',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/forwardStep/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/forwardStep',
    physics: ['compressible'], difficulty: 'advanced', dim: '2D', status: 'complete',
    description: '2D inviscid supersonic flow past a forward-facing step. Produces a strong bow shock, Mach reflection, and vortex sheet downstream.',
    tags: ['compressible', 'supersonic', 'shock', 'Mach reflection'], buildFlags: ['-DSPATIAL_DIM=2'], estimatedTime: '5–30 min',
  },

  // ── 3. Heat Transfer and Buoyancy ───────────────────────────────────────
  {
    caseId: 'VC011', slug: 'benardCells', displayTitle: 'Rayleigh–Bénard Convection', title: 'Rayleigh–Bénard convection',
    group: 'Heat Transfer and Buoyancy',
    githubFolder: 'BernardCells',   // ⚠️ folder name unverified — BernardCells vs BénardCells
    githubDisabled: false,
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/BernardCells',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/BernardCells/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/BernardCells',
    lastUpdated: '2026-07-23',
    physics: ['heat-transfer', 'incompressible'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Natural convection driven by the Boussinesq buoyancy approximation; produces Bénard convection cells between differentially heated horizontal plates.',
    tags: ['heat-transfer', 'buoyancy', 'Boussinesq', 'natural convection'], buildFlags: [], estimatedTime: '5–30 min',
  },
  {
    caseId: 'VC012', slug: 'slab', displayTitle: 'Heated Slab (CHT)', title: 'Heated slab (CHT)',
    group: 'Heat Transfer and Buoyancy', githubFolder: 'slab', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/slab',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/slab/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/slab',
    physics: ['heat-transfer', 'incompressible'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Flow over a heated slab coupling fluid convection with solid conduction (conjugate heat transfer, CHT). Validates the solid–fluid interface heat flux exchange.',
    tags: ['heat-transfer', 'CHT', 'conjugate', 'solid'], buildFlags: [], estimatedTime: '1–5 min',
  },
  {
    caseId: 'VC016', slug: 'flange', displayTitle: 'Flange (Solid Thermal Diffusion)', title: 'Thermal diffusion in a solid flange',
    group: 'Heat Transfer and Buoyancy', githubFolder: 'flange', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/flange',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/flange/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/flange',
    physics: ['heat-transfer'], difficulty: 'beginner', dim: '3D', status: 'complete',
    description: 'Pure thermal diffusion in a 3D solid flange geometry. Validates the solid heat conduction solver against an analytical steady-state solution.',
    tags: ['heat-transfer', 'solid', 'diffusion', '3D'], buildFlags: [], estimatedTime: '1–5 min',
  },

  // ── 4. Free-Surface and Multi-Physics ───────────────────────────────────
  {
    caseId: 'VC007', slug: 'flexibleDamBreak', displayTitle: 'Flexible Dam Break (FSI + VOF)', title: 'Flexible dam break',
    group: 'Free-Surface and Multi-Physics', githubFolder: 'dam_break_fsi', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/dam_break_fsi',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/dam_break_fsi/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/dam_break_fsi',
    physics: ['multiphase', 'fsi'], difficulty: 'advanced', dim: '2D', status: 'complete',
    description: 'Water column impact on an elastic obstacle. Couples VOF free-surface flow with ALE structural deformation. Validated against Walhorn et al. (2005) experiments.',
    tags: ['FSI', 'VOF', 'ALE', 'multiphase', 'elastic'], buildFlags: [], estimatedTime: '15–60 min',
  },
  {
    caseId: 'VC008', slug: 'damBreak', displayTitle: 'Rigid Dam Break (VOF)', title: 'Rigid dam break',
    group: 'Free-Surface and Multi-Physics', githubFolder: 'damBreak', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/damBreak',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/damBreak/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/damBreak',
    physics: ['multiphase'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Free-surface dam break simulation using the Volume of Fluid method with FCT interface compression. Validated against Martin & Moyce (1952) water height data.',
    tags: ['multiphase', 'VOF', 'free surface', 'dam break'], buildFlags: [], estimatedTime: '5–30 min',
  },
  {
    caseId: 'VC009', slug: 'perpendicularFlap', displayTitle: 'Perpendicular Flap (FSI)', title: 'Perpendicular flap (FSI)',
    group: 'Free-Surface and Multi-Physics', githubFolder: 'perpendicularFlap', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/perpendicularFlap',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/perpendicularFlap/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/perpendicularFlap',
    physics: ['fsi', 'incompressible'], difficulty: 'advanced', dim: '2D', status: 'complete',
    description: 'Fluid–structure interaction benchmark: steady flow past a flexible bar attached perpendicular to the channel wall. Validated against Turek & Hron (2006) reference data.',
    tags: ['FSI', 'ALE', 'elastic', 'benchmark'], buildFlags: [], estimatedTime: '15–60 min',
  },
  {
    caseId: 'VC010', slug: 'staticDroplet', displayTitle: 'Static Droplet (Young–Laplace)', title: 'Static droplet',
    group: 'Free-Surface and Multi-Physics', githubFolder: 'staticDroplet', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/staticDroplet',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/staticDroplet/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/staticDroplet',
    physics: ['multiphase'], difficulty: 'beginner', dim: '2D', status: 'complete',
    description: 'Stationary droplet in equilibrium, isolating the CSF (Continuum Surface Force) surface-tension model. Validates pressure jump against the Young–Laplace equation.',
    tags: ['multiphase', 'VOF', 'surface tension', 'CSF'], buildFlags: [], estimatedTime: '< 1 min',
  },
  {
    caseId: 'VC018', slug: 'oscillatingBox', displayTitle: 'Oscillating Box (Prescribed-Disp. ALE)', title: 'Oscillating box',
    group: 'Free-Surface and Multi-Physics', githubFolder: 'oscillatingBox', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/oscillatingBox',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/oscillatingBox/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/oscillatingBox',
    physics: ['incompressible'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Dynamic mesh case with prescribed displacement ALE: a box oscillates inside a closed cavity. Validates the mesh motion and ALE transport terms.',
    tags: ['dynamic mesh', 'ALE', 'moving boundaries', 'prescribed displacement'], buildFlags: [], estimatedTime: '5–30 min',
  },
  {
    caseId: 'VC020', slug: 'risingBubble', displayTitle: 'Rising Bubble (Hysing Benchmark)', title: 'Rising bubble (Hysing)',
    group: 'Free-Surface and Multi-Physics', githubFolder: 'risingBubble', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/risingBubble',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/risingBubble/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/risingBubble',
    physics: ['multiphase'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Buoyancy-driven bubble rising under gravity with surface tension (VOF). Validated against the Hysing et al. (2009) benchmark: rise velocity, circularity, and centre-of-mass trajectory.',
    tags: ['multiphase', 'VOF', 'surface tension', 'buoyancy', 'Hysing'], buildFlags: [], estimatedTime: '5–30 min',
  },
  {
    caseId: 'VC022', slug: 'oscillatingCylinder', displayTitle: 'In-Line Oscillating Cylinder (Dütsch)', title: 'In-line oscillating cylinder',
    group: 'Free-Surface and Multi-Physics',
    githubFolder: 'oscillatingCylinder',   // ⚠️ folder unverified — not in tab:input-files
    githubDisabled: false,
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/oscillatingCylinder',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/oscillatingCylinder/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/oscillatingCylinder',
    lastUpdated: '2026-07-23',
    physics: ['incompressible'], difficulty: 'advanced', dim: '2D', status: 'complete',
    description: 'In-line sinusoidally oscillating cylinder in quiescent fluid. Validates ALE moving-mesh flow solver against Dütsch et al. (1998) force and velocity data.',
    tags: ['ALE', 'oscillating', 'moving mesh', 'Dütsch'], buildFlags: [], estimatedTime: '15–60 min',
  },
  {
    caseId: 'VC024', slug: 'flexibleBottomCavity', displayTitle: 'Channel Flow over Flexible Bottom', title: 'Channel flow over flexible bottom cavity',
    group: 'Free-Surface and Multi-Physics',
    githubFolder: undefined, githubDisabled: true,
    lastUpdated: '2026-07-23',
    physics: ['fsi', 'incompressible'], difficulty: 'advanced', dim: '2D', status: 'complete',
    description: 'Channel flow over a cavity with a flexible bottom wall. Couples incompressible ALE flow with structural deformation of the cavity floor.',
    tags: ['FSI', 'ALE', 'channel flow', 'flexible wall'], buildFlags: [], estimatedTime: '15–60 min',
  },

  // ── 5. Rotating Frames ──────────────────────────────────────────────────
  {
    caseId: 'VC013', slug: 'taylorCouette', displayTitle: 'Taylor–Couette–Poiseuille Flow', title: 'Taylor–Couette–Poiseuille flow',
    group: 'Rotating Frames', githubFolder: 'TaylorCouettePoiseuille', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/TaylorCouettePoiseuille',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/TaylorCouettePoiseuille/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/TaylorCouettePoiseuille',
    physics: ['incompressible'], difficulty: 'intermediate', dim: '3D', status: 'complete',
    description: 'Combined azimuthal (Couette) and axial (Poiseuille) flow between concentric cylinders with periodic BCs. Validated against the analytical solution for the laminar velocity field.',
    tags: ['incompressible', 'rotating', 'periodic', 'laminar', 'analytical'], buildFlags: [], estimatedTime: '5–30 min',
  },
  {
    caseId: 'VC019', slug: 'rotatingCylinder', displayTitle: 'Flow Past Rotating Cylinder (Sliding Mesh)', title: 'Flow past rotating cylinder',
    group: 'Rotating Frames',
    githubFolder: 'rotatingCylinder',   // ⚠️ folder unverified
    githubDisabled: false,
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/rotatingCylinder',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/rotatingCylinder/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/rotatingCylinder',
    lastUpdated: '2026-07-23',
    physics: ['incompressible'], difficulty: 'advanced', dim: '2D', status: 'in-progress',
    description: 'Laminar flow past a rotating cylinder using a sliding mesh ALE interface. Some results are still pending; contributions welcome.',
    tags: ['ALE', 'rotating', 'sliding mesh', 'cylinder'], buildFlags: [], estimatedTime: '5–30 min',
  },

  // ── 6. Solid Mechanics ──────────────────────────────────────────────────
  {
    caseId: 'VC014', slug: 'plateHole', displayTitle: 'Plate With Circular Hole (Kirsch)', title: 'Plate with circular hole (Kirsch)',
    group: 'Solid Mechanics', githubFolder: 'plateHole', lastUpdated: '2026-07-23',
    githubUrl: 'https://github.com/CCFNUM/OpenAccel/tree/main/examples/plateHole',
    meshUrl:   'https://github.com/CCFNUM/OpenAccel/tree/main/examples/plateHole/constant/polyMesh',
    inputUrl:  'https://github.com/CCFNUM/OpenAccel/tree/main/examples/plateHole',
    physics: ['solid-mechanics'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Stress concentration around a circular hole in a plate under uniaxial tension. Validated against the Kirsch (1898) analytical solution for hoop and radial stress.',
    tags: ['solid-mechanics', 'stress', 'Kirsch', 'analytical'], buildFlags: [], estimatedTime: '< 1 min',
  },
  {
    caseId: 'VC023', slug: 'pressurizedCylinder', displayTitle: 'Pressurised Thick Cylinder (Lamé)', title: 'Pressurised thick cylinder',
    group: 'Solid Mechanics',
    githubFolder: undefined, githubDisabled: true,
    lastUpdated: '2026-07-23',
    physics: ['solid-mechanics'], difficulty: 'intermediate', dim: '2D', status: 'complete',
    description: 'Thick-walled cylinder under internal pressure. Validates radial and circumferential stress distributions against the Lamé analytical solution.',
    tags: ['solid-mechanics', 'stress', 'Lamé', 'analytical', 'pressure'], buildFlags: [], estimatedTime: '< 1 min',
  },
];

/** Returns "< 30 min" for any case with an upper bound ≤ 30 min; otherwise the raw estimatedTime. */
export function displayTime(estimatedTime: string): string {
  const range = estimatedTime.match(/(\d+)–(\d+)/);
  if (range) return parseInt(range[2]) <= 30 ? '< 30 min' : estimatedTime;
  const lt = estimatedTime.match(/< (\d+)/);
  if (lt && parseInt(lt[1]) <= 30) return '< 30 min';
  return estimatedTime;
}

export const TUTORIAL_GROUPS: TutorialGroup[] = [
  'Incompressible Flows',
  'Compressible Flows',
  'Heat Transfer and Buoyancy',
  'Free-Surface and Multi-Physics',
  'Rotating Frames',
  'Solid Mechanics',
];
