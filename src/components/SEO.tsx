import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'OpenAccel';
const BASE_URL = 'https://openaccel.replit.app';
const OG_IMAGE = `${BASE_URL}/og-image.png`;
const DEFAULT_DESC =
  'OpenAccel is a free, open-source vertex-based CVFEM solver for multiphysics CFD: compressible and incompressible flow, multiphase VOF, fluid-structure interaction, conjugate heat transfer, and turbulence modelling. BSD 3-Clause licensed.';

interface SEOProps {
  /** Page name, e.g. "Tutorials". Rendered as "Tutorials — OpenAccel".
   *  Pass undefined or empty string to use the default site title. */
  title?: string;
  description?: string;
  path?: string;
}

export function SEO({ title, description = DEFAULT_DESC, path = '/' }: SEOProps) {
  const fullTitle = title
    ? `${title} — ${SITE_NAME}`
    : `${SITE_NAME} — Open-source multiphysics CFD solver`;

  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="OpenAccel — Open-source multiphysics CFD solver" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}
