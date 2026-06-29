export interface Op {
  /** route + file slug */
  slug: string
  /** display title, e.g. "Op: Agent Basics" */
  title: string
  /** fixed display order, 1-6 */
  order: number
  /** one-line description for the dashboard card */
  description: string
  /** public path to the op badge SVG */
  badge: string
}

export const ops: Op[] = [
  {
    slug: 'welcome-to-the-resistance',
    title: 'Op: Welcome to the Resistance',
    order: 1,
    description: 'Meet the Resistance and find the people who brought you in.',
    badge: '/badges/welcome-to-the-resistance.svg',
  },
  {
    slug: 'agent-basics',
    title: 'Op: Agent Basics',
    order: 2,
    description: 'The scanner, portals, XM, and how you level up.',
    badge: '/badges/agent-basics.svg',
  },
  {
    slug: 'field-operations',
    title: 'Op: Field Operations',
    order: 3,
    description: 'Linking, fielding, and reading the Intel map.',
    badge: '/badges/field-operations.svg',
  },
  {
    slug: 'combat-ready',
    title: 'Op: Combat Ready',
    order: 4,
    description: 'Weapons, mods, and holding ground.',
    badge: '/badges/combat-ready.svg',
  },
  {
    slug: 'gear-logistics',
    title: 'Op: Gear & Logistics',
    order: 5,
    description: 'Inventory, gear, farming, and keeping stocked.',
    badge: '/badges/gear-logistics.svg',
  },
  {
    slug: 'deep-cover',
    title: 'Op: Deep Cover',
    order: 6,
    description: 'Anomalies, missions, and the wider world you are now part of.',
    badge: '/badges/deep-cover.svg',
  },
]

export const opsBySlug: Record<string, Op> = Object.fromEntries(
  ops.map((op) => [op.slug, op])
)

/** Total lessons across all ops. */
export const TOTAL_LESSONS = 36
