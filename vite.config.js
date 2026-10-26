import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BASE = '/rns/'
const PAGES = { home: 'index.html', zapocet: 'zapocet/index.html', prednasky: 'prednasky/index.html' }

// Emits sw.js with the list of built files so the whole site works offline after
// the first visit. Pages are cached under their directory URL (/rns/zapocet/).
// Only woff2 fonts are precached; .woff/.ttf fallbacks are never requested by modern browsers.
function serviceWorker() {
  return {
    name: 'rns-service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const files = Object.keys(bundle).filter((f) => !/\.(map|woff|ttf|html)$/.test(f))
      // HTML is emitted after this hook runs, so the page URLs are listed explicitly.
      files.push(...Object.values(PAGES).map((p) => p.replace(/index\.html$/, '')), 'favicon.svg')
      const version = createHash('sha256').update(files.sort().join('\n')).digest('hex').slice(0, 12)
      const template = readFileSync(resolve(__dirname, 'src/shared/sw-template.js'), 'utf8')
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: template
          .replace('__VERSION__', JSON.stringify(version))
          .replace('__BASE__', JSON.stringify(BASE))
          .replace('__PRECACHE__', JSON.stringify(files)),
      })
    },
  }
}

export default defineConfig({
  base: BASE,
  plugins: [react(), serviceWorker()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(Object.entries(PAGES).map(([k, v]) => [k, resolve(__dirname, v)])),
    },
  },
})
