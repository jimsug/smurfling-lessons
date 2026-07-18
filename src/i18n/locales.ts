export const locales = ['en-au', 'en-us'] as const
export type Locale = (typeof locales)[number]
// No `: Locale` annotation - kept as its inferred literal type so
// `Exclude<Locale, typeof defaultLocale>` resolves to the other locale(s)
// instead of widening to `never`.
export const defaultLocale = 'en-au'

export const localeNames: Record<Locale, string> = {
  'en-au': 'English (Australia)',
  'en-us': 'English (US)',
}
