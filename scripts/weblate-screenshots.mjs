// Screenshots every lesson page and uploads it to Weblate, attached to the
// matching component, so translators have visual context for the page
// they're translating (particularly the <Lvl>/<Medal> table-heavy lessons).
//
// Unlike i18n-coverage.mjs this is a gating script: it exits non-zero on
// real failures, since a silent failure here just means Weblate quietly
// has stale/missing screenshots with no signal.
//
// Usage:
//   node scripts/weblate-screenshots.mjs              # uploads to Weblate
//   node scripts/weblate-screenshots.mjs --dry-run     # saves to .screenshots/, no network calls to Weblate
//
// Env:
//   WEBLATE_API_TOKEN     required unless --dry-run
//   SCREENSHOT_BASE_URL   default https://guide.join.blue
//   WEBLATE_LESSON_FILTER optional "<op>/<slug>", restricts the run to one lesson
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const DEFAULT_LOCALE = 'en-au'
const LESSONS_BASE = 'src/content/lessons'
const WEBLATE_API = 'https://hosted.weblate.org/api'
const WEBLATE_PROJECT = 'smurfling-guide'

const dryRun = process.argv.includes('--dry-run')
const baseUrl = (process.env.SCREENSHOT_BASE_URL ?? 'https://guide.join.blue').replace(/\/$/, '')
const lessonFilter = process.env.WEBLATE_LESSON_FILTER
const apiToken = process.env.WEBLATE_API_TOKEN

if (!dryRun && !apiToken) {
  console.error('WEBLATE_API_TOKEN is required unless --dry-run is passed.')
  process.exitCode = 1
  process.exit(1)
}

function enumerateLessons() {
  const ops = readdirSync(`${LESSONS_BASE}/${DEFAULT_LOCALE}`)
  return ops.flatMap((op) =>
    readdirSync(`${LESSONS_BASE}/${DEFAULT_LOCALE}/${op}`)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => ({ op, slug: file.replace(/\.mdx$/, '') })),
  )
}

