import { defaultLocale, type Locale } from './locales'
import enAu from './lesson-text/en-au.json'
import enUs from './lesson-text/en-us.json'

export type LessonTextKey = keyof typeof enAu

const overrides: Partial<Record<Exclude<Locale, typeof defaultLocale>, Partial<Record<LessonTextKey, string>>>> = {
  'en-us': enUs,
}

/** Resolved title/summary text for one lesson field, falling back to the
 *  default locale's value for any key `locale` hasn't translated yet. */
export function lessonText(locale: Locale, op: string, slug: string, field: 'title' | 'summary'): string {
  const key = `${op}/${slug}.${field}` as LessonTextKey
  const dict = locale === defaultLocale ? {} : (overrides[locale] ?? {})
  const value = dict[key] ?? enAu[key]
  if (value === undefined) {
    throw new Error(`Missing default-locale lesson text for key "${key}" in en-au.json`)
  }
  return value
}
