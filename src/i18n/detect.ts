import { locales, type Locale } from './locales'

/**
 * Match a browser's preferred-language list (e.g. navigator.languages)
 * against the configured locales. Exact codes take priority over the base
 * language subtag (so a configured "pt-BR" beats a configured "pt" for a
 * browser preference of "pt-BR"), earlier preferences win over later ones,
 * and matching is case-insensitive. Returns null if nothing matches.
 */
export function matchLocale(browserLangs: readonly string[]): Locale | null {
  const codes = locales as readonly string[]
  for (const raw of browserLangs) {
    const lang = raw.toLowerCase()
    const exactIndex = codes.indexOf(lang)
    if (exactIndex !== -1) return locales[exactIndex]
    const baseIndex = codes.indexOf(lang.split('-')[0])
    if (baseIndex !== -1) return locales[baseIndex]
  }
  return null
}
