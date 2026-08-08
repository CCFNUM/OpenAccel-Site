import { TutorialFigure, TutorialSubfigureRow } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function FlexibleDamBreakContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC007' },
        { label: 'Reference',    value: 'Walhorn et al. (2005)' },
        { label: 'Solver mode',  value: 'Transient, segregated; partitioned FSI with Aitken' },
        { label: 'Physics',      value: '2-D incompressible VoF + ALE + linear elasticity' },
        { label: 'Coupling',     value: 'Aitken Δ² relaxation' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          The flexible dam-break problem couples VoF free-surface tracking with a moving mesh (ALE) and a
          partitioned FSI solver. A water column collapses under gravity, sweeps across an air-filled domain,
          impacts a clamped flexible obstacle, and deforms it. The validation target is the time history of the
          obstacle tip displacement against the space–time finite-element reference of Walhorn et al. (2005).
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/flelxible_dam_schematic.svg"
          alt="Flexible dam break schematic"
          caption="Flexible dam-break configuration: a water column of dimensions w × b = 0.146 × 0.292 m sits at the lower-left of a 0.584 × 0.584 m domain. A clamped elastic obstacle stands at the centre."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="Flexible dam-break — complete case setup"
          groups={[
            { heading: 'Geometry', rows: [
              { label: 'Domain',              value: 'L = W = 0.584 m' },
              { label: 'Water column',        value: 'w × b = 0.146 × 0.292 m' },
              { label: 'Obstacle',            value: 'a × w_obs = 0.08 × 0.012 m, clamped at base' },
              { label: 'Initialisation',      value: 'if(x≤0.146 and y≤0.292, 1, 0)' },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: 'Water ρ_w, μ_w',     value: '1000 kg/m³, 10⁻³ Pa·s' },
              { label: 'Air ρ_a, μ_a',       value: '1 kg/m³, 1.48×10⁻⁵ Pa·s' },
              { label: 'Surface tension',     value: 'σ = 0.07 N/m (CSF)' },
            ]},
            { heading: 'Solid properties (total-Lagrangian linear elastic)', rows: [
              { label: 'Density ρ_s',        value: '2700 kg/m³' },
              { label: "Young's modulus E",   value: '10⁶ Pa' },
              { label: "Poisson's ratio ν",   value: '0' },
            ]},
            { heading: 'Body force', rows: [
              { label: 'Gravity',             value: 'g = 9.81 m/s² downward' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',    value: 'First-order backward Euler' },
              { label: 'Initial Δt',          value: '10⁻³ s, adaptive with Co_max = 1' },
              { label: 'End time',            value: '0.5 s' },
              { label: 'Advection',           value: 'High-resolution Barth–Jespersen' },
              { label: 'VoF FCT',             value: 'Compression level 2; 2 α-correction sweeps' },
              { label: 'Mesh stiffness',      value: 'Inverse-volume (exponent 2), reference = initial mesh' },
            ]},
            { heading: 'FSI coupling', rows: [
              { label: 'Interface type',      value: 'General-connection, search tol. 5×10⁻⁴' },
              { label: 'Acceleration',        value: 'Aitken Δ², ω₀ = 0.1, ω ∈ [0.01, 0.5]' },
              { label: 'Pressure sub-iterations', value: '4 per outer loop' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: '10⁻⁸ / 5 per step' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <TutorialFigure
          src="/figures/flexibleDam_tipDisplacement.png"
          alt="Flexible dam tip displacement"
          caption="Horizontal tip displacement δ_x(t) of the flexible obstacle compared with reference results from the literature."
        />

        <p>The free-surface snapshots below compare the OpenAccel solution (left) with the space–time FEM reference of Walhorn et al. (right) at three instants.</p>

        <TutorialSubfigureRow
          left={{ src: '/figures/flexDam_openaccel_t015.svg', alt: 'OpenAccel t=0.15s', subcaption: 't = 0.15 s (OpenAccel)' }}
          right={{ src: '/figures/flexDam_walhorn_t015.png',  alt: 'Walhorn t=0.15s',  subcaption: 't = 0.15 s (Walhorn)' }}
          caption="Free surface at t = 0.15 s."
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/flexDam_openaccel_t0185.svg', alt: 'OpenAccel t=0.185s', subcaption: 't = 0.185 s (OpenAccel)' }}
          right={{ src: '/figures/flexDam_walhorn_t0185.png',  alt: 'Walhorn t=0.185s',  subcaption: 't = 0.185 s (Walhorn)' }}
          caption="Free surface at t = 0.185 s."
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/flexDam_openaccel_t025.svg', alt: 'OpenAccel t=0.25s', subcaption: 't = 0.25 s (OpenAccel)' }}
          right={{ src: '/figures/flexDam_walhorn_t025.png',  alt: 'Walhorn t=0.25s',  subcaption: 't = 0.25 s (Walhorn)' }}
          caption="Free surface at t = 0.25 s."
        />
      </section>

      <Takeaway>
        The tip-displacement history matches the Walhorn reference within graphical agreement across the full
        transient, and the snapshots reproduce the impact, the upward jet, and the secondary fall-back. The
        Aitken relaxation factor begins at ω₀ = 0.1 and adapts dynamically as the residual sign changes during
        impact — this is what allows convergence at the relatively coarse outer-iteration cap of five. Without
        dynamic relaxation, the added-mass effect at the water–solid interface would stall convergence.
      </Takeaway>

      <AcceptanceCriterion>
        The horizontal tip displacement δ_x(t) shall fall within the scatter band of the reference solutions over
        0 ≤ t ≤ 0.5 s. The free-surface snapshots at t = 0.15, 0.185, 0.25 s shall reproduce the impact, jet,
        and fall-back features of the Walhorn reference.
      </AcceptanceCriterion>
    </>
  );
}
