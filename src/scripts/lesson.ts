import { load, onChange, setDone } from '../lib/progress'

const button = document.querySelector<HTMLButtonElement>('[data-mark-complete]')
const key = button?.dataset.lessonKey

if (button && key) {
  const label = button.querySelector('[data-mark-label]')

  const render = (): void => {
    const done = load()[key] === true
    button.setAttribute('aria-pressed', String(done))
    button.classList.toggle('is-done', done)
    if (label) label.textContent = done ? 'Completed' : 'Mark complete'
  }

  button.addEventListener('click', () => {
    setDone(key, !(load()[key] === true))
  })

  render()
  onChange(render)
}
