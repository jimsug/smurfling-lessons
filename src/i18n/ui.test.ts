import { describe, expect, it } from 'vitest'
import { en, translatedKeys, useTranslations } from './ui'
import { defaultLocale, locales, type Locale } from './locales'

describe('useTranslations', () => {
  it('resolves default-locale (en-AU) keys directly', () => {
    expect(useTranslations('en-au')('nav.glossary')).toBe('Glossary')
  })

  it('supports {placeholder} interpolation', () => {
    expect(useTranslations('en-au')('op.breadcrumbLabel', { order: 3 })).toBe('Op 3')
  })

  it('replaces every occurrence of a repeated placeholder', () => {
    expect(useTranslations('en-au')('badge.ariaLabel', { order: 1, title: 'Agent Basics' })).toBe(
      'Op 1: Agent Basics',
    )
  })

  it('falls back to en-AU for a key en-US has not translated', () => {
    // 'xx' stands in for a hypothetical locale with no overrides at all.
    expect(useTranslations('xx' as Locale)('nav.glossary')).toBe(en['nav.glossary'])
  })
})

describe('locale completeness', () => {
  const allKeys = Object.keys(en) as (keyof typeof en)[]
  const nonDefaultLocales = locales.filter(
    (locale): locale is Exclude<Locale, typeof defaultLocale> => locale !== defaultLocale,
  )

  // Real gate now that en-us is configured: fails if any English key is
  // missing from en-us's overrides. The process rule this enforces is
  // "don't make a locale live until its ui.ts entry is complete."
  it.each(nonDefaultLocales)('%s has translated every UI key', (locale) => {
    const translated = translatedKeys(locale)
    const missing = allKeys.filter((key) => !translated.includes(key))
    expect(missing).toEqual([])
  })

  it('always configures the default locale', () => {
    expect(locales).toContain(defaultLocale)
  })
})
