import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { M } from '@/components/tutorial/Equation';
import { TheoryLayout } from './TheoryLayout';
import { H2, H3 } from '../get-started/GsLayout';

export function Ch17Implementation() {
  useDocumentTitle('Implementation and Data Structures — Theory Manual');
  return (
    <TheoryLayout chNum="17" title="Implementation and Data Structures">
      <SEO
        title="Implementation and Data Structures — Theory Manual"
        description="STK mesh terminology, the registered node/element field catalogue, the four-kernel assembler architecture, and the parallel MPI model."
        path="/theory/implementation"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel is built on the Trilinos Sierra Toolkit (STK) mesh library, which provides the
        parallel, distributed, unstructured mesh on which every field lives.
      </p>

      <H2 id="stk-terminology" num="17.1">STK Terminology</H2>
      <ul className="list-disc pl-6 space-y-3 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>
          <strong style={{ color: 'var(--text)' }}>Bucket</strong> &mdash; a bucket refers to a
          collection of mesh entities (e.g. elements) that share the same topology (e.g., all
          hexahedra, all tetrahedra). By grouping data into buckets, the code can perform
          computational operations more efficiently, and in a way that is scalable. A{' '}
          <em>Part</em> can be divided into <em>Buckets</em>.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Part</strong> &mdash; a part refers to a
          collection of mesh entities that <em>might</em> have different topologies. Parts can be
          &ldquo;interior parts&rdquo; (element blocks in Exodus terminology) or &ldquo;boundary
          parts&rdquo; (side sets in Exodus terminology):
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>
              Interior parts are specified explicitly in the original mesh and always represent a
              collection of mesh entities that share the same topology. For example, a mesh may
              be divided into two interior parts, the first (first element block) being
              tetrahedral elements and the second (second element block) hexahedral elements.
            </li>
            <li>
              Boundary parts, also known as side sets, represent the collection of faces used to
              define the boundaries of the computational domain where boundary conditions are
              typically applied. A boundary part may contain faces belonging to different
              interior parts &mdash; for instance, a single boundary part may contain hexahedra{' '}
              <em>and</em> tetrahedra.
            </li>
          </ol>
        </li>
      </ul>

      <H2 id="field-definitions" num="17.2">Field Definitions</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        OpenAccel registers solution fields on the STK mesh using a structured naming convention.
        All fields are stored as double-precision floating-point values. There are two primary
        storage locations: <em>node fields</em>, stored at mesh nodes, and <em>element fields</em>,
        stored at the integration points of each element. Both types support scalar (rank-0),
        vector (rank-1) and tensor (rank-2) quantities. The geometry field{' '}
        <code>coordinates</code> and the dual control-volume field{' '}
        <code>dual_nodal_volume</code> are always present on all parts. The lists below give a
        representative subset; the full set depends on the active physics modules.
      </p>

      <H3 id="node-fields" num="17.2.1">Node fields</H3>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>
          Flow and thermodynamic transport fields.
        </strong>
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4" style={{ color: 'var(--text-dim)' }}>
        <li><code>velocity</code> &mdash; vector; fluid velocity <M math="\mathbf{v}=(u,v,w)" /> [m/s]; primary momentum unknown.</li>
        <li><code>pressure</code> &mdash; scalar; solved pressure variable <M math="p" /> (gauge for incompressible, absolute for compressible) [Pa].</li>
        <li><code>specific_enthalpy</code> &mdash; scalar; specific enthalpy <M math="h" /> [J/kg]; primary unknown of the thermal energy equation.</li>
        <li><code>temperature</code> &mdash; scalar; static temperature <M math="T" /> [K]; derived from <code>specific_enthalpy</code>.</li>
        <li><code>specific_total_enthalpy</code> &mdash; scalar; specific total enthalpy <M math="h_0=h+\tfrac12|\mathbf{v}|^{2}" /> [J/kg]; primary unknown of the total energy equation.</li>
        <li><code>volume_fraction</code> &mdash; scalar; phase volume fraction <M math="\alpha^{p}\in[0,1]" />, solved per phase in VoF simulations.</li>
      </ul>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Physical property fields.</strong>
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4" style={{ color: 'var(--text-dim)' }}>
        <li><code>density</code> &mdash; <M math="\rho" /> [kg/m&sup3;];</li>
        <li><code>dynamic_viscosity</code> &mdash; <M math="\mu" /> [Pa&middot;s];</li>
        <li><code>turbulent_viscosity</code> &mdash; <M math="\mu_t" /> [Pa&middot;s];</li>
        <li><code>effective_viscosity</code> &mdash; <M math="\mu_{eff}=\mu+\mu_t" />;</li>
        <li><code>thermal_conductivity</code> &mdash; <M math="\lambda" /> [W/(m&middot;K)];</li>
        <li><code>effective_thermal_conductivity</code> &mdash; <M math="\lambda_{eff}=\lambda+\mu_t c_p/Pr_t" />;</li>
        <li><code>specific_heat_capacity</code> &mdash; <M math="c_p" /> [J/(kg&middot;K)];</li>
        <li><code>compressibility</code> &mdash; <M math="\psi=\rho/p" /> [s&sup2;/m&sup2;] (<M math="\psi=1/(RT)" /> for an ideal gas);</li>
        <li><code>thermal_expansivity</code> &mdash; <M math="\beta" /> [1/K], used in Boussinesq buoyancy.</li>
      </ul>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Turbulence transport fields.</strong>
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4" style={{ color: 'var(--text-dim)' }}>
        <li><code>turbulent_kinetic_energy</code> &mdash; <M math="k" /> [m&sup2;/s&sup2;];</li>
        <li><code>turbulent_eddy_frequency</code> &mdash; <M math="\omega" /> [1/s] (SST);</li>
        <li><code>turbulent_dissipation_rate</code> &mdash; <M math="\varepsilon" /> [m&sup2;/s&sup3;] (<M math="k" />&ndash;<M math="\varepsilon" />);</li>
        <li><code>turbulent_intermittency</code> &mdash; <M math="\gamma\in[0,1]" /> (transition SST);</li>
        <li><code>transition_onset_reynolds_number</code> &mdash; <M math="\widetilde{Re}_{\theta t}" /> (transition SST).</li>
      </ul>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Mesh motion fields.</strong>
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4" style={{ color: 'var(--text-dim)' }}>
        <li><code>displacement</code> &mdash; vector; node displacement <M math="\mathbf{D}" /> [m], solved by the displacement diffusion equation;</li>
        <li><code>velocity_mesh</code> &mdash; vector; mesh velocity <M math="\mathbf{v}_m" />, derived from the displacement field by the BDF2 formula of <a href="/theory/moving-domains">Chapter 7</a>.</li>
      </ul>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Wall and distance fields.</strong>
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4" style={{ color: 'var(--text-dim)' }}>
        <li><code>minimum_distance_to_wall</code> &mdash; <M math="y_{min,i}" /> [m], used in turbulence wall functions and mesh stiffness formulations;</li>
        <li><code>wall_scale</code> &mdash; a normalised wall distance used in near-wall turbulence modelling;</li>
        <li><code>y_plus</code> &mdash; dimensionless wall distance <M math="y^{+}=\rho u_\tau y/\mu" /> (with companions <M math="u^{+}" /> and the wall-law slope of <a href="/theory/postprocessing">Chapter 18</a>).</li>
      </ul>

      <p className="mt-6" style={{ color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', fontStyle: 'italic' }}>Post-processing and diagnostic fields.</strong>
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4" style={{ color: 'var(--text-dim)' }}>
        <li><code>total_pressure</code> &mdash; <M math="p_0" /> [Pa];</li>
        <li><code>total_temperature</code> &mdash; <M math="T_0" /> [K];</li>
        <li><code>mach_number</code> &mdash; <M math="M_a" /> (compressible runs, together with the shock-damping field <code>betaDamp</code> when high-speed blend damping is on);</li>
        <li><code>courant_number</code> &mdash; local Courant number (transient runs);</li>
        <li><code>du</code>/<code>duTilde</code> &mdash; the momentum-diagonal-derived pressure-correction coefficients of <a href="/theory/pv-coupling">Chapter 15</a>.</li>
      </ul>

      <H3 id="element-fields" num="17.2.2">Element fields</H3>
      <p style={{ color: 'var(--text-dim)' }}>
        Element fields are quantities associated with the integration points of each element; they
        are computed during assembly and not stored on nodes.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4" style={{ color: 'var(--text-dim)' }}>
        <li>
          <code>mass_flow_rate</code> &mdash; <M math="\dot{m}_{ip}" /> at each element integration
          point [kg/s], computed via the Rhie&ndash;Chow interpolation (see{' '}
          <a href="/theory/pv-coupling">Chapter 15</a>) and used in the advection terms of all
          transport equations;
        </li>
        <li>
          <code>heat_flow_rate</code> &mdash; thermal energy flux at each element integration
          point [W], used during assembly of the thermal energy equation.
        </li>
      </ul>

      <H2 id="assembler-architecture" num="17.3">Assembler Architecture</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        Every equation follows one kernel pattern with up to four kernel classes: <em>node terms</em>{' '}
        (pure nodal contributions &mdash; transient and time-derivative terms), <em>element terms</em>{' '}
        (interior sub-control-surface loop contributions &mdash; diffusion, advection, sources),{' '}
        <em>boundary conditions</em> (boundary-face contributions), and <em>interface conditions</em>{' '}
        (conformal/non-conformal interface contributions, see{' '}
        <a href="/theory/interfaces">Chapter 14</a>). Each kernel accumulates additively into the
        shared matrix and right-hand side, building <M math="a_{ii}" />/<M math="a_{ij}" />/
        <M math="b_i" /> across all four kernel types before the assembled system goes to the
        linear solver of <a href="/theory/linear-solvers">Chapter 16</a>; a per-equation
        sub-iteration (<code>subIters</code>) repeats the assemble-then-solve cycle within one
        outer physics iteration.
      </p>

      <H2 id="parallel-model" num="17.4">Parallel Model</H2>
      <p style={{ color: 'var(--text-dim)' }}>
        The mesh is partitioned across MPI ranks; each rank owns a subset of elements and a halo
        of <em>ghosted</em> entities shared with neighbours. STK bucket/part selectors drive
        cache-efficient assembly loops over homogeneous entity groups; field values on shared and
        ghosted nodes are synchronised by STK's <code>communicate_field_data</code> (e.g. for{' '}
        <code>du</code>/<code>duTilde</code> after the momentum diagonal is formed); and global
        reductions (residual norms, Courant maxima, the IQN-ILS inner products of{' '}
        <a href="/theory/rigidbody-fsi">Chapter 10</a>) are MPI-reduced, so the CVFEM assembly on
        each rank sees the same integration-point data it would see in serial. Non-conformal
        interfaces maintain their own persistent ghosting, rebuilt whenever the interface sides
        move relative to each other.
      </p>
    </TheoryLayout>
  );
}
