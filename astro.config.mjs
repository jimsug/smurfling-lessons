import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
// Static SSG output is the default in Astro: no adapter, no SSR.
export default defineConfig({
  site: 'https://guide.join.blue',
  base: '/',
  trailingSlash: 'always',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
})
