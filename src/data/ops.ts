import type { Locale } from '../i18n/locales'
import { defaultLocale } from '../i18n/locales'
import enAuText from './ops-text/en-au.json'
import enUsText from './ops-text/en-us.json'

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
  'en-au': enAuText,
  'en-us': enUsText,
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
