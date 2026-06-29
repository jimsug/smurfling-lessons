import type { CollectionEntry } from 'astro:content'
import { ops } from '../data/ops'

export type Lesson = CollectionEntry<'lessons'>

/** The lesson slug: the entry id without its op prefix (`op/lesson` -> `lesson`). */
export function lessonSlug(entry: Lesson): string {
  return entry.id.split('/').pop() ?? entry.id
}

/** Route for a lesson page. */
export function lessonHref(entry: Lesson): string {
  return `/ops/${entry.data.op}/${lessonSlug(entry)}/`
}

const opOrder = new Map(ops.map((op) => [op.slug, op.order]))

/** All lessons in reading order: by op order, then lesson order within the op. */
export function orderedLessons(all: Lesson[]): Lesson[] {
  return [...all].sort(
    (a, b) =>
      (opOrder.get(a.data.op) ?? 999) - (opOrder.get(b.data.op) ?? 999) ||
      a.data.order - b.data.order,
  )
}
