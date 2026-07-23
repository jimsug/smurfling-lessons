import { defaultLocale, type Locale } from './locales'
import en from './locales/en-au.json'
import enUs from './locales/en-us.json'

export { en }
export type UIKey = keyof typeof en

/** Per-locale overrides, sourced from src/i18n/locales/*.json (the format
 *  Weblate manages). Only non-default locales need entries here, and only
 *  for the keys that have actually been translated - useTranslations() falls
 *  back to the English value for anything missing. */
const overrides: Partial<Record<Exclude<Locale, typeof defaultLocale>, Partial<Record<UIKey, string>>>> = {
  'en-us': enUs,
}

export function useTranslations(locale: Locale) {
  const dict: Partial<Record<UIKey, string>> = locale === defaultLocale ? {} : (overrides[locale] ?? {})

  return function t(key: UIKey, replacements?: Record<string, string | number>): string {
    const template = dict[key] ?? en[key]
    if (!replacements) return template
    return Object.entries(replacements).reduce(
      (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
      template,
    )
  }
}

/** Which keys a non-default locale has actually translated, as opposed to
 *  falling back to English - useTranslations() alone can't distinguish the
 *  two, since it deliberately masks missing keys with the English value. */
export function translatedKeys(locale: Exclude<Locale, typeof defaultLocale>): UIKey[] {
  return Object.keys(overrides[locale] ?? {}) as UIKey[]
}
