import { describe, expect, it } from 'vitest'
import { en, translatedKeys, useTranslations } from './ui'
import { locales, type Locale } from './locales'

describe('useTranslations', () => {
  it('resolves English keys directly', () => {
    expect(useTranslations('en')('nav.glossary')).toBe('Glossary')
  })

  it('supports {placeholder} interpolation', () => {
    expect(useTranslations('en')('op.breadcrumbLabel', { order: 3 })).toBe('Op 3')
  })

  it('replaces every occurrence of a repeated placeholder', () => {
    expect(useTranslations('en')('badge.ariaLabel', { order: 1, title: 'Agent Basics' })).toBe(
      'Op 1: Agent Basics',
    )
  })

  it('falls back to English for a key a locale has not translated', () => {
    // 'xx' stands in for a future locale with no overrides at all yet.
    expect(useTranslations('xx' as Locale)('nav.glossary')).toBe(en['nav.glossary'])
  })
})

describe('locale completeness', () => {
  const allKeys = Object.keys(en) as (keyof typeof en)[]
  const nonDefaultLocales = locales.filter(
    (locale): locale is Exclude<Locale, 'en'> => locale !== 'en',
  )

  // Vacuously passes with zero test cases today (only "en" is configured).
  // The moment a locale is added to locales.ts, this starts asserting that
  // every English key has a translation - the process rule this enforces is
  // "don't make a locale live until its ui.ts entry is complete."
  it.each(nonDefaultLocales)('%s has translated every UI key', (locale) => {
    const translated = translatedKeys(locale)
    const missing = allKeys.filter((key) => !translated.includes(key))
    expect(missing).toEqual([])
  })

  it('always configures the default locale', () => {
    expect(locales).toContain('en')
  })
})
