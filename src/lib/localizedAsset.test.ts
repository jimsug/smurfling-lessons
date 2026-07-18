import { beforeEach, describe, expect, it, vi } from 'vitest'

const existsSyncMock = vi.fn()
vi.mock('node:fs', () => ({
  existsSync: (...args: unknown[]) => existsSyncMock(...args),
}))

const { localizedAsset } = await import('./localizedAsset')

describe('localizedAsset', () => {
  beforeEach(() => {
    existsSyncMock.mockReset()
  })

  it('passes the default locale (en-au) straight through without touching the filesystem', () => {
    expect(localizedAsset('/badges/agent-basics-active.svg', 'en-au')).toBe(
      '/badges/agent-basics-active.svg',
    )
    expect(existsSyncMock).not.toHaveBeenCalled()
  })

  it('resolves to the locale variant when it exists on disk', () => {
    existsSyncMock.mockReturnValue(true)
    expect(localizedAsset('/badges/agent-basics-active.svg', 'en-us')).toBe(
      '/badges/agent-basics-active.en-us.svg',
    )
  })

  it('falls back to the default path when no variant exists', () => {
    existsSyncMock.mockReturnValue(false)
    expect(localizedAsset('/badges/agent-basics-active.svg', 'en-us')).toBe(
      '/badges/agent-basics-active.svg',
    )
  })
})
