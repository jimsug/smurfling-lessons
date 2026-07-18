import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import { locales, defaultLocale } from './src/i18n/locales.ts'

// https://astro.build/config
// Static SSG output is the default in Astro: no adapter, no SSR.
export default defineConfig({
  site: 'https://guide.join.blue',
  base: '/',
  trailingSlash: 'always',
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
      fallback: { 'en-us': 'en-au' },
      fallbackType: 'rewrite',
    },
  },
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
})
