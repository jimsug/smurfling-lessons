import { doneCount, isOpComplete, load, onChange, reset } from '../lib/progress'

interface OpData {
  slug: string
  keys: string[]
}
interface PageData {
  ops: OpData[]
  total: number
}

const dataEl = document.getElementById('progress-data')
if (dataEl?.textContent) {
  let data: PageData
  try {
    data = JSON.parse(dataEl.textContent) as PageData
  } catch {
    // A malformed embed degrades to the no-JS baseline rather than throwing.
    data = { ops: [], total: 0 }
  }

  const render = (): void => {
    const map = load()
    let done = 0

    for (const op of data.ops) {
      const opDone = doneCount(op.keys, map)
      done += opDone
      const complete = isOpComplete(op.keys, map)

      const card = document.querySelector(`[data-op-card="${op.slug}"]`)
      if (card) {
        const count = card.querySelector('[data-op-count]')
        if (count) count.textContent = `${opDone}/${op.keys.length}`
        card.classList.toggle('is-complete', complete)
      }

      const badge = document.querySelector(`[data-op-badge="${op.slug}"]`)
      if (badge) {
        badge.classList.toggle('is-earned', complete)
        const status = badge.querySelector('[data-badge-status]')
        if (status) status.textContent = complete ? 'earned' : 'locked'
      }
    }

    document.querySelectorAll('[data-progress-count]').forEach((el) => {
      el.textContent = String(done)
    })

    const bar = document.querySelector<HTMLElement>('[data-progress-bar]')
    if (bar) {
      const pct = data.total ? Math.round((done / data.total) * 100) : 0
      bar.style.width = `${pct}%`
      bar
        .closest<HTMLElement>('[role="progressbar"]')
        ?.setAttribute('aria-valuenow', String(done))
    }
  }

  render()
  onChange(render)

  document.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (window.confirm('Clear all saved progress on this device?')) reset()
  })
}
