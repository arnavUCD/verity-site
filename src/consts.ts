/**
 * Site-wide constants. Everything a domain change touches lives here, so wiring the real
 * domain later is a one-file edit (ADR 0011 §2).
 */

export const SITE_NAME = 'Verity'

/**
 * Keeps the whole site out of search while it lives on a temporary GitHub Pages URL. Set to false
 * the day it moves to the real domain — otherwise a throwaway `github.io` address competes with
 * that domain for your own name, and half-finished pages rank before you meant them to.
 *
 * NOTE: this meta tag is what actually does the work. A `robots.txt` in `public/` would be served
 * at `/<repo>/robots.txt`, and crawlers only honour one at the DOMAIN root — which a project page
 * does not control.
 */
export const NOINDEX = true

/** TODO(domain): placeholder until the real domain is registered. Used for canonical URLs and the sitemap. */
export const SITE_URL = 'https://verity.example.com'

/**
 * The operator UI, on its own origin (ADR 0011 §2). This is where the primary CTA goes: the
 * demo IS the product, so "see the live demo" lands in the real app rather than a booking form.
 *
 * KNOWN GAP (ADR 0011 §7): the app still greets visitors as "EOS". Renaming it is its own change.
 */
export const APP_URL = 'https://frontend-production-2175.up.railway.app'

/**
 * Where a CTA actually lands: the app's front door, named explicitly.
 *
 * `APP_URL` on its own works only by accident — the root is a guarded lane, so an unauthenticated
 * visitor is bounced to `/welcome` by the shell's redirect. Depending on a redirect to reach the
 * page every marketing link is *for* means the destination is only ever one routing change away
 * from silently becoming something else. Naming it costs nothing and makes the handoff explicit:
 * the site hands off to sign in / set up a workspace, not to a dashboard nobody can see yet. */
export const APP_ENTRY_URL = `${APP_URL}/welcome`

/** TODO(contact): a real inbox, not a personal address. The site has no form — this is the only route in. */
export const CONTACT_EMAIL = 'hello@verity.example.com'

export const SITE_DESCRIPTION =
  'Verity is an agentic accounting operations layer. It connects your bank and your billing ' +
  'system, works out what each payment actually was, credits what is owed, and posts it back — ' +
  'on its own. You read the end-of-day report.'

export interface NavItem {
  href: string
  label: string
}

/** Nav order follows the narrative's argument: how it works → where it applies → what it connects
 *  to → why it can be trusted → who it is for. */
export const NAV: NavItem[] = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/use-cases', label: 'Use cases' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/security', label: 'Security' },
  { href: '/design-partners', label: 'Design partners' },
]

/**
 * The primary CTA. `available` is the switch: while it is false, `CtaButton` renders a
 * non-interactive label instead of a link, because a button that admits the demo is not ready
 * and still navigates is worse than one that does not admit it. Flip it when the demo is live
 * and every placement becomes a real link again.
 */
export const CTA = { href: APP_ENTRY_URL, label: 'Demo', available: true }