async function weblateFetch(path, options = {}) {
  const response = await fetch(`${WEBLATE_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Token ${apiToken}`,
      ...options.headers,
    },
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Weblate API ${response.status} for ${path}: ${body}`)
  }
  return response
}

// Follows the `next` pagination field until exhausted, returning every
// result across all pages.
async function weblateFetchAllPages(path) {
  const results = []
  let next = `${WEBLATE_API}${path}`
  while (next) {
    const response = await fetch(next, { headers: { Authorization: `Token ${apiToken}` } })
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new Error(`Weblate API ${response.status} for ${next}: ${body}`)
    }
    const page = await response.json()
    results.push(...page.results)
    next = page.next
  }
  return results
}

// Builds `<op>/<lesson>` name -> { slug, sourceLanguageCode }. Weblate's
// slugification of the component name isn't something we should guess at,
// so we always resolve it against the live API.
async function buildComponentMap() {
  const components = await weblateFetchAllPages(
    `/projects/${WEBLATE_PROJECT}/components/?page_size=100`,
  )
  const map = new Map()
  for (const component of components) {
    map.set(component.name, {
      slug: component.slug,
      sourceLanguageCode: component.source_language?.code,
    })
  }
  return map
}

// Keyed by component slug -> existing screenshot id, so we know whether to
// create or replace.
//
// NOTE: the exact shape of `component` on a screenshot list entry (a plain
// slug vs a hyperlinked "/api/components/<project>/<slug>/" URL, per DRF
// convention elsewhere in Weblate's API) hasn't been confirmed against a
// live response - this environment has no API token. Handle both shapes
// defensively; this is one of the code paths flagged for a real smoke test
// once WEBLATE_API_TOKEN is available.
async function buildExistingScreenshotMap() {
  const screenshots = await weblateFetchAllPages(`/projects/${WEBLATE_PROJECT}/screenshots/`)
  const map = new Map()
  for (const screenshot of screenshots) {
    const raw = screenshot.component
    if (!raw) continue
    const slug = raw.includes('/') ? raw.replace(/\/$/, '').split('/').pop() : raw
    map.set(slug, screenshot.id ?? screenshot.pk)
  }
  return map
}

async function uploadScreenshot({ existingId, componentSlug, sourceLanguageCode, name, buffer }) {
  const form = new FormData()
  form.append('image', new Blob([buffer], { type: 'image/png' }), `${name}.png`)
  form.append('name', name)

  if (existingId) {
    await weblateFetch(`/screenshots/${existingId}/file/`, {
      method: 'POST',
      body: form,
    })
    return 'replaced'
  }

  form.append('project_slug', WEBLATE_PROJECT)
  form.append('component_slug', componentSlug)
  form.append('language_code', sourceLanguageCode)
  await weblateFetch('/screenshots/', {
    method: 'POST',
    body: form,
  })
  return 'created'
}

async function main() {
  let lessons = enumerateLessons()
  if (lessonFilter) {
    lessons = lessons.filter(({ op, slug }) => `${op}/${slug}` === lessonFilter)
    if (lessons.length === 0) {
      console.error(`WEBLATE_LESSON_FILTER "${lessonFilter}" matched no lessons.`)
      process.exitCode = 1
      return
    }
  }

  let componentMap = new Map()
  let existingScreenshots = new Map()
  if (!dryRun) {
    console.log('Fetching Weblate component list...')
    componentMap = await buildComponentMap()
    console.log(`Found ${componentMap.size} Weblate components.`)
    console.log('Fetching existing screenshots...')
    existingScreenshots = await buildExistingScreenshotMap()
  } else {
    mkdirSync('.screenshots', { recursive: true })
  }

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

  let created = 0
  let replaced = 0
  let failed = 0

  for (const { op, slug } of lessons) {
    const name = `${op}/${slug}`
    const url = `${baseUrl}/ops/${op}/${slug}/`

    try {
      await page.goto(url, { waitUntil: 'load' })
      await page.locator('article.lesson-prose').waitFor({ state: 'visible' })
      const buffer = await page.screenshot({ fullPage: true })

      if (dryRun) {
        const filePath = `.screenshots/${op}-${slug}.png`
        writeFileSync(filePath, buffer)
        console.log(`[dry-run] saved ${filePath} (${buffer.length} bytes)`)
        continue
      }

      const component = componentMap.get(name)
      if (!component) {
        console.warn(`No Weblate component found for "${name}", skipping.`)
        failed++
        continue
      }
      if (!component.slug || !component.sourceLanguageCode) {
        console.warn(
          `Weblate component for "${name}" is missing a slug or source language code, skipping.`,
        )
        failed++
        continue
      }

      const existingId = existingScreenshots.get(component.slug)
      const result = await uploadScreenshot({
        existingId,
        componentSlug: component.slug,
        sourceLanguageCode: component.sourceLanguageCode,
        name,
        buffer,
      })
      if (result === 'created') created++
      else replaced++
      console.log(`${result} screenshot for ${name}`)
    } catch (error) {
      console.error(`Failed to screenshot/upload "${name}": ${error.message}`)
      failed++
    }
  }

  await browser.close()

  if (dryRun) {
    console.log(`Dry run complete: ${lessons.length} lesson(s) screenshotted to .screenshots/.`)
  } else {
    console.log(`Summary: ${created} created, ${replaced} replaced, ${failed} skipped/failed.`)
  }

  if (failed > 0) process.exitCode = 1
}

// Future enhancement: associate individual translatable strings with a
// region of the screenshot via POST /api/screenshots/(id)/units/. There's
// no bulk form for that endpoint, and it needs a per-string GET /api/units/
// lookup to resolve unit ids, so it's left for a follow-up - the core value
// here is the whole-page visual reference.

await main()
