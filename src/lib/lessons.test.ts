import { describe, expect, it } from 'vitest'
import { lessonHref } from './lessons'

describe('lessonHref', () => {
  it('builds an unprefixed URL for the default locale', () => {
    expect(lessonHref('en-au', 'agent-basics', 'xm')).toBe('/ops/agent-basics/xm/')
  })

  it('prefixes a non-default locale', () => {
    expect(lessonHref('en-us', 'agent-basics', 'xm')).toBe('/en-us/ops/agent-basics/xm/')
  })
})
