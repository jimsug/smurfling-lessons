import { doneCount, isOpComplete, load, onChange, setDone } from '../lib/progress'

const checkboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[data-lesson-key]'),
)
const keys = checkboxes
  .map((cb) => cb.dataset.lessonKey ?? '')
  .filter((key) => key.length > 0)

const render = (): void => {
  const map = load()

  for (const cb of checkboxes) {
    const key = cb.dataset.lessonKey
    if (key) cb.checked = map[key] === true
  }

  const done = doneCount(keys, map)
  const complete = isOpComplete(keys, map)

  document.querySelectorAll('[data-op-count]').forEach((el) => {
    el.textContent = `${done}/${keys.length}`
  })

  const badge = document.querySelector('[data-op-badge]')
  if (badge) {
    badge.classList.toggle('is-earned', complete)
    const status = badge.querySelector('[data-badge-status]')
    if (status) status.textContent = complete ? 'earned' : 'locked'
  }
}

for (const cb of checkboxes) {
  cb.addEventListener('change', () => {
    const key = cb.dataset.lessonKey
    if (key) setDone(key, cb.checked)
  })
}

render()
onChange(render)
