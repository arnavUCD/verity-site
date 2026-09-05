/**
 * Every dropdown link in the header points at a SECTION of a page (`NAV` in src/consts.ts).
 * A link whose `#id` does not exist scrolls nowhere: the browser silently stays put, the reader
 * assumes the site is broken, and nothing in the build says a word about it. That is the exact
 * shape of failure this repo keeps writing checks for — correct-looking markup that is wrong
 * only in the browser.
 *
 * So the anchors are verified against the BUILT HTML rather than the source. Checking the source
 * would prove that someone typed an id; checking dist/ proves the id survives into the artifact
 * that actually ships, which is the claim the header is making.
 *
 * Runs as part of `npm run build`, after `astro build`. Exits non-zero on the first broken link.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const consts = readFileSync('src/consts.ts', 'utf8')

// Only the section links carry a '#', so this finds exactly the set the dropdowns render.
const links = [...consts.matchAll(/href:\s*'(\/[a-z0-9-]+#[a-z0-9-]+)'/g)].map((m) => m[1])

if (links.length === 0) {
  console.error('check-anchors: found no section links in src/consts.ts — has NAV changed shape?')
  process.exit(1)
}

const problems = []

for (const link of links) {
  const [path, id] = link.split('#')
  const file = join('dist', path, 'index.html')

  if (!existsSync(file)) {
    problems.push(`${link} — no built page at ${file}`)
    continue
  }
  // Astro emits double-quoted attributes; match on the attribute, not a bare substring, so an
  // id that merely appears inside body copy cannot satisfy the check.
  if (!readFileSync(file, 'utf8').includes(`id="${id}"`)) {
    problems.push(`${link} — ${file} has no element with id="${id}"`)
  }
}

if (problems.length) {
  console.error(`\ncheck-anchors: ${problems.length} header link(s) point nowhere:\n`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  console.error('')
  process.exit(1)
}

console.log(`check-anchors: ${links.length} header section links all resolve ✓`)
