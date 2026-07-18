import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defaultLocale, type Locale } from '../i18n/locales'

const PUBLIC_DIR = fileURLToPath(new URL('../../public/', import.meta.url))

/**
 * Resolve a locale-specific variant of a public/-relative asset path
 * ("/badges/foo-active.svg" -> "/badges/foo-active.es.svg") if one exists on
 * disk, falling back to the default-locale path otherwise. This is a
 * build-time decision (a plain fs check during Astro's render), not a
 * client-side runtime one - each locale already gets its own static page, so
 * there's no need to ship every locale's variant to every visitor.
 */
export function localizedAsset(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path
  const dot = path.lastIndexOf('.')
  const candidate = `${path.slice(0, dot)}.${locale}${path.slice(dot)}`
  return existsSync(`${PUBLIC_DIR}${candidate.replace(/^\//, '')}`) ? candidate : path
}
