const select = document.querySelector<HTMLSelectElement>('[data-language-switcher]')

select?.addEventListener('change', () => {
  location.href = select.value
})
