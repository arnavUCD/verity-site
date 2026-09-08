# Verity marketing site

The public site for Verity, an accounting operations tool that reads a bank feed, matches each
payment to an invoice, and posts the correction back to the billing system.

Built with Astro and Tailwind v4. Static output, no server, no forms, no analytics, no cookies.
The homepage ships one script (GSAP, for the hero); every other page ships none.

## Running it

```bash
npm install
npm run dev       # localhost:4321
npm run build     # type-check, build to dist/, verify header links
npm run preview
```

## Layout

```
src/
  components/       header, footer, wordmark, CTA
    hero/           ScrollFilm, the scroll-driven hero
  layouts/          BaseLayout, all head and meta tags
  pages/            one file per route
  styles/           global.css, the whole design system
  consts.ts         domain, nav, CTA target
scripts/
  check-anchors.mjs verifies every header dropdown link resolves
```

## Conventions worth knowing

**Two typefaces, split by meaning.** Geist for anything the site says. Source Code Pro for anything
the system produced: invoice references, bank narration, amounts, state names. An editorial label
set in the mono face is a bug rather than a style choice.

**Animation never hides content.** Every reveal is a native scroll-driven animation whose base
style is already the finished style, so an element renders correctly whether or not the animation
runs. This matters more than it sounds: a scroll timeline is inactive on a page loaded partway
down, on a jump to a `#section` anchor, and in browsers without support. Anything that only looks
right mid-animation will be wrong in all three cases.

**The hero's tall scroll height is set by JavaScript, never CSS.** Without the script the section
is one viewport tall and reads as an ordinary hero. If that height lived in the stylesheet, a
failed script would leave four blank screens to scroll past.

**Claims trace to the product.** No customer logos, testimonials, or compliance badges, because
there aren't any yet. The connector list mirrors what actually ships, and anything not built is
labelled as not built.

## Deploying

Pushes to `main` build and publish to GitHub Pages via `.github/workflows/deploy.yml`. The site
URL and base path are derived from the repository itself, so renaming or forking it keeps
canonical URLs and asset paths correct.

Three things that silently break a Pages deploy, all handled here:

| | |
|---|---|
| `public/.nojekyll` | Without it Jekyll strips `_astro/`, and the site loads with no CSS or JS. |
| `src/lib/url.ts` | A project page is served from a subpath. Astro rewrites asset URLs but not hand-written `href`s, so internal links go through `url()`. |
| `NOINDEX` in `consts.ts` | Keeps the temporary github.io URL out of search. A `robots.txt` would not work, since crawlers only honour one at the domain root. |

### Moving to a custom domain

1. Add a `CNAME` file to `public/` containing the domain.
2. Set `SITE_URL` to it and `BASE_PATH` to `/` in the workflow.
3. Set `NOINDEX = false` in `src/consts.ts`.

## Known gaps

- `SITE_URL` and `CONTACT_EMAIL` in `consts.ts` are placeholders.
- `/privacy` and `/terms` are accurate but not legally reviewed. Both are `noindex` and excluded
  from the sitemap.
- Pricing, case studies and a blog are deliberately absent until there is something real to put
  on them.
