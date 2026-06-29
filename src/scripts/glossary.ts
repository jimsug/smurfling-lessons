const input = document.querySelector<HTMLInputElement>('[data-glossary-search]')
const terms = Array.from(document.querySelectorAll<HTMLElement>('[data-term]'))
const empty = document.querySelector<HTMLElement>('[data-glossary-empty]')

input?.addEventListener('input', () => {
  const query = input.value.trim().toLowerCase()
  let visible = 0
  for (const el of terms) {
    const match = query === '' || (el.dataset.termText ?? '').includes(query)
    el.hidden = !match
    if (match) visible += 1
  }
  if (empty) empty.hidden = visible !== 0
})
