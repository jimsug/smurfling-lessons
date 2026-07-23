# Smurfling Guide

A mobile-first static site that onboards new Resistance players to Ingress.
Lives at [guide.join.blue](https://guide.join.blue).

It replaces the old smurfling.guide: refreshed for current game mechanics, built
for a phone, and aimed at getting a freshly recruited agent operational
alongside their local team.

## Stack

- Astro (static SSG, no SSR adapter)
- Tailwind v4 via the `@tailwindcss/vite` plugin
- MDX lessons through Astro's Content Layer API (`glob()` loader)
- TypeScript throughout, near-zero client JS
- Self-hosted fonts (Chakra Petch for display, Inter for body), no external requests

## What's here

- A dashboard styled as an agent profile: a hex medal case, overall readiness,
  and a card per op.
- Six ops of six lessons each (36 in all), written and fact-checked against
  current Ingress mechanics.
- A searchable glossary that links each term to the lesson covering it, plus
  inline term definitions in lessons via the native Popover API.
- A resources page that points new agents at their local community.
- Progress tracking in localStorage that lights an op badge when its lessons are
  done. No accounts, no analytics, no cookies.
- Australian and US English, with a language switcher and automatic
  browser-language detection on first visit. The footer links out to the
  project on Weblate for anyone wanting to help translate.

## Develop

Needs Node >= 22.12 and pnpm.

```sh
pnpm install
pnpm dev            # local dev server
pnpm build          # static build to dist/
pnpm preview        # serve the built output
pnpm check          # type-check
pnpm test           # unit tests (vitest)
pnpm i18n:coverage  # lesson-translation coverage per locale
pnpm screenshots    # screenshot lesson pages and upload to Weblate (needs
                    # WEBLATE_API_TOKEN; supports --dry-run to save locally
                    # instead)
```

## Content

- Op metadata: `src/data/ops.ts` - stable metadata (slug, order, badge), plus
  per-locale text (title, description) in `src/data/ops-text/<locale>.json`,
  read together via `getOps(locale)`.
- Lessons: MDX under `src/content/lessons/<locale>/<op>/<lesson>.mdx`, loaded
  as the `lessons` collection. Frontmatter is just `op` and `order` - title
  and summary live in `src/i18n/lesson-text/<locale>.json` instead, keyed
  `<op>/<lesson>.title`/`.summary`.
- Glossary: stable ids in `src/data/glossary.ts`, per-locale `{ term,
  definition }` text in `src/data/glossary-text/<locale>.json`, read together
  via `getGlossary(locale)`, with each term mapped to its lesson.
- UI chrome strings: `src/i18n/locales/<locale>.json`, read via
  `useTranslations(locale)` in `src/i18n/ui.ts`.

All of the above are plain per-locale JSON dictionaries specifically so they
can be managed through [Weblate](https://hosted.weblate.org/projects/smurfling-guide/)
rather than requiring a code change for every translation - see
[CONTRIBUTING.md](CONTRIBUTING.md).

Lessons can use a few MDX components: `<Lvl n={8} />` colours a portal or agent
level, `<Medal tier="gold" />` a medal tier, and `<Term id="xm">XM</Term>` adds
an inline definition. Spots that want artwork are marked with
`{/* VISUAL: ... */}`.

## Internationalisation

Two locales today: `en-au` (default, unprefixed - `/ops/...`) and `en-us`
(`/en-us/ops/...`), differing only in spelling (colour/organise/centred vs
color/organize/centered, etc.) - the language switcher and browser-language
detection are both live. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to
add a further locale.

## Deploy

Pushes to `main` build and publish to GitHub Pages via
`.github/workflows/deploy.yml`, and, after a successful deploy, uploads fresh
lesson screenshots to Weblate for translator context. The custom domain is
pinned by `public/CNAME`. Pull requests and pushes to `development` run
type-checking, tests, and a build via `.github/workflows/ci.yml`.

## Contributing

Feature and fix branches target `development`, not `main` - see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

Site code is MIT (`LICENSE`). Guide content is CC BY-SA 4.0 (`LICENSE-CONTENT`).

Inspired by the original smurfling.guide. Not affiliated with Niantic Spatial.
