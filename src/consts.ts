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
  'system, works out what each payment was, credits what is owed, and posts it back on its own. ' +
  'You read the end-of-day report.'

/** One row inside a nav item's dropdown: a link to a SECTION of that item's page. */
export interface NavSection {
  /** Always `<page>#<id>`, and the id must exist in that page's markup. */
  href: string
  label: string
  /** One line on what is actually there. A menu of bare nouns makes the reader open all five. */
  desc: string
}

export interface NavItem {
  href: string
  label: string
  sections: NavSection[]
}

/**
 * Nav order follows the narrative's argument: how it works → where it applies → what it connects
 * to → why it can be trusted → who it is for.
 *
 * Each item carries its page's sections, and the header renders them as a dropdown. Two things
 * this buys beyond navigation: a reader can see what is ON a page before committing to it, and
 * the site stops behaving like five separate documents you can only enter at the top.
 *
 * THE ANCHORS ARE LOAD-BEARING. Every `href` below points at an `id` that must exist in that
 * page's markup — a dropdown that scrolls nowhere is worse than no dropdown, and it fails
 * silently. They are checked by `npm run check:anchors`, which is wired into `npm run build`.
 */
export const NAV: NavItem[] = [
  {
    href: '/how-it-works',
    label: 'How it works',
    sections: [
      { href: '/how-it-works#two-doors', label: 'Two ways in', desc: 'The bank feed finds the work; a person can also just ask' },
      { href: '/how-it-works#pipeline', label: 'The six steps', desc: 'Ingest, match, classify, act, post, report' },
      { href: '/how-it-works#matching-floor', label: 'The matching floor', desc: 'Why the model advises and never authorizes' },
      { href: '/how-it-works#oversight', label: 'Oversight', desc: 'The end-of-day report, and what ships next' },
    ],
  },
  {
    href: '/use-cases',
    label: 'Use cases',
    sections: [
      { href: '/use-cases#cases', label: 'Eight situations', desc: 'An ordinary finance week, with and without Verity' },
      { href: '/use-cases#uc-1', label: 'Duplicate payments', desc: 'The second payment nobody catches for a quarter' },
      { href: '/use-cases#uc-3', label: 'Ambiguous references', desc: 'Two plausible invoices, one payment, no guess' },
      { href: '/use-cases#business-case', label: 'The business case', desc: 'Four numbers we would rather you calculated' },
    ],
  },
  {
    href: '/integrations',
    label: 'Integrations',
    sections: [
      { href: '/integrations#providers', label: 'Connector status', desc: 'What connects today, and the real reason for each gap' },
      { href: '/integrations#tiers', label: 'Three kinds of connection', desc: 'Cloud OAuth, API key, local connector' },
      { href: '/integrations#canonical-invoice', label: 'One invoice shape', desc: 'Why a new adapter is contained work, not a rewrite' },
    ],
  },
  {
    href: '/security',
    label: 'Security',
    sections: [
      { href: '/security#guarantees', label: 'What is enforced', desc: 'Six guarantees, and the mechanism behind each' },
      { href: '/security#credentials', label: 'Credentials', desc: 'The safest secret is the one we never hold' },
      { href: '/security#this-site', label: 'This website', desc: 'Collects nothing, so it can leak nothing' },
      { href: '/security#audit', label: 'Audit', desc: 'Every entry names its actor and its basis' },
    ],
  },
  {
    href: '/design-partners',
    label: 'Design partners',
    sections: [
      { href: '/design-partners#the-trade', label: 'The trade', desc: 'What you get, and what we ask in return' },
      { href: '/design-partners#fit', label: 'Fit', desc: 'Who this works for, and who it does not' },
      { href: '/design-partners#how-it-starts', label: 'How it starts', desc: 'Three steps, none of them a procurement cycle' },
    ],
  },
]

/**
 * The primary CTA. `available` is the switch: while it is false, `CtaButton` renders a
 * non-interactive label instead of a link, because a button that admits the demo is not ready
 * and still navigates is worse than one that does not admit it. Flip it when the demo is live
 * and every placement becomes a real link again.
 */
export const CTA = { href: APP_ENTRY_URL, label: 'Demo', available: true }
