import { SEO } from '@/components/SEO';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { TheoryLayout } from './TheoryLayout';

export function Ch1Overview() {
  useDocumentTitle('Overview — Theory Manual');
  return (
    <TheoryLayout chNum="1" title="Overview">
      <SEO
        title="Overview — Theory Manual"
        description="What OpenAccel is and the physics it covers: incompressible/compressible flow, turbulence, heat transfer, free-surface flow, solid mechanics, rigid-body dynamics, and fluid–structure interaction."
        path="/theory/overview"
      />

      <p style={{ color: 'var(--text-dim)' }}>
        <span style={{ color: 'var(--text)' }}>OpenAccel</span> is a CPU-parallel, vertex-based
        control-volume finite-element (CVFEM) solver built on the Trilinos&ndash;STK mesh
        infrastructure. It employs a pressure-based, segregated approach to solve the governing
        equations, making it well suited to incompressible and low-Mach compressible flows. Over
        successive releases the physics has grown well beyond single-phase flow, and now spans:
      </p>

      <ul className="list-disc pl-6 space-y-2 my-6" style={{ color: 'var(--text-dim)' }}>
        <li>
          incompressible and compressible fluid flow, with RANS turbulence (<em>k</em>&ndash;
          <em>&epsilon;</em>, <em>k</em>&ndash;<em>&omega;</em> SST) and laminar&ndash;turbulent
          transition (two transition-SST variants);
        </li>
        <li>
          heat transfer through a thermal-energy or a total-energy formulation, with an ideal-gas
          equation of state and NASA-polynomial thermodynamics, and conjugate heat transfer across
          fluid&ndash;solid interfaces;
        </li>
        <li>
          multiphase free-surface flow by an algebraic volume-of-fluid method with interface
          compression, flux-corrected transport, and balanced-force surface tension;
        </li>
        <li>
          finite-strain solid mechanics &mdash; linear elastic, neo-Hookean and
          Saint-Venant&ndash;Kirchhoff &mdash; in a total-Lagrangian setting;
        </li>
        <li>rigid-body (6-DOF) dynamics with two-way coupling to the flow; and</li>
        <li>
          partitioned fluid&ndash;structure interaction with Aitken and IQN-ILS convergence
          acceleration.
        </li>
      </ul>

      <p style={{ color: 'var(--text-dim)' }}>
        This guide documents the underlying mathematical theory and numerical formulations
        implemented in the OpenAccel C++ framework.{' '}
        <a href="/theory/preliminaries">Chapter 2</a> fixes notation.{' '}
        <strong style={{ color: 'var(--text)' }}>Part II</strong> derives the continuum models.{' '}
        <strong style={{ color: 'var(--text)' }}>Part III</strong> develops the CVFEM
        discretisation. <strong style={{ color: 'var(--text)' }}>Part IV</strong> presents the
        solution algorithms, and <strong style={{ color: 'var(--text)' }}>Part V</strong>{' '}
        documents the implementation, interfaces, post-processing and mesh quality machinery.
      </p>
    </TheoryLayout>
  );
}
