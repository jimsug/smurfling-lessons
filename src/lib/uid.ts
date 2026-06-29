// Build-time unique-id counter. Lives in a module so the count persists across
// component renders within a build, giving each instance a unique id.
let n = 0

export function uid(prefix: string): string {
  n += 1
  return `${prefix}-${n}`
}
