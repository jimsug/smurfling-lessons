import { describe, expect, it } from 'vitest'
import { localizedPath, stripLocalePrefix } from './paths'

describe('stripLocalePrefix', () => {
  it('passes an unprefixed path straight through', () => {
    expect(stripLocalePrefix('/ops/agent-basics/xm/')).toEqual({
      locale: 'en-au',
      path: '/ops/agent-basics/xm/',
    })
  })

  it('passes the root path straight through', () => {
    expect(stripLocalePrefix('/')).toEqual({ locale: 'en-au', path: '/' })
  })

  it('strips a configured non-default locale prefix', () => {
    expect(stripLocalePrefix('/en-us/ops/agent-basics/xm/')).toEqual({
      locale: 'en-us',
      path: '/ops/agent-basics/xm/',
    })
  })

  it('preserves the trailing slash after stripping a prefix', () => {
    expect(stripLocalePrefix('/en-us/glossary/')).toEqual({ locale: 'en-us', path: '/glossary/' })
  })

  it('leaves a path alone if its first segment is not a configured locale', () => {
    expect(stripLocalePrefix('/xx/ops/')).toEqual({ locale: 'en-au', path: '/xx/ops/' })
  })
})

describe('localizedPath', () => {
  it('returns the default locale path unchanged', () => {
    expect(localizedPath('/ops/agent-basics/xm/', 'en-au')).toBe('/ops/agent-basics/xm/')
  })

  it('prefixes a non-default locale', () => {
    expect(localizedPath('/ops/agent-basics/xm/', 'en-us')).toBe('/en-us/ops/agent-basics/xm/')
  })

  it('prefixes the root path without a double slash', () => {
    expect(localizedPath('/', 'en-us')).toBe('/en-us/')
  })

  it('strips an existing prefix before adding the target one', () => {
    expect(localizedPath('/en-us/glossary/', 'en-au')).toBe('/glossary/')
  })
})
