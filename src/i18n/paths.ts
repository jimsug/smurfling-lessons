import { defaultLocale, locales, type Locale } from './locales'

/** Strip a known locale prefix if present: "/es/foo/" -> { locale: 'es', path: '/foo/' }.
 *  Framework-free (no astro:content/astro:i18n imports) so it can be shared
 *  between server-rendered components and the client-side detection script. */
export function stripLocalePrefix(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split('/')
  if (first && (locales as readonly string[]).includes(first)) {
    return { locale: first as Locale, path: '/' + rest.join('/') }
  }
  return { locale: defaultLocale, path: pathname }
}

/** The equivalent path for another locale, given any current pathname. */
export function localizedPath(pathname: string, target: Locale): string {
  const { path } = stripLocalePrefix(pathname)
  return target === defaultLocale ? path : `/${target}${path}`
}
