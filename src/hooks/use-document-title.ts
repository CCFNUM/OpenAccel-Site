/**
 * Titles and meta tags are now managed by react-helmet-async via the <SEO>
 * component in each page. This hook is kept as a no-op so existing call
 * sites don't need to be touched simultaneously.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDocumentTitle(_title: string) {}
