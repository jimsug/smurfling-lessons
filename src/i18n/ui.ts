import { defaultLocale, type Locale } from './locales'

export const en = {
  'nav.glossary': 'Glossary',
  'nav.resources': 'Resources',
  'nav.dashboard': 'Dashboard',
  'footer.inspiredBy': 'Inspired by the original',
  'footer.licensedPrefix': 'Content licensed',
  'footer.licenseSuffix': '; site code MIT. Not affiliated with Niantic Spatial.',
  'meta.defaultDescription': 'Onboarding for new Resistance agents in Ingress.',
  'dashboard.eyebrow': 'Resistance · Agent onboarding',
  'dashboard.title': 'Agent dashboard',
  'dashboard.subtitle': 'Getting new Resistance agents operational, fast.',
  'dashboard.readiness': 'Operational readiness',
  'dashboard.lessonsCompleteAriaLabel': 'Lessons complete',
  'dashboard.medalCase': 'Medal case',
  'dashboard.operations': 'Operations',
  'dashboard.resetProgress': 'Reset progress',
  'dashboard.confirmReset': 'Clear all saved progress on this device?',
  'progress.savedNote': 'Progress is saved on this device.',
  'op.breadcrumbLabel': 'Op {order}',
  'op.lessonsCompleteSuffix': 'lessons complete',
  'op.markCompleteAriaLabel': 'Mark "{title}" complete',
  'op.adjacentOpsAriaLabel': 'Adjacent operations',
  'op.previousOp': '← Previous op',
  'op.nextOp': 'Next op →',
  'lesson.breadcrumbLabel': 'Lesson {order}',
  'lesson.notYetTranslated': "This lesson isn't translated yet — showing the English version.",
  'lesson.markComplete': 'Mark complete',
  'lesson.completed': 'Completed',
  'lesson.navigationAriaLabel': 'Lesson navigation',
  'lesson.previous': '← Previous',
  'lesson.next': 'Next →',
  'glossary.eyebrow': 'Reference',
  'glossary.intro':
    'Plain-language definitions of the terms used across the guide. Each links to the lesson that covers it.',
  'glossary.metaDescription': 'Plain-language definitions of the Ingress terms used in this guide.',
  'glossary.filterPlaceholder': 'Filter terms…',
  'glossary.filterAriaLabel': 'Filter glossary terms',
  'glossary.noMatches': 'No terms match.',
  'glossary.coveredIn': 'Covered in {title} →',
  'notFound.eyebrow': 'Signal lost',
  'notFound.title': 'Page not found',
  'notFound.body':
    "That route isn't on the map. Head back to your dashboard, or check the glossary and resources from the menu above.",
  'notFound.backLink': '← Agent dashboard',
  'badge.ariaLabel': 'Op {order}: {title}',
  'badge.earned': 'earned',
  'badge.locked': 'locked',
  'opCard.doneLabel': 'done',
  'term.definitionSuffix': ' definition',
  'term.openGlossary': 'Open glossary',
} as const

export type UIKey = keyof typeof en

/** Per-locale overrides. Only non-default locales need entries here, and only
 *  for the keys that have actually been translated — useTranslations() falls
 *  back to the English value for anything missing. */
const overrides: Partial<Record<Exclude<Locale, typeof defaultLocale>, Partial<Record<UIKey, string>>>> = {
  // None of this UI chrome contains a word that differs in US spelling, so
  // most keys below are identical to en-au - kept explicit rather than left
  // to fall back, so it's on record as reviewed rather than just untouched.
  'en-us': {
    'nav.glossary': 'Glossary',
    'nav.resources': 'Resources',
    'nav.dashboard': 'Dashboard',
    'footer.inspiredBy': 'Inspired by the original',
    'footer.licensedPrefix': 'Content licensed',
    'footer.licenseSuffix': '; site code MIT. Not affiliated with Niantic Spatial.',
    'meta.defaultDescription': 'Onboarding for new Resistance agents in Ingress.',
    'dashboard.eyebrow': 'Resistance · Agent onboarding',
    'dashboard.title': 'Agent dashboard',
    'dashboard.subtitle': 'Getting new Resistance agents operational, fast.',
    'dashboard.readiness': 'Operational readiness',
    'dashboard.lessonsCompleteAriaLabel': 'Lessons complete',
    'dashboard.medalCase': 'Medal case',
    'dashboard.operations': 'Operations',
    'dashboard.resetProgress': 'Reset progress',
    'dashboard.confirmReset': 'Clear all saved progress on this device?',
    'progress.savedNote': 'Progress is saved on this device.',
    'op.breadcrumbLabel': 'Op {order}',
    'op.lessonsCompleteSuffix': 'lessons complete',
    'op.markCompleteAriaLabel': 'Mark "{title}" complete',
    'op.adjacentOpsAriaLabel': 'Adjacent operations',
    'op.previousOp': '← Previous op',
    'op.nextOp': 'Next op →',
    'lesson.breadcrumbLabel': 'Lesson {order}',
    // The one genuine wording change: "the English version" is ambiguous
    // now that there are two, so be specific about which one this is.
    'lesson.notYetTranslated':
      "This lesson isn't translated yet — showing the Australian English version.",
    'lesson.markComplete': 'Mark complete',
    'lesson.completed': 'Completed',
    'lesson.navigationAriaLabel': 'Lesson navigation',
    'lesson.previous': '← Previous',
    'lesson.next': 'Next →',
    'glossary.eyebrow': 'Reference',
    'glossary.intro':
      'Plain-language definitions of the terms used across the guide. Each links to the lesson that covers it.',
    'glossary.metaDescription': 'Plain-language definitions of the Ingress terms used in this guide.',
    'glossary.filterPlaceholder': 'Filter terms…',
    'glossary.filterAriaLabel': 'Filter glossary terms',
    'glossary.noMatches': 'No terms match.',
    'glossary.coveredIn': 'Covered in {title} →',
    'notFound.eyebrow': 'Signal lost',
    'notFound.title': 'Page not found',
    'notFound.body':
      "That route isn't on the map. Head back to your dashboard, or check the glossary and resources from the menu above.",
    'notFound.backLink': '← Agent dashboard',
    'badge.ariaLabel': 'Op {order}: {title}',
    'badge.earned': 'earned',
    'badge.locked': 'locked',
    'opCard.doneLabel': 'done',
    'term.definitionSuffix': ' definition',
    'term.openGlossary': 'Open glossary',
  },
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
