import type { Locale } from '../i18n/locales'
import { defaultLocale } from '../i18n/locales'

export interface OpMeta {
  /** route + file slug */
  slug: string
  /** fixed display order, 1-6 */
  order: number
  /** public path to the op badge SVG */
  badge: string
}

export interface OpText {
  /** display title, e.g. "Op: Agent Basics" */
  title: string
  /** title with the "Op: " prefix stripped, for contexts that don't want it */
  shortTitle: string
  /** one-line description for the dashboard card */
  description: string
}

export interface Op extends OpMeta, OpText {}

export const opsMeta: OpMeta[] = [
  {
    slug: 'welcome-to-the-resistance',
    order: 1,
    badge: '/badges/welcome-to-the-resistance.svg',
  },
  {
    slug: 'agent-basics',
    order: 2,
    badge: '/badges/agent-basics.svg',
  },
  {
    slug: 'field-operations',
    order: 3,
    badge: '/badges/field-operations.svg',
  },
  {
    slug: 'combat-ready',
    order: 4,
    badge: '/badges/combat-ready.svg',
  },
  {
    slug: 'gear-logistics',
    order: 5,
    badge: '/badges/gear-logistics.svg',
  },
  {
    slug: 'deep-cover',
    order: 6,
    badge: '/badges/deep-cover.svg',
  },
]

const opsText: Record<Locale, Partial<Record<string, OpText>>> = {
  'en-au': {
    'welcome-to-the-resistance': {
      title: 'Op: Welcome to the Resistance',
      shortTitle: 'Welcome to the Resistance',
      description: 'Meet the Resistance and find the people who brought you in.',
    },
    'agent-basics': {
      title: 'Op: Agent Basics',
      shortTitle: 'Agent Basics',
      description: 'The scanner, portals, XM, and how you level up.',
    },
    'field-operations': {
      title: 'Op: Field Operations',
      shortTitle: 'Field Operations',
      description: 'Linking, fielding, and reading the Intel map.',
    },
    'combat-ready': {
      title: 'Op: Combat Ready',
      shortTitle: 'Combat Ready',
      description: 'Weapons, mods, and holding ground.',
    },
    'gear-logistics': {
      title: 'Op: Gear & Logistics',
      shortTitle: 'Gear & Logistics',
      description: 'Inventory, gear, farming, and keeping stocked.',
    },
    'deep-cover': {
      title: 'Op: Deep Cover',
      shortTitle: 'Deep Cover',
      description: 'Anomalies, missions, and the wider world you are now part of.',
    },
  },
  // No spelling differs between en-AU and en-US for any of these - kept
  // explicit rather than left to fall back, so it's on record as reviewed.
  'en-us': {
    'welcome-to-the-resistance': {
      title: 'Op: Welcome to the Resistance',
      shortTitle: 'Welcome to the Resistance',
      description: 'Meet the Resistance and find the people who brought you in.',
    },
    'agent-basics': {
      title: 'Op: Agent Basics',
      shortTitle: 'Agent Basics',
      description: 'The scanner, portals, XM, and how you level up.',
    },
    'field-operations': {
      title: 'Op: Field Operations',
      shortTitle: 'Field Operations',
      description: 'Linking, fielding, and reading the Intel map.',
    },
    'combat-ready': {
      title: 'Op: Combat Ready',
      shortTitle: 'Combat Ready',
      description: 'Weapons, mods, and holding ground.',
    },
    'gear-logistics': {
      title: 'Op: Gear & Logistics',
      shortTitle: 'Gear & Logistics',
      description: 'Inventory, gear, farming, and keeping stocked.',
    },
    'deep-cover': {
      title: 'Op: Deep Cover',
      shortTitle: 'Deep Cover',
      description: 'Anomalies, missions, and the wider world you are now part of.',
    },
  },
}

/** All ops for `locale`, falling back to the default locale's text if untranslated. */
export function getOps(locale: Locale): Op[] {
  return opsMeta.map((meta) => ({
    ...meta,
    ...(opsText[locale]?.[meta.slug] ?? opsText[defaultLocale][meta.slug]!),
  }))
}

export function getOpsBySlug(locale: Locale): Record<string, Op> {
  return Object.fromEntries(getOps(locale).map((op) => [op.slug, op]))
}

/** Total lessons across all ops. Locale-independent. */
export const TOTAL_LESSONS = 36
