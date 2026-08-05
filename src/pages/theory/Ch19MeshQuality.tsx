import { Info, AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { DocCallout } from '@/components/DocCallout';
import { CodeBlock } from '@/components/CodeBlock';
import { Algorithm } from '@/components/theory/Algorithm';
import { M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch19MeshQuality() {
  useDocumentTitle('Mesh Quality and Element Correction — Theory Manual');
  return (
    <TheoryLayout chNum="19" title="Mesh Quality and Element Correction">
      <SEO
        title="Mesh Quality and Element Correction — Theory Manual"
        description="Element quality metrics and classification, flat- and high-aspect-ratio element correction, STK integration, and the validation report format."
        path="/theory/mesh-quality"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        The quality of the computational mesh significantly affects the accuracy, stability, and
        convergence of the CVFEM solution. Poor-quality elements can lead to numerical errors,
        convergence issues, and unphysical results. This chapter describes the mesh quality
        assessment and element correction algorithms implemented in OpenAccel, which are based on
        methodologies ported from the flash CVFEM framework.
      </p>

      <DocCallout icon={Info} label="Note" accent="var(--text-dim)" bg="var(--dim-pill-bg)">
        The element validator is <em>3D-only</em> &mdash; its entire implementation is guarded by
        a spatial-dimension check, and there is no 2D equivalent.
      </DocCallout>

      <H2 id="quality-assessment" num="19.1">Element Quality Assessment</H2>

      <H3 id="quality-metrics" num="19.1.1">Quality metrics</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        The element validation system evaluates mesh quality using several geometric criteria:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>
          <strong style={{ color: 'var(--text)' }}>Aspect ratio</strong>: the ratio of the
          longest edge to the shortest edge within an element; for a well-conditioned element
          this should be close to unity.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Element volume</strong>: the volumetric
          measure of the element. Elements with near-zero or negative volumes indicate severely
          degenerate geometry (volume tolerance <M math="10^{-15}" />).
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Flatness</strong>: a measure of element
          deformation where the element approaches a planar configuration, losing its
          three-dimensional character (flatness tolerance <M math="10^{-12}" />).
        </li>
      </ol>
      <p style={{ color: 'var(--text-dim)' }}>
        Independently of correction, a Jacobian diagnostic flags any element whose determinant
        falls below a threshold (<M math="\det J < 10^{-10}" /> by default), catching inverted or
        degenerate elements.
      </p>

      <H3 id="quality-classification" num="19.1.2">Quality classification</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Elements are classified into three categories based on their geometric properties:
      </p>
      <dl className="my-6 space-y-4">
        <div>
          <dt className="font-semibold" style={{ color: 'var(--text)' }}>
            Normal elements (quality <M math="=10" />)
          </dt>
          <dd style={{ color: 'var(--text-dim)' }}>
            Well-conditioned elements that meet all quality criteria and do not require
            correction.
          </dd>
        </div>
        <div>
          <dt className="font-semibold" style={{ color: 'var(--text)' }}>
            High-aspect-ratio elements (quality <M math="=0" />)
          </dt>
          <dd style={{ color: 'var(--text-dim)' }}>
            Elements where the aspect ratio exceeds a specified threshold (default 1.5 for
            testing, typically 10&ndash;100 in production). These may cause numerical issues but
            can often be handled through special numerical treatment.
          </dd>
        </div>
        <div>
          <dt className="font-semibold" style={{ color: 'var(--text)' }}>
            Flat elements (quality <M math="=-1" />)
          </dt>
          <dd style={{ color: 'var(--text-dim)' }}>
            Severely degenerate elements with near-zero volume or extreme geometric distortion;
            these require immediate correction or will cause solution failure.
          </dd>
        </div>
      </dl>

      <H2 id="correction-algorithms" num="19.2">Element Correction Algorithms</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The correction algorithms are based on the flash CVFEM <code>FETETF</code> (flat
        tetrahedral correction) and <code>BETA_BAD_EL</code> (bad-element handling) routines.
      </p>

      <H3 id="flat-element-correction" num="19.2.1">Flat element correction</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        For flat tetrahedral elements, the correction implements a vertex-movement strategy:
      </p>

      <Algorithm
        number="2"
        caption="Flat element correction (FETETF)"
        lines={[
          { text: "**Input:** flat tetrahedral element $E$" },
          { text: "identify element nodes $\\{n_1, n_2, n_3, n_4\\}$" },
          { text: "compute element centroid $\\mathbf{c} = \\tfrac{1}{4}\\sum_{i=1}^{4}\\mathbf{x}_i$" },
          { text: "calculate node distances from centroid" },
          { text: "**for** each node $n_i$ **do**" },
          { text: "**if** $|\\mathbf{x}_i - \\mathbf{c}| > 1.5 \\times \\text{average distance}$ **then**", indent: 1 },
          { text: "move node toward centroid: $\\mathbf{x}_i^{new} = \\mathbf{x}_i + \\alpha(\\mathbf{c} - \\mathbf{x}_i)$, with $\\alpha = 0.1$ (smoothing factor)", indent: 2 },
          { text: "**end if**", indent: 1 },
          { text: "**end for**" },
          { text: "recompute element quality" },
        ]}
      />

      <H3 id="high-aspect-ratio-treatment" num="19.2.2">High-aspect-ratio element treatment</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        For elements with high aspect ratios, two strategies are employed:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>
          <strong style={{ color: 'var(--text)' }}>Geometric correction</strong>: for severely
          distorted elements (aspect ratio <M math=">2\times" /> threshold), vertex smoothing is
          applied as for flat elements.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Numerical treatment</strong>: for moderately
          distorted elements, special numerical schemes (such as reduced blending factors) are
          used without modifying the mesh geometry.
        </li>
      </ol>

      <DocCallout icon={AlertTriangle} label="Caution" accent="var(--warm)" bg="var(--callout-warm-bg)">
        Correction is <em>off</em> by default: with only <code>check_mesh: true</code> the mesh is
        classified and diagnosed but not modified. Vertex movement runs only when{' '}
        <code>enable_correction: true</code> is also set, iterating each invalid element by the
        correction factor (default <M math="0.1" />) up to a maximum iteration count and
        recording the before/after quality and the nodes moved.
      </DocCallout>

      <H2 id="implementation-details" num="19.3">Implementation Details</H2>

      <H3 id="stk-integration" num="19.3.1">Integration with the STK mesh</H3>
      <ul className="list-disc pl-6 space-y-2 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>Element quality is stored as an STK field (<code>element_quality</code>) on all element parts.</li>
        <li>Coordinate modifications use STK's <code>modification_begin()</code> / <code>modification_end()</code> framework.</li>
        <li>Parallel processing is supported through STK's parallel mesh operations.</li>
      </ul>

      <H3 id="workflow-integration" num="19.3.2">Workflow integration</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Element validation and correction are automatically performed during mesh initialisation
        when enabled via <code>check_mesh: true</code> in the input file:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>
          <strong style={{ color: 'var(--text)' }}>Setup phase</strong>: the element validator is
          created and STK fields are allocated.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Initialisation phase</strong>: initial quality
          assessment of all elements; validation report generation; element correction attempts
          for poor-quality elements (if enabled); post-correction validation and reporting.
        </li>
      </ol>

      <H3 id="performance-considerations" num="19.3.3">Performance considerations</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Element validation adds minimal overhead during mesh initialisation. For production runs
        with verified mesh quality, validation can be disabled using <code>check_mesh: false</code>.
        Correction algorithms are designed to be conservative to avoid introducing new geometric
        issues, and parallel efficiency is maintained through proper STK mesh modification
        protocols.
      </p>

      <H2 id="validation-output" num="19.4">Validation Output</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The system provides comprehensive reporting of mesh quality and correction activities:
      </p>

      <CodeBlock
        lang="text"
        code={`============================================================
          MESH ELEMENT QUALITY VALIDATION REPORT
============================================================
Total Elements:                  918
Normal Elements:                 178 (19.4%)
Flat Elements:                     0 (0.0%)
High Aspect Ratio:               740 (80.6%)

Aspect Ratio Statistics:
Average Aspect Ratio:      1.812e+00
Worst Aspect Ratio:        3.022e+00

Correction Statistics:
Corrected Elements:                0
Failed Corrections:                0
============================================================`}
      />

      <p style={{ color: 'var(--text-dim)' }}>
        When corrections are applied, additional detailed output shows which elements and nodes
        were modified, providing full traceability of mesh modifications.
      </p>
    </TheoryLayout>
  );
}
