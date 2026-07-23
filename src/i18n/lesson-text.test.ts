import { readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import en from './lesson-text/en-au.json'

const base = 'src/content/lessons/en-au'

describe('lesson-text completeness', () => {
  const ops = readdirSync(base)
  const canonical = ops.flatMap((op) =>
    readdirSync(`${base}/${op}`).map((file) => ({ op, slug: file.replace(/\.mdx$/, '') })),
  )

  it.each(canonical)('en-au.json has title/summary for $op/$slug', ({ op, slug }) => {
    // Keys are flat with literal dots (e.g. "gear-logistics/inventory.title"),
    // so `in` is used directly rather than toHaveProperty's dot-path lookup.
    expect(`${op}/${slug}.title` in en).toBe(true)
    expect(`${op}/${slug}.summary` in en).toBe(true)
  })
})
