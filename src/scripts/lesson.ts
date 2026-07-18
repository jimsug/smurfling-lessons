import { load, onChange, setDone } from '../lib/progress'
import { loadStrings } from './i18n-strings'

const strings = loadStrings({ markComplete: 'Mark complete', completed: 'Completed' })

const button = document.querySelector<HTMLButtonElement>('[data-mark-complete]')
const key = button?.dataset.lessonKey

if (button && key) {
  const label = button.querySelector('[data-mark-label]')

  const render = (): void => {
    const done = load()[key] === true
    button.setAttribute('aria-pressed', String(done))
    button.classList.toggle('is-done', done)
    if (label) label.textContent = done ? strings.completed : strings.markComplete
  }

  button.addEventListener('click', () => {
    setDone(key, !(load()[key] === true))
  })

  render()
  onChange(render)
}
