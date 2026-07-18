// Reports lesson-translation completeness per locale. Not a test - always
// exits 0 - this is a coverage report, not a gate. Plain Node, no build
// step, so it stays runnable regardless of the TS toolchain.
import { appendFileSync, existsSync, readdirSync } from 'node:fs'

const DEFAULT_LOCALE = 'en'
const base = 'src/content/lessons'

const ops = readdirSync(`${base}/${DEFAULT_LOCALE}`)
const canonical = ops.flatMap((op) =>
  readdirSync(`${base}/${DEFAULT_LOCALE}/${op}`).map((file) => `${op}/${file}`),
)

const otherLocales = readdirSync(base).filter((locale) => locale !== DEFAULT_LOCALE)

const lines = [`${DEFAULT_LOCALE}: ${canonical.length}/${canonical.length} lessons (default locale)`]

if (otherLocales.length === 0) {
  lines.push('No additional locales configured yet.')
} else {
  for (const locale of otherLocales) {
    const translated = canonical.filter((rel) => existsSync(`${base}/${locale}/${rel}`))
    const pct = Math.round((translated.length / canonical.length) * 100)
    lines.push(`${locale}: ${translated.length}/${canonical.length} lessons translated (${pct}%)`)
  }
}

for (const line of lines) console.log(line)

const summaryPath = process.env.GITHUB_STEP_SUMMARY
if (summaryPath) {
  const table = ['## Lesson translation coverage', '', ...lines.map((line) => `- ${line}`), ''].join(
    '\n',
  )
  appendFileSync(summaryPath, table)
}
