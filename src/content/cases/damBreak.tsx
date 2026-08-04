import { TutorialFigure, TutorialSubfigureRow, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function DamBreakContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',      value: 'VC008' },
        { label: 'References',   value: 'Koshizuka et al. (1995); Walhorn et al. (2005); Hänsch et al. (2012)' },
        { label: 'Solver mode',  value: 'Transient, segregated' },
        { label: 'Physics',      value: '2-D incompressible VoF, two-phase' },
      ]} />

      <section id="problem">
        <h2>1. Problem Description</h2>
        <p>
          The rigid dam-break with a fixed obstacle is the canonical free-surface benchmark for gravity-driven
          transient flow with strong interface deformation, impact, and overtopping. Three reference quantities
          are compared: the water column height at the left wall against the experiment of Koshizuka et al.,
          the horizontal water-front displacement against Walhorn et al., and the pressure history at a probe
          on the obstacle face against Hänsch et al.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry &amp; Boundary Conditions</h2>
        <TutorialFigure
          src="/figures/dam_schematic.png"
          alt="Rigid dam break schematic"
          caption="Rigid dam-break configuration. Point B on the upstream face of the obstacle at mid-height serves as a pressure probe."
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          caption="Rigid dam-break — complete case setup"
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: 'Domain',              value: 'L = 0.584 m square' },
              { label: 'Water column',        value: 'w × h = 0.146 × 0.292 m at lower-left corner' },
              { label: 'Obstacle (rigid)',    value: 'w_o × h_o = 0.024 × 0.048 m at x = 0.292 m' },
              { label: 'Mesh',               value: '4 746 nodes / 2 268 elements' },
            ]},
            { heading: 'Fluid properties', rows: [
              { label: 'Water ρ_w, μ_w',     value: '1000 kg/m³, 10⁻³ Pa·s' },
              { label: 'Air ρ_a, μ_a',       value: '1 kg/m³, 1.48×10⁻⁵ Pa·s' },
              { label: 'Surface tension',     value: 'σ = 0.07 N/m (CSF)' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Left, right, bottom, obstacle', value: 'No-slip walls' },
              { label: 'Top',                value: 'Opening (zero-gauge static pressure)' },
              { label: 'Body force',         value: 'g = 9.81 m/s², Boussinesq ref. density 1 kg/m³' },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time integration',   value: 'First-order backward Euler' },
              { label: 'Time step',          value: 'Constant Δt = 5×10⁻⁴ s' },
              { label: 'End time',           value: '0.6 s' },
              { label: 'Advection',          value: 'High-resolution Barth–Jespersen' },
              { label: 'VoF FCT',            value: 'Compression level 2; 2 α-correction sweeps' },
              { label: 'VoF smoothing',      value: '5 iterations, Fo = 0.25' },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target / outer iters', value: '10⁻⁸ / up to 20 per step' },
            ]},
          ]}
        />
      </section>

      <section id="results">
        <h2>4. Results</h2>
        <p>Simulation (top row) vs experiment — Koshizuka et al. (bottom row):</p>

        <TutorialSubfigureRow
          left={{ src: '/figures/0.1_sec_rigid_dam.png', alt: 'Simulation t=0.1s', subcaption: 'Simulation, t = 0.1 s' }}
          right={{ src: '/figures/exp_0.1.png',           alt: 'Experiment t=0.1s', subcaption: 'Experiment, t = 0.1 s' }}
          caption="Free surface at t = 0.1 s."
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/0.2_sec_rigid_dam.png', alt: 'Simulation t=0.2s', subcaption: 'Simulation, t = 0.2 s' }}
          right={{ src: '/figures/exp_0.2.png',           alt: 'Experiment t=0.2s', subcaption: 'Experiment, t = 0.2 s' }}
          caption="Free surface at t = 0.2 s."
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/0.3_sec_rigid_dam.png', alt: 'Simulation t=0.3s', subcaption: 'Simulation, t = 0.3 s' }}
          right={{ src: '/figures/exp_0.3.png',           alt: 'Experiment t=0.3s', subcaption: 'Experiment, t = 0.3 s' }}
          caption="Free surface at t = 0.3 s."
        />
        <TutorialSubfigureRow
          left={{ src: '/figures/0.5_sec_rigid_dam.png', alt: 'Simulation t=0.5s', subcaption: 'Simulation, t = 0.5 s' }}
          right={{ src: '/figures/exp_0.5.png',           alt: 'Experiment t=0.5s', subcaption: 'Experiment, t = 0.5 s' }}
          caption="Free surface at t = 0.5 s — note the entrapped air pocket near the lower-right corner."
        />

        <TutorialFigure
          src="/figures/pressure_rigid_dam.png"
          alt="Pressure history at probe B"
          caption="Pressure history at probe point B (centre of the upstream face of the obstacle) compared with Hänsch et al. (2012)."
        />

        <TutorialSubfigureStack
          items={[
            { src: '/figures/water_height.png',     alt: 'Water column height', subcaption: 'Water-column height at the left wall vs. Koshizuka et al.' },
            { src: '/figures/water_distance_x.png', alt: 'Water front distance', subcaption: 'Horizontal water-front displacement at the bottom wall vs. Walhorn et al.' },
          ]}
          caption="Time-resolved validation quantities for the rigid dam break."
        />
      </section>

      <Takeaway>
        At t = 0.1 s the simulated water front has not yet reached the obstacle, while in the experiment a thin
        film along the bottom has already arrived — a known limitation of CSF-based VoF on coarse meshes near
        the floor. From t = 0.2 s onward the agreement with the experimental snapshots is very close, including
        the upward jet and the fall-back that traps an air pocket near the lower-right corner at t = 0.5 s.
      </Takeaway>

      <AcceptanceCriterion>
        The water-column height at the left wall and the horizontal water-front displacement at the bottom wall
        shall both match their respective references in graphical agreement. The free-surface snapshots at
        t ∈ {"{0.1, 0.2, 0.3, 0.5}"} s shall reproduce the qualitative features of the Koshizuka experiment,
        in particular the air pocket trapped near the lower-right corner at t = 0.5 s.
      </AcceptanceCriterion>
    </>
  );
}
