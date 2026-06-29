/**
 * Progress tracking. localStorage only, one JSON object under one key.
 * Shape: { "op-slug/lesson-slug": true, ... }. Op completion is derived,
 * never stored. All reads/writes are defensive so private mode or a full
 * quota degrades quietly rather than throwing.
 */

export const STORAGE_KEY = 'smurfling:progress'
export const PROGRESS_EVENT = 'smurfling:progress-changed'

export type ProgressMap = Record<string, boolean>

/** Storage key for a lesson. Matches the content entry id (`op/lesson`). */
export function lessonKey(op: string, lesson: string): string {
  return `${op}/${lesson}`
}

export function load(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as ProgressMap
    }
  } catch {
    // malformed JSON or storage unavailable
  }
  return {}
}

function persist(map: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // quota exceeded or storage blocked; carry on without persisting
  }
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT))
}

export function setDone(key: string, done: boolean): void {
  const map = load()
  if (done) map[key] = true
  else delete map[key]
  persist(map)
}

export function reset(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT))
}

/** How many of the given keys are marked done. */
export function doneCount(keys: string[], map: ProgressMap = load()): number {
  return keys.reduce((n, key) => (map[key] ? n + 1 : n), 0)
}

/** True when every key in the op is done (and the op has lessons). */
export function isOpComplete(keys: string[], map: ProgressMap = load()): boolean {
  return keys.length > 0 && keys.every((key) => map[key] === true)
}

/**
 * Run `handler` whenever progress changes: same-page edits (custom event),
 * other tabs (storage event), and back/forward cache restores (pageshow).
 */
export function onChange(handler: () => void): void {
  window.addEventListener(PROGRESS_EVENT, handler)
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) handler()
  })
  window.addEventListener('pageshow', handler)
}
