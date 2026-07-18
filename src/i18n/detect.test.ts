import { describe, expect, it, vi } from 'vitest'

// Only "en" is configured today; mock a richer locale list so the priority
// logic (exact vs. base-subtag, earlier preference vs. later) is genuinely
// exercised now rather than only once a second real locale exists.
vi.mock('./locales', () => ({
  locales: ['en', 'es', 'pt-br'],
}))

const { matchLocale } = await import('./detect')

describe('matchLocale', () => {
  it('matches an exact configured code', () => {
    expect(matchLocale(['es'])).toBe('es')
  })

  it('matches case-insensitively', () => {
    expect(matchLocale(['ES'])).toBe('es')
  })

  it('falls back to the base language subtag', () => {
    expect(matchLocale(['es-AR'])).toBe('es')
  })

  it('prefers an exact multi-part match over a base-subtag match', () => {
    expect(matchLocale(['pt-BR'])).toBe('pt-br')
  })

  it('prefers an earlier preference over a later one', () => {
    expect(matchLocale(['fr', 'es', 'en'])).toBe('es')
  })

  it('returns null when nothing matches', () => {
    expect(matchLocale(['fr', 'de'])).toBeNull()
  })

  it('returns null for an empty preference list', () => {
    expect(matchLocale([])).toBeNull()
  })
})
