import { describe, expect, it } from 'vitest'
import opsEnAu from './ops-text/en-au.json'
import opsEnUs from './ops-text/en-us.json'
import glossaryEnAu from './glossary-text/en-au.json'
import glossaryEnUs from './glossary-text/en-us.json'

// Both dictionaries are small, closed, hand-curated sets that are already
// fully translated in both locales today - unlike lesson text, there's no
// incremental-translation model to preserve here, so this is a hard gate
// (mirrors src/i18n/ui.test.ts's locale-completeness check).
describe('ops-text completeness', () => {
  it('en-us has every en-au key', () => {
    expect(Object.keys(opsEnUs).sort()).toEqual(Object.keys(opsEnAu).sort())
  })
})

describe('glossary-text completeness', () => {
  it('en-us has every en-au key', () => {
    expect(Object.keys(glossaryEnUs).sort()).toEqual(Object.keys(glossaryEnAu).sort())
  })
})
