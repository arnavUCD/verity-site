# marketing/ — the public site

Astro + Tailwind v4, static, zero JS on any page without an island.

- **What it may say** — [`docs/marketing/product-narrative.md`](../docs/marketing/product-narrative.md).
  The source of every claim, positioning line, and use case. Read it before writing copy.
- **How it is built** — [ADR 0011](../docs/adr/0011-marketing-site.md).
- **How it looks and moves** — [ADR 0012](../docs/adr/0012-marketing-design-system.md), the
  "Instrument" design system.

This is **not** the app. The operator UI is [`frontend/`](../frontend/), it lives on `app.<domain>`,
and it is the only surface with a session, an API call, or a token. The two deliberately no longer
share a design language (ADR 0011 §12.2).

## Commands

```bash
npm install
npm run dev       # localhost:4321
npm run build     # astro check + static build to dist/
npm run preview
```

## Six rules that are easy to break by accident

1. **Every claim traces to code.** No customer logos, testimonials, review scores, compliance
   badges, or invented metrics — we have none of those yet, and a finance buyer checks. The
   connector list mirrors [`services/billing_connect/providers.py`](../services/billing_connect/providers.py),
   which *derives* availability from whether a driver is registered.
2. **Mind the tense.** The narrative tags every capability **LIVE / NEXT / PLANNED**. LIVE gets the
   present tense; NEXT is written as shipping next; PLANNED appears only in a roadmap section. The
   removal of the approval gate for bank-matched payments is **NEXT**, not done.
3. **No animation may gate content** (ADR 0012 §5). Nothing is `opacity: 0` in the base stylesheet
   waiting for JS to rescue it. Reveals use native scroll-driven animation, and their
   `animation-range` **must keep both endpoints in the same phase** — mixing `entry` with `cover`
   produces an inverted range for short elements, pins progress at 0, and leaves content invisible
   in the middle of the viewport. That is not hypothetical; it shipped here once and was caught in
   the browser.
4. **The hero is a pinned scroll film, and its tall height is set by JS — never in CSS**
   (ADR 0012 §10). `ScrollFilm` renders server-side as a complete, readable act one; the script
   adds `460vh`, pins the stage, and scrubs the camera. If the script never runs, the section is
   one viewport tall and the hero is intact. Put that height in the stylesheet and a failed script
   leaves four blank screens to scroll past.
5. **No React, and no WebGL.** The film is SVG + a GSAP timeline. Nothing on the site needs a
   component runtime; adding one back needs a reason recorded in an ADR.
6. **An animation may never be the only source of a finished style** (ADR 0012 §12.4). This is the
   quieter half of rule 3, and it has already shipped here once: a `view()` timeline is *inactive*
   whenever its subject is not mid-entry — a page loaded already scrolled, a jump to a `#section`
   anchor — and an inactive animation applies **nothing**, dropping the element to its base style.
   `accent-resolve` put the colour only in its keyframes, and six pipeline numbers rendered
   near-black. The base style must already be the finished style; the animation only supplies the
   arrival. Neither this nor the `animation-range` bug was visible to `astro check` — both were
   found by reading computed style in a browser, which is the check that catches the class.

## Structure

```
src/
  components/       SiteHeader (nav + section dropdowns), SiteFooter, Wordmark,
                    CtaButton, CTASection, PageHero
    hero/           ScrollFilm — the pinned, scroll-scrubbed SVG film
  layouts/          BaseLayout — all head/meta discipline lives here
  pages/            index + the five interior pages, privacy, terms
  styles/global.css the whole design system: tokens, primitives, motion
  consts.ts         domain, app URL, contact, nav — a domain change is a one-file edit
scripts/
  check-anchors.mjs asserts every header dropdown link resolves in the BUILT html
```

The header's dropdowns are **pure CSS** (`group-hover` for a pointer, `group-focus-within` for a
keyboard) and add zero JS. Their targets come from `NAV` in `consts.ts`, and every `#id` in it is
verified against `dist/` by `check-anchors`, which runs as part of `npm run build` — a dropdown
that scrolls nowhere is the kind of breakage nothing else in the pipeline would notice.

## Deploying to GitHub Pages

The site publishes to a **separate public repo**, so the backend, ADRs and build plan in the parent
monorepo stay private. `marketing/` remains the source of truth; only this subtree is pushed.

```bash
# 1. Create an EMPTY public repo on GitHub, e.g. verity-site (no README, no .gitignore).
# 2. From the monorepo root, commit the site and push just this subtree:
git add marketing docs/adr/0011-marketing-site.md docs/adr/0012-marketing-design-system.md docs/marketing
git commit -m "feat(marketing): Verity public site"
git remote add site https://github.com/<you>/verity-site.git
git subtree push --prefix marketing site main
# 3. In the new repo: Settings -> Pages -> Source: "GitHub Actions".
```

Every later deploy is the last command again. The workflow
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) builds on push to `main`.

**Nothing about the hosting is hardcoded.** The workflow derives `SITE_URL` from the repo owner and
`BASE_PATH` from the repo name, so canonical URLs, the sitemap and every asset path stay correct if
you rename or fork it.

Three things that make a Pages deploy fail silently, all handled here:

| | |
|---|---|
| `public/.nojekyll` | Without it, Jekyll strips every directory starting with `_` — which is Astro's entire `_astro/` bundle. The site loads with no CSS and no JS. |
| `src/lib/url.ts` | A project page is served from `/<repo>/`, and Astro rewrites asset URLs but **not** hand-written `href`s. Every internal link goes through `url()`. |
| `NOINDEX` in `consts.ts` | Keeps a temporary `github.io` URL from competing with the real domain later. A `robots.txt` would not work here — crawlers only honour one at the domain root, which a project page does not control. |

### Moving to a real domain

1. Add a `CNAME` file to `public/` containing the domain.
2. In the workflow, set `SITE_URL` to it and `BASE_PATH` to `/`.
3. Set `NOINDEX = false` in [`src/consts.ts`](src/consts.ts).

## Status

- **Done** — narrative document, ADRs 0011 + 0012, the Instrument design system, site shell, home
  (scroll film), and the full interior set: `/how-it-works`, `/use-cases`, `/integrations`,
  `/security`, `/design-partners`, plus `/privacy` and `/terms` as flagged placeholders.
- **Next** — OG images and JSON-LD, an a11y + perf pass, then the compose + nginx vhost wiring for
  the `app.` split.
- **Deferred** — pricing (not set), resources/blog, customer stories (none exist yet).

## Known gaps, tracked not hidden

- `SITE_URL`, `APP_URL` and `CONTACT_EMAIL` in [`src/consts.ts`](src/consts.ts) are placeholders.
- The CTA lands on an app that still calls itself **EOS** (ADR 0011 §7).
- The dome is now the poster's navy gradient here, while the app's
  `frontend/src/app/Wordmark.tsx` still draws the old violet flat fill — so the "change one, change
  the other" rule the two files share is **currently broken on purpose** (ADR 0012 §12.1). A visitor
  crossing the CTA handoff sees two different blues until the app follows.
- The site canvas stays cool `#fafaf9` while the poster and the operator UI are both on cream
  (ADR 0012 §12.2). Deferred, not overlooked: a new ground re-rates every contrast figure measured
  against it.
- `/privacy` and `/terms` are **not legally reviewed**. They are accurate about what the site does
  and say plainly that the product's binding terms live in the design-partner agreement. Both are
  `noindex` and excluded from the sitemap until counsel has been through them.
