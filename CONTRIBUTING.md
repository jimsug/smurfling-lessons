# Contributing

## Getting started

Needs Node >= 22.12 and pnpm.

```sh
pnpm install
pnpm dev
```

## Branches and PRs

Feature and fix branches target `development`, not `main`. `main` only
receives merges from `development` and is what deploys to production
(`.github/workflows/deploy.yml`, on push to `main`).

Before opening a PR, run:

```sh
pnpm check    # type-check
pnpm test     # unit tests
pnpm build    # confirm the site builds
```

`.github/workflows/ci.yml` runs the same three on every PR and on pushes to
`development`.

## Adding or editing a lesson

Lessons live at `src/content/lessons/en-au/<op>/<lesson>.mdx` (write new
lessons in Australian English - see
[Internationalisation](#internationalisation) below for the `en-us` copy).
Frontmatter is `title`, `op` (the op slug), `order` (position within the op),
and `summary`. The six op slugs and their order are fixed in
`src/data/ops.ts`.

Three MDX components are available in lesson bodies:

- `<Lvl n={8} />` - colours a portal or agent level
- `<Medal tier="gold" />` - colours a medal tier
- `<Term id="xm">XM</Term>` - an inline glossary definition, popover-triggered;
  `id` must match an entry in `src/data/glossary.ts`

Spots that want artwork but don't have it yet are marked
`{/* VISUAL: ... */}`. When building one of these out, prefer a diagram-style
SVG with the text as real markup (or overlaid separately) over a flat
screenshot with baked-in UI text - it stays legible at any zoom level and
doesn't need a re-shoot for every locale. `src/lib/localizedAsset.ts` resolves
a locale-specific variant of an asset path when one exists, falling back to
the default otherwise, for the cases where a real screenshot is unavoidable.

## Adding a glossary term

Add an id to the `glossaryIds` list and a `{ term, definition }` entry under
`en-au` in `glossaryText`, both in `src/data/glossary.ts`, then add the same
entry under `en-us` (converting spelling only - see below). If the term is
covered by a specific lesson, add it to `termLesson` too (`id` -> `op/lesson`)
so the glossary page can link to it and `<Term>` popovers stay consistent.

## Internationalisation

Two locales exist: `en-au` (default, unprefixed URLs) and `en-us` (under
`/en-us/`). They differ only in spelling - colour/organise/centred/travelled
vs color/organize/centered/traveled, and so on - never in wording or meaning.
When adding or editing `en-au` lesson content, add the equivalent `en-us`
file alongside it with just the spelling converted; don't leave one locale's
copy of a lesson stale relative to the other.

Adding a genuinely different (non-English) locale is content work, not
plumbing work - the routing, dictionary, switcher, and detection already
handle an arbitrary number of locales:

1. Add the locale code to `locales` (and a display name to `localeNames`) in
   `src/i18n/locales.ts`. This alone makes the switcher and the
   detection/redirect script go live for that locale.
2. Fill in the locale's entries in `src/i18n/ui.ts`'s `overrides`. This is
   required *before* step 1 can land cleanly: `src/i18n/ui.test.ts` has a
   hard-gate test asserting every UI key has a translation for every
   configured non-default locale, so an incomplete dictionary fails CI.
3. Fill in the locale's entries in `opsText` (`src/data/ops.ts`) and
   `glossaryText` (`src/data/glossary.ts`).
4. Add `src/pages/<locale>/index.astro`, `glossary.astro`, and
   `resources.astro` (hand-translated - these are page-length content, not
   dictionary keys), plus `src/pages/<locale>/ops/[op]/index.astro` and
   `[lesson].astro` (thin wrappers - copy the `en-us` ones and swap the
   locale constant/literal, including inside `getStaticPaths` - see the
   comment in either file about why it can't be a shared module-level const).
5. Add an entry to `routing.fallback` (e.g. `{ 'en-us': 'en-au', '<locale>':
   'en-au' }`) in `astro.config.mjs`'s `i18n` block, so any page in that
   locale you haven't built yet transparently shows the default version
   instead of 404ing.
6. Translate lesson MDX incrementally under `src/content/lessons/<locale>/`.
   Nothing needs to be complete before it ships: `lessonsForLocale()` in
   `src/lib/lessons.ts` falls back to the default locale's copy of any lesson
   that isn't translated yet, and the lesson page shows a "not translated
   yet" banner when it does. Run `pnpm i18n:coverage` to see per-locale
   translation percentages.
7. If a translated lesson uses `<Term>`, check that its popover shows the
   right locale's definition. `Term.astro` resolves locale from the URL
   rather than `Astro.currentLocale`, since it's rendered from inside MDX
   content where that API is unreliable - if that ever stops holding up, pass
   `locale` to `<Term>` explicitly as a documented fallback.

Note that a lesson's slug (file/folder name) stays the same across locales
regardless of what that word means in the new locale - `lessonsForLocale()`
matches translations to their default-locale original by identical slug, so
renaming one would just make the translation invisible rather than updating
the URL.

## Licence

Site code is MIT (`LICENSE`); guide content is CC BY-SA 4.0
(`LICENSE-CONTENT`). Contributions are made under those same terms.
