import { TutorialFigure, TutorialSubfigureStack } from '@/components/tutorial/TutorialFigure';
import { SetupTable } from '@/components/tutorial/SetupTable';
import { DataTable } from '@/components/tutorial/DataTable';
import { Equation, M } from '@/components/tutorial/Equation';
import { Takeaway, AcceptanceCriterion, CaseInfoBlock } from '@/components/tutorial/TutorialCallouts';

export function LayeredPipeContent() {
  return (
    <>
      <CaseInfoBlock rows={[
        { label: 'Case ID',        value: 'VC025' },
        { label: 'Reference',      value: <>Tukovi&#263;, Ivankovi&#263; &amp; Kara&#269; (2013); <code>solids4foam</code> tutorial</> },
        { label: 'Solver mode',    value: 'Steady-state' },
        { label: 'Physics / models', value: '2-D linear elasticity, plane stress, two solid domains coupled by a conformal solid–solid interface' },
      ]} />

      <section id="problem">
        <h2>1. Problem description</h2>
        <p>
          This case validates the solid-mechanics solver on a <em>multi-material</em> problem: a
          thick-walled cylinder assembled from two concentric layers of different elastic materials,
          loaded by uniform pressure on its inner bore. Unlike the single-material pressurised
          cylinder, the domain here is composed of two elastic regions with an order-of-magnitude
          stiffness contrast, meeting at a shared cylindrical interface. The value of the test lies
          in what happens at that interface: the radial (traction) stress must remain{' '}
          <em>continuous</em> across it, enforcing equilibrium, while the circumferential (hoop)
          stress is <em>discontinuous</em>, jumping in proportion to the stiffness ratio. The
          Lamé-type closed-form solution for the compound cylinder provides both stress components
          throughout each layer, so the simulation is probed point-by-point on either side of the
          interface rather than against a peak value alone.
        </p>
        <p>
          The distinguishing feature of this validation is the coupling strategy. In OpenAccel a
          single physical domain carries a single material; a body with two materials is therefore
          represented as <em>two separate solid domains</em> that share a common boundary and are
          tied together by a <code>solid_solid</code> interface. The two layers are meshed
          independently, so their nodes at the shared radius are geometrically coincident but
          topologically distinct; at setup the interface is detected as conformal and the coincident
          degrees of freedom are merged, which enforces displacement continuity exactly and traction
          continuity through the assembled flux. This case therefore validates two things at once:
          the linear-elastic operator on a heterogeneous body, and the conformal{' '}
          <code>solid_solid</code> interface as the mechanism for multi-material solid mechanics.
        </p>
        <p>
          By the two-fold symmetry of the geometry and loading, a quarter of the cross-section is
          modelled with symmetry boundary conditions on the cut faces. The plane-stress assumption
          follows the reference and is consistent with a cylinder of small axial extent loaded only
          on its lateral surfaces, with inertial and gravitational effects neglected.
        </p>
      </section>

      <section id="geometry">
        <h2>2. Geometry and boundary conditions</h2>
        <TutorialFigure
          src="/figures/layered_pipe.png"
          alt="Bi-material thick-walled cylinder, quarter-symmetric model"
          width="narrow"
          label="Figure 1"
          caption={<>Internally pressurised bi-material thick-walled cylinder: quarter-symmetric model. Inner layer (region 1) spans <M math="r_1 = 50~\mathrm{mm}" /> to the interface <M math="r_2 = 70~\mathrm{mm}" />; outer layer (region 2) spans <M math="r_2 = 70~\mathrm{mm}" /> to <M math="r_3 = 100~\mathrm{mm}" />. Uniform internal pressure <M math="p_i" /> on the inner arc; traction-free outer arc; symmetry on the two straight edges; the two regions meet at the conformal solid–solid interface at <M math="r_2" />.</>}
        />
      </section>

      <section id="setup">
        <h2>3. Setup</h2>
        <SetupTable
          label="Table 1"
          caption="Bi-material thick-walled cylinder — complete case setup."
          groups={[
            { heading: 'Geometry and mesh', rows: [
              { label: <>Inner radius <M math="r_1" /></>,     value: <M math="50~\mathrm{mm}" /> },
              { label: <>Interface radius <M math="r_2" /></>, value: <M math="70~\mathrm{mm}" /> },
              { label: <>Outer radius <M math="r_3" /></>,     value: <M math="100~\mathrm{mm}" /> },
              { label: 'Mesh (inner layer)', value: <><M math="40 \times 240" /> structured 2-D cells</> },
              { label: 'Mesh (outer layer)', value: <><M math="60 \times 240" /> structured 2-D cells</> },
              { label: 'Total',              value: '24 000 quadrilateral cells, 2 element blocks' },
            ]},
            { heading: 'Material — region 1, inner (linear elastic, plane stress)', rows: [
              { label: <>Density <M math="\rho_1" /></>,        value: <><M math="1000~\mathrm{kg\,m^{-3}}" /> (dummy; steady state)</> },
              { label: <>Young's modulus <M math="E_1" /></>,   value: <><M math="2\times10^{10}~\mathrm{Pa}" /> (20 GPa)</> },
              { label: <>Poisson's ratio <M math="\nu_1" /></>, value: '0.35' },
            ]},
            { heading: 'Material — region 2, outer (linear elastic, plane stress)', rows: [
              { label: <>Density <M math="\rho_2" /></>,        value: <><M math="1000~\mathrm{kg\,m^{-3}}" /> (dummy; steady state)</> },
              { label: <>Young's modulus <M math="E_2" /></>,   value: <><M math="2\times10^{11}~\mathrm{Pa}" /> (200 GPa)</> },
              { label: <>Poisson's ratio <M math="\nu_2" /></>, value: '0.30' },
              { label: <>Stiffness ratio <M math="E_2/E_1" /></>, value: '10' },
            ]},
            { heading: 'Boundary conditions', rows: [
              { label: 'Inner wall',  value: <>Uniform traction <M math="p_i = 1\times10^{5}~\mathrm{Pa}" /> (inward normal)</> },
              { label: 'Outer wall',  value: 'Zero traction' },
              { label: <>Symmetry planes (<M math="x=0" />, <M math="y=0" />)</>, value: <>Symmetry (<M math="u_x = 0" />, <M math="u_y = 0" /> respectively)</> },
            ]},
            { heading: 'Interface', rows: [
              { label: 'Type',     value: <><code>solid_solid</code>, conformal (coincident nodes merged)</> },
              { label: 'Location', value: <>Shared cylindrical surface at <M math="r_2 = 70~\mathrm{mm}" /></> },
            ]},
            { heading: 'Numerics', rows: [
              { label: 'Time mode',            value: 'Steady-state' },
              { label: 'Maximum outer iters',  value: '250' },
            ]},
            { heading: 'Linear solvers', rows: [
              { label: 'Displacement system', value: <>PETSc / FGMRES + block-Jacobi (rel. tol. <M math="10^{-4}" />)</> },
            ]},
            { heading: 'Convergence', rows: [
              { label: 'RMS target', value: <M math="10^{-15}" /> },
            ]},
          ]}
        />
      </section>

      <section id="analytical">
        <h2>4. Analytical reference</h2>
        <p>
          For the compound cylinder the two layers each satisfy the Lamé equations, coupled through
          the contact pressure <M math="p_{12}" /> that develops at the interface <M math="r_2" />.
          With the inner bore at <M math="r_1" /> under pressure <M math="p_i" />, the interface at{' '}
          <M math="r_2" />, and the traction-free outer surface at <M math="r_3" />, the radial and
          circumferential stresses are, per layer,
        </p>
        <Equation math="\sigma_r(r) = \frac{r_1^{2} p_i - r_2^{2} p_{12}
          + (p_{12} - p_i)\!\left(\dfrac{r_1 r_2}{r}\right)^{\!2}}{r_2^{2} - r_1^{2}},
          \qquad r_1 \le r < r_2," />
        <Equation math="\sigma_r(r) = \frac{r_2^{2} p_{12}
          - p_{12}\!\left(\dfrac{r_2 r_3}{r}\right)^{\!2}}{r_3^{2} - r_2^{2}},
          \qquad r_2 < r \le r_3," />
        <Equation math="\sigma_\theta(r) = \frac{r_1^{2} p_i - r_2^{2} p_{12}
          - (p_{12} - p_i)\!\left(\dfrac{r_1 r_2}{r}\right)^{\!2}}{r_2^{2} - r_1^{2}},
          \qquad r_1 \le r < r_2," />
        <Equation math="\sigma_\theta(r) = \frac{r_2^{2} p_{12}
          + p_{12}\!\left(\dfrac{r_2 r_3}{r}\right)^{\!2}}{r_3^{2} - r_2^{2}},
          \qquad r_2 < r \le r_3," />
        <p>where the interface contact pressure is</p>
        <Equation math="p_{12} = \frac{\dfrac{2\, r_1^{2} p_i}{E_1 \left(r_2^{2} - r_1^{2}\right)}}
          {\dfrac{1}{E_2}\!\left(\dfrac{r_3^{2} + r_2^{2}}{r_3^{2} - r_2^{2}} + \nu_2\right)
          + \dfrac{1}{E_1}\!\left(\dfrac{r_2^{2} + r_1^{2}}{r_2^{2} - r_1^{2}} - \nu_1\right)}." />
        <p>
          For the present geometry and material data, this gives a contact pressure of{' '}
          <M math="p_{12} = 68.18~\mathrm{kPa}" />. At the inner wall the radial stress recovers the
          applied pressure exactly, <M math="\sigma_r(r_1) = -p_i" />, and at the outer wall{' '}
          <M math="\sigma_r(r_3) = 0" />; these identities are the natural tests of the traction
          boundary conditions. The radial stress passes continuously through the interface,{' '}
          <M math="\sigma_r(r_2^{-}) = \sigma_r(r_2^{+}) \approx -68.2~\mathrm{kPa}" />, whereas the
          hoop stress is discontinuous, jumping from{' '}
          <M math="\sigma_\theta(r_2^{-}) \approx -1.9~\mathrm{kPa}" /> in the compliant inner layer
          to <M math="\sigma_\theta(r_2^{+}) \approx +199~\mathrm{kPa}" /> in the stiff outer layer.
          This continuity of traction with a jump in hoop stress is the defining signature of the
          multi-material problem and the quantity of interest for this validation.
        </p>
      </section>

      <section id="results">
        <h2>5. Results</h2>
        <p>
          The stress profiles are extracted along a radial cut coincident with the{' '}
          <M math="x = 0" /> symmetry plane, where the Cartesian components map directly onto the
          polar components (<M math="\sigma_{xx} \equiv \sigma_\theta" /> and{' '}
          <M math="\sigma_{yx} \equiv \sigma_r" /> on this face), so no tensor rotation is required.
          To avoid averaging across the material interface, the data are sampled at element (cell)
          centres rather than at nodes, keeping every sample strictly inside a single material and
          away from the shared interface nodes. The results below are reported on a refined mesh of
          24 000 cells, for which the profiles are mesh-converged.
        </p>

        <TutorialSubfigureStack
          label="Figure 2"
          items={[
            { src: '/figures/stress_radial_layered_pipe.png', alt: 'Radial stress profile', subcaption: <>Radial stress <M math="\sigma_r(r)" /> across the wall thickness (continuous at the interface).</> },
            { src: '/figures/stress_circum_layered_pipe.png', alt: 'Circumferential stress profile', subcaption: <>Circumferential stress <M math="\sigma_\theta(r)" /> across the wall thickness (discontinuous at the interface).</> },
          ]}
          caption={<>Bi-material thick-walled cylinder: in-plane stress components along a radial cut from <M math="r = r_1" /> to <M math="r = r_3" />, compared with the compound-cylinder analytical solution. Symbols: OpenAccel (cell centres); solid lines: analytical. The inner and outer layers are plotted as separate series so that the hoop-stress discontinuity at <M math="r_2" /> is represented without an interpolated ramp.</>}
        />

        <DataTable
          label="Table 2"
          caption={<>Error metrics for the in-plane stress profiles along the radial cut on the refined (24 000-cell) mesh, sampled at element centres (the interface line is excluded, where the hoop stress is discontinuous and a nodal value is not uniquely defined).</>}
          headers={['Quantity', <><M math="E_{L^2}" /> [kPa]</>, <><M math="E_{L^\infty}" /> [kPa]</>]}
          rows={[
            [<>Radial stress <M math="\sigma_r" /></>, '0.45', '2.42'],
            [<>Circumferential stress <M math="\sigma_\theta" /></>, '0.47', '2.76'],
          ]}
        />
      </section>

      <Takeaway>
        <p>
          The numerical results follow the analytical curves closely across both layers. The radial
          stress recovers the applied pressure at the inner wall, vanishes at the outer wall, and
          passes continuously through the interface, confirming traction equilibrium across the
          conformal solid–solid coupling; the circumferential stress reproduces the characteristic
          jump at <M math="r_2" /> set by the stiffness contrast. On the refined mesh the
          root-mean-square deviations are <M math="E_{L^2} = 0.45~\mathrm{kPa}" /> (
          <M math="\sigma_r" />) and <M math="0.47~\mathrm{kPa}" /> (<M math="\sigma_\theta" />), on
          ranges of 100 and 196 kPa; the <M math="E_{L^\infty}" /> values of 2.42 and 2.76 kPa are a
          localised overshoot in the element adjacent to <M math="r_2" />, the expected signature of
          a node-based scheme resolving the hoop-stress discontinuity, not a coupling defect. A
          uniform <M math="2\times" /> refinement lowers <M math="E_{L^2}" /> by{' '}
          <M math="\sim 3\text{--}4\times" />, consistent with second-order convergence. The
          agreement validates the linear-elastic operator on a heterogeneous body and establishes
          the conformal <code>solid_solid</code> interface as the mechanism for multi-material solid
          mechanics in OpenAccel.
        </p>
      </Takeaway>

      <AcceptanceCriterion>
        <p>
          The radial stress shall satisfy <M math="\sigma_r(r_1) = -p_i" /> at the inner wall and{' '}
          <M math="\sigma_r(r_3) = 0" /> at the outer wall to within the convergence tolerance, and
          shall remain continuous across the interface. The circumferential stress shall reproduce
          the analytical jump at <M math="r_2" />. The <M math="\sigma_r(r)" /> and{' '}
          <M math="\sigma_\theta(r)" /> profiles shall track the compound-cylinder solution in
          graphical agreement across both layers, with interior-node deviations within a few percent
          of range.
        </p>
      </AcceptanceCriterion>
    </>
  );
}
