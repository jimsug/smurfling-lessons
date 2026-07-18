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

Lessons live at `src/content/lessons/en/<op>/<lesson>.mdx` (the `en` segment
is the locale - see [Internationalisation](#internationalisation) below).
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
`en` in `glossaryText`, both in `src/data/glossary.ts`. If the term is covered
by a specific lesson, add it to `termLesson` too (`id` -> `op/lesson`) so the
glossary page can link to it and `<Term>` popovers stay consistent.

## Internationalisation

English is the only locale with content today, but the routing, the UI string
dictionary, the language switcher, and browser-language detection are all
built and working - adding a locale is content work, not plumbing work.

1. Add the locale code to `locales` (and a display name to `localeNames`) in
   `src/i18n/locales.ts`. This alone makes the switcher and the
   detection/redirect script go live for that locale.
2. Fill in the locale's entries in `src/i18n/ui.ts`'s `overrides`. This is
   required *before* step 1 can land cleanly: `src/i18n/ui.test.ts` has a
   hard-gate test asserting every English UI key has a translation for every
   configured non-default locale, so an incomplete dictionary fails CI.
3. Fill in the locale's entries in `opsText` (`src/data/ops.ts`) and
   `glossaryText` (`src/data/glossary.ts`).
4. Add `src/pages/<locale>/index.astro`, `glossary.astro`, and
   `resources.astro` (hand-translated - these are page-length content, not
   dictionary keys), plus `src/pages/<locale>/ops/[op]/index.astro` and
   `[lesson].astro` (thin wrappers - copy the English ones and swap the
   locale constant).
5. Add `routing.fallback: { <locale>: 'en' }` and `fallbackType: 'rewrite'` to
   `astro.config.mjs`'s `i18n` block, so any page in that locale you haven't
   built yet transparently shows the English version instead of 404ing.
6. Translate lesson MDX incrementally under `src/content/lessons/<locale>/`.
   Nothing needs to be complete before it ships: `lessonsForLocale()` in
   `src/lib/lessons.ts` falls back to the English copy of any lesson that
   isn't translated yet, and the lesson page shows a "not translated yet"
   banner when it does. Run `pnpm i18n:coverage` to see per-locale
   translation percentages.
7. If a translated lesson uses `<Term>`, check that its popover shows the
   right locale's definition. `Term.astro` resolves locale from the URL
   rather than `Astro.currentLocale`, since it's rendered from inside MDX
   content where that API is unreliable - if that ever stops holding up, pass
   `locale` to `<Term>` explicitly as a documented fallback.

## Licence

Site code is MIT (`LICENSE`); guide content is CC BY-SA 4.0
(`LICENSE-CONTENT`). Contributions are made under those same terms.
