import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'
import { opsMeta } from '../data/ops'
import { defaultLocale, type Locale } from '../i18n/locales'
import { lessonText } from '../i18n/lesson-text'
import { localizedPath } from '../i18n/paths'

export type Lesson = CollectionEntry<'lessons'>

/** The lesson slug: the entry id without its locale/op prefix (`locale/op/lesson` -> `lesson`). */
export function lessonSlug(entry: Lesson): string {
  return entry.id.split('/').pop() ?? entry.id
}

/** Route for a lesson page in a given locale. Takes locale/op/slug rather than
 *  an entry, since the rendered entry may be a fallback from another locale
 *  (see `lessonsForLocale`) and must not leak that locale into the URL. */
export function lessonHref(locale: Locale, op: string, slug: string): string {
  return localizedPath(`/ops/${op}/${slug}/`, locale)
}

const opOrder = new Map(opsMeta.map((op) => [op.slug, op.order]))

export interface LocalizedLesson {
  entry: Lesson
  op: string
  slug: string
  title: string
  summary: string
  /** True when no translation exists yet and `entry` is the default-locale fallback. */
  isFallback: boolean
}

/**
 * Every lesson for `locale`, in reading order, always covering the full
 * canonical (default-locale) set — falling back to the default locale's
 * entry (and flagging isFallback) for anything not yet translated. Lesson
 * order and op assignment follow the default locale and are not overridable
 * per locale, so prev/next and counts stay identical across locales.
 */
export async function lessonsForLocale(locale: Locale): Promise<LocalizedLesson[]> {
  const all = await getCollection('lessons')
  const byId = new Map(all.map((entry) => [entry.id, entry]))

  const canonical = all
    .filter((entry) => entry.id.startsWith(`${defaultLocale}/`))
    .map((entry) => ({ op: entry.data.op, slug: lessonSlug(entry), order: entry.data.order }))
    .sort(
      (a, b) => (opOrder.get(a.op) ?? 999) - (opOrder.get(b.op) ?? 999) || a.order - b.order,
    )

  return canonical.map(({ op, slug }) => {
    const localized = byId.get(`${locale}/${op}/${slug}`)
    const fallback = byId.get(`${defaultLocale}/${op}/${slug}`)!
    const isFallback = !localized
    // Title/summary follow the same effective locale as the resolved body,
    // rather than being resolved independently - otherwise a translated
    // heading could sit above an untranslated body and the "not yet
    // translated" banner, a confusing partial state.
    const textLocale = isFallback ? defaultLocale : locale
    return {
      entry: localized ?? fallback,
      op,
      slug,
      title: lessonText(textLocale, op, slug, 'title'),
      summary: lessonText(textLocale, op, slug, 'summary'),
      isFallback,
    }
  })
}
