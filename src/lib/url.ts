/**
 * Base-aware internal links.
 *
 * On GitHub Pages a project site is served from a SUBPATH (`/credere-site/`), not the domain root.
 * Astro rewrites asset URLs for that automatically; it does **not** rewrite `href` attributes you
 * wrote by hand. A bare `href="/security"` therefore resolves to `username.github.io/security` —
 * off the site entirely, and a 404 on every nav click. Every internal link goes through here.
 *
 * `import.meta.env.BASE_URL` is `/` in dev and whatever `base` is set to at build time, so moving
 * to a custom domain later means changing one variable and touching no links.
 */
export function url(path: string): string {
  // Absolute URLs, mailto:, tel: and in-page anchors are already final.
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path

  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  const rest = path.replace(/^\/+/, '')
  return rest ? `${base}/${rest}` : `${base}/`
}
