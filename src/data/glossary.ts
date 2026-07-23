import type { Locale } from '../i18n/locales'
import { defaultLocale } from '../i18n/locales'
import enAuText from './glossary-text/en-au.json'
import enUsText from './glossary-text/en-us.json'

export interface GlossaryEntry {
  /** url-safe id, used for anchors and the <Term id="..."> lookup */
  id: string
  /** display term */
  term: string
  /** one-line definition for the glossary and inline popovers */
  definition: string
}

interface GlossaryText {
  term: string
  definition: string
}

/** Stable ids, in canonical (display) order. */
const glossaryIds = [
  'xm',
  'portal',
  'resonator',
  'link',
  'control-field',
  'mind-unit',
  'hack',
  'glyph-hack',
  'mod',
  'shield',
  'ap',
  'level',
  'resistance',
  'enlightened',
  'machina',
  'key',
  'key-locker',
  'capsule',
  'kinetic-capsule',
  'power-cube',
  'hypercube',
  'xmp-burster',
  'ultra-strike',
  'heat-sink',
  'multi-hack',
  'link-amp',
  'sbul',
  'ito-transmuter',
  'flip-card',
  'recursion',
  'wayfarer',
  'anomaly',
  'mission',
  'banner',
  'comms',
  'intel-map',
  'first-saturday',
  'second-sunday',
  'dispatch',
  'fracker',
  'cmu',
  'core',
  'scanner',
  'nl-1331',
] as const

const glossaryText: Record<Locale, Partial<Record<string, GlossaryText>>> = {
  'en-au': enAuText,
  'en-us': enUsText,
}

/** All glossary entries for `locale`, in canonical order, falling back to the default locale's text if untranslated. */
export function getGlossary(locale: Locale): GlossaryEntry[] {
  return glossaryIds.map((id) => ({
    id,
    ...(glossaryText[locale]?.[id] ?? glossaryText[defaultLocale][id]!),
  }))
}

export function getGlossaryById(locale: Locale): Record<string, GlossaryEntry> {
  return Object.fromEntries(getGlossary(locale).map((entry) => [entry.id, entry]))
}

/** The lesson (op/lesson slug pair) that covers each term. Locale-independent. */
export const termLesson: Record<string, string> = {
  xm: 'agent-basics/xm',
  portal: 'agent-basics/portals',
  resonator: 'agent-basics/resonators',
  link: 'field-operations/linking',
  'control-field': 'field-operations/fielding',
  'mind-unit': 'field-operations/fielding',
  hack: 'agent-basics/hacking',
  'glyph-hack': 'agent-basics/hacking',
  mod: 'combat-ready/defence-mods',
  shield: 'combat-ready/defence-mods',
  ap: 'agent-basics/ap-levelling-badges',
  level: 'agent-basics/ap-levelling-badges',
  resistance: 'welcome-to-the-resistance/the-resistance',
  enlightened: 'welcome-to-the-resistance/the-resistance',
  machina: 'welcome-to-the-resistance/machina-intro',
  key: 'field-operations/linking',
  'key-locker': 'field-operations/key-lockers',
  capsule: 'gear-logistics/capsules',
  'kinetic-capsule': 'gear-logistics/kinetic-capsules',
  'power-cube': 'gear-logistics/power-cubes',
  hypercube: 'gear-logistics/power-cubes',
  'xmp-burster': 'combat-ready/weapons',
  'ultra-strike': 'combat-ready/weapons',
  'heat-sink': 'combat-ready/hack-mods',
  'multi-hack': 'combat-ready/hack-mods',
  'link-amp': 'combat-ready/linking-mods',
  sbul: 'combat-ready/linking-mods',
  'ito-transmuter': 'combat-ready/ito-transmuters',
  'flip-card': 'combat-ready/viruses',
  recursion: 'field-operations/recursion',
  wayfarer: 'deep-cover/portal-submissions',
  anomaly: 'deep-cover/anomalies',
  mission: 'deep-cover/missions-banners',
  banner: 'deep-cover/missions-banners',
  comms: 'welcome-to-the-resistance/finding-your-community',
  'intel-map': 'field-operations/intel-map',
  'first-saturday': 'welcome-to-the-resistance/first-saturday',
  'second-sunday': 'deep-cover/dispatch-campaigns',
  dispatch: 'deep-cover/dispatch-campaigns',
  fracker: 'gear-logistics/farming',
  cmu: 'gear-logistics/ingress-store',
  core: 'gear-logistics/ingress-store',
  scanner: 'agent-basics/the-scanner',
  'nl-1331': 'deep-cover/nl-1331',
}
