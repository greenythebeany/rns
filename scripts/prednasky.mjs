// Scans public/prednasky/ for NN-nazov.pdf and writes src/data/prednasky.json.
// Runs automatically before `vite dev` and `vite build` (npm pre-scripts).
// Title comes from the file name: "03-metoda-harmonickej-rovnovahy-2.pdf" -> "Metoda harmonickej rovnovahy 2".
// Date is the last git commit of the file (needs full history in CI), falling back to mtime.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'public', 'prednasky')
const OUT = join(ROOT, 'src', 'data', 'prednasky.json')
const NAME_RE = /^(\d+)-(.+)\.pdf$/i

function gitDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', relative(ROOT, file)], { cwd: ROOT, encoding: 'utf8' }).trim()
    return out || null
  } catch {
    return null
  }
}

function title(slug) {
  const text = slug.normalize('NFC').replace(/[-_]+/g, ' ').trim()
  return text.charAt(0).toLocaleUpperCase('sk') + text.slice(1)
}

let files = []
try {
  files = readdirSync(DIR)
} catch {
  // no folder yet = no lectures
}

const skipped = []
const lectures = files
  .map((name) => {
    const m = name.normalize('NFC').match(NAME_RE)
    if (!m) {
      if (name.toLowerCase().endsWith('.pdf')) skipped.push(name)
      return null
    }
    const path = join(DIR, name)
    const stat = statSync(path)
    return {
      number: Number(m[1]),
      title: title(m[2]),
      file: name,
      size: stat.size,
      date: gitDate(path) || stat.mtime.toISOString(),
    }
  })
  .filter(Boolean)
  .sort((a, b) => b.number - a.number)

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(lectures, null, 2) + '\n')
console.log(`prednasky: ${lectures.length} lecture(s) -> ${relative(ROOT, OUT)}`)
for (const name of skipped) console.warn(`prednasky: skipped "${name}" (expected NN-nazov.pdf)`)
