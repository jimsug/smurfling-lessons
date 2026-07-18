import { describe, expect, it } from 'vitest'
import { localizedPath, stripLocalePrefix } from './paths'
import type { Locale } from './locales'

describe('stripLocalePrefix', () => {
  it('passes an unprefixed path straight through', () => {
    expect(stripLocalePrefix('/ops/agent-basics/xm/')).toEqual({
      locale: 'en',
      path: '/ops/agent-basics/xm/',
    })
  })

  it('passes the root path straight through', () => {
    expect(stripLocalePrefix('/')).toEqual({ locale: 'en', path: '/' })
  })

  it('strips a configured locale prefix', () => {
    expect(stripLocalePrefix('/en/ops/agent-basics/xm/')).toEqual({
      locale: 'en',
      path: '/ops/agent-basics/xm/',
    })
  })

  it('preserves the trailing slash after stripping a prefix', () => {
    expect(stripLocalePrefix('/en/glossary/')).toEqual({ locale: 'en', path: '/glossary/' })
  })

  it('leaves a path alone if its first segment is not a configured locale', () => {
    expect(stripLocalePrefix('/xx/ops/')).toEqual({ locale: 'en', path: '/xx/ops/' })
  })
})

describe('localizedPath', () => {
  it('returns the default locale path unchanged', () => {
    expect(localizedPath('/ops/agent-basics/xm/', 'en')).toBe('/ops/agent-basics/xm/')
  })

  it('prefixes a non-default locale', () => {
    // 'xx' stands in for a future second locale - only "en" is configured
    // today, so this exercises the non-default branch synthetically.
    expect(localizedPath('/ops/agent-basics/xm/', 'xx' as Locale)).toBe('/xx/ops/agent-basics/xm/')
  })

  it('prefixes the root path without a double slash', () => {
    expect(localizedPath('/', 'xx' as Locale)).toBe('/xx/')
  })

  it('strips an existing prefix before adding the target one', () => {
    expect(localizedPath('/en/glossary/', 'xx' as Locale)).toBe('/xx/glossary/')
  })
})
