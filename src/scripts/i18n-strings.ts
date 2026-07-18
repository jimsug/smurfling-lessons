/** Reads the #i18n-strings JSON island rendered by Layout.astro. Degrades to
 *  the given English fallbacks if the island is missing or malformed. */
export function loadStrings<T extends Record<string, string>>(fallback: T): T {
  try {
    const el = document.getElementById('i18n-strings')
    if (el?.textContent) return { ...fallback, ...JSON.parse(el.textContent) }
  } catch {
    // malformed embed; degrade to fallback strings
  }
  return fallback
}
