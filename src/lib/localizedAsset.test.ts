import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Locale } from '../i18n/locales'

const existsSyncMock = vi.fn()
vi.mock('node:fs', () => ({
  existsSync: (...args: unknown[]) => existsSyncMock(...args),
}))

const { localizedAsset } = await import('./localizedAsset')

describe('localizedAsset', () => {
  beforeEach(() => {
    existsSyncMock.mockReset()
  })

  it('passes the default locale straight through without touching the filesystem', () => {
    expect(localizedAsset('/badges/agent-basics-active.svg', 'en')).toBe(
      '/badges/agent-basics-active.svg',
    )
    expect(existsSyncMock).not.toHaveBeenCalled()
  })

  it('resolves to the locale variant when it exists on disk', () => {
    existsSyncMock.mockReturnValue(true)
    // 'es' stands in for a future second locale - only "en" is configured today.
    expect(localizedAsset('/badges/agent-basics-active.svg', 'es' as Locale)).toBe(
      '/badges/agent-basics-active.es.svg',
    )
  })

  it('falls back to the default path when no variant exists', () => {
    existsSyncMock.mockReturnValue(false)
    expect(localizedAsset('/badges/agent-basics-active.svg', 'es' as Locale)).toBe(
      '/badges/agent-basics-active.svg',
    )
  })
})
