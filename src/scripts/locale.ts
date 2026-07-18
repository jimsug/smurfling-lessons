import { defaultLocale, type Locale } from '../i18n/locales'
import { localizedPath } from '../i18n/paths'
import { matchLocale } from '../i18n/detect'

const STORAGE_KEY = 'smurfling:locale'
const current = document.documentElement.lang as Locale

function persist(locale: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // storage unavailable; the choice just won't survive a reload
  }
}

let stored: string | null = null
try {
  stored = localStorage.getItem(STORAGE_KEY)
} catch {
  // storage unavailable; behave as if nothing is stored
}

if (stored === null) {
  // First visit ever. Only auto-redirect from the default locale - landing
  // directly on a non-default locale URL (shared link, search result, or a
  // previous switcher click before storage was available) is treated as an
  // explicit choice, not something to redirect away from.
  if (current === defaultLocale) {
    const preferred = matchLocale(navigator.languages ?? [navigator.language])
    if (preferred && preferred !== defaultLocale) {
      // Persist before redirecting so this can only ever fire once per
      // browser, even across back-button or bfcache reloads.
      persist(preferred)
      location.replace(localizedPath(location.pathname, preferred))
    } else {
      persist(defaultLocale)
    }
  } else {
    persist(current)
  }
} else if (stored !== current) {
  // Any subsequent navigation - a switcher click, a bookmarked link, typing
  // a URL directly - updates the stored preference to match. A plain
  // <a href> switcher link needs no click handler: this same check on the
  // next page load is what makes the choice stick.
  persist(current)
}
