import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { SITE_URL } from './src/consts'

// A pre-rendered static site. No adapter, no SSR, no server tier: the deployed
// artifact is HTML/CSS/fonts, served by nginx on its own vhost, proxying nothing (§2, §3).
// No React: the hero film is SVG + a GSAP timeline, and nothing else on the site
// needs a component runtime. A marketing page that requires JS to render its own text has lost.
/**
 * `site` and `base` are read from the environment so the deploy workflow can derive them from the
 * repository itself (see .github/workflows/deploy.yml) — nothing about the hosting is hardcoded
 * here, and moving to a custom domain means changing the workflow, not the source.
 *
 * `base` is the GitHub Pages project subpath (`/credere-site`). Astro rewrites asset URLs for it;
 * hand-written `href`s go through `src/lib/url.ts`.
 */
export default defineConfig({
  site: process.env.SITE_URL ?? SITE_URL,
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  // The legal pages are `noindex` until counsel has reviewed them; listing them in the sitemap
  // would be asking crawlers to index exactly what the meta tag tells them not to.
  integrations: [mdx(), sitemap({ filter: (page) => !/\/(privacy|terms)\/$/.test(page) })],
  vite: { plugins: [tailwindcss()] },
})
